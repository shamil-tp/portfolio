"use client";

import React, { useEffect, useState } from "react";

export function InkParticles() {
  const [particles, setParticles] = useState<
    { id: number; top: number; left: number; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    // Generate static positions client-side to prevent SSR mismatches
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.floor(Math.random() * 4) + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10,
    }));
    setParticles(items);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Background ambient ink glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(84,160,255,0.08)_0%,rgba(12,37,53,0.03)_50%,transparent_80%)] blur-3xl pointer-events-none" />

      {/* Floating subtle ink particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[var(--accent)] pointer-events-none animate-ink-drift"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.25,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
