import { useState, useRef, useCallback } from "react";

export interface PIDParams { 
  kp: number; 
  ki: number; 
  kd: number; 
  windStrength: number; 
}

export interface TelemetryData { 
  distance: number; 
  heading: number; 
  error: number; 
  angularVel: number; 
  windOffset: number; 
}

export function useSimulation() {
  const pidRef = useRef<PIDParams>({ kp: 2.0, ki: 0.05, kd: 0.5, windStrength: 0.5 });
  const [pidState, setPidState] = useState<PIDParams>({ kp: 2.0, ki: 0.05, kd: 0.5, windStrength: 0.5 });
  const [telemetry, setTelemetry] = useState<TelemetryData>({ distance: 0, heading: 0, error: 0, angularVel: 0, windOffset: 0 });
  const resetRef = useRef(false);

  const handleParamChange = useCallback((key: keyof PIDParams, value: number) => {
    pidRef.current[key] = value;
    setPidState(p => ({ ...p, [key]: value }));
  }, []);

  const handleReset = useCallback(() => { 
    resetRef.current = true; 
  }, []);

  return {
    pidRef,
    pidState,
    telemetry,
    setTelemetry,
    resetRef,
    handleParamChange,
    handleReset
  };
}
