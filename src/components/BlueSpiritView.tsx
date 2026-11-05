"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { content } from "@/data/content";
import { VerticalCaption } from "@/components/VerticalCaption";
import { SpiritMaskIcon } from "@/components/SpiritMaskIcon";
import { InkParticles } from "@/components/InkParticles";
import { FlippableCard } from "@/components/FlippableCard";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  ExternalLink,
  Terminal,
  Server,
  Layers,
  Database,
  Shield,
  FileDown,
  Mail,
  Sparkles,
  Cpu,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Japanese Categories
const TECH_CATEGORIES = [
  {
    kanji: "前線",
    romaji: "Zensen",
    name: "FRONTEND",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    icon: <Layers className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    kanji: "盤石",
    romaji: "Banjaku",
    name: "BACKEND",
    skills: ["Node.js", "Express", "Fastify", "Hono", "Rust", "Python", "FastAPI", "Go"],
    icon: <Server className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    kanji: "蓄積",
    romaji: "Chikuseki",
    name: "DATABASE",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cloudflare D1", "SQLite"],
    icon: <Database className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    kanji: "基盤",
    romaji: "Kiban",
    name: "TOOLS & INFRASTRUCTURE",
    skills: ["Git", "GitHub Actions", "Docker", "Linux / Ubuntu Server", "REST APIs", "WebSockets"],
    icon: <Shield className="w-4 h-4 text-[var(--accent)]" />,
  },
];

// Philosophy axioms
const PHILOSOPHY_PRINCIPLES = [
  {
    kanji: "創",
    titleJa: "優れたソフトウェアは単に書かれるのではない。丹念に創り上げられるのだ。",
    titleEn: "Good software is not just written. It is carefully crafted.",
    desc: "Code is an enduring craft. Beyond syntactic execution lies architectural harmony, resilience under load, and deliberate engineering discipline.",
  },
  {
    kanji: "技",
    titleJa: "コードには精密さを、体験には簡潔さを。",
    titleEn: "Precision in code. Simplicity in experience.",
    desc: "Complexity should be conquered at the system boundary. The client experiences effortless speed and elegance; the backend operates with razor-sharp deterministic precision.",
  },
  {
    kanji: "道",
    titleJa: "システムを理解し、細部を極める。",
    titleEn: "Understand the system. Master the details.",
    desc: "From memory allocation and network syscalls to user gestures, true mastery requires seeing both the vast architecture and the microscopic byte.",
  },
];

export function BlueSpiritView() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const featuredProjects = content.projects.filter((p) => p.featured);

  return (
    <div className="relative min-h-screen text-[var(--foreground)] overflow-x-hidden pb-24 selection:bg-[var(--accent)] selection:text-[var(--background)]">
      {/* Background atmospheric ink mist & ambient particles */}
      <InkParticles />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — THE BLUE SPIRIT (蒼き鬼神)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)] overflow-hidden">
        {/* Subtle background calligraphy watermark */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 writing-vertical font-calligraphy text-[18vw] leading-none text-[var(--accent)]/5 select-none pointer-events-none hidden xl:block"
          style={{ textOrientation: "upright" }}
          aria-hidden="true"
        >
          青心影武
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Vertical Caption & Editorial Hero Text */}
          <div className="lg:col-span-7 flex items-start gap-6 sm:gap-10">
            {/* Signature Japanese Vertical Caption */}
            <div className="shrink-0 pt-3">
              <VerticalCaption
                kanji="蒼き鬼神"
                romaji="Aoki Kishin"
                english="THE BLUE SPIRIT"
                sectionNumber="零壱"
              />
            </div>

            {/* Editorial Content */}
            <div className="space-y-6 flex-1">
              {/* Hanko Status Badge */}
              <div className="inline-flex items-center gap-3">
                <span className="hanko-seal text-xs px-2 py-0.5 font-calligraphy">
                  現役稼働
                </span>
                <span className="text-xs font-tech tracking-wider text-[var(--muted-foreground)] uppercase">
                  AVAILABLE FOR OPPORTUNITIES · {content.person.location}
                </span>
              </div>

              {/* Dramatic Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
                  <span>SYSTEM ARCHITECTURE &amp; FULL-STACK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-editorial font-bold tracking-tight text-[var(--foreground)] leading-[1.05]">
                  THE BLUE SPIRIT
                </h1>

                <p className="text-lg sm:text-2xl font-editorial italic text-[var(--muted-foreground)]">
                  Shamil TP — {content.person.role} ({content.person.focus})
                </p>
              </div>

              {/* Introduction quote */}
              <div className="relative pl-4 border-l-2 border-[var(--accent)]/50 py-1 space-y-2">
                <p className="font-calligraphy text-base sm:text-lg text-[var(--foreground)]/90 tracking-wide">
                  「システムを構築し、体験を創出し、構想を具現化する」
                </p>
                <p className="text-sm sm:text-base text-[var(--muted-foreground)] font-sans leading-relaxed">
                  Building high-throughput backend services, crafting responsive client experiences, and turning resilient ideas into production reality.
                </p>
              </div>

              {/* Technical Specifications bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs font-tech text-[var(--muted-foreground)] border-y border-[var(--border)]">
                <div>
                  <span className="text-[var(--accent)] block">DISCIPLINE</span>
                  <span>Full-Stack</span>
                </div>
                <div>
                  <span className="text-[var(--accent)] block">ENGINE</span>
                  <span>Node / Go / Rust</span>
                </div>
                <div>
                  <span className="text-[var(--accent)] block">INFRA</span>
                  <span>Linux / Docker</span>
                </div>
                <div>
                  <span className="text-[var(--accent)] block">DEGREE</span>
                  <span>MCA Candidate</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded text-xs font-tech tracking-wider uppercase bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-black transition-all shadow-lg group font-bold"
                >
                  <span>作品を見る · Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded text-xs font-tech tracking-wider uppercase border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--foreground)] transition-all"
                >
                  <span>自己紹介 · About</span>
                </a>

                <a
                  href={content.person.resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded text-xs font-tech tracking-wider uppercase border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
                  title="Download Resume PDF"
                >
                  <FileDown className="w-4 h-4 text-[var(--accent)]" />
                  <span className="hidden sm:inline">履歴書 · Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Hand-Illustrated Poster & Floating Mask Artwork */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual poster frame with layered artwork */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden border-2 border-[var(--border)] bg-[#07101d] shadow-2xl group">
              {/* Main character poster illustration */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/blue-spirit-hero.png"
                alt="The Blue Spirit character illustration in moonlit bamboo forest"
                className="w-full h-full object-cover contrast-115 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Top Japanese Poster Header Overlay */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-[#07101d]/90 via-[#07101d]/50 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SpiritMaskIcon className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-calligraphy text-sm text-[var(--foreground)] tracking-widest">
                    蒼霊録
                  </span>
                </div>
                <span className="text-[10px] font-tech text-[var(--muted-foreground)] tracking-wider">
                  DEV.2026
                </span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#05070a] via-[#07101d]/80 to-transparent space-y-1">
                <div className="flex items-center justify-between text-xs font-tech">
                  <span className="text-[var(--accent)] tracking-widest uppercase">
                    RONIN ARCHITECT
                  </span>
                  <span className="font-calligraphy text-[var(--foreground)]">
                    孤高の刃
                  </span>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] font-sans line-clamp-1">
                  Mastery over the command line, distributed networks, and real-time streams.
                </p>
              </div>
            </div>

            {/* Floating 3D Mask Asset positioned as dynamic foreground ornament */}
            <div className="absolute -bottom-6 -left-6 sm:-left-10 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[var(--accent)] bg-[#07101d] shadow-2xl animate-float-gentle hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/blue-spirit-mask.png"
                alt="Isolated Blue Spirit Oni Mask"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[9px] font-tech text-[var(--accent)] uppercase tracking-wider">
                  鬼面 · MASK
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: ABOUT ME (自己紹介)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Vertical Caption Column */}
          <div className="lg:col-span-2 flex items-start gap-4">
            <VerticalCaption
              kanji="自己紹介"
              romaji="Jiko Shoukai"
              english="ABOUT ME"
              sectionNumber="零弐"
            />
            <div className="hidden sm:block">
              <span className="writing-vertical font-tech text-xs text-[var(--muted-foreground)] tracking-widest uppercase">
                PORTFOLIO DOSSIER · SHAMIL TP
              </span>
            </div>
          </div>

          {/* About Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
                IDENTITY &amp; ENGINEERING BACKGROUND
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[var(--foreground)]">
                The Dual Path of Engineering &amp; Discipline
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base leading-relaxed text-[var(--muted-foreground)] font-sans">
              <p>
                I am <strong className="text-[var(--foreground)]">Shamil TP</strong>, a Full-Stack Engineer and MCA postgraduate candidate at Devagiri College, Kozhikode. Like a ronin refining every cut of the blade, I treat software engineering as an exacting discipline where architecture, reliability, and precision reign supreme.
              </p>
              <p>
                My focus centers on <span className="text-[var(--accent)]">backend systems, API design, high-throughput network architectures, and self-hosted server environments</span>. On my home lab (an Ubuntu Server with automated GitHub Actions CI/CD pipelines), I host microservices, reverse proxies, and streaming pipelines that reflect production reliability.
              </p>
              <p>
                I have built systems ranging from customer debt ledger automation (<strong className="text-[var(--foreground)]">emvBazar</strong>), specialized educational portals (<strong className="text-[var(--foreground)]">Tutora</strong>), interactive cognitive regret maps (<strong className="text-[var(--foreground)]">RegretMap</strong>), to high-speed desktop telemetry (<strong className="text-[var(--foreground)]">OpsPilot</strong>).
              </p>
            </div>

            {/* Quick stats / Highlights in samurai scroll boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] space-y-1">
                <span className="hanko-seal text-[9px] px-1.5 py-0.2">実戦</span>
                <h4 className="text-xl font-bold font-tech text-[var(--foreground)]">12+</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Production Systems &amp; Case Studies Delivered</p>
              </div>

              <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] space-y-1">
                <span className="hanko-seal text-[9px] px-1.5 py-0.2">勝負</span>
                <h4 className="text-xl font-bold font-tech text-[var(--accent)]">Top 13 &amp; 37</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Placements in Competitive 24h Hackathons</p>
              </div>

              <div className="p-4 rounded border border-[var(--border)] bg-[var(--card)] space-y-1">
                <span className="hanko-seal text-[9px] px-1.5 py-0.2">拠点</span>
                <h4 className="text-xl font-bold font-tech text-[var(--foreground)]">Ubuntu</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Dedicated Self-Hosted Server &amp; CI/CD</p>
              </div>
            </div>
          </div>

          {/* Mask Seal Graphic on the right */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center space-y-4">
            <div className="w-24 h-24 rounded-full border border-[var(--accent)]/40 p-2 flex items-center justify-center bg-[#0c192c]/50">
              <SpiritMaskIcon className="w-16 h-16 text-[var(--accent)]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-calligraphy text-lg text-[var(--foreground)]">
                信条：誠心誠意
              </h3>
              <p className="text-xs font-tech text-[var(--muted-foreground)]">
                &quot;Precision in code. Honesty in architecture.&quot;
              </p>
            </div>

            <div className="pt-2 w-full border-t border-[var(--border)] flex justify-around text-xs font-tech text-[var(--muted-foreground)]">
              <span>DEVAGIRI</span>
              <span>·</span>
              <span>KERALA</span>
              <span>·</span>
              <span>INDIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: TECHNOLOGIES (技術)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border)]">
        <div className="flex items-start gap-6 sm:gap-10 mb-14">
          <div className="shrink-0">
            <VerticalCaption
              kanji="技術"
              romaji="Gijutsu"
              english="TECHNOLOGIES"
              sectionNumber="零参"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
              TECHNICAL ARSENAL &amp; CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[var(--foreground)]">
              Weapons &amp; Systems in Practice
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl font-sans">
              No generic progress bars. Categorized by operational layer with strict engineering focus on concurrency, memory safety, and decoupled resilience.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.name}
              className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/60 transition-all duration-300 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[var(--muted)] border border-[var(--border)]">
                      {cat.icon}
                    </div>
                    <div>
                      <span className="text-xs font-tech text-[var(--accent)] tracking-wider">
                        {cat.name}
                      </span>
                      <h3 className="font-calligraphy text-base text-[var(--foreground)]">
                        {cat.kanji}
                      </h3>
                    </div>
                  </div>
                  <span className="hanko-seal text-[9px] px-1 py-0.5">
                    0{idx + 1}
                  </span>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-tech rounded bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] border border-[var(--border)] group-hover:border-[var(--accent)]/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sub-label */}
              <div className="pt-2 text-[10px] font-tech text-[var(--muted-foreground)]/70 flex justify-between">
                <span>LAYER 0{idx + 1}</span>
                <span>PRODUCTION READY</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: PROJECTS (作品)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="flex items-start gap-6 sm:gap-10">
            <div className="shrink-0">
              <VerticalCaption
                kanji="作品"
                romaji="Sakuhin"
                english="SELECTED WORKS"
                sectionNumber="零四"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
                FEATURED ARCHITECTURES &amp; SYSTEMS
              </span>
              <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[var(--foreground)]">
                Selected Works
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl font-sans">
                Full-width project panels inspired by Japanese manga compositions and editorial gallery scrolls.
              </p>
            </div>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-tech text-[var(--accent)] hover:text-white uppercase tracking-wider self-start sm:self-auto group border-b border-[var(--accent)]/40 pb-1"
          >
            <span>View all 12 projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Projects Panels (Alternating Layout) */}
        <div className="space-y-12">
          {featuredProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            const projectNumber = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <div
                key={project.slug}
                className="relative p-6 sm:p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all duration-500 group overflow-hidden"
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Kanji Watermark */}
                <div
                  className="absolute right-6 -bottom-6 font-calligraphy text-8xl text-[var(--foreground)]/[0.03] select-none pointer-events-none group-hover:text-[var(--accent)]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  作
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}>
                  {/* Left Project Info */}
                  <div className={`lg:col-span-7 space-y-5 ${isEven ? "" : "lg:order-2"}`}>
                    <div className="flex items-center gap-3">
                      <span className="hanko-seal text-[10px] px-2 py-0.5 font-calligraphy">
                        巻 {projectNumber}
                      </span>
                      <span className="text-xs font-tech text-[var(--accent)] tracking-widest uppercase">
                        {project.kicker}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed font-sans">
                        {project.summary}
                      </p>
                    </div>

                    {/* Highlights bullet */}
                    {project.caseStudy?.highlights && (
                      <ul className="space-y-1.5 text-xs text-[var(--muted-foreground)] font-sans">
                        {project.caseStudy.highlights.slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="text-[var(--accent)] mt-1">▸</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.stack.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 text-xs font-tech rounded bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-3 text-xs font-tech">
                      {project.source && (
                        <a
                          href={project.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>SOURCE CODE</span>
                        </a>
                      )}

                      {project.live && (
                        <a
                          href={project.live.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline underline-offset-4"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>LIVE SYSTEM</span>
                        </a>
                      )}

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors ml-auto"
                      >
                        <span>CASE STUDY</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Project Image Panel */}
                  <div className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}>
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--muted)] group-hover:border-[var(--accent)] transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/assets/og/${project.slug}.png`}
                        alt={project.name}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#07101d]/90 border border-[var(--border)] text-[10px] font-tech text-[var(--accent)]">
                        {project.type || "Full Stack"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: EXPERIENCE & EDUCATION (経歴)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border)]">
        <div className="flex items-start gap-6 sm:gap-10 mb-14">
          <div className="shrink-0">
            <VerticalCaption
              kanji="経歴"
              romaji="Keireki"
              english="EXPERIENCE"
              sectionNumber="零五"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
              MILESTONES &amp; FORMAL EDUCATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[var(--foreground)]">
              Chronicles &amp; Lineage
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl font-sans">
              A minimalist scroll timeline detailing professional freelance deliveries, hackathon trials, and postgraduate study.
            </p>
          </div>
        </div>

        {/* Scroll Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work History */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
              <span className="hanko-seal text-[10px] px-2 py-0.5">実務</span>
              <h3 className="font-tech text-sm uppercase tracking-wider text-[var(--foreground)] font-bold">
                Professional Work &amp; Client Software
              </h3>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--border)]">
              {content.experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--accent)] group-hover:scale-125 transition-transform" />

                  <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--card)] space-y-3 group-hover:border-[var(--accent)] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-base font-bold text-[var(--foreground)] font-sans">
                        {exp.role}
                      </h4>
                      <span className="text-xs font-tech text-[var(--accent)]">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-xs font-tech text-[var(--muted-foreground)]">
                      {exp.org}
                    </p>

                    <div className="space-y-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {exp.bullets.map((b, bIdx) => (
                        <p key={bIdx}>
                          {b}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
              <span className="hanko-seal text-[10px] px-2 py-0.5">学問</span>
              <h3 className="font-tech text-sm uppercase tracking-wider text-[var(--foreground)] font-bold">
                Education &amp; Credentials
              </h3>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--border)]">
              {content.education.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[#eae8df] group-hover:scale-125 transition-transform" />

                  <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--card)] space-y-2 group-hover:border-[var(--accent)] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-base font-bold text-[var(--foreground)] font-sans">
                        {edu.title}
                      </h4>
                      <span className="text-xs font-tech text-[var(--muted-foreground)]">
                        {edu.meta[0]}
                      </span>
                    </div>

                    <p className="text-xs font-tech text-[var(--accent)]">
                      {edu.org}
                    </p>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {edu.meta[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: DEVELOPER PHILOSOPHY (思想)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border)] relative overflow-hidden">
        {/* Subtle large background kanji */}
        <div
          className="absolute -right-8 top-1/2 -translate-y-1/2 font-calligraphy text-[24vw] leading-none text-[var(--foreground)]/[0.02] select-none pointer-events-none"
          aria-hidden="true"
        >
          道
        </div>

        <div className="flex items-start gap-6 sm:gap-10 mb-14">
          <div className="shrink-0">
            <VerticalCaption
              kanji="思想"
              romaji="Shisou"
              english="PHILOSOPHY"
              sectionNumber="零六"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
              ENGINEERING CREED &amp; PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[var(--foreground)]">
              Developer Philosophy
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl font-sans">
              Oversized Japanese calligraphy paired with core engineering axioms.
            </p>
          </div>
        </div>

        {/* 3 Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PHILOSOPHY_PRINCIPLES.map((principle) => (
            <div
              key={principle.kanji}
              className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all duration-300 space-y-6 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="font-calligraphy text-4xl text-[var(--accent)] group-hover:scale-110 transition-transform">
                  {principle.kanji}
                </span>
                <span className="hanko-seal text-[10px] px-1.5 py-0.5">
                  真理
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-calligraphy text-base text-[var(--foreground)] leading-relaxed">
                  {principle.titleJa}
                </h3>
                <h4 className="font-editorial text-lg italic text-[var(--accent)]">
                  &quot;{principle.titleEn}&quot;
                </h4>
              </div>

              <p className="text-xs text-[var(--muted-foreground)] font-sans leading-relaxed border-t border-[var(--border)] pt-4">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: CONTACT (連絡) — THE FINAL CONNECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex items-start gap-6 sm:gap-10 mb-14">
          <div className="shrink-0">
            <VerticalCaption
              kanji="連絡"
              romaji="Renraku"
              english="GET IN TOUCH"
              sectionNumber="零七"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-tech tracking-[0.25em] text-[var(--accent)] uppercase">
              DIRECT INQUIRIES &amp; IDENTITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[var(--foreground)]">
              Let&apos;s Build Together
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl font-sans">
              &quot;Every great journey begins with a single connection.&quot; (すべての偉大な旅は、一つの繋がりから始まる。)
            </p>
          </div>
        </div>

        {/* 3D Flippable Developer Card */}
        <div className="space-y-8">
          <FlippableCard />

          {/* Direct channels bar */}
          <div className="max-w-3xl mx-auto p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-wrap items-center justify-between gap-4 text-xs font-tech">
            <div className="flex items-center gap-2">
              <span className="hanko-seal text-[9px] px-1 py-0.5">通信</span>
              <span className="text-[var(--foreground)]">DIRECT PORTAL:</span>
              <a
                href="https://contact.shamiltp.life"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                contact.shamiltp.life
              </a>
            </div>

            <div className="flex items-center gap-4 text-[var(--muted-foreground)]">
              {content.socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
