"use client";

import React from "react";
import Link from "next/link";
import { content } from "@/data/content";
import { useTheme } from "./ThemeProvider";
import { SpiritMaskIcon } from "./SpiritMaskIcon";
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { theme } = useTheme();
  const isBlueSpirit = theme === "bluespirit";

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--background)] py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Info & Status */}
          <div className="md:col-span-2 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-base font-bold text-[var(--foreground)]"
            >
              {isBlueSpirit && <SpiritMaskIcon className="w-5 h-5 text-[var(--accent)]" />}
              <span>{content.person.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted-foreground)]">
                {content.person.focus}
              </span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md leading-relaxed">
              {content.person.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{content.person.status}</span>
            </div>

            {isBlueSpirit && (
              <div className="pt-2 flex items-center gap-2">
                <span className="hanko-seal text-[9px] px-1.5 py-0.2">蒼鬼</span>
                <span className="font-calligraphy text-xs text-[var(--accent)]">
                  「研ぎ澄まされた刃のように、簡潔で堅牢なコードを」
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/projects"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  All Projects &amp; Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Technical Skills &amp; Stack
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Experience &amp; Timeline
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  About &amp; Background
                </Link>
              </li>
              <li>
                <Link
                  href="/achievements"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Hackathons &amp; Certificates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-medium text-[var(--accent)]"
                >
                  Contact Portal (D1 Worker)
                </Link>
              </li>
              <li>
                <a
                  href={content.person.resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <span>Resume (ATS PDF)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-semibold">
              Connect
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a
                href={content.contact.email ? `mailto:${content.contact.email}` : "#"}
                className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{content.contact.email}</span>
              </a>
              {content.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {social.id === "github" && <Github className="w-3.5 h-3.5" />}
                  {social.id === "linkedin" && <Linkedin className="w-3.5 h-3.5" />}
                  {social.id === "twitter-x" && <Twitter className="w-3.5 h-3.5" />}
                  <span>{social.label} ({social.handle})</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-4">
          <p>© {new Date().getFullYear()} Shamil TP. Built with Next.js &amp; TypeScript.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Kozhikode, Kerala, India</span>
            <span>•</span>
            <span className="text-[var(--accent)] font-medium">shamiltp.life</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
