"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Theme, LayoutMode } from "@/lib/theme-presets";
import {
  Palette,
  Sparkles,
  Terminal,
  Square,
  Sun,
  Moon,
  Dices,
  Layers,
  Check,
} from "lucide-react";

const THEME_OPTIONS: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
  { id: "bluespirit", name: "The Blue Spirit", icon: <span className="font-serif font-bold text-xs">蒼</span>, color: "#54A0FF" },
  { id: "obsidian", name: "Obsidian Dark", icon: <Moon className="w-3.5 h-3.5" />, color: "#A8B1FF" },
  { id: "swiss", name: "Swiss Minimal", icon: <Sun className="w-3.5 h-3.5" />, color: "#FF0000" },
  { id: "terminal", name: "Cyber Terminal", icon: <Terminal className="w-3.5 h-3.5" />, color: "#00FF41" },
  { id: "brutalist", name: "Neo Brutalist", icon: <Square className="w-3.5 h-3.5" />, color: "#FAFF00" },
  { id: "warm", name: "Warm Editorial", icon: <Sparkles className="w-3.5 h-3.5" />, color: "#CC7A6B" },
];

export function ThemeToggle() {
  const { theme, palette, layout, setTheme, setLayout, randomShift } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <div className="relative flex items-center gap-1.5" ref={ref}>
      {/* Quick Random Shift Dice Button */}
      <button
        onClick={() => randomShift()}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm group"
        title="Random shift layout & high-contrast palette (also shifts on every refresh)"
        aria-label="Random shift layout and color palette"
      >
        <Dices className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-[var(--accent)]" />
        <span className="hidden lg:inline text-[11px] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">
          Shift
        </span>
      </button>

      {/* Main Theme Selector Menu */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all shadow-sm"
        title="Switch design aesthetic & layout"
        aria-label="Switch theme aesthetic"
      >
        <span
          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
          style={{ backgroundColor: palette.accent || currentTheme.color }}
        />
        <span className="hidden sm:inline font-mono text-[var(--foreground)] font-semibold">
          {currentTheme.name}
        </span>
        <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
          {palette.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
          {/* Section 1: Themes */}
          <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono text-[var(--muted-foreground)] font-bold">
            Design Aesthetic
          </div>
          <div className="space-y-0.5 mb-2">
            {THEME_OPTIONS.map((item) => {
              const isSelected = item.id === theme;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    isSelected
                      ? "bg-[var(--muted)] text-[var(--foreground)] font-bold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : item.icon}
                </button>
              );
            })}
          </div>

          {/* Section 2: Layout Shift Options */}
          <div className="pt-2 border-t border-[var(--border)]">
            <div className="px-2 py-1 flex items-center justify-between text-[10px] uppercase tracking-wider font-mono text-[var(--muted-foreground)] font-bold">
              <span>Layout Style</span>
              <Layers className="w-3 h-3" />
            </div>
            <div className="grid grid-cols-3 gap-1 px-1 py-1">
              {(["standard", "asymmetric", "stacked"] as LayoutMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayout(mode)}
                  className={`px-2 py-1 text-[10px] font-mono rounded capitalize transition-colors ${
                    layout === mode
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-bold"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Surprise Me / Random Shift Button */}
          <div className="pt-2 mt-2 border-t border-[var(--border)]">
            <button
              onClick={() => {
                randomShift();
                setOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono font-bold rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Shift (Palette + Layout)</span>
            </button>
            <p className="text-[10px] font-mono text-[var(--muted-foreground)] text-center pt-1.5 opacity-80">
              Shift also happens automatically on every refresh
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
