"use client";

import React, { useState } from "react";

interface VerticalCaptionProps {
  kanji: string;
  english: string;
  sectionNumber?: string;
  romaji?: string;
  className?: string;
}

export function VerticalCaption({
  kanji,
  english,
  sectionNumber,
  romaji,
  className = "",
}: VerticalCaptionProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group relative select-none cursor-pointer flex items-center gap-3 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label={`${kanji} (${romaji || ""}) - ${english}. Click or tap to toggle translation.`}
      title="Click or hover to translate"
    >
      {/* Decorative vertical thread / line */}
      <div className="w-[1px] h-full min-h-[90px] bg-gradient-to-b from-transparent via-[var(--border)] to-transparent group-hover:via-[var(--accent)] transition-colors duration-500" />

      {/* Vertical text container */}
      <div className="relative min-w-[32px] flex flex-col items-center py-2">
        {/* Section number in Kanji/Numeric */}
        {sectionNumber && (
          <span className="text-[10px] font-mono text-[var(--accent)] mb-2 tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            {sectionNumber}
          </span>
        )}

        {/* Text transformation stage */}
        <div className="relative flex items-center justify-center min-h-[110px] w-8">
          {/* Japanese Kanji (Default) */}
          <div
            className={`writing-vertical font-calligraphy text-xl sm:text-2xl text-[var(--foreground)] tracking-[0.22em] transition-all duration-500 transform ${
              isFlipped
                ? "opacity-0 -translate-x-2 scale-95 pointer-events-none"
                : "opacity-100 translate-x-0 scale-100"
            }`}
            style={{ textOrientation: "upright" }}
          >
            {kanji}
          </div>

          {/* English Translation (On Hover / Tap) */}
          <div
            className={`absolute inset-0 flex items-center justify-center writing-vertical-sideways font-editorial text-xs sm:text-sm uppercase tracking-[0.28em] text-[var(--accent)] transition-all duration-500 transform ${
              isFlipped
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-2 scale-95 pointer-events-none"
            }`}
          >
            {english}
          </div>
        </div>

        {/* Traditional Hanko Seal Stamp */}
        <div className="mt-3.5 hanko-seal text-[9px] px-1 py-0.5 group-hover:scale-110 transition-transform duration-300">
          <span>印</span>
        </div>
      </div>
    </div>
  );
}
