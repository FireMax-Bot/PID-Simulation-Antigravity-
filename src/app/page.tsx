"use client";

import Navbar from "@/components/layout/Navbar";
import SimCanvas from "@/components/simulation/SimCanvas";

export default function HomePage() {
  return (
    <main className="relative w-full h-full overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 relative" style={{ marginTop: "var(--nav-height)" }}>
        <SimCanvas />
      </div>
    </main>
  );
}
