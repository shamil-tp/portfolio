import React from "react";
import Link from "next/link";
import { Project } from "@/data/content";
import { ArrowUpRight, Github, BookOpen, ExternalLink, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div>
        {/* Top Header: Kicker & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent)] font-semibold">
            {project.kicker}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Project Name */}
        <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          <Link href={`/projects/${project.slug}`}>
            {project.name}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
          {project.summary}
        </p>

        {/* Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[var(--border)]/60 flex items-center justify-between gap-2 text-xs">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Case Study</span>
        </Link>

        <div className="flex items-center gap-3">
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="View source code on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}

          {project.live && (
            <a
              href={project.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[var(--accent)] hover:underline"
            >
              <span>{project.live.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
