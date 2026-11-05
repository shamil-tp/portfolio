import React from "react";
import { content } from "@/data/content";
import { Server, Database, Cloud, Radio, Cpu, Layers } from "lucide-react";

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "Backend Engineering": <Server className="w-4 h-4 text-[var(--accent)]" />,
  "Data & Storage": <Database className="w-4 h-4 text-[var(--accent)]" />,
  "DevOps & Cloud": <Cloud className="w-4 h-4 text-[var(--accent)]" />,
  "Media & Streaming": <Radio className="w-4 h-4 text-[var(--accent)]" />,
  "Automation & AI": <Cpu className="w-4 h-4 text-[var(--accent)]" />,
  "Frontend & IoT": <Layers className="w-4 h-4 text-[var(--accent)]" />,
};

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {content.skills.map((skillGroup) => (
        <div
          key={skillGroup.group}
          className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="p-2 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                {GROUP_ICONS[skillGroup.group] || <Server className="w-4 h-4 text-[var(--accent)]" />}
              </div>
              <h4 className="text-sm font-bold text-[var(--foreground)] font-mono">
                {skillGroup.group}
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skillGroup.items.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
