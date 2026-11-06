import React from "react";
import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Sparkles } from "lucide-react";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact Shamil TP — Direct Message & Engineering Inquiries",
  description:
    "Direct contact portal for Shamil TP (shamil-tp). Inquire about backend engineering, software development projects, API architectures, or technical collaboration.",
  alternates: {
    canonical: "https://shamiltp.life/contact",
  },
  openGraph: {
    title: "Contact Shamil TP — Software Engineer",
    description:
      "Direct contact portal for Shamil TP. Powered by Cloudflare Workers & Hono with D1 database.",
    url: "https://shamiltp.life/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--accent)]">
          <Mail className="w-3.5 h-3.5" />
          <span>Direct Contact Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
          Get In Touch with Shamil TP
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
          Whether you have a distributed systems question, an engineering opportunity, or a project to build, send a direct message below.
        </p>
      </header>

      {/* Interactive Form Component */}
      <section className="space-y-8">
        <ContactForm />
      </section>
    </div>
  );
}
