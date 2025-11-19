"use client";

import { ShaderBackground } from "@/components/ui/infinite-hero";

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <ShaderBackground className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#070c16] via-[#05080f]/60 to-[#030407]" />
      <div className="absolute inset-0 opacity-70 mix-blend-screen [background:radial-gradient(140%_90%_at_50%_-20%,rgba(255,255,255,0.28),transparent_70%)]" />
      <div className="absolute inset-0 opacity-25 mix-blend-screen [background:radial-gradient(140%_120%_at_50%_110%,rgba(255,215,180,0.2),transparent_80%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(60deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
    </div>
  );
}
