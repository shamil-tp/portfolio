"use client";

import React, { useState } from "react";
import { content } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";
import { Search, Sparkles, Filter } from "lucide-react";

const CATEGORIES = [
  "All",
  "Featured",
  "AI & Agents",
  "Backend & API",
  "Media & Streaming",
  "Systems & Open Source",
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = content.projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (activeCategory === "All") return true;
    if (activeCategory === "Featured") return project.featured;
    if (activeCategory === "AI & Agents")
      return (
        project.stack.includes("Gemini") ||
        project.kicker.toLowerCase().includes("ai") ||
        project.slug === "opspilot" ||
        project.slug === "regretmap"
      );
    if (activeCategory === "Backend & API")
      return (
        project.stack.includes("FastAPI") ||
        project.stack.includes("Node.js") ||
        project.stack.includes("Express") ||
        project.stack.includes("PostgreSQL") ||
        project.stack.includes("MongoDB")
      );
    if (activeCategory === "Media & Streaming")
      return (
        project.slug === "rewind" ||
        project.slug === "lume" ||
        project.stack.includes("FFmpeg") ||
        project.stack.includes("HLS")
      );
    if (activeCategory === "Systems & Open Source")
      return (
        project.slug === "osmium" ||
        project.slug === "brl" ||
        project.slug === "rewind" ||
        project.stack.includes("Go")
      );

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Case Studies &amp; Open Source</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          All Projects ({content.projects.length})
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
          From AI incident response agents and self-hosted streaming backends to custom compression algorithms and client systems.
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-y border-[var(--border)] py-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCategory === cat
                  ? "bg-[var(--foreground)] text-[var(--background)] font-bold shadow-sm"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stack or name..."
            className="w-full pl-9 pr-4 py-1.5 text-xs font-mono rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm text-[var(--muted-foreground)] font-mono">
            No projects matched your criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="text-xs text-[var(--accent)] underline font-mono"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
