import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { content } from "@/data/content";
import {
  Server,
  Cpu,
  GraduationCap,
  Briefcase,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Radio,
  FileDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Shamil TP — Developer, MCA Student and Self-Hoster",
  description:
    "Shamil TP is a backend-focused full stack developer from Kerala, studying for an MCA at St. Joseph's College, Devagiri. Projects, home server and IoT work.",
  alternates: {
    canonical: "https://shamiltp.life/about",
  },
};

const TECH_MATRIX = [
  { tech: "Node.js & Express", projects: ["N-jin", "Blogify", "Osmium", "Skylark", "coffeeCat"], slug: "njin" },
  { tech: "Python & FastAPI", projects: ["OpsPilot backend"], slug: "opspilot" },
  { tech: "Go (Golang)", projects: ["Rewind audio server"], slug: "rewind" },
  { tech: "Next.js", projects: ["RegretMap"], slug: "regretmap" },
  { tech: "Redis", projects: ["N-jin caching layer"], slug: "njin" },
  { tech: "PostgreSQL & Supabase", projects: ["OpsPilot", "RegretMap"], slug: "opspilot" },
  { tech: "MongoDB & Mongoose", projects: ["N-jin", "Skylark", "coffeeCat"], slug: "njin" },
  { tech: "CI/CD & GitHub Actions", projects: ["Rewind automated releases", "OpsPilot testing"], slug: "rewind" },
  { tech: "Cloudflare R2", projects: ["LUME media storage"], slug: "lume" },
  { tech: "FFmpeg & HLS Streaming", projects: ["LUME video pipeline"], slug: "lume" },
  { tech: "Ubuntu Server & Nginx", projects: ["Personal home server"], slug: "rewind" },
  { tech: "MicroPython & ESP32", projects: ["github.com/shamil-tp/micropython"], external: "https://github.com/shamil-tp/micropython" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Terminal className="w-3.5 h-3.5" />
          <span>About Me</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Shamil TP
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          Backend-focused full stack developer from Kerala, India. Studying for an MCA at St. Joseph&apos;s College (Autonomous), Devagiri.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium rounded-xl bg-[var(--foreground)] text-[var(--background)]"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
          <a
            href={content.person.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Resume (PDF)</span>
          </a>
        </div>
      </header>

      {/* Background Narrative */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          Background
        </h2>
        <div className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-4 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
          {content.person.about.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* Home Server Setup */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
          <Server className="w-4 h-4 text-[var(--accent)]" />
          My Home Server
        </h2>
        <div className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-4 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
          <p>
            I maintain a personal home server running <strong className="text-[var(--foreground)]">Ubuntu Server</strong>, with <strong className="text-[var(--foreground)]">Nginx</strong> as the reverse proxy in front, and deploy most of my backends to it.
          </p>
          <p>
            Releases are automated via <strong className="text-[var(--foreground)]">GitHub Actions CI/CD</strong> pipelines.{" "}
            <Link href="/projects/rewind" className="text-[var(--accent)] font-medium underline">
              Rewind
            </Link>
            , my self-hosted music server, is the clearest example: every push runs formatting, vetting, and race-detector tests; deploys via SSH; and every Git version tag builds and publishes cross-compiled multi-arch release binaries.
          </p>
        </div>
      </section>

      {/* IoT Experiments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--accent)]" />
          IoT &amp; Hardware Experiments
        </h2>
        <div className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
          <p>
            Away from the web, I love hardware and low-level experimentation. I write <strong className="text-[var(--foreground)]">MicroPython</strong> for the <strong className="text-[var(--foreground)]">ESP32</strong> and the <strong className="text-[var(--foreground)]">Raspberry Pi Pico 2 W</strong>.
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/shamil-tp/micropython"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent)] hover:underline"
            >
              <span>Explore my experiments on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* What I Use and Where (Matrix) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
          <Radio className="w-4 h-4 text-[var(--accent)]" />
          What I Use, and Where
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-[var(--foreground)]">
              <tr>
                <th className="py-3 px-4 font-bold">Technology</th>
                <th className="py-3 px-4 font-bold">Applied in Project(s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/60 text-[var(--muted-foreground)]">
              {TECH_MATRIX.map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[var(--foreground)] whitespace-nowrap">
                    {item.tech}
                  </td>
                  <td className="py-3 px-4">
                    {item.external ? (
                      <a
                        href={item.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{item.projects.join(", ")}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : item.slug ? (
                      <Link
                        href={`/projects/${item.slug}`}
                        className="text-[var(--accent)] hover:underline"
                      >
                        {item.projects.join(", ")}
                      </Link>
                    ) : (
                      item.projects.join(", ")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Official Profiles & Verified Subdomains */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
          Official Profiles &amp; Live Domains
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Developer Profiles
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <a href="https://github.com/shamil-tp" target="_blank" className="hover:text-[var(--accent)] flex items-center justify-between">
                  <span>GitHub: shamil-tp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/shamil-tp/" target="_blank" className="hover:text-[var(--accent)] flex items-center justify-between">
                  <span>LinkedIn: in/shamil-tp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a href="https://x.com/ShamilTp6" target="_blank" className="hover:text-[var(--accent)] flex items-center justify-between">
                  <span>X (Twitter): @ShamilTp6</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Live Subdomains
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <a href="https://opspilot.shamiltp.life" target="_blank" className="hover:text-[var(--accent)] flex items-center justify-between">
                  <span>opspilot.shamiltp.life</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a href="https://regret-map.shamiltp.life/" target="_blank" className="hover:text-[var(--accent)] flex items-center justify-between">
                  <span>regret-map.shamiltp.life</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
