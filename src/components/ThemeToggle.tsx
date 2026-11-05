"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, Theme } from "./ThemeProvider";
import { Palette, Sparkles, Terminal, Square, Sun, Moon } from "lucide-react";

const THEME_OPTIONS: { id: Theme; name: string; icon: React.ReactNode; color: string }[] = [
  { id: "obsidian", name: "Obsidian Dark", icon: <Moon className="w-3.5 h-3.5" />, color: "#3B82F6" },
  { id: "swiss", name: "Swiss Minimal", icon: <Sun className="w-3.5 h-3.5" />, color: "#FF0000" },
  { id: "terminal", name: "Cyber Terminal", icon: <Terminal className="w-3.5 h-3.5" />, color: "#00FF41" },
  { id: "brutalist", name: "Neo Brutalist", icon: <Square className="w-3.5 h-3.5" />, color: "#FFE600" },
  { id: "warm", name: "Warm Editorial", icon: <Sparkles className="w-3.5 h-3.5" />, color: "#C85A32" },
];

export function ThemeToggle() {
  const { theme, setTheme, cycleTheme } = useTheme();
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all shadow-sm"
        title="Switch theme aesthetic"
        aria-label="Switch theme aesthetic"
      >
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: currentTheme.color }}
        />
        <span className="hidden sm:inline font-mono text-[var(--foreground)]">
          {currentTheme.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl z-50 backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-mono text-[var(--muted-foreground)]">
            Design Aesthetic
          </div>
          {THEME_OPTIONS.map((item) => {
            const isSelected = item.id === theme;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTheme(item.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected
                    ? "bg-[var(--muted)] text-[var(--foreground)] font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                {item.icon}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
