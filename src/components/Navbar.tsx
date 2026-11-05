"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SpiritMaskIcon } from "./SpiritMaskIcon";
import { useTheme } from "./ThemeProvider";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { content } from "@/data/content";

const NAV_LINKS = [
  { name: "Home", ja: "ホーム", href: "/" },
  { name: "Projects", ja: "作品", href: "/projects" },
  { name: "Skills", ja: "技術", href: "/skills" },
  { name: "Experience", ja: "経歴", href: "/experience" },
  { name: "About", ja: "自己紹介", href: "/about" },
  { name: "Achievements", ja: "功績", href: "/achievements" },
  { name: "Contact", ja: "連絡", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isBlueSpirit = theme === "bluespirit";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group font-mono text-sm tracking-tight text-[var(--foreground)]"
          aria-label="Home — Shamil TP"
        >
          {isBlueSpirit ? (
            <div className="flex items-center gap-2">
              <SpiritMaskIcon className="w-5 h-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
              <span className="font-calligraphy text-base text-[var(--accent)] font-bold">
                蒼霊
              </span>
              <span className="font-bold text-xs tracking-wider">shamiltp.life</span>
            </div>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] group-hover:scale-125 transition-transform" />
              <span className="font-bold">shamiltp</span>
              <span className="text-[var(--accent)] font-semibold">.life</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex flex-col items-center leading-tight ${
                  isActive
                    ? "text-[var(--foreground)] bg-[var(--muted)] font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                }`}
              >
                <span>{link.name}</span>
                {isBlueSpirit && (
                  <span className="text-[9px] font-calligraphy text-[var(--accent)] opacity-80">
                    {link.ja}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <a
            href={content.person.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity font-mono"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--card)] px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--muted)] text-[var(--foreground)] font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                }`}
              >
                <span>{link.name}</span>
                {isBlueSpirit && (
                  <span className="text-xs font-calligraphy text-[var(--accent)]">
                    {link.ja}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[var(--border)]">
            <a
              href={content.person.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-lg bg-[var(--foreground)] text-[var(--background)]"
            >
              <span>Download Resume PDF</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
