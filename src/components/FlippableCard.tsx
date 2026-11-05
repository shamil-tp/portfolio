"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCw, ArrowUpRight, Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { content } from "@/data/content";

export function FlippableCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Interactive Controls & Hint */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Interactive 3D Bento Identity Card</span>
        </div>

        <button
          onClick={toggleFlip}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--foreground)] transition-all shadow-sm group"
          aria-label="Flip card to other side"
        >
          <RotateCw className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-semibold">
            {isFlipped ? "Show Front Side" : "Click to Flip Card"}
          </span>
        </button>
      </div>

      {/* 3D Perspective Card Viewport */}
      <div
        className="perspective-1200 w-full select-none cursor-pointer"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label="3D Flippable Developer Card. Click or press Enter to flip."
      >
        <div
          className="relative w-full aspect-[700/420] transition-transform duration-700 ease-out transform-style-3d will-change-transform"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ════════ FRONT FACE ════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden shadow-2xl border border-[#003999]/30 bg-[#c6e1f2]"
            style={{ transform: "rotateY(0deg)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/shamil-t-p-bento-grid-front.svg"
              alt="Shamil TP Bento Grid Front Card"
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Dynamic Glass Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glarePosition.opacity}), transparent 60%)`,
              }}
            />

            {/* Flip badge overlay on hover */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#003999]/90 text-[#c6e1f2] text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 backdrop-blur-sm shadow-md flex items-center gap-1">
              <RotateCw className="w-2.5 h-2.5" />
              <span>Tap to Flip</span>
            </div>
          </div>

          {/* ════════ BACK FACE ════════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden shadow-2xl border border-[#c6e1f2]/30 bg-[#003999]"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/shamil-t-p-bento-grid-back.svg"
              alt="Shamil TP Bento Grid Back Card"
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Dynamic Glass Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glarePosition.opacity}), transparent 60%)`,
              }}
            />

            {/* Flip badge overlay */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#c6e1f2]/90 text-[#003999] text-[10px] font-mono font-bold tracking-wider uppercase opacity-90 backdrop-blur-sm shadow-md flex items-center gap-1">
              <RotateCw className="w-2.5 h-2.5" />
              <span>Tap to Flip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Badges & Direct Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
        <a
          href={`mailto:${content.contact.email}`}
          className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span className="truncate text-[var(--foreground)]">{content.contact.email}</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
        </a>

        <a
          href={content.contact.phoneHref}
          className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span className="text-[var(--foreground)]">{content.contact.phone}</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
        </a>

        <Link
          href="/contact"
          className="p-3.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-all flex items-center justify-between group text-[var(--foreground)]"
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span className="font-bold">Contact Portal</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
        </Link>
      </div>

      <style jsx>{`
        .perspective-1200 {
          perspective: 1200px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
