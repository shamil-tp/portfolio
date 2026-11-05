"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  Theme,
  LayoutMode,
  PalettePreset,
  THEME_CONFIGS,
  LAYOUT_MODES,
} from "@/lib/theme-presets";

export type { Theme, LayoutMode, PalettePreset };

interface ThemeContextType {
  theme: Theme;
  palette: PalettePreset;
  layout: LayoutMode;
  setTheme: (theme: Theme) => void;
  setPalette: (paletteId: string) => void;
  setLayout: (layout: LayoutMode) => void;
  cycleTheme: () => void;
  randomShift: (specificTheme?: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "bluespirit",
  palette: THEME_CONFIGS.bluespirit.palettes[0],
  layout: "standard",
  setTheme: () => {},
  setPalette: () => {},
  setLayout: () => {},
  cycleTheme: () => {},
  randomShift: () => {},
});

const THEMES: Theme[] = ["bluespirit", "obsidian", "swiss", "terminal", "brutalist", "warm"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("bluespirit");
  const [palette, setPaletteState] = useState<PalettePreset>(
    THEME_CONFIGS.bluespirit.palettes[0]
  );
  const [layout, setLayoutState] = useState<LayoutMode>("standard");
  const [mounted, setMounted] = useState(false);

  // Apply variables to DOM
  const applyStyles = useCallback((t: Theme, p: PalettePreset, l: LayoutMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-theme", t);
    root.setAttribute("data-palette", p.id);
    root.setAttribute("data-layout", l);

    // Dynamic high-contrast tokens
    root.style.setProperty("--background", p.background);
    root.style.setProperty("--foreground", p.foreground);
    root.style.setProperty("--card", p.card);
    root.style.setProperty("--card-foreground", p.foreground);
    root.style.setProperty("--card-border", p.cardBorder);
    root.style.setProperty("--border", p.cardBorder);
    root.style.setProperty("--muted", p.muted);
    root.style.setProperty("--muted-foreground", p.mutedForeground);
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--accent-foreground", p.accentForeground);
    root.style.setProperty("--badge-bg", p.badgeBg);
    root.style.setProperty("--badge-text", p.badgeText);
    root.style.setProperty("--selection", p.selection);
    root.style.setProperty("--font-heading", THEME_CONFIGS[t].fontHeading);
    root.style.setProperty("--font-body", THEME_CONFIGS[t].fontBody);

    // Meta theme color update
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", p.background);
    }
  }, []);

  // Perform a random shift of palette and layout
  const randomShift = useCallback(
    (targetTheme?: Theme) => {
      const activeTheme = targetTheme || theme;
      const themeConfig = THEME_CONFIGS[activeTheme];
      const palettes = themeConfig.palettes;

      // Pick a random palette different from current if possible
      let nextPalette = palettes[Math.floor(Math.random() * palettes.length)];
      if (palettes.length > 1 && nextPalette.id === palette.id) {
        const filtered = palettes.filter((p) => p.id !== palette.id);
        nextPalette = filtered[Math.floor(Math.random() * filtered.length)];
      }

      // Pick a random layout
      const nextLayout = LAYOUT_MODES[Math.floor(Math.random() * LAYOUT_MODES.length)];

      setThemeState(activeTheme);
      setPaletteState(nextPalette);
      setLayoutState(nextLayout);

      applyStyles(activeTheme, nextPalette, nextLayout);
    },
    [theme, palette.id, applyStyles]
  );

  useEffect(() => {
    setMounted(true);

    const savedTheme = (localStorage.getItem("portfolio-theme") as Theme | null) || "bluespirit";
    const validTheme = THEMES.includes(savedTheme) ? savedTheme : "bluespirit";

    // Detect if this visit is a page reload / refresh
    let isReload = false;
    try {
      const navEntries = window.performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isReload = (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      }
    } catch {
      // fallback
    }

    // "random shift must happen in every refresh"
    // Pick random palette and layout for the design on refresh or fresh load
    const themeConfig = THEME_CONFIGS[validTheme];
    const palettes = themeConfig.palettes;
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomLayout = LAYOUT_MODES[Math.floor(Math.random() * LAYOUT_MODES.length)];

    setThemeState(validTheme);
    setPaletteState(randomPalette);
    setLayoutState(randomLayout);

    applyStyles(validTheme, randomPalette, randomLayout);
  }, [applyStyles]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);

    const themeConfig = THEME_CONFIGS[newTheme];
    const initialPalette = themeConfig.palettes[0];
    setPaletteState(initialPalette);

    applyStyles(newTheme, initialPalette, layout);
  };

  const setPalette = (paletteId: string) => {
    const found = THEME_CONFIGS[theme].palettes.find((p) => p.id === paletteId);
    if (found) {
      setPaletteState(found);
      applyStyles(theme, found, layout);
    }
  };

  const setLayout = (newLayout: LayoutMode) => {
    setLayoutState(newLayout);
    applyStyles(theme, palette, newLayout);
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        palette,
        layout,
        setTheme,
        setPalette,
        setLayout,
        cycleTheme,
        randomShift,
      }}
    >
      <div
        className={`min-h-screen theme-${theme} transition-colors duration-300`}
        data-theme={theme}
        data-palette={palette.id}
        data-layout={layout}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
