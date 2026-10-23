"use client";

import type { ReactNode } from "react";
import FloatingParticles from "./FloatingParticles";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-mono bg-black text-cyan-400 overflow-hidden relative">
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      <FloatingParticles />

      {/* Scanning line effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"
          style={{
            top: "30%",
            animation: "scan-line 4s ease-in-out infinite alternate",
          }}
        ></div>
      </div>

      <Header />
      <main className="pt-16">{children}</main>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes scan-line {
          0% {
            top: 20%;
            opacity: 1;
          }
          100% {
            top: 80%;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
