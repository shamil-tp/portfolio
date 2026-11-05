"use client";

import React, { useState, useEffect } from "react";
import { content } from "@/data/content";
import { Trophy, Award, MapPin, Eye, X } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export function AchievementsSection() {
  const [mounted, setMounted] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    image: string;
    org: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trophy Spotlight & Diagonal Flip Zoom Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.05,
      },
    },
  };

  const trophyCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.88, rotateY: -10, y: 35 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 18,
      },
    },
  };

  // Server & Initial Hydration Pass: Static HTML
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {content.achievements.map((item) => (
            <div
              key={item.id}
              className="group p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] flex flex-col justify-between"
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

                <h4 className="text-lg font-bold text-[var(--foreground)]">
                  {item.title}
                </h4>

                <p className="text-xs font-medium text-[var(--muted-foreground)]">
                  {item.org}
                </p>

                <div className="space-y-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {item.meta.map((m, mIdx) => (
                    <p key={mIdx}>{m}</p>
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
                      org: item.org,
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Row */}
        <div className="space-y-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--foreground)] font-mono uppercase tracking-wider">
              Verified Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {content.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--foreground)] truncate">
                    {cert.title}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
                    {cert.org} · {cert.date}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedCert({
                      title: cert.title,
                      image: cert.certificate.original,
                      org: cert.org,
                    })
                  }
                  className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--accent)] shrink-0"
                  title="View certification preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Client Pass: Trophy Spotlight & Diagonal Zoom Animation
  return (
    <div className="space-y-8">
      {/* Hackathons & Competitions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {content.achievements.map((item) => (
          <motion.div
            key={item.id}
            variants={trophyCardVariants}
            whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.25 } }}
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
                {item.meta.map((m, mIdx) => (
                  <p key={mIdx}>{m}</p>
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
                    org: item.org,
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Certifications Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="space-y-4 pt-4 border-t border-[var(--border)]"
      >
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm font-bold text-[var(--foreground)] font-mono uppercase tracking-wider">
            Verified Certifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {content.certifications.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/60 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--foreground)] truncate">
                  {cert.title}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
                  {cert.org} · {cert.date}
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedCert({
                    title: cert.title,
                    image: cert.certificate.original,
                    org: cert.org,
                  })
                }
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--accent)] shrink-0"
                title="View certification preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] font-mono">
                  {selectedCert.org}
                </p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-[var(--muted)] flex items-center justify-center max-h-[75vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md border border-[var(--border)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
