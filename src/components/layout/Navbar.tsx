"use client";

import React, { useState } from "react";
import { Code2, ExternalLink, X } from "lucide-react";

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: "var(--nav-height)",
          padding: "0 max(20px, 2vw)",
          background: "rgba(8, 7, 6, 0.90)",
          borderBottom: "0.5px solid var(--color-border)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Left: Brand */}
        <div className="flex items-baseline gap-3">
          <span 
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(18px, 2.2vw, 26px)",
              letterSpacing: "-0.04em",
              color: "var(--color-text-primary)",
            }}
          >
            ANTIGRAVITY
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {"// PID DIFFERENTIAL DRIVE"}
          </span>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="uppercase transition-colors duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-plasma-light)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            SIMULATION
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="uppercase transition-colors duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-plasma-light)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            ABOUT
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span 
              className="rounded-full animate-pulse" 
              style={{ width: "8px", height: "8px", background: "var(--color-plasma-light)" }} 
            />
            <span 
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-plasma-light)",
                letterSpacing: "0.12em",
              }}
            >
              LIVE
            </span>
          </div>

          {/* Source link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors duration-200 uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.5)",
              paddingRight: "max(16px, 1.5vw)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          >
            <Code2 size={13} />
            <span className="hidden sm:inline">SOURCE</span>
            <ExternalLink size={10} style={{ opacity: 0.45 }} />
          </a>
        </div>
      </header>

      {/* About Modal */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", background: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setAboutOpen(false); }}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10, 9, 8, 0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="flex items-center justify-between px-8 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-300" style={{ fontFamily: "var(--font-mono)" }}>
                  About This Project
                </span>
              </div>
              <button
                onClick={() => setAboutOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <X size={13} />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-0">
              <div className="flex flex-col space-y-4">
                <p
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}
                >
                  The Project
                </p>
                <p className="text-sm leading-relaxed text-stone-300" style={{ fontFamily: "var(--font-body)" }}>
                  Built by <span className="font-semibold text-amber-400">Noel Isaac Aj</span>.
                  The best way to understand control theory is to interact with it. I designed
                  this simulation as a testing ground for the PID logic that powers my
                  real-world differential bot. By adjusting these gains against environmental
                  disturbances, you are interacting with the exact math required for
                  autonomous hardware stabilization.
                </p>
              </div>

              <div className="my-6" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

              <div className="flex flex-wrap gap-2">
                {["PID Control", "Robotics", "Three.js", "Next.js", "Differential Drive"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.18)",
                      color: "#6ee7b7",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
