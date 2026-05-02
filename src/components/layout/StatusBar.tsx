import React from "react";
import { TelemetryData } from "@/hooks/useSimulation";

interface StatusBarProps {
  telemetry: TelemetryData;
}

export default function StatusBar({ telemetry }: StatusBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between"
      style={{
        height: "var(--status-height)",
        padding: "0 max(20px, 2vw)",
        background: "rgba(10,11,18,0.9)",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
      }}
    >
      <div className="flex items-center gap-6">
        <span>
          θ <span style={{ color: "#fff" }}>{telemetry.heading.toFixed(2)}</span>
        </span>
        <span>
          ERR <span style={{ color: "var(--color-disturbance-light)" }}>{telemetry.error.toFixed(3)}</span>
        </span>
        <span>
          DIST <span style={{ color: "var(--color-plasma-light)" }}>{telemetry.distance.toFixed(2)}m</span>
        </span>
      </div>
      <div style={{ color: "var(--color-plasma)" }}>
        ⇒ CLICK GROUND TO SET TARGET
      </div>
    </div>
  );
}
