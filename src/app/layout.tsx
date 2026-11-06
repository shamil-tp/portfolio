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
    default: "Shamil TP — Full Stack Developer | Backend & Distributed Systems",
    template: "%s | Shamil TP",
  },
  description:
    "Full Stack Developer & Backend Systems Engineer from Kerala, India. Specializing in high-throughput APIs, distributed systems, Linux home servers, and Next.js.",
  keywords: [
    "Shamil TP",
    "shamil-tp",
    "shamil tp",
    "shamiltp.life",
    "Shamil Developer",
    "Full Stack Developer",
    "Backend Developer Kerala",
    "Next.js Developer",
    "FastAPI",
    "Go Developer",
    "Node.js",
    "Docker",
    "Devagiri College",
    "OpsPilot",
    "RegretMap",
    "Rewind",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Shamil TP", url: "https://shamiltp.life" }],
  creator: "Shamil TP",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://shamiltp.life",
    title: "Shamil TP — Full Stack Developer | Backend & Systems Engineer",
    description:
      "Full Stack Developer & Backend Systems Engineer from Kerala, India. Specializing in high-throughput APIs, distributed systems, Linux home servers, and Next.js.",
    siteName: "Shamil TP Portfolio",
    images: [
      {
        url: "/assets/og/home.png",
        width: 1200,
        height: 630,
        alt: "Shamil TP — Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shamil TP — Full Stack Developer | Backend & Systems Engineer",
    description:
      "Full Stack Developer & Backend Systems Engineer from Kerala, India. Specializing in high-throughput APIs, distributed systems, Linux home servers, and Next.js.",
    creator: "@ShamilTp6",
    images: ["/assets/og/home.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
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
      "alternateName": [
        "Shamil TP Portfolio",
        "shamiltp.life",
        "The Blue Spirit"
      ],
      "description": "Full Stack Developer & Backend Systems Engineer Portfolio",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://shamiltp.life/#person",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://shamiltp.life/#profilepage",
      "url": "https://shamiltp.life",
      "name": "Shamil TP — Full Stack Developer Profile",
      "isPartOf": { "@id": "https://shamiltp.life/#website" },
      "mainEntity": { "@id": "https://shamiltp.life/#person" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://shamiltp.life/myProfileImg.jpeg",
      },
    },
    {
      "@type": "Person",
      "@id": "https://shamiltp.life/#person",
      "name": "Shamil TP",
      "alternateName": ["Shamil", "Shamil T P", "shamil-tp", "shamil tp"],
      "url": "https://shamiltp.life",
      "image": "https://shamiltp.life/myProfileImg.jpeg",
      "jobTitle": "Full Stack Developer",
      "description":
        "Full Stack Developer specializing in high-throughput backend services, distributed systems, Linux servers, and Next.js.",
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "St. Joseph's College (Autonomous), Devagiri",
          "url": "https://www.devagiricollege.org",
        },
        {
          "@type": "EducationalOrganization",
          "name": "Safi Institute of Advanced Study",
        },
      ],
      "knowsAbout": [
        "Full Stack Development",
        "Backend Architecture",
        "Next.js",
        "React",
        "TypeScript",
        "FastAPI",
        "Python",
        "Go",
        "Node.js",
        "Docker",
        "Linux Ubuntu Server",
        "Cloudflare Workers",
        "PostgreSQL",
        "Redis",
        "WebSockets",
        "MicroPython",
        "REST APIs"
      ],
      "sameAs": [
        "https://github.com/shamil-tp",
        "https://www.linkedin.com/in/shamil-tp/",
        "https://x.com/ShamilTp6",
        "https://contact.shamiltp.life"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Direct engineering and development inquiries",
        "url": "https://contact.shamiltp.life",
        "email": "shamiltp073@gmail.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://shamiltp.life/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://shamiltp.life",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Projects",
          "item": "https://shamiltp.life/projects",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Skills",
          "item": "https://shamiltp.life/skills",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Experience",
          "item": "https://shamiltp.life/experience",
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "About",
          "item": "https://shamiltp.life/about",
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Achievements",
          "item": "https://shamiltp.life/achievements",
        },
        {
          "@type": "ListItem",
          "position": 7,
          "name": "Contact",
          "item": "https://shamiltp.life/contact",
        },
      ],
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
