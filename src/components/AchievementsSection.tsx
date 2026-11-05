"use client";

import React, { useState } from "react";
import Image from "next/image";
import { content, AchievementItem, CertificationItem } from "@/data/content";
import { Trophy, Award, Calendar, MapPin, ExternalLink, X, Eye } from "lucide-react";

export function AchievementsSection() {
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    image: string;
    org: string;
  } | null>(null);

  return (
    <div className="space-y-8">
      {/* Hackathons & Competitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {content.achievements.map((item) => (
          <div
            key={item.id}
            className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                  <Trophy className="w-3.5 h-3.5" />
                  {item.result}
                </span>
                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  {item.date}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {item.title}
              </h4>

              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                {item.org}
              </p>

              <div className="space-y-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                {item.meta.map((m, idx) => (
                  <p key={idx}>{m}</p>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border)]/60 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3" />
                {item.place}
              </span>

              <button
                onClick={() =>
                  setSelectedCert({
                    title: item.title,
                    image: item.certificate.original,
                    org: item.organizer,
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Proof</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications Banner */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Award className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)]">
              {content.certifications[0]?.title}
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {content.certifications[0]?.org} · {content.certifications[0]?.date}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xl">
              {content.certifications[0]?.summary}
            </p>
          </div>
        </div>

        {content.certifications[0]?.certificate && (
          <button
            onClick={() =>
              setSelectedCert({
                title: content.certifications[0].title,
                image: content.certifications[0].certificate.original,
                org: content.certifications[0].org,
              })
            }
            className="self-start sm:self-center px-4 py-2 text-xs font-mono font-medium rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--foreground)] transition-all whitespace-nowrap shadow-sm"
          >
            View Certificate
          </button>
        )}
      </div>

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-3xl w-full p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] font-mono">
                  Issued by {selectedCert.org}
                </p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] max-h-[70vh] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
