import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SkillsGrid } from "@/components/SkillsGrid";
import { Code2, ArrowRight } from "lucide-react";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: "Technical Skills & Engineering Competencies — Shamil TP",
  description:
    "Explore Shamil TP's core backend, data, devops, media streaming, automation, AI, and IoT tech stack: FastAPI, Go, Node.js, PostgreSQL, Docker, Redis, FFmpeg, MicroPython.",
  alternates: {
    canonical: "https://shamiltp.life/skills",
  },
  openGraph: {
    title: "Technical Skills — Shamil TP",
    description:
      "Backend engineering, distributed databases, cloud DevOps, media pipelines, and automation capabilities.",
    url: "https://shamiltp.life/skills",
  },
};

export default function SkillsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Code2 className="w-3.5 h-3.5" />
          <span>Technical Stack</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Technical Skills of Shamil TP
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          The languages, distributed storage engines, streaming protocols, and CI/CD tools I use to build dependable server-side architectures.
        </p>
      </header>

      {/* Skills Grid */}
      <section className="space-y-8">
        <SkillsGrid />
      </section>

      {/* Next Step CTA */}
      <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)]">
            Want to see these skills in production?
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Check out real architecture case studies and open-source implementations.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-center"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
