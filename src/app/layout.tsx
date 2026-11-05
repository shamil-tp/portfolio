import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TerminalView } from "@/components/TerminalView";
import { content } from "@/data/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://shamiltp.life"),
  title: {
    default: `${content.person.name} — ${content.person.role} (${content.person.focus})`,
    template: `%s | ${content.person.name}`,
  },
  description: content.person.tagline,
  keywords: [
    "Shamil TP",
    "Full Stack Developer",
    "Backend Developer",
    "FastAPI",
    "Next.js",
    "Go",
    "Node.js",
    "Docker",
    "Kerala Developer",
    "OpsPilot",
    "RegretMap",
    "Rewind",
    "shamiltp.life",
  ],
  authors: [{ name: "Shamil TP", url: "https://shamiltp.life" }],
  creator: "Shamil TP",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://shamiltp.life",
    title: `${content.person.name} — ${content.person.role}`,
    description: content.person.tagline,
    siteName: "Shamil TP Portfolio",
    images: [
      {
        url: "/assets/og/home.png",
        width: 1200,
        height: 630,
        alt: "Shamil TP — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.person.name} — ${content.person.role}`,
    description: content.person.tagline,
    creator: "@ShamilTp6",
    images: ["/assets/og/home.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://shamiltp.life",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://shamiltp.life/#website",
      "url": "https://shamiltp.life",
      "name": "Shamil TP",
      "description": content.person.tagline,
      "publisher": {
        "@id": "https://shamiltp.life/#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://shamiltp.life/#person",
      "name": "Shamil TP",
      "alternateName": ["Shamil", "Shamil T P", "shamil-tp"],
      "url": "https://shamiltp.life",
      "jobTitle": "Full Stack Developer",
      "alumniOf": "Safi Institute of Advanced Study",
      "affiliation": {
        "@type": "CollegeOrUniversity",
        "name": "St. Joseph's College (Autonomous), Devagiri",
      },
      "sameAs": [
        "https://github.com/shamil-tp",
        "https://www.linkedin.com/in/shamil-tp/",
        "https://x.com/ShamilTp6",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Direct engineering and development inquiries",
        "url": "https://contact.shamiltp.life",
      },
    },
    {
      "@type": "ItemList",
      "@id": "https://shamiltp.life/#sitelinks",
      "name": "Shamil TP Portfolio Main Navigation Sections",
      "description": "Primary architecture and navigation sections optimized for Google Sitelinks",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Projects",
          "description": "Architecture case studies and open-source systems built by Shamil TP",
          "url": "https://shamiltp.life/projects",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Skills",
          "description": "Backend engineering, distributed storage, streaming, and DevOps competencies",
          "url": "https://shamiltp.life/skills",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Experience",
          "description": "Work history, freelance client platforms, internship, and education timeline",
          "url": "https://shamiltp.life/experience",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "About",
          "description": "Background, personal Ubuntu home server, and MicroPython IoT experiments",
          "url": "https://shamiltp.life/about",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Achievements",
          "description": "Hackathon awards, symposiums, and verified credentials",
          "url": "https://shamiltp.life/achievements",
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Contact",
          "description": "Direct message portal connected to Cloudflare Workers & D1 database",
          "url": "https://shamiltp.life/contact",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Noto+Sans+JP:wght@300;400;500;700&family=Shippori+Mincho:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Yuji+Syuku&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <TerminalView />
        </ThemeProvider>
      </body>
    </html>
  );
}
