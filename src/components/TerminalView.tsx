"use client";

import React, { useState, useRef, useEffect } from "react";
import { content } from "@/data/content";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

export function TerminalView() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">
            Shamil TP — Interactive Developer Shell v2.0
          </p>
          <p className="text-[var(--muted-foreground)]">
            Type <span className="text-[var(--accent)] font-bold">help</span> to see available commands or click the prompts below.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    let out: React.ReactNode = null;

    switch (cmd) {
      case "help":
        out = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-1">
            <div><span className="text-emerald-400 font-bold">projects</span> — List all 12 projects</div>
            <div><span className="text-emerald-400 font-bold">skills</span> — View core tech stack</div>
            <div><span className="text-emerald-400 font-bold">experience</span> — Work history</div>
            <div><span className="text-emerald-400 font-bold">education</span> — Degrees & training</div>
            <div><span className="text-emerald-400 font-bold">achievements</span> — Hackathons & honors</div>
            <div><span className="text-emerald-400 font-bold">contact</span> — Email, social handles</div>
            <div><span className="text-emerald-400 font-bold">theme [name]</span> — Switch aesthetic</div>
            <div><span className="text-emerald-400 font-bold">clear</span> — Clear terminal output</div>
          </div>
        );
        break;

      case "projects":
        out = (
          <div className="space-y-2 text-xs">
            {content.projects.map((p) => (
              <div key={p.slug} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[var(--border)]/40 pb-1">
                <div>
                  <span className="font-bold text-[var(--foreground)]">{p.name}</span>
                  <span className="text-[var(--muted-foreground)] ml-2 text-[11px]">({p.stack.join(", ")})</span>
                </div>
                <span className="text-[var(--accent)] text-[11px]">{p.kicker}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        out = (
          <div className="space-y-2 text-xs">
            {content.skills.map((s) => (
              <div key={s.group}>
                <span className="text-emerald-400 font-bold">{s.group}: </span>
                <span className="text-[var(--foreground)]">{s.items.join(" · ")}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "experience":
        out = (
          <div className="space-y-3 text-xs">
            {content.experience.map((e, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-bold text-[var(--foreground)]">
                  {e.role} @ {e.org} <span className="text-[var(--muted-foreground)] font-normal">({e.period})</span>
                </div>
                <ul className="list-disc list-inside text-[var(--muted-foreground)] space-y-0.5 pl-2">
                  {e.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case "education":
        out = (
          <div className="space-y-2 text-xs">
            {content.education.map((ed, idx) => (
              <div key={idx}>
                <div className="font-bold text-[var(--foreground)]">{ed.title}</div>
                <div className="text-[var(--muted-foreground)]">{ed.org} — {ed.period}</div>
              </div>
            ))}
          </div>
        );
        break;

      case "achievements":
        out = (
          <div className="space-y-2 text-xs">
            {content.achievements.map((a) => (
              <div key={a.id}>
                <span className="text-emerald-400 font-bold">{a.result}: </span>
                <span className="text-[var(--foreground)]">{a.title}</span>
                <span className="text-[var(--muted-foreground)] ml-2">({a.place})</span>
              </div>
            ))}
          </div>
        );
        break;

      case "contact":
        out = (
          <div className="space-y-1 text-xs">
            <div>Email: <a href={`mailto:${content.contact.email}`} className="text-[var(--accent)] underline">{content.contact.email}</a></div>
            <div>Phone: <span className="text-[var(--foreground)]">{content.contact.phone}</span></div>
            <div>GitHub: <a href="https://github.com/shamil-tp" target="_blank" className="text-[var(--accent)] underline">github.com/shamil-tp</a></div>
            <div>LinkedIn: <a href="https://linkedin.com/in/shamil-tp" target="_blank" className="text-[var(--accent)] underline">linkedin.com/in/shamil-tp</a></div>
          </div>
        );
        break;

      case "theme":
        if (["obsidian", "swiss", "terminal", "brutalist", "warm"].includes(arg.toLowerCase())) {
          setTheme(arg.toLowerCase() as Theme);
          out = <div>Theme changed to <span className="text-emerald-400 font-bold">{arg}</span></div>;
        } else {
          out = <div>Available themes: obsidian, swiss, terminal, brutalist, warm. Usage: <span className="text-emerald-400">theme swiss</span></div>;
        }
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "whoami":
        out = <div>guest@shamiltp.life (welcome, curious explorer!)</div>;
        break;

      default:
        out = (
          <div className="text-rose-400">
            command not found: {trimmed}. Type <span className="font-bold underline cursor-pointer" onClick={() => handleCommand("help")}>help</span> for a list of commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, output: out }]);
    setInputVal("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-xl hover:border-[var(--accent)] hover:scale-105 transition-all text-xs font-mono font-medium"
        >
          <TerminalIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Interactive Shell</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 border border-[var(--border)] bg-[#07090e]/95 backdrop-blur-xl shadow-2xl font-mono text-[var(--foreground)] rounded-2xl flex flex-col transition-all duration-300 ${
        isMaximized
          ? "inset-4 sm:inset-10"
          : "bottom-6 right-6 w-[92vw] sm:w-[540px] h-[420px]"
      }`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]/70 select-none bg-black/40 rounded-t-2xl">
        <div className="flex items-center gap-2 text-xs">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-gray-200">shamil@portfolio: ~</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? "Restore window" : "Maximize window"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-gray-400 hover:text-rose-400 transition-colors"
            title="Close shell"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>➜</span>
              <span className="text-gray-300">~</span>
              <span className="text-white">{item.command}</span>
            </div>
            <div className="pl-4 text-gray-300">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-[var(--border)]/70 bg-black/40 flex items-center gap-2 rounded-b-2xl">
        <span className="text-emerald-400 font-bold text-xs">➜</span>
        <span className="text-gray-400 text-xs">~</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type 'help' or any command..."
          className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder-gray-500"
        />
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 font-mono">
          <span>press</span>
          <kbd className="px-1 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">Enter</kbd>
        </div>
      </div>
    </div>
  );
}
