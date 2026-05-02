import type { Metadata } from "next";
import { Syne, DM_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({ weight: ["700", "800"], subsets: ["latin"], variable: "--font-syne" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm-mono" });
const instrumentSans = Instrument_Sans({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-instrument-sans" });

export const metadata: Metadata = {
  title: "ANTIGRAVITY // PID Differential Drive",
  description:
    "Interactive 3D simulation of a PID-controlled differential drive robot. Tune Kp, Ki, Kd gains in real-time and observe the robot navigate to click targets while fighting environmental wind disturbance.",
  keywords: ["PID controller", "differential drive", "robotics simulation", "Three.js", "Next.js"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${instrumentSans.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden" style={{ background: "var(--color-void)", color: "var(--color-text-primary)" }}>
        {children}
      </body>
    </html>
  );
}
