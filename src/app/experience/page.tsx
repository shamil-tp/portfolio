import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Briefcase, ArrowRight, FileDown } from "lucide-react";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: "Experience & Education — Shamil TP",
  description:
    "Professional software engineering experience, freelance client deliverables (Tutora, emvBazar), internship at Fugipie Technologies, and MCA degree coursework.",
  alternates: {
    canonical: "https://shamiltp.life/experience",
  },
  openGraph: {
    title: "Experience & Education — Shamil TP",
    description:
      "Career timeline, client systems, full stack internship, and academic credentials.",
    url: "https://shamiltp.life/experience",
  },
};

export default function ExperiencePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Career Timeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Experience &amp; Education
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          Production roles, freelance system architecture, and formal academic training in computer applications.
        </p>

        <div className="pt-2">
          <a
            href={content.person.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Download ATS Resume (PDF)</span>
          </a>
        </div>
      </header>

      {/* Experience & Education Timelines */}
      <section className="space-y-8">
        <ExperienceTimeline />
      </section>

      {/* Next Step CTA */}
      <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)]">
            Looking for a developer for your next project or team?
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            I am currently open to new software engineering opportunities.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-center"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
