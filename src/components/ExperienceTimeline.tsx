import React from "react";
import { content } from "@/data/content";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

export function ExperienceTimeline() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Experience Column */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
          <Briefcase className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-base font-bold text-[var(--foreground)] font-mono">
            Work Experience
          </h3>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border)]">
          {content.experience.map((exp, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline bead */}
              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--accent)] group-hover:scale-125 transition-transform" />

              <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-base font-bold text-[var(--card-foreground)]">
                    {exp.role}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] font-medium">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </span>
                </div>

                <div className="text-xs font-mono text-[var(--muted-foreground)]">
                  {exp.org}
                </div>

                <ul className="space-y-2 text-xs text-[var(--muted-foreground)] leading-relaxed list-disc list-inside">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="pl-1">
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {exp.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]/50">
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Column */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
          <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-base font-bold text-[var(--foreground)] font-mono">
            Education & Certifications
          </h3>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border)]">
          {content.education.map((edu, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--foreground)] group-hover:scale-125 transition-transform" />

              <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-base font-bold text-[var(--card-foreground)]">
                    {edu.title}
                  </h4>
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">
                    {edu.period}
                  </span>
                </div>

                <div className="text-xs font-mono text-[var(--foreground)] font-medium">
                  {edu.org}
                </div>

                <div className="space-y-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {edu.meta.map((m, mIdx) => (
                    <p key={mIdx}>{m}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
