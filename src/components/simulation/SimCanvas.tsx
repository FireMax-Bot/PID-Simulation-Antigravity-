"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { PIDController } from "@/lib/pid";
import { computeDistance, computeTargetHeading, computeLinearVelocity } from "@/lib/physics";
import { angleWrap } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import PIDPanel from "./PIDPanel";
import SimControls from "./SimControls";
import StatusBar from "../layout/StatusBar";

function createTree(variant = 0): THREE.Group {
  const group = new THREE.Group();
  const trunkColors = [0x8B5E3C, 0x7a4f30, 0x6b4226];
  const foliageRows = [
    [0x2d6a4f, 0x1b4332, 0x40916c],
    [0x386641, 0x294a23, 0x4a7c59],
    [0x1f4e3d, 0x2d5a27, 0x52796f],
  ];
  const fc = foliageRows[variant % 3];

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.16, 0.9, 5),
    new THREE.MeshLambertMaterial({ color: trunkColors[variant % 3] })
  );
  trunk.position.y = 0.45;
  trunk.castShadow = true;
  group.add(trunk);

  const coneData = [
    { r: 0.7, h: 1.0, y: 1.1, ci: 0 },
    { r: 0.52, h: 0.85, y: 1.75, ci: 1 },
    { r: 0.32, h: 0.7, y: 2.3, ci: 2 },
  ];
  for (const d of coneData) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(d.r, d.h, 6),
      new THREE.MeshLambertMaterial({ color: fc[d.ci] })
    );
    cone.position.y = d.y;
    cone.castShadow = true;
    group.add(cone);
  }
  return group;
}

function createRobot(): THREE.Group {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.32, 1.0),
    new THREE.MeshLambertMaterial({ color: 0xf59e0b })
  );
  body.position.y = 0.26; body.castShadow = true;
  group.add(body);

  const topPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.1, 0.75),
    new THREE.MeshLambertMaterial({ color: 0xd97706 })
  );
  topPanel.position.y = 0.47; topPanel.castShadow = true;
  group.add(topPanel);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: 0xfbbf24 })
  );
  dome.position.y = 0.52; dome.castShadow = true;
  group.add(dome);

  const nub = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.1, 0.1),
    new THREE.MeshLambertMaterial({ color: 0xfef3c7 })
  );
  nub.position.set(0, 0.26, -0.55);
  group.add(nub);

  const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 10);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1c1917 });
  const rimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.11, 10);
  const rimMat = new THREE.MeshLambertMaterial({ color: 0x44403c });
  const wPos = [
    new THREE.Vector3(0.46, 0.16, -0.28),
    new THREE.Vector3(-0.46, 0.16, -0.28),
    new THREE.Vector3(0.46, 0.16, 0.28),
    new THREE.Vector3(-0.46, 0.16, 0.28),
  ];
  for (const p of wPos) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.z = Math.PI / 2; w.position.copy(p); w.castShadow = true;
    group.add(w);
    const r = new THREE.Mesh(rimGeo, rimMat);
    r.rotation.z = Math.PI / 2; r.position.copy(p);
    group.add(r);
  }
  return group;
}

export default function SimCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const { 
    pidRef, 
    pidState, 
    telemetry, 
    setTelemetry, 
    resetRef, 
    handleParamChange,
    handleReset
  } = useSimulation();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7ab3cc);
    scene.fog = new THREE.Fog(0x9ecde0, 35, 90);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(15, 20, 15);
    camera.lookAt(0, 0, 0);

    const sun = new THREE.DirectionalLight(0xfff4d6, 5.5);
    sun.position.set(18, 38, 12);
    sun.castShadow = true;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 130;
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.001;
    scene.add(sun);

    scene.add(new THREE.AmbientLight(0xb8d8f0, 3.0));
    scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4a7c59, 1.8));
    const fill = new THREE.DirectionalLight(0xd0eeff, 1.4);
    fill.position.set(-18, 12, -12);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      new THREE.MeshLambertMaterial({ color: 0x3d7a3d })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const playfield = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 32),
      new THREE.MeshLambertMaterial({ color: 0x4a8f4a })
    );
    playfield.rotation.x = -Math.PI / 2;
    playfield.position.y = 0.003;
    playfield.receiveShadow = true;
    scene.add(playfield);

    const grid = new THREE.GridHelper(32, 32, 0x3a7a3a, 0x3a7a3a);
    (grid.material as THREE.LineBasicMaterial).opacity = 0.22;
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    grid.position.y = 0.006;
    scene.add(grid);

    const robotGroup = createRobot();
    robotGroup.scale.set(1.3, 1.3, 1.3);
    scene.add(robotGroup);

    const robotLight = new THREE.PointLight(0xfbbf24, 8, 6);
    scene.add(robotLight);

    const ringGeo = new THREE.RingGeometry(0.45, 0.65, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02;
    scene.add(ring);

    const outerRingGeo = new THREE.RingGeometry(0.65, 0.95, 32);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2; outerRing.position.y = 0.02;
    scene.add(outerRing);

    const targetLight = new THREE.PointLight(0xffd700, 7, 6);
    scene.add(targetLight);

    const addTree = (tx: number, tz: number, sMin = 0.8, sMax = 1.6) => {
      const t = createTree(Math.floor(Math.random() * 3));
      t.position.set(tx + (Math.random() - 0.5) * 1.2, 0, tz + (Math.random() - 0.5) * 1.2);
      t.rotation.y = Math.random() * Math.PI * 2;
      const s = sMin + Math.random() * (sMax - sMin);
      t.scale.set(s, s, s);
      scene.add(t);
    };
    for (let a = 0; a < Math.PI * 2; a += 0.22) addTree(Math.cos(a) * (16 + Math.random() * 1.5), Math.sin(a) * (16 + Math.random() * 1.5), 0.9, 1.4);
    for (let a = 0; a < Math.PI * 2; a += 0.18) addTree(Math.cos(a) * (20 + Math.random() * 2), Math.sin(a) * (20 + Math.random() * 2), 1.0, 1.8);
    for (let a = 0; a < Math.PI * 2; a += 0.14) addTree(Math.cos(a) * (25 + Math.random() * 3), Math.sin(a) * (25 + Math.random() * 3), 1.2, 2.5);
    for (let a = 0; a < Math.PI * 2; a += 0.10) addTree(Math.cos(a) * (31 + Math.random() * 5), Math.sin(a) * (31 + Math.random() * 5), 1.6, 3.2);
    for (let i = 0; i < 120; i++) {
      const a = Math.random() * Math.PI * 2, r = 16 + Math.random() * 18;
      addTree(Math.cos(a) * r, Math.sin(a) * r, 0.8, 2.4);
    }

    interface WindParticle {
      mesh: THREE.Mesh;
      speed: number;
      yOsc: number;
      yPhase: number;
      zDrift: number;
    }

    const windParticles: WindParticle[] = [];

    const dustGeo = new THREE.SphereGeometry(0.04, 4, 4);
    const dustMat = new THREE.MeshBasicMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 80; i++) {
      const m = new THREE.Mesh(dustGeo, dustMat);
      m.position.set((Math.random() - 0.5) * 36, Math.random() * 4 + 0.1, (Math.random() - 0.5) * 30);
      scene.add(m);
      windParticles.push({ mesh: m, speed: 0.6 + Math.random() * 0.8, yOsc: 0.015 + Math.random() * 0.03, yPhase: Math.random() * Math.PI * 2, zDrift: (Math.random() - 0.5) * 0.2 });
    }

    for (let i = 0; i < 80; i++) {
      const r = 0.07 + Math.random() * 0.07;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 5, 4),
        new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.38 + Math.random() * 0.15 })
      );
      m.position.set((Math.random() - 0.5) * 38, Math.random() * 5 + 0.2, (Math.random() - 0.5) * 28);
      scene.add(m);
      windParticles.push({ mesh: m, speed: 1.2 + Math.random() * 1.4, yOsc: 0.008 + Math.random() * 0.015, yPhase: Math.random() * Math.PI * 2, zDrift: (Math.random() - 0.5) * 0.1 });
    }

    for (let i = 0; i < 40; i++) {
      const r = 0.16 + Math.random() * 0.16;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 6, 5),
        new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.14 + Math.random() * 0.1 })
      );
      m.position.set((Math.random() - 0.5) * 34, Math.random() * 3 + 0.3, (Math.random() - 0.5) * 26);
      scene.add(m);
      windParticles.push({ mesh: m, speed: 1.8 + Math.random() * 1.8, yOsc: 0.02 + Math.random() * 0.04, yPhase: Math.random() * Math.PI * 2, zDrift: (Math.random() - 0.5) * 0.15 });
    }

    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const mouse = new THREE.Vector2();
    const clickIntersect = new THREE.Vector3();

    const state = {
      x: 0, z: 0, heading: 0,
      targetX: 5, targetZ: 0,
      windOffset: 0, lastTime: performance.now(), baseSpeed: 3.5,
    };
    ring.position.set(5, 0.02, 0);
    outerRing.position.set(5, 0.02, 0);

    const pidController = new PIDController();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(groundPlane, clickIntersect);
      state.targetX = Math.max(-13, Math.min(13, clickIntersect.x));
      state.targetZ = Math.max(-13, Math.min(13, clickIntersect.z));
      ring.position.set(state.targetX, 0.02, state.targetZ);
      outerRing.position.set(state.targetX, 0.02, state.targetZ);
    };
    renderer.domElement.addEventListener("click", onClick);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animFrameId: number;
    let telThrottle = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - state.lastTime) / 1000, 0.05);
      state.lastTime = now;

      if (resetRef.current) {
        Object.assign(state, { x: 0, z: 0, heading: 0, targetX: 5, targetZ: 0, windOffset: 0 });
        ring.position.set(5, 0.02, 0);
        outerRing.position.set(5, 0.02, 0);
        pidController.reset();
        resetRef.current = false;
      }

      const { kp, ki, kd, windStrength } = pidRef.current;

      const dist = computeDistance(state.x, state.z, state.targetX, state.targetZ);
      const targetHeading = computeTargetHeading(state.x, state.z, state.targetX, state.targetZ);
      const error = angleWrap(targetHeading - state.heading);

      const angularVelocity = pidController.compute(error, dt, kp, ki, kd);
      
      state.heading = angleWrap(state.heading + angularVelocity * dt);
      const linearVelocity = computeLinearVelocity(dist, error, state.baseSpeed);
      
      state.x += Math.cos(state.heading) * linearVelocity * dt;
      state.z += Math.sin(state.heading) * linearVelocity * dt;
      
      const windDelta = windStrength * dt * 0.5;
      state.x += windDelta;
      state.windOffset += windDelta;

      robotGroup.position.set(state.x, 0, state.z);
      robotGroup.rotation.y = -(state.heading - Math.PI / 2);
      robotLight.position.set(state.x, 1.5, state.z);
      robotLight.intensity = 6 + Math.sin(now * 0.004) * 2;
      targetLight.position.set(state.targetX, 1.2, state.targetZ);

      const pulse = (Math.sin(now * 0.003) + 1) / 2;
      ringMat.opacity = 0.55 + pulse * 0.35;
      outerRingMat.opacity = 0.15 + pulse * 0.25;
      const rs = 1 + pulse * 0.14;
      outerRing.scale.set(rs, rs, rs);

      const baseWind = windStrength * 2.2 + 0.35;
      for (const wp of windParticles) {
        const { mesh, speed, yOsc, yPhase, zDrift } = wp;
        mesh.position.x += baseWind * speed * dt;
        mesh.position.y += Math.sin(now * 0.0012 + yPhase) * yOsc;
        mesh.position.z += zDrift * dt;
        if (windStrength > 0) {
          (mesh.material as THREE.MeshBasicMaterial).opacity =
            Math.max(0.05, Math.min(0.65, ((mesh.material as THREE.MeshBasicMaterial).opacity) * 0.98 + (0.25 + windStrength * 0.06) * 0.02));
        }
        if (mesh.position.x > 20) {
          mesh.position.x = -20;
          mesh.position.z = (Math.random() - 0.5) * 30;
          mesh.position.y = Math.random() * 4.5 + 0.1;
        }
      }

      telThrottle += dt;
      if (telThrottle > 0.1) {
        telThrottle = 0;
        setTelemetry({
          distance: dist,
          heading: state.heading,
          error: error,
          angularVel: angularVelocity,
          windOffset: state.windOffset,
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach(x => x.dispose());
          else (m.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="absolute inset-0 cursor-crosshair" />
      <SimControls 
        simActive={true} 
        windActive={pidState.windStrength > 0} 
        onToggleWind={() => handleParamChange("windStrength", pidState.windStrength > 0 ? 0 : 2.5)} 
      />
      <PIDPanel 
        params={pidState} 
        telemetry={telemetry} 
        onParamChange={handleParamChange} 
        onReset={handleReset}
      />
      <StatusBar telemetry={telemetry} />
    </div>
  );
}
