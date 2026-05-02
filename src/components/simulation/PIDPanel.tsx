import React from "react";
import { PIDParams, TelemetryData } from "@/hooks/useSimulation";
import { RotateCcw } from "lucide-react";

interface PIDPanelProps {
  params: PIDParams;
  telemetry: TelemetryData;
  onParamChange: (key: keyof PIDParams, value: number) => void;
  onReset: () => void;
}

interface GainDef {
  key: keyof PIDParams;
  label: string;
  subLabel: string;
  min: number;
  max: number;
  step: number;
  color: string;
}

const GAINS: GainDef[] = [
  { key: "kp", label: "Kp", subLabel: "Proportional", min: 0, max: 5, step: 0.1, color: "var(--color-plasma)" },
  { key: "ki", label: "Ki", subLabel: "Integral", min: 0, max: 0.5, step: 0.01, color: "var(--color-orbit)" },
  { key: "kd", label: "Kd", subLabel: "Derivative", min: 0, max: 2, step: 0.1, color: "var(--color-orbit-light)" },
  { key: "windStrength", label: "Wind", subLabel: "Disturbance", min: 0, max: 5, step: 0.1, color: "var(--color-disturbance)" },
];

function CustomSlider({ def, value, onChange }: { def: GainDef; value: number; onChange: (v: number) => void }) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100;
  
  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "4px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {def.label}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: def.color }}>
          {value.toFixed(def.step < 0.1 ? 2 : 1)}
        </div>
      </div>
      <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", marginBottom: "8px", fontFamily: "var(--font-body)" }}>
        {def.subLabel}
      </div>
      
      {/* Slider Track */}
      <div className="relative flex items-center" style={{ height: "10px" }}>
        <div className="absolute w-full" style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
        <div 
          className="absolute" 
          style={{ height: "3px", background: def.color, width: `${pct}%`, borderRadius: "2px", boxShadow: `0 0 6px ${def.color}80` }} 
        />
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "10px", height: "10px",
            background: "#fff",
            left: `calc(${pct}% - 5px)`,
            boxShadow: `0 0 4px rgba(0,0,0,0.5)`,
          }}
        />
      </div>
    </div>
  );
}

function TelRow({ label, value, isError }: { label: string; value: string; isError?: boolean }) {
  return (
    <div className="flex items-center justify-between" style={{ minHeight: "28px" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: isError ? "var(--color-disturbance-light)" : "var(--color-plasma-light)" }}>
        {value}
      </span>
    </div>
  );
}

export default function PIDPanel({ params, telemetry, onParamChange, onReset }: PIDPanelProps) {
  return (
    <div
      className="absolute z-10"
      style={{
        top: "var(--nav-height)",
        right: "max(16px, 1.5vw)",
        width: "var(--panel-width)",
        padding: "var(--panel-padding)",
        border: "0.5px solid var(--color-border)",
        background: "var(--color-panel)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 0 0 0.5px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
        overflowY: "auto",
        maxHeight: "calc(100vh - var(--nav-height) - var(--status-height))",
        paddingBottom: "16px",
      }}
    >
      {/* PID SECTION */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
        PID CONTROLLER
      </div>
      
      {GAINS.map(g => (
        <CustomSlider key={g.key} def={g} value={params[g.key]} onChange={(v) => onParamChange(g.key, v)} />
      ))}

      {/* DIVIDER */}
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", margin: "16px 0" }} />

      {/* TELEMETRY SECTION */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
        LIVE TELEMETRY
      </div>
      
      <TelRow label="DISTANCE" value={`${telemetry.distance.toFixed(2)}m`} />
      <TelRow label="HEADING" value={`${telemetry.heading.toFixed(2)} rad`} />
      <TelRow label="PID ERROR" value={`${telemetry.error.toFixed(3)}`} isError={Math.abs(telemetry.error) > 0.1} />
      <TelRow label="ANGULAR Ω" value={`${telemetry.angularVel.toFixed(2)} r/s`} />
      <TelRow label="WIND OFFSET" value={`${telemetry.windOffset.toFixed(2)}m`} isError={Math.abs(telemetry.windOffset) > 0.1} />
      
      {/* RESET BUTTON */}
      <button
        onClick={onReset}
        className="group w-full flex items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-200 mt-6"
        style={{
          background: "rgba(10, 9, 8, 0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.35)",
        }}
        onMouseEnter={e => {
          const b = e.currentTarget as HTMLElement;
          b.style.borderColor = "rgba(245,158,11,0.35)";
          b.style.color = "#f59e0b";
          b.style.background = "rgba(245,158,11,0.06)";
        }}
        onMouseLeave={e => {
          const b = e.currentTarget as HTMLElement;
          b.style.borderColor = "rgba(255,255,255,0.07)";
          b.style.color = "rgba(255,255,255,0.35)";
          b.style.background = "rgba(10, 9, 8, 0.85)";
        }}
      >
        <RotateCcw size={11} className="transition-transform duration-500 group-hover:-rotate-180" />
        RESET SIMULATION
      </button>
    </div>
  );
}
