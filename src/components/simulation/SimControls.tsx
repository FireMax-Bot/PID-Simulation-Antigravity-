import React from "react";
import { Wind } from "lucide-react";

interface SimControlsProps {
  windActive: boolean;
  onToggleWind: () => void;
  // Currently, the sim is always active, but we can visually represent it
  simActive: boolean;
}

export default function SimControls({ windActive, onToggleWind, simActive }: SimControlsProps) {
  return (
    <div 
      className="absolute z-10 flex items-center" 
      style={{
        top: "64px",
        left: "max(16px, 1.5vw)",
        gap: "8px",
      }}
    >
      <button
        className="flex items-center gap-1.5 transition-all duration-200"
        style={{
          padding: "6px 14px",
          borderRadius: "20px",
          border: simActive ? "0.5px solid rgba(29,158,117,0.5)" : "0.5px solid rgba(255,255,255,0.15)",
          background: simActive ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.05)",
          color: simActive ? "#5DCAA5" : "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {simActive && <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-pulse" />}
        SIM ACTIVE
      </button>
      
      <button
        onClick={onToggleWind}
        className="flex items-center gap-1.5 transition-all duration-200"
        style={{
          padding: "6px 14px",
          borderRadius: "20px",
          border: windActive ? "0.5px solid rgba(83,74,183,0.5)" : "0.5px solid rgba(255,255,255,0.15)",
          background: windActive ? "rgba(83,74,183,0.1)" : "rgba(255,255,255,0.05)",
          color: windActive ? "#AFA9EC" : "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <Wind size={9} />
        WIND ON
      </button>
    </div>
  );
}
