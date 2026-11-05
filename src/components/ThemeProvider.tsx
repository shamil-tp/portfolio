"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "obsidian" | "swiss" | "terminal" | "brutalist" | "warm";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "obsidian",
  setTheme: () => {},
  cycleTheme: () => {},
});

const THEMES: Theme[] = ["obsidian", "swiss", "terminal", "brutalist", "warm"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("obsidian");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    if (saved && THEMES.includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "obsidian");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      <div className={`min-h-screen theme-${theme} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
