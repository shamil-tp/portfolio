"use client";

import React from "react";
import { content } from "@/data/content";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export function ExperienceTimeline() {
  const shouldReduceMotion = useReducedMotion();

  // Timeline Branch Animation Variants
  const columnLeftVariants: Variants = {
    hidden: { opacity: 0, x: -45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.18,
      },
    },
  };

  const columnRightVariants: Variants = {
    hidden: { opacity: 0, x: 45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.18,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Experience Column (Slides from Left with Rail Unfold) */}
      <motion.div
        variants={columnLeftVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
          <motion.div
            initial={shouldReduceMotion ? {} : { scale: 0 }}
            whileInView={shouldReduceMotion ? {} : { scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Briefcase className="w-4 h-4 text-[var(--accent)]" />
          </motion.div>
          <h3 className="text-base font-bold text-[var(--foreground)] font-mono">
            Work Experience
          </h3>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border)]">
          {content.experience.map((exp, idx) => (
            <motion.div key={idx} variants={itemVariants} className="relative group">
              {/* Timeline bead with spring bloom */}
              <motion.div
                initial={shouldReduceMotion ? {} : { scale: 0 }}
                whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                transition={{ type: "spring", delay: 0.1 + idx * 0.12 }}
                viewport={{ once: true }}
                className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--accent)] group-hover:scale-125 transition-transform"
              />

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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Education Column (Slides from Right with Rail Unfold) */}
      <motion.div
        variants={columnRightVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
          <motion.div
            initial={shouldReduceMotion ? {} : { scale: 0 }}
            whileInView={shouldReduceMotion ? {} : { scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
          </motion.div>
          <h3 className="text-base font-bold text-[var(--foreground)] font-mono">
            Formal Education
          </h3>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border)]">
          {content.education.map((edu, idx) => (
            <motion.div key={idx} variants={itemVariants} className="relative group">
              {/* Timeline bead */}
              <motion.div
                initial={shouldReduceMotion ? {} : { scale: 0 }}
                whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                transition={{ type: "spring", delay: 0.15 + idx * 0.12 }}
                viewport={{ once: true }}
                className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] bg-[var(--accent)] group-hover:scale-125 transition-transform"
              />

              <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-base font-bold text-[var(--card-foreground)]">
                    {edu.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] font-medium">
                    <Calendar className="w-3 h-3" />
                    {edu.period}
                  </span>
                </div>

                <div className="text-xs font-mono text-[var(--muted-foreground)]">
                  {edu.org}
                </div>

                {edu.meta && (
                  <ul className="space-y-1 text-xs text-[var(--muted-foreground)] list-disc list-inside">
                    {edu.meta.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
