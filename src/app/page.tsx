import React from "react";
import Link from "next/link";
import { content } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { AchievementsSection } from "@/components/AchievementsSection";
import { ContactForm } from "@/components/ContactForm";
import {
  ArrowRight,
  Server,
  Code2,
  Trophy,
  Sparkles,
  FileDown,
  Briefcase,
  Mail,
} from "lucide-react";

export default function HomePage() {
  const featuredProjects = content.projects.filter((p) => p.featured);

  return (
    <div className="space-y-24 py-12 md:py-20">
      {/* ════════════════ HERO SECTION ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--foreground)]">{content.person.status}</span>
              <span className="text-[var(--muted-foreground)]">· {content.person.location}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1]">
                Hi, I&apos;m{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] to-[var(--accent)]">
                  {content.person.name}
                </span>
                .
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[var(--accent)] font-mono">
                {content.person.role} ({content.person.focus})
              </p>
            </div>

            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
              {content.person.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity font-mono shadow-md"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] transition-all font-mono"
              >
                <span>About &amp; Home Server</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] hover:border-[var(--accent)] transition-all font-mono"
              >
                <Mail className="w-4 h-4 text-[var(--accent)]" />
                <span>Contact Direct</span>
              </Link>

              <a
                href={content.person.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]/80 transition-colors"
                title="Download Resume (ATS PDF)"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Resume</span>
              </a>
            </div>

            {/* Social handles bar */}
            <div className="flex items-center gap-4 pt-4 text-xs font-mono text-[var(--muted-foreground)]">
              {content.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--foreground)] transition-colors underline-offset-4 hover:underline"
                >
                  {s.label} ({s.handle})
                </a>
              ))}
            </div>
          </div>

          {/* Right avatar portrait */}
          <div className="relative group self-center md:self-auto">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[var(--border)] bg-[var(--muted)] shadow-2xl group-hover:border-[var(--accent)] transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/profile-400.jpg"
                alt="Portrait of Shamil TP"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-mono shadow-lg flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Self-Hoster</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS / HIGHLIGHTS BAR ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <Link href="/projects" className="space-y-1 group">
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-mono group-hover:text-[var(--accent)] transition-colors">
              12
            </div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium">
              Projects &amp; Case Studies →
            </div>
          </Link>
          <Link href="/achievements" className="space-y-1 group">
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)] font-mono">
              Top 13 &amp; 37
            </div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium">
              Hackathon Placements →
            </div>
          </Link>
          <Link href="/about" className="space-y-1 group">
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-mono group-hover:text-[var(--accent)] transition-colors">
              Ubuntu
            </div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium">
              Self-Hosted Server + CI/CD →
            </div>
          </Link>
          <Link href="/experience" className="space-y-1 group">
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] font-mono group-hover:text-[var(--accent)] transition-colors">
              MCA
            </div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium">
              Devagiri College (2026-28) →
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════════ FEATURED PROJECTS ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Work</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Architecture &amp; Case Studies
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <span>View all 12 projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* ════════════════ SKILLS MATRIX ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Tools &amp; Systems I Work With
            </h2>
          </div>

          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <span>Dedicated skills directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <SkillsGrid />
      </section>

      {/* ════════════════ EXPERIENCE & EDUCATION ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career &amp; Background</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Experience &amp; Education
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Professional roles, freelance client software, and formal degrees.
            </p>
          </div>

          <Link
            href="/experience"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <span>Full experience timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ExperienceTimeline />
      </section>

      {/* ════════════════ ACHIEVEMENTS SNAPSHOT ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Competitions &amp; Credentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Hackathons &amp; Certifications
            </h2>
          </div>

          <Link
            href="/achievements"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <span>All credentials &amp; certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AchievementsSection />
      </section>

      {/* ════════════════ CONTACT SECTION WITH CLOUDFLARE D1 FORM ════════════════ */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Inquiries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Contact &amp; Collaboration
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Send a direct message via Cloudflare Workers &amp; Hono to D1 database.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto"
          >
            <span>Full contact page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ContactForm />
      </section>
    </div>
  );
}
