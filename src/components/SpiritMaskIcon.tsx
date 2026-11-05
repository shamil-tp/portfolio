"use client";

import React from "react";

interface SpiritMaskIconProps {
  className?: string;
  size?: number;
}

export function SpiritMaskIcon({ className = "w-5 h-5", size }: SpiritMaskIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="The Blue Spirit Oni Mask Icon"
    >
      {/* Outer Oni Mask Silhouette */}
      <path
        d="M32 4C20 4 12 14 10 24C8 34 11 46 20 56C25 61 32 63 32 63C32 63 39 61 44 56C53 46 56 34 54 24C52 14 44 4 32 4Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Crown Horn Ridges */}
      <path
        d="M22 6L26 16M42 6L38 16M32 4V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Stylized Fierce Eye Holes */}
      <path
        d="M18 25C21 23 26 23 28 26C25 28 20 28 18 25Z"
        fill="currentColor"
      />
      <path
        d="M46 25C43 23 38 23 36 26C39 28 44 28 46 25Z"
        fill="currentColor"
      />
      {/* Menacing Arched Brows */}
      <path
        d="M16 22C21 19 27 20 29 23M48 22C43 19 37 20 35 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Broad Nose Ridge */}
      <path
        d="M32 26V35M29 35H35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wide Grimacing Teeth / Fanged Mouth */}
      <path
        d="M20 42C24 40 40 40 44 42C41 51 23 51 20 42Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Upper Sharp Fangs */}
      <path
        d="M24 41V46M40 41V46M28 41V44M32 41V44M36 41V44"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Lower Sharp Fangs */}
      <path
        d="M26 49V46M38 49V46M30 48V46M34 48V46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
