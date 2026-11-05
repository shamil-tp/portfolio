export interface ProjectLink {
  href: string;
  label: string;
}

export interface CaseStudyData {
  overview: string;
  roleDescription: string;
  highlights: string[];
  architecture?: string[];
  techStackDetailed?: { category: string; technologies: string[] }[];
  keyFeatures?: { title: string; description: string }[];
  impactOrMetrics?: string[];
}

export interface Project {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  stack: string[];
  source?: string;
  live?: ProjectLink;
  featured?: boolean;
  type?: string;
  caseStudy?: CaseStudyData;
}

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  start: string;
  end: string;
  bullets: string[];
  skills?: string[];
}

export interface EducationItem {
  title: string;
  org: string;
  period: string;
  meta: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  org: string;
  meta: string[];
  event: string;
  kind: string;
  result: string;
  date: string;
  organizer: string;
  place: string;
  projectSlug?: string;
  certificate: {
    file: string;
    original: string;
    label: string;
    width: number;
    height: number;
  };
}

export interface CertificationItem {
  id: string;
  title: string;
  org: string;
  date: string;
  summary: string;
  certificate: {
    file: string;
    original: string;
    label: string;
    width: number;
    height: number;
  };
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export const content = {
  person: {
    name: "Shamil TP",
    firstName: "Shamil",
    lastName: "TP",
    role: "Full Stack Developer",
    focus: "Backend Focused",
    location: "Kerala, India",
    status: "Open to new opportunities",
    tagline:
      "I build server-side systems where data efficiency meets performance: APIs, crawlers, streaming pipelines and the CI/CD that ships them.",
    about: [
      "I am a developer motivated by a sincere interest in the fundamental workings of the internet. Although I can create responsive frontends, my area of expertise is the backend, where data efficiency, server architecture, and logic come together.",
      "I enjoy working with low-level details because memory and performance optimization can have a noticeable impact. I see myself as a hands-on developer who enjoys the process of improving the speed and dependability of systems.",
      "I am studying for a Master of Computer Applications (MCA) at St. Joseph's College (Autonomous), Devagiri. Most of my backends run on a home server I maintain (Ubuntu Server behind Nginx), shipped by GitHub Actions pipelines that also publish versioned releases. Away from the web, I build small IoT experiments in MicroPython on the ESP32 and Raspberry Pi Pico.",
    ],
    quote: "Memory and performance optimization can have a noticeable impact.",
    resumePdf: "/Shamil_TP_Resume_ATS(1).pdf",
  },

  contact: {
    message:
      "I'm currently looking for new opportunities. Whether you have an engineering problem to discuss, a backend role, or just want to say hi, feel free to reach out!",
    email: "shamiltp073@gmail.com",
    phone: "+91 79027 86927",
    phoneHref: "tel:+917902786927",
    location: "Kerala, India",
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      handle: "shamil-tp",
      href: "https://github.com/shamil-tp",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "in/shamil-tp",
      href: "https://www.linkedin.com/in/shamil-tp/",
    },
    {
      id: "twitter-x",
      label: "X",
      handle: "@ShamilTp6",
      href: "https://x.com/ShamilTp6",
    },
  ],

  skills: [
    {
      group: "Backend Engineering",
      items: [
        "Node.js / Express",
        "Python / FastAPI",
        "Go",
        "RESTful APIs",
        "Socket.io",
        "OAuth 2.0 / JWT",
      ],
    },
    {
      group: "Data & Storage",
      items: [
        "PostgreSQL / Supabase",
        "MongoDB",
        "Redis",
        "SQLite",
        "Mongoose Aggregations",
      ],
    },
    {
      group: "DevOps & Cloud",
      items: [
        "GitHub Actions CI/CD",
        "Docker",
        "Nginx Reverse Proxy",
        "Ubuntu Server (Self-hosted)",
        "Cloudflare R2 / CDN",
      ],
    },
    {
      group: "Media & Streaming",
      items: [
        "FFmpeg pipelines",
        "HLS adaptive streaming",
        "tus resumable uploads",
        "HTTP Range streaming",
      ],
    },
    {
      group: "Automation & AI",
      items: [
        "Agentic incident workflows",
        "Gemini API / Key pooling",
        "GitHub Webhooks",
        "Google Apps Script",
      ],
    },
    {
      group: "Frontend & IoT",
      items: [
        "Next.js / React 19",
        "TypeScript",
        "Tailwind CSS",
        "MicroPython (ESP32, Pico 2 W)",
        "OWASP & Zod security",
      ],
    },
  ] as SkillGroup[],

  experience: [
    {
      role: "Freelance Full Stack Developer",
      org: "Independent Clients",
      period: "Nov 2023 — Present",
      start: "Nov 2023",
      end: "Present",
      bullets: [
        "Architected and delivered Tutora, an educational management platform, automating student and staff workflows to reduce administrative overhead by 35%.",
        "Engineered emvBazar, an automated customer debt tracking system integrating WhatsApp APIs, increasing collection efficiency by 40% with strict data privacy.",
        "Designed comprehensive user management architectures and secure RBAC portals tailored to strict client specifications.",
      ],
      skills: ["FastAPI", "Node.js", "WhatsApp API", "PostgreSQL", "RBAC"],
    },
    {
      role: "Full Stack Development Intern",
      org: "Fugipie Technologies",
      period: "Dec 2024 — Mar 2025",
      start: "Dec 2024",
      end: "Mar 2025",
      bullets: [
        "Designed scalable RESTful APIs using Node.js and Express.js, implementing Zod schema validation to guarantee 100% data input integrity.",
        "Engineered secure authentication systems using JWT and BcryptJS, significantly fortifying application security compliance.",
        "Managed MongoDB databases with Mongoose ODM, reducing complex query response times by 40% through optimized aggregation pipelines.",
        "Implemented strong security protocols including Helmet.js and rate limiting to effectively protect against DDoS vulnerabilities.",
      ],
      skills: ["Node.js", "Express", "MongoDB", "JWT", "Zod", "Helmet"],
    },
  ] as ExperienceItem[],

  education: [
    {
      title: "Master of Computer Applications (MCA)",
      org: "St. Joseph's College (Autonomous), Devagiri, Kozhikode",
      period: "2026 — 2028 (In Progress)",
      meta: ["Master's Degree in Computer Applications", "Focus on Advanced Algorithms, Distributed Systems & Database Architecture"],
    },
    {
      title: "Bachelor of Computer Application (BCA)",
      org: "Safi Institute of Advanced Study",
      period: "Graduated March 2025",
      meta: ["CGPA: 7.76 / 10", "Core coursework: Data Structures, Operating Systems, Networking, Software Engineering"],
    },
    {
      title: "MERN Stack Web Development Certification",
      org: "DataTribe",
      period: "May — November 2025",
      meta: ["6-month intensive training program", "Graduated with Grade A+"],
    },
  ] as EducationItem[],

  achievements: [
    {
      id: "layover-2026",
      title: "Layover 2026: Top 13 with RegretMap",
      org: "TinkerHub · TinkerSpace Calicut",
      meta: [
        "10–11 October 2026",
        "Overnight hackathon. Our team built RegretMap, which was selected among the top 13 projects.",
      ],
      event: "Layover 2026",
      kind: "Hackathon",
      result: "Top 13 Finalist",
      date: "10–11 October 2026",
      organizer: "TinkerHub",
      place: "TinkerSpace Calicut, Kozhikode",
      projectSlug: "regretmap",
      certificate: {
        file: "layover-2026",
        original: "/certificates/Layover2026.png",
        label: "Proof of participation, issued by TinkerHub",
        width: 717,
        height: 752,
      },
    },
    {
      id: "gateways-2026",
      title: "Gateways 2026: Top 37 with OpsPilot",
      org: "Department of Computer Science, CHRIST (Deemed to be University), Bangalore",
      meta: [
        "30 September – 1 October 2026",
        "24° Shift, the international-level hackathon of the Gateways 2026 IT fest. Our team built OpsPilot, which placed in the top 37.",
      ],
      event: "Gateways 2026 · 24° Shift hackathon",
      kind: "Hackathon",
      result: "Top 37 Finalist",
      date: "30 September – 1 October 2026",
      organizer: "Department of Computer Science, CHRIST (Deemed to be University)",
      place: "Bangalore",
      projectSlug: "opspilot",
      certificate: {
        file: "gateways-2026",
        original: "/certificates/Gateways2026.png",
        label: "Certificate of participation, Gateways 2026 (ID GW26-REG-174658)",
        width: 1400,
        height: 987,
      },
    },
    {
      id: "ai-unplugged-2026",
      title: "AI Unplugged 2026",
      org: "Department of Computer Science, St. Joseph's College (Autonomous), Devagiri",
      meta: [
        "13 July 2026",
        "Participant, International Symposium on Artificial Intelligence and Emerging Technologies.",
      ],
      event: "AI Unplugged 2026",
      kind: "Symposium",
      result: "Participant",
      date: "13 July 2026",
      organizer: "Department of Computer Science, St. Joseph's College (Autonomous), Devagiri",
      place: "Kozhikode",
      certificate: {
        file: "ai-unplugged-2026",
        original: "/certificates/AiUnplugged2026.jpg",
        label: "Certificate of participation",
        width: 1400,
        height: 990,
      },
    },
    {
      id: "beyond-us-2023",
      title: "Beyond Us 2023 Hackathon",
      org: "GTech µLearn with Kerala Knowledge Economy Mission (KKEM)",
      meta: [
        "8–9 July 2023",
        "24-hour online hackathon — my foundational entry into hackathon collaboration.",
      ],
      event: "Beyond Us 2023",
      kind: "Hackathon",
      result: "Participant",
      date: "8–9 July 2023",
      organizer: "GTech µLearn in association with KKEM",
      place: "Online",
      certificate: {
        file: "beyond-us-2023",
        original: "/certificates/Beyond_us2023.jpg",
        label: "Certificate of participation (ID µ2023B10090)",
        width: 987,
        height: 774,
      },
    },
  ] as AchievementItem[],

  certifications: [
    {
      id: "datatribe-mern-2025",
      title: "MERN Stack Web Development",
      org: "DataTribe",
      date: "May — November 2025",
      summary:
        "Comprehensive 6-month curriculum covering MongoDB, Express, React, and Node.js with architectural patterns, finished with Grade A+ distinction.",
      certificate: {
        file: "datatribe-mern-2025",
        original: "/certificates/fullstackWebDevelopment2026.jpg",
        label: "Certificate of completion (ID MERN2A08)",
        width: 800,
        height: 1132,
      },
    },
  ] as CertificationItem[],

  projects: [
    {
      slug: "opspilot",
      name: "OpsPilot",
      kicker: "AI Agents · DevOps · FastAPI",
      summary:
        "An incident response copilot that investigates outages from real evidence, proposes fixes and executes them only after human approval. I built the FastAPI backend, deployment, CI/CD and GitHub webhooks.",
      stack: ["FastAPI", "PostgreSQL", "Gemini", "Docker", "GitHub Actions"],
      source: "https://github.com/shamil-tp/OopsPilot",
      live: { href: "https://opspilot.shamiltp.life", label: "Live Demo" },
      featured: true,
      type: "AI Agent Platform / SRE",
      caseStudy: {
        overview:
          "OpsPilot is an AI-assisted incident response and DevOps copilot with deterministic backend controls and human approval for risky remediation. It investigates a production incident from structured operational evidence (logs, health status, deployments, previous incidents, GitHub CI/CD events, and AI code reviews), identifies the most likely root cause with exact citations, proposes a safe fix, and waits for human approval before allowlisted execution.",
        roleDescription:
          "Backend Architect, Deployment & CI/CD Pipelines. I engineered the entire FastAPI backend, state machine, webhook verification, and automated Docker staging pipelines.",
        highlights: [
          "Engineered a deterministic state machine for incident progression: Detect → Investigate → Root Cause → Remediate → Verify.",
          "Implemented strict cryptographic signature validation for GitHub webhooks.",
          "Built bounded context evidence collectors to prevent hallucinated LLM responses.",
          "Restricted remediation actions to an allowlist with dry-run capabilities and human confirmation.",
        ],
        keyFeatures: [
          {
            title: "Automated Evidence Collection",
            description: "Pulls bounded slices of logs (±10m), diffs, and health baseline data to present complete context to the LLM.",
          },
          {
            title: "Deterministic State Machine",
            description: "Guarantees no out-of-order execution; risky remediation actions require explicit human operator confirmation.",
          },
          {
            title: "Continuous Health Probing",
            description: "Monitors endpoints every 60s, triggering automated incident flows on consecutive degradation.",
          },
        ],
        impactOrMetrics: [
          "Top 37 finalist at Gateways 2026 international hackathon (CHRIST University, Bangalore).",
          "Sub-second evidence retrieval and zero unauthenticated webhook executions.",
        ],
      },
    },
    {
      slug: "regretmap",
      name: "RegretMap",
      kicker: "Next.js · Supabase · Leaflet · AI",
      summary:
        "A community map of travel lessons with AI summaries and a chat grounded only in real traveller stories. I set up the foundation and built the map, data layer, auth, comments and Gemini key pool.",
      stack: ["Next.js", "Supabase", "Leaflet", "Gemini", "Zod"],
      source: "https://github.com/shamil-tp/RegretMap",
      live: { href: "https://regret-map.shamiltp.life/", label: "Live App" },
      featured: true,
      type: "Community Geospatial Platform",
      caseStudy: {
        overview:
          "RegretMap crowdsources real travel mistakes, missed connections, and hidden gotchas across global destinations on an interactive map. It employs Gemini to distill raw stories into actionable destination advice, with chat responses constrained to authentic user submissions.",
        roleDescription:
          "Core Architect & Full Stack Lead. Built the geospatial Leaflet interface, Supabase database schemas, authentication, and an intelligent round-robin Gemini API key pool.",
        highlights: [
          "Created a fault-tolerant Gemini key pooling mechanism with automatic fallback on quota exhaustion.",
          "Optimized geospatial coordinate indexing in Supabase (PostgreSQL) for snappy pin clustering.",
          "Built responsive UI with Next.js App Router and server-side cached rendering.",
        ],
        keyFeatures: [
          {
            title: "Interactive Geolocation Pins",
            description: "Pinpoint exact spots where travelers faced scams, transit delays, or cultural nuances.",
          },
          {
            title: "Grounded AI Chatbot",
            description: "Chat assistant that queries only user-verified stories to avoid speculative advice.",
          },
        ],
        impactOrMetrics: [
          "Top 13 finalist at Layover 2026 overnight hackathon (TinkerHub).",
          "Zero downtime during live judging demo with active map queries.",
        ],
      },
    },
    {
      slug: "rewind",
      name: "Rewind",
      kicker: "Go · SQLite · Svelte · Self-hosted",
      summary:
        "A private, self-hosted music server: one Go binary with an embedded Svelte player and one SQLite file, streaming original audio over HTTP Range. Built and released solo.",
      stack: ["Go", "SQLite", "Svelte", "Tailscale", "systemd"],
      source: "https://github.com/shamil-tp/rewind",
      live: { href: "https://github.com/shamil-tp/rewind/releases", label: "GitHub Releases" },
      featured: true,
      type: "High-Performance Systems & Streaming",
      caseStudy: {
        overview:
          "Rewind is a zero-dependency personal audio streaming service distributed as a single static Go binary. It packages an embedded Svelte web client, an embedded SQLite database, and full HTTP Range request support for seeking FLAC/MP3 files without buffering entire tracks.",
        roleDescription: "Sole creator and maintainer — system architecture, Go backend, SQLite schema, UI, and release CI/CD.",
        highlights: [
          "Compiled frontend assets directly into the Go binary using `embed.FS`.",
          "Implemented RFC 7233 byte-range serving for low-latency audio scrubbing.",
          "Configured GitHub Actions for cross-compilation targeting Linux (amd64, arm64) and macOS.",
        ],
        keyFeatures: [
          {
            title: "Single Binary Portability",
            description: "Zero external dependencies: run with `./rewind -music /path/to/library`.",
          },
          {
            title: "Byte-Range Streaming",
            description: "Instant seeks across multi-gigabyte playlists without memory bloat.",
          },
        ],
        impactOrMetrics: [
          "Under 15MB RAM footprint under active playback.",
          "Shipped reproducible versioned releases with automated changelogs.",
        ],
      },
    },
    {
      slug: "lume",
      name: "LUME",
      kicker: "Media Streaming · FFmpeg · Cloudflare R2",
      summary:
        "A media streaming platform with resumable tus uploads, FFmpeg pipelines that slice media into HLS chunks, Cloudflare R2 storage and a custom adaptive player.",
      stack: ["tus", "FFmpeg", "HLS", "Cloudflare R2", "Node.js"],
      source: "https://github.com/shamil-tp/LUME",
      live: { href: "https://lume-one.vercel.app/", label: "Live Platform" },
      featured: true,
      type: "Distributed Media Infrastructure",
      caseStudy: {
        overview:
          "LUME handles end-to-end video ingestion, adaptive bitrate encoding, and global content delivery. Uploads survive network interruptions via the tus protocol, are segmented into multiple HLS resolutions via FFmpeg workers, and are delivered globally using Cloudflare R2.",
        roleDescription: "Media Pipeline Architect & Backend Engineer.",
        highlights: [
          "Implemented chunked resumable upload server using open tus specifications.",
          "Engineered asynchronous FFmpeg worker queues to segment video into 1080p, 720p, 480p HLS manifests.",
          "Direct zero-egress Cloudflare R2 cloud object storage distribution.",
        ],
        keyFeatures: [
          {
            title: "Resumable Uploads",
            description: "Large video files resume precisely where they stopped upon internet disconnection.",
          },
          {
            title: "Adaptive Bitrate (ABR)",
            description: "Player automatically steps down to lower resolutions on bandwidth dips.",
          },
        ],
        impactOrMetrics: [
          "Supports multi-gigabyte media uploads reliably over mobile connections.",
          "Zero egress bandwidth charges via Cloudflare R2 integration.",
        ],
      },
    },
    {
      slug: "njin",
      name: "N-jin",
      kicker: "Search · Web Crawler · Redis",
      summary:
        "A localized search engine powered by a custom web crawler, with MongoDB aggregation-based ranking and a Redis caching layer for fast queries.",
      stack: ["Node.js", "MongoDB", "Redis", "Mongoose"],
      source: "https://github.com/shamil-tp/web-crawler",
      live: { href: "https://magnificent-recreation-production.up.railway.app/", label: "Live Demo" },
      featured: false,
      type: "Search Engine & Information Retrieval",
      caseStudy: {
        overview:
          "N-jin crawls web pages, extracts metadata, tokenizes text, and provides search indexing with query ranking using MongoDB aggregation pipelines and high-speed Redis caching.",
        roleDescription: "Solo Developer — crawler queue, scoring algorithms, and database indexing.",
        highlights: [
          "Polite web crawling with robots.txt compliance and rate limiting.",
          "Sub-50ms query turnaround for cached keyword lookups via Redis.",
        ],
      },
    },
    {
      slug: "blogify",
      name: "Blogify",
      kicker: "Security · Full Stack · OAuth 2.0",
      summary:
        "A blogging platform with rich editing, Google OAuth 2 with JWT access/refresh tokens, and a backend hardened along OWASP guidelines with Helmet, rate limiting and Zod.",
      stack: ["React", "Express", "OAuth 2", "Zod", "Helmet"],
      source: "https://github.com/shamil-tp/Blogify",
      live: { href: "https://blogify-7mdx.vercel.app/", label: "Live App" },
      featured: false,
      type: "Full Stack Content Platform",
      caseStudy: {
        overview:
          "A production-ready blogging platform designed with defensive security principles. Features secure HTTP-only cookies, token rotation, XSS prevention, and strict schema validation.",
        roleDescription: "Full Stack Architect — Auth flows, security hardening, and frontend state.",
        highlights: [
          "OWASP top-10 defensive architecture implementation.",
          "JWT dual-token auth with silent refresh rotation.",
        ],
      },
    },
    {
      slug: "osmium",
      name: "Osmium",
      kicker: "Algorithms · Compression · LZ77 & Huffman",
      summary:
        "A file compression and decompression app built from first principles, implementing LZ77 and Huffman coding from scratch in a Deflate-like design.",
      stack: ["Node.js", "Express", "EJS", "LZ77", "Huffman"],
      source: "https://github.com/shamil-tp/osmium",
      live: { href: "https://osmium-production.up.railway.app", label: "Live App" },
      featured: false,
      type: "Algorithmic Systems Project",
      caseStudy: {
        overview:
          "Demonstrates computer science fundamentals by implementing the LZ77 sliding-window dictionary algorithm and Huffman variable-length prefix tree encoder from scratch without external compression libraries.",
        roleDescription: "Algorithm Engineer & Node.js Developer.",
        highlights: [
          "Built sliding-window match finder and binary tree generator from scratch in pure JS.",
          "Serialized bitstreams into efficient byte arrays.",
        ],
      },
    },
    {
      slug: "skylark",
      name: "Skylark",
      kicker: "E-Commerce · Payments · Full Stack",
      summary:
        "A rent-a-car platform with date-based bookings, Razorpay payments and an admin portal. As lead developer I built the Vue architecture, admin panel and backend integrations.",
      stack: ["Vue 3", "Node.js", "Express", "MongoDB", "Razorpay"],
      source: "https://github.com/sinanrahman/skylark",
      live: { href: "https://skylark-frontend-eqdt.onrender.com", label: "Live App" },
      featured: false,
      type: "Commercial Booking Platform",
      caseStudy: {
        overview:
          "Vehicle reservation system featuring real-time fleet availability calendars, Razorpay payment gateway integration with webhook verification, and comprehensive administrative fleet management.",
        roleDescription: "Lead Developer — Frontend architecture, payment processing, and database schemas.",
        highlights: [
          "Cryptographic payment signature verification before booking finalization.",
          "Dynamic pricing based on reservation length and peak availability.",
        ],
      },
    },
    {
      slug: "coffeecat",
      name: "coffeeCat",
      kicker: "Real-time · WebSockets · Social",
      summary:
        "An Instagram–WhatsApp hybrid with real-time chat over Socket.io, a follow-based social graph, and image posts with likes and comments via Cloudinary.",
      stack: ["Vue", "Express", "Socket.io", "Cloudinary", "MongoDB"],
      source: "https://github.com/shamil-tp/coffeeCat",
      live: { href: "https://coffee-cat-topaz.vercel.app/login", label: "Live App" },
      featured: false,
      type: "Real-time Social Application",
      caseStudy: {
        overview:
          "Social networking hub combining feed updates with direct 1-to-1 instant messaging powered by persistent WebSocket rooms.",
        roleDescription: "Full Stack Engineer — WebSocket handlers, media transforms, feed algorithms.",
        highlights: [
          "Instant message delivery with typing indicators and online state presence.",
          "Cloudinary media optimization pipeline on photo upload.",
        ],
      },
    },
    {
      slug: "brl",
      name: "blog-Rendering-Library",
      kicker: "Open Source · DOM · Zero Dependencies",
      summary:
        "A zero-dependency vanilla JavaScript library that renders blog posts directly from JSON with raw DOM manipulation. Open source under the MIT license.",
      stack: ["JavaScript", "DOM API", "Zero Dependencies"],
      source: "https://github.com/shamil-tp/blog-Rendering-Library",
      live: {
        href: "https://shamil-tp.github.io/blog-Rendering-Library/?slug=messis-world-cup-glory-48qNNV&theme=tokyo_night",
        label: "Live Demo",
      },
      featured: false,
      type: "Open Source Utility Library",
      caseStudy: {
        overview:
          "A lightweight script designed to embed rich article layouts from raw JSON payloads into any HTML page with zero framework baggage.",
        roleDescription: "Author & Maintainer.",
        highlights: [
          "Zero third-party dependencies, <8KB minified.",
          "Modular theme engine supporting dark/light syntax palettes.",
        ],
      },
    },
    {
      slug: "tutora",
      name: "Tutora",
      kicker: "Client Project · Education Management",
      summary:
        "An education management platform built for a client, serving students, teachers, coordinators and parents with tailored views and permissions.",
      stack: ["Full Stack", "RBAC", "Private Client Project"],
      featured: false,
      type: "Enterprise Education Software",
      caseStudy: {
        overview:
          "Custom educational operations software that centralizes student academic tracking, teacher grading matrices, and parental communications.",
        roleDescription: "Lead Contractor & Architect.",
        highlights: [
          "Tailored multi-role access control protecting sensitive student records.",
          "Reduced administrative documentation overhead by 35%.",
        ],
      },
    },
    {
      slug: "emvbazar",
      name: "emvBazar",
      kicker: "Client Project · Automation · WhatsApp API",
      summary:
        "A customer debt tracking system for a client, with ledgers mapped to customer profiles and scheduled WhatsApp reminders for collections.",
      stack: ["Automation", "WhatsApp API", "Ledger System"],
      featured: false,
      type: "Business Process Automation",
      caseStudy: {
        overview:
          "A specialized accounting and notification service engineered for retail credit tracking. Features automated invoice generation and automated payment reminders over WhatsApp.",
        roleDescription: "Contractor & Automation Developer.",
        highlights: [
          "Integrated WhatsApp Business messaging webhooks.",
          "Boosted on-time payment collections by 40% for the client.",
        ],
      },
    },
  ] as Project[],
};
