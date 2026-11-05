import React from "react";
import { Metadata } from "next";
import { AchievementsSection } from "@/components/AchievementsSection";
import { Trophy, Award, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Achievements & Certificates | Shamil TP",
  description:
    "Shamil TP's hackathons and certificates: Layover 2026 (top 13, RegretMap), Gateways 2026 (top 37, OpsPilot), AI Unplugged 2026 and Beyond Us 2023.",
};

export default function AchievementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Trophy className="w-3.5 h-3.5" />
          <span>Honors &amp; Proofs</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Achievements &amp; Certificates
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          Competitions, hackathon finalist placements, academic symposiums, and verified professional certifications.
        </p>
      </header>

      {/* Main Interactive Achievements Component */}
      <section className="space-y-8">
        <AchievementsSection />
      </section>
    </div>
  );
}
