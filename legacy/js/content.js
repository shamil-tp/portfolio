/**
 * content.js — the single source of portfolio content.
 *
 * Every design renders from this object; nothing here knows about layout.
 * Edit a project once and all six designs pick it up.
 *
 * Paths are relative to index.html so the site works at a domain root and
 * under a GitHub Pages project path (/repository/).
 *
 * Rich text (experience bullets) is an array of segments: plain strings, or
 * { text, href } objects for inline links.
 *
 * Facts here are published as-is on every design, the crawlable homepage and
 * the JSON-LD. Achievements and education are taken from the certificates in
 * certificates/ (see the comments on each entry); add nothing unverified.
 */

export const content = {
    person: {
        name: 'Shamil TP',
        firstName: 'Shamil',
        lastName: 'TP',
        role: 'Full Stack Developer',
        focus: 'Backend focused',
        location: 'Kerala, India',
        status: 'Open to new opportunities',
        tagline:
            'I build server-side systems where data efficiency meets performance: APIs, crawlers, streaming pipelines and the CI/CD that ships them.',
        about: [
            'I am a developer motivated by a sincere interest in the fundamental workings of the internet. Although I can create responsive frontends, my area of expertise is the backend, where data efficiency, server architecture, and logic come together.',
            'I enjoy working with low-level details because memory and performance optimization can have a noticeable impact. I see myself as a hands-on developer who enjoys the process of improving the speed and dependability of systems.',
            "I'm studying for a Master of Computer Applications (MCA) at St. Joseph's College (Autonomous), Devagiri. Most of my backends run on a home server I maintain (Ubuntu Server behind Nginx), shipped by GitHub Actions pipelines that also publish versioned releases. Away from the web, I build small IoT experiments in MicroPython on the ESP32 and Raspberry Pi Pico.",
        ],
        // A short line lifted from `about`, used as a pull quote by some designs.
        quote: 'Memory and performance optimization can have a noticeable impact.',
        portrait: {
            alt: 'Portrait of Shamil TP',
            width: 400,
            height: 400,
            avif: 'assets/img/profile-400.avif 400w, assets/img/profile-700.avif 700w',
            webp: 'assets/img/profile-400.webp 400w, assets/img/profile-700.webp 700w',
            jpg: 'assets/img/profile-400.jpg 400w, assets/img/profile-700.jpg 700w',
            src: 'assets/img/profile-400.jpg',
        },
        resume: { href: 'Shamil_TP_Resume_ATS(1).pdf', label: 'Resume (PDF)' },
    },

    contact: {
        message:
            "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
        email: 'shamiltp073@gmail.com',
        phone: { href: 'tel:+917902786927', label: '+91 79027 86927' },
        location: 'Kerala, India',
    },

    socials: [
        { id: 'github', label: 'GitHub', handle: 'shamil-tp', href: 'https://github.com/shamil-tp' },
        { id: 'linkedin', label: 'LinkedIn', handle: 'in/shamil-tp', href: 'https://www.linkedin.com/in/shamil-tp/' },
        { id: 'twitter-x', label: 'X', handle: '@ShamilTp6', href: 'https://x.com/ShamilTp6' },
    ],

    caseStudiesHref: 'myProjectDetails/mycontributions.html',
    // Standalone pages (crawlable HTML, styled by the active design like the case studies).
    aboutHref: 'about/',
    achievementsHref: 'achievements/',

    projects: [
        {
            slug: 'opspilot',
            name: 'OpsPilot',
            kicker: 'AI Agents · DevOps',
            summary:
                'An incident response copilot that investigates outages from real evidence, proposes fixes and executes them only after human approval. I built the FastAPI backend, deployment, CI/CD and GitHub webhooks.',
            stack: ['FastAPI', 'PostgreSQL', 'Gemini', 'Docker', 'GitHub Actions'],
            caseStudy: 'myProjectDetails/oopspilot.html',
            source: 'https://github.com/shamil-tp/OopsPilot',
            live: { href: 'https://opspilot.shamiltp.me', label: 'Live' },
        },
        {
            slug: 'regretmap',
            name: 'RegretMap',
            kicker: 'Maps · Community · AI',
            summary:
                'A community map of travel lessons with AI summaries and a chat grounded only in real traveller stories. I set up the foundation and built the map, data layer, auth, comments and Gemini key pool.',
            stack: ['Next.js', 'Supabase', 'Leaflet', 'Gemini', 'zod'],
            caseStudy: 'myProjectDetails/regretmap.html',
            source: 'https://github.com/shamil-tp/RegretMap',
            live: { href: 'https://regret-map.shamiltp.me/', label: 'Live' },
        },
        {
            slug: 'rewind',
            name: 'Rewind',
            kicker: 'Self-hosted · Streaming',
            summary:
                'A private, self-hosted music server: one Go binary with an embedded Svelte player and one SQLite file, streaming original audio over HTTP Range. Built and released solo.',
            stack: ['Go', 'SQLite', 'Svelte', 'systemd', 'Tailscale'],
            caseStudy: 'myProjectDetails/rewind.html',
            source: 'https://github.com/shamil-tp/rewind',
            live: { href: 'https://github.com/shamil-tp/rewind/releases', label: 'Releases' },
        },
        {
            slug: 'lume',
            name: 'LUME',
            kicker: 'Media Streaming',
            summary:
                'A media streaming platform with resumable tus uploads, FFmpeg pipelines that slice media into HLS chunks, Cloudflare R2 storage and a custom adaptive player.',
            stack: ['tus', 'FFmpeg', 'HLS', 'Cloudflare R2'],
            caseStudy: 'myProjectDetails/lume.html',
            source: 'https://github.com/shamil-tp/LUME',
            live: { href: 'https://lume-one.vercel.app/', label: 'Live' },
        },
        {
            slug: 'njin',
            name: 'N-jin',
            kicker: 'Search · Crawling',
            summary:
                'A localized search engine powered by a custom web crawler, with MongoDB aggregation-based ranking and a Redis caching layer for fast queries.',
            stack: ['Node.js', 'MongoDB', 'Redis', 'Mongoose'],
            caseStudy: 'myProjectDetails/njin.html',
            source: 'https://github.com/shamil-tp/web-crawler',
            live: { href: 'https://magnificent-recreation-production.up.railway.app/', label: 'Live' },
        },
        {
            slug: 'blogify',
            name: 'Blogify',
            kicker: 'Security · Full Stack',
            summary:
                'A blogging platform with rich editing, Google OAuth 2 with JWT access/refresh tokens, and a backend hardened along OWASP guidelines with Helmet, rate limiting and Zod.',
            stack: ['React', 'Express', 'OAuth 2', 'Zod', 'Helmet'],
            caseStudy: 'myProjectDetails/blogify.html',
            source: 'https://github.com/shamil-tp/Blogify',
            live: { href: 'https://blogify-7mdx.vercel.app/', label: 'Live' },
        },
        {
            slug: 'osmium',
            name: 'Osmium',
            kicker: 'Algorithms',
            summary:
                'A file compression and decompression app built from first principles, implementing LZ77 and Huffman coding from scratch in a Deflate-like design.',
            stack: ['Node.js', 'Express', 'EJS', 'LZ77', 'Huffman'],
            caseStudy: 'myProjectDetails/osmium.html',
            source: 'https://github.com/shamil-tp/osmium',
            live: { href: 'https://osmium-production.up.railway.app', label: 'Live' },
        },
        {
            slug: 'skylark',
            name: 'Skylark',
            kicker: 'Payments · Full Stack',
            summary:
                'A rent-a-car platform with date-based bookings, Razorpay payments and an admin portal. As lead developer I built the Vue architecture, admin panel and backend integrations.',
            stack: ['Vue 3', 'Node.js', 'Express', 'MongoDB', 'Razorpay'],
            caseStudy: 'myProjectDetails/skylark.html',
            source: 'https://github.com/sinanrahman/skylark',
            live: { href: 'https://skylark-frontend-eqdt.onrender.com', label: 'Live' },
        },
        {
            slug: 'coffeecat',
            name: 'coffeeCat',
            kicker: 'Real-time · Social',
            summary:
                'An Instagram–WhatsApp hybrid with real-time chat over Socket.io, a follow-based social graph, and image posts with likes and comments via Cloudinary.',
            stack: ['Vue', 'Express', 'Socket.io', 'Cloudinary'],
            caseStudy: 'myProjectDetails/coffeecat.html',
            source: 'https://github.com/shamil-tp/coffeeCat',
            live: { href: 'https://coffee-cat-topaz.vercel.app/login', label: 'Live' },
        },
        {
            slug: 'brl',
            name: 'blog-Rendering-Library',
            kicker: 'Library · Open Source',
            summary:
                'A zero-dependency vanilla JavaScript library that renders blog posts directly from JSON with raw DOM manipulation. Open source under the MIT license.',
            stack: ['JavaScript', 'DOM', 'Zero dependencies'],
            caseStudy: 'myProjectDetails/blog-rendering-lib.html',
            source: 'https://github.com/shamil-tp/blog-Rendering-Library',
            live: {
                href: 'https://shamil-tp.github.io/blog-Rendering-Library/?slug=messis-world-cup-glory-48qNNV&theme=tokyo_night',
                label: 'Live',
            },
        },
        {
            slug: 'tutora',
            name: 'Tutora',
            kicker: 'Client Project · Education',
            summary:
                'An education management platform built for a client, serving students, teachers, coordinators and parents with tailored views and permissions.',
            stack: ['Private client project', 'Full Stack'],
            caseStudy: 'myProjectDetails/tutora.html',
        },
        {
            slug: 'emvbazar',
            name: 'emvBazar',
            kicker: 'Client Project · Automation',
            summary:
                'A customer debt tracking system for a client, with ledgers mapped to customer profiles and scheduled WhatsApp reminders for collections.',
            stack: ['Private client project', 'Automation', 'API integration'],
            caseStudy: 'myProjectDetails/emvbazar.html',
        },
    ],

    // Six groups: several designs draw one object per group (stones, beds).
    skills: [
        { group: 'Backend', items: ['Node.js / Express', 'Python / FastAPI', 'Go', 'REST APIs', 'Socket.io', 'OAuth 2.0 / JWT'] },
        { group: 'Data & Media', items: ['MongoDB', 'PostgreSQL / Supabase', 'Redis', 'SQLite', 'FFmpeg / HLS streaming'] },
        { group: 'DevOps & Self-hosting', items: ['GitHub Actions CI/CD', 'Automated versioned releases', 'Docker', 'Nginx', 'Ubuntu Server', 'Cloudflare'] },
        { group: 'Automation & AI', items: ['Agentic workflow automation', 'Webhooks', 'Google Apps Script', 'Gemini API'] },
        { group: 'Frontend', items: ['JavaScript / TypeScript', 'Next.js', 'React', 'Vue', 'Tailwind CSS'] },
        { group: 'IoT & Security', items: ['MicroPython', 'ESP32', 'Raspberry Pi Pico 2 W', 'OWASP practices', 'Helmet / Zod'] },
    ],

    experience: [
        {
            role: 'Freelance Full Stack Developer',
            org: 'Independent Clients',
            start: { label: 'Nov 2023', datetime: '2023-11' },
            end: { label: 'Present' },
            bullets: [
                [
                    'Architected and delivered ',
                    { text: 'Tutora', href: 'myProjectDetails/tutora.html' },
                    ', a specialized educational management platform, automating student and staff workflows to reduce administrative overhead by 35%.',
                ],
                [
                    'Engineered ',
                    { text: 'emvBazar', href: 'myProjectDetails/emvbazar.html' },
                    ', an automated customer debt tracking system integrating WhatsApp APIs, increasing collection efficiency by 40% and ensuring strict data privacy.',
                ],
                ['Designed comprehensive user management architectures and secure RBAC portals tailored to strict client specifications.'],
            ],
        },
        {
            role: 'Full Stack Development Intern',
            org: 'Fugipie Technologies',
            start: { label: 'Dec 2024', datetime: '2024-12' },
            end: { label: 'Mar 2025', datetime: '2025-03' },
            bullets: [
                ['Designed scalable RESTful APIs using Node.js and Express.js, implementing Zod schema validation to ensure 100% data input integrity.'],
                ['Engineered secure authentication systems using JWT and BcryptJS, significantly fortifying application security compliance.'],
                ['Managed MongoDB databases with Mongoose ODM, reducing complex query response times by 40% through optimized aggregation pipelines.'],
                ['Implemented strong security protocols including Helmet.js and Rate-Limiting to effectively protect against DDoS vulnerabilities.'],
            ],
        },
    ],

    education: [
        {
            // Source: Layover 2026 and Gateways 2026 certificates ("MCA, 2026-2028 batch").
            title: 'Master of Computer Applications (MCA)',
            org: "St. Joseph's College (Autonomous), Devagiri, Kozhikode",
            meta: ['2026–2028, in progress'],
        },
        {
            title: 'Bachelor of Computer Application (BCA)',
            org: 'Safi Institute of Advanced Study',
            meta: ['Graduation: March 2025', 'CGPA: 7.76/10'],
        },
        {
            // Source: certificates/fullstackWebDevelopment2026.jpg (ID MERN2A08).
            title: 'MERN Stack Web Development',
            org: 'DataTribe',
            meta: ['6-month course, May–November 2025', 'Completed with grade A+'],
        },
    ],

    /*
     * Hackathons and events, newest first. Same shape as education (title,
     * org, meta) so every design can list them, plus the detail the
     * achievements page uses. Each certificate is a participation
     * certificate; placements are as reported by Shamil (no public results
     * page found yet), so they are not marked up as awards in JSON-LD.
     */
    // certificate.file -> assets/certificates/<file>-full.jpg and -640.jpg (web copies);
    // width/height are the -full copy's; original is the file as issued.
    achievements: [
        {
            id: 'layover-2026',
            title: 'Layover 2026: top 13 with RegretMap',
            org: 'TinkerHub · TinkerSpace Calicut',
            meta: ['10–11 October 2026', 'Overnight hackathon. Our team built RegretMap, which was selected among the top 13 projects.'],
            event: 'Layover 2026',
            kind: 'Hackathon',
            result: 'Top 13',
            date: { label: '10–11 October 2026', datetime: '2026-10-10' },
            organizer: 'TinkerHub',
            place: 'TinkerSpace Calicut, Kozhikode',
            project: 'regretmap',
            certificate: { file: 'layover-2026', original: 'certificates/Layover2026.png', label: 'Proof of participation, issued by TinkerHub', width: 717, height: 752 },
        },
        {
            id: 'gateways-2026',
            title: 'Gateways 2026: top 37 with OpsPilot',
            org: 'Department of Computer Science, CHRIST (Deemed to be University), Bangalore',
            meta: ['30 September – 1 October 2026', '24° Shift, the international-level hackathon of the Gateways 2026 IT fest. Our team built OpsPilot, which placed in the top 37.'],
            event: 'Gateways 2026 · 24° Shift hackathon',
            kind: 'Hackathon',
            result: 'Top 37',
            date: { label: '30 September – 1 October 2026', datetime: '2026-09-30' },
            organizer: 'Department of Computer Science, CHRIST (Deemed to be University)',
            place: 'Bangalore',
            project: 'opspilot',
            certificate: { file: 'gateways-2026', original: 'certificates/Gateways2026.png', label: 'Certificate of participation, Gateways 2026 (ID GW26-REG-174658)', width: 1400, height: 987 },
        },
        {
            id: 'ai-unplugged-2026',
            title: 'AI Unplugged 2026',
            org: "Department of Computer Science, St. Joseph's College (Autonomous), Devagiri",
            meta: ['13 July 2026', 'Participant, International Symposium on Artificial Intelligence and Emerging Technologies.'],
            event: 'AI Unplugged 2026',
            kind: 'Symposium',
            result: 'Participant',
            date: { label: '13 July 2026', datetime: '2026-07-13' },
            organizer: "Department of Computer Science, St. Joseph's College (Autonomous), Devagiri",
            place: 'Kozhikode',
            certificate: { file: 'ai-unplugged-2026', original: 'certificates/AiUnplugged2026.jpg', label: 'Certificate of participation', width: 1400, height: 990 },
        },
        {
            id: 'beyond-us-2023',
            title: 'Beyond Us 2023, my first hackathon',
            org: 'GTech µLearn with the Kerala Knowledge Economy Mission (KKEM)',
            meta: ['8–9 July 2023', '24-hour online hackathon.'],
            event: 'Beyond Us 2023',
            kind: 'Hackathon',
            result: 'Participant',
            date: { label: '8–9 July 2023', datetime: '2023-07-08' },
            organizer: 'GTech µLearn in association with KKEM',
            place: 'Online',
            certificate: { file: 'beyond-us-2023', original: 'certificates/Beyond_us2023.jpg', label: 'Certificate of participation (ID µ2023B10090)', width: 987, height: 774 },
        },
    ],

    // Courses with a certificate, shown on the achievements page.
    certifications: [
        {
            id: 'datatribe-mern-2025',
            title: 'MERN Stack Web Development',
            org: 'DataTribe',
            date: { label: 'May–November 2025', datetime: '2025-11-28' },
            summary: 'A 6-month course in the MERN stack (MongoDB, Express, React, Node.js), completed with grade A+.',
            certificate: { file: 'datatribe-mern-2025', original: 'certificates/fullstackWebDevelopment2026.jpg', label: 'Certificate of completion (ID MERN2A08)', width: 800, height: 1132 },
        },
    ],
};
