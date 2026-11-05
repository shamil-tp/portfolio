"use client";

import React from "react";
import Link from "next/link";
import { content } from "@/data/content";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { AchievementsSection } from "@/components/AchievementsSection";
import { FlippableCard } from "@/components/FlippableCard";
import {
  ArrowRight,
  Server,
  Code2,
  Trophy,
  Sparkles,
  FileDown,
  Briefcase,
  Mail,
  Layers,
  Cpu,
  GraduationCap,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function HomePage() {
  const featuredProjects = content.projects.filter((p) => p.featured);
  const shouldReduceMotion = useReducedMotion();

  // ════════════════ HERO ENTRANCE VARIANTS ════════════════
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const portraitVariants: Variants = {
    hidden: { opacity: 0, scale: 0.88, rotate: -3 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
    },
  };

  // ════════════════ 1. ARCHITECTURE & CASE STUDIES: 3D PERSPECTIVE ELEVATION CASCADE ════════════════
  const architectureContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };

  const architectureCardVariants: Variants = {
    hidden: { opacity: 0, y: 55, scale: 0.94, rotateX: 8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // ════════════════ 2. TOOLS & SYSTEMS: QUANTUM MATRIX POP & SPRING RIPPLE ════════════════
  const toolsHeaderVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ════════════════ 3. EXPERIENCE & EDUCATION: TIMELINE RAIL & BRANCH DRAWER ════════════════
  const experienceHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ════════════════ 4. HACKATHONS & CERTIFICATIONS: TROPHY SPOTLIGHT & DIAGONAL FLIP ════════════════
  const trophyHeaderVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 220 },
    },
  };

  // ════════════════ 5. LET'S BUILD TOGETHER: MAGNETIC LEVITATION & ORBITAL FLOAT-IN ════════════════
  const buildSectionVariants: Variants = {
    hidden: { opacity: 0, y: 70, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="portfolio-page space-y-24 py-12 md:py-20 overflow-x-hidden">
      {/* ════════════════ HERO SECTION ════════════════ */}
      <motion.section
        variants={heroContainerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
        className="hero-section max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="hero-layout flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-12">
          {/* Left content */}
          <div className="hero-content flex-1 space-y-6">
            <motion.div
              variants={heroItemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--foreground)]">{content.person.status}</span>
              <span className="text-[var(--muted-foreground)]">· {content.person.location}</span>
            </motion.div>

            <motion.div variants={heroItemVariants} className="space-y-3">
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
            </motion.div>

            <motion.p
              variants={heroItemVariants}
              className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl"
            >
              {content.person.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={heroItemVariants}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity font-mono shadow-md group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            </motion.div>

            {/* Social handles bar */}
            <motion.div
              variants={heroItemVariants}
              className="flex items-center gap-4 pt-4 text-xs font-mono text-[var(--muted-foreground)]"
            >
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
            </motion.div>
          </div>

          {/* Right avatar portrait */}
          <motion.div
            variants={portraitVariants}
            className="relative group self-center md:self-auto"
          >
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
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════════ STATS / HIGHLIGHTS BAR ════════════════ */}
      <motion.section
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
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
      </motion.section>

      {/* ════════════════ 1. ARCHITECTURE & CASE STUDIES (3D PERSPECTIVE ELEVATION CASCADE) ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Work · 3D Perspective Elevation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Architecture &amp; Case Studies
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto group"
          >
            <span>View all 12 projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 3D Elevation Cascade Grid */}
        <motion.div
          variants={architectureContainerVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{ perspective: 1200 }}
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.slug}
              variants={architectureCardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -6, transition: { duration: 0.25 } }
              }
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════ 2. TOOLS & SYSTEMS (QUANTUM MATRIX POP & SPRING RIPPLE) ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <motion.div
          variants={toolsHeaderVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Technical Capabilities · Quantum Matrix Pop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Tools &amp; Systems I Work With
            </h2>
          </div>

          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto group"
          >
            <span>Dedicated skills directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Quantum Spring Grid */}
        <SkillsGrid />
      </section>

      {/* ════════════════ 3. EXPERIENCE & EDUCATION (TIMELINE RAIL & BRANCH DRAWER) ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <motion.div
          variants={experienceHeaderVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career &amp; Background · Dual-Branch Rail Drawer</span>
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
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto group"
          >
            <span>Full experience timeline</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Sliding Timeline Rail */}
        <ExperienceTimeline />
      </section>

      {/* ════════════════ 4. HACKATHONS & CERTIFICATIONS (TROPHY SPOTLIGHT & DIAGONAL FLIP ZOOM) ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <motion.div
          variants={trophyHeaderVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Competitions &amp; Credentials · Spotlight Tilt Zoom</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Hackathons &amp; Certifications
            </h2>
          </div>

          <Link
            href="/achievements"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto group"
          >
            <span>All credentials &amp; certificates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Spotlight Diagonal Flip Grid */}
        <AchievementsSection />
      </section>

      {/* ════════════════ 5. LET'S BUILD TOGETHER (MAGNETIC LEVITATION & ORBITAL FLOAT-IN) ════════════════ */}
      <motion.section
        id="contact"
        variants={buildSectionVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Inquiries &amp; Identity · Magnetic Levitation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Let&apos;s Build Together
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Hover and click or tap the card to flip between front identity and back coordinates.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors self-start sm:self-auto group"
          >
            <span>Direct message portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3D Flippable Card Component */}
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <FlippableCard />
        </motion.div>
      </motion.section>
    </div>
  );
}
