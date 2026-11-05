import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { content, Project } from "@/data/content";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  Globe,
  Layers,
  CheckCircle2,
  Cpu,
  Trophy,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return content.projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = content.projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Shamil TP",
    };
  }

  return {
    title: `${project.name} — Architecture & Case Study | Shamil TP`,
    description: project.summary,
    openGraph: {
      title: `${project.name} | Shamil TP`,
      description: project.summary,
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = content.projects.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = content.projects[projectIndex];
  const prevProject =
    projectIndex > 0 ? content.projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < content.projects.length - 1
      ? content.projects[projectIndex + 1]
      : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs font-mono">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <span className="text-[var(--muted-foreground)]">
          Project {projectIndex + 1} of {content.projects.length}
        </span>
      </div>

      {/* Header Banner */}
      <header className="space-y-6 pb-8 border-b border-[var(--border)]">
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
            {project.kicker}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            {project.name}
          </h1>
          {project.type && (
            <p className="text-xs font-mono text-[var(--muted-foreground)]">
              Category: {project.type}
            </p>
          )}
        </div>

        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          {project.summary}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.live && (
            <a
              href={project.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
            >
              <Globe className="w-4 h-4" />
              <span>{project.live.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          )}

          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
          )}
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-mono rounded-lg bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      {/* Case Study Body Content */}
      <div className="space-y-12">
        {/* Overview */}
        {project.caseStudy?.overview && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              Overview &amp; Architecture
            </h2>
            <div className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed space-y-4">
              <p>{project.caseStudy.overview}</p>
            </div>
          </section>
        )}

        {/* My Role & Technical Highlights */}
        {project.caseStudy?.highlights && project.caseStudy.highlights.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--accent)]" />
              My Technical Contributions
            </h2>
            {project.caseStudy.roleDescription && (
              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                Role: {project.caseStudy.roleDescription}
              </p>
            )}
            <div className="space-y-3">
              {project.caseStudy.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Features */}
        {project.caseStudy?.keyFeatures && project.caseStudy.keyFeatures.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              Key System Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.caseStudy.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] space-y-2"
                >
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Impact or Hackathon Accolades */}
        {project.caseStudy?.impactOrMetrics && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--accent)]" />
              Impact &amp; Recognition
            </h2>
            <div className="p-5 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 space-y-2">
              {project.caseStudy.impactOrMetrics.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Prev / Next Project Links */}
      <nav className="pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="flex flex-col items-start gap-1 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all max-w-[48%]"
          >
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted-foreground)]">
              <ArrowLeft className="w-3 h-3" />
              Previous
            </span>
            <span className="text-xs font-bold text-[var(--foreground)] truncate w-full">
              {prevProject.name}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="flex flex-col items-end gap-1 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all max-w-[48%]"
          >
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted-foreground)]">
              Next
              <ArrowRight className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold text-[var(--foreground)] truncate w-full text-right">
              {nextProject.name}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
