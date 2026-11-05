"use client";

import React from "react";
import { content } from "@/data/content";
import { Server, Database, Cloud, Radio, Cpu, Layers } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "Backend Engineering": <Server className="w-4 h-4 text-[var(--accent)]" />,
  "Data & Storage": <Database className="w-4 h-4 text-[var(--accent)]" />,
  "DevOps & Cloud": <Cloud className="w-4 h-4 text-[var(--accent)]" />,
  "Media & Streaming": <Radio className="w-4 h-4 text-[var(--accent)]" />,
  "Automation & AI": <Cpu className="w-4 h-4 text-[var(--accent)]" />,
  "Frontend & IoT": <Layers className="w-4 h-4 text-[var(--accent)]" />,
};

// Quantum Matrix Spring Physics Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardSpringVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

export function SkillsGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={containerVariants}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {content.skills.map((skillGroup, index) => (
        <motion.div
          key={skillGroup.group}
          variants={cardSpringVariants}
          whileHover={
            shouldReduceMotion
              ? {}
              : { scale: 1.025, transition: { duration: 0.2 } }
          }
          className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <motion.div
                initial={shouldReduceMotion ? {} : { rotate: -15, scale: 0.8 }}
                whileInView={shouldReduceMotion ? {} : { rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: index * 0.08 }}
                className="p-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] shrink-0"
              >
                {GROUP_ICONS[skillGroup.group] || (
                  <Server className="w-4 h-4 text-[var(--accent)]" />
                )}
              </motion.div>
              <h4 className="text-sm font-bold text-[var(--foreground)] font-mono">
                {skillGroup.group}
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skillGroup.items.map((item, i) => (
                <motion.span
                  key={item}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
