/**
 * render-helpers.js — small, layout-agnostic HTML builders shared by designs.
 *
 * Designs build markup with template strings; everything that comes from
 * content.js goes through esc() (or a helper that calls it).
 */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ENTITIES[ch]);

export const pad = (n, width = 2) => String(n).padStart(width, '0');

/** Shared section ids. Every design renders these ids so #hash links work in all of them. */
export const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

/** Reference to a symbol in the inline SVG sprite in index.html. */
export const icon = (name, cls = '') =>
    `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true" focusable="false"><use href="#i-${esc(name)}"></use></svg>`;

const NEW_TAB = ' (opens in a new tab)';

/**
 * An anchor. External links open in a new tab and say so to screen readers.
 * `inner` is trusted HTML (already escaped); otherwise `text` is escaped.
 */
export function link({ href, text = '', inner, external = false, sr = '', cls = '', attrs = '' }) {
    const body = inner ?? esc(text);
    const hidden = sr || external ? `<span class="visually-hidden">${esc(sr)}${external ? NEW_TAB : ''}</span>` : '';
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const klass = cls ? ` class="${esc(cls)}"` : '';
    return `<a href="${esc(href)}"${klass}${target}${attrs ? ` ${attrs}` : ''}>${body}${hidden}</a>`;
}

/** The links a project offers, in display order: case study, source, live/releases. */
export function projectLinks(project) {
    const links = [{ kind: 'case', label: 'Case study', href: project.caseStudy, external: false, sr: ` for ${project.name}` }];
    if (project.source) links.push({ kind: 'source', label: 'Source', href: project.source, external: true, sr: ` code for ${project.name}` });
    if (project.live) {
        const what = project.live.label === 'Live' ? ' demo of ' : ' of ';
        links.push({ kind: 'live', label: project.live.label, href: project.live.href, external: true, sr: `${what}${project.name}` });
    }
    return links;
}

/** Render project links with a shared shape; `decorate(l)` may return extra inner HTML (e.g. an icon). */
export function projectLinksHTML(project, { cls = '', decorate } = {}) {
    return projectLinks(project)
        .map((l) =>
            link({
                href: l.href,
                inner: `${esc(l.label)}${decorate ? decorate(l) : ''}`,
                external: l.external,
                sr: l.sr,
                cls: `${cls} ${cls}--${l.kind}`.trim(),
                attrs: `data-link-kind="${l.kind}"`,
            })
        )
        .join('');
}

/** Rich text: an array of strings and { text, href } link segments. */
export const rich = (segments) =>
    segments.map((s) => (typeof s === 'string' ? esc(s) : link({ href: s.href, text: s.text }))).join('');

/** Plain-text version of rich segments (for previews and aria labels). */
export const plain = (segments) => segments.map((s) => (typeof s === 'string' ? s : s.text)).join('');

export const dateRange = (item) => {
    const start = item.start.datetime ? `<time datetime="${esc(item.start.datetime)}">${esc(item.start.label)}</time>` : esc(item.start.label);
    const end = item.end.datetime ? `<time datetime="${esc(item.end.datetime)}">${esc(item.end.label)}</time>` : esc(item.end.label);
    return `${start} – ${end}`;
};

/** Responsive portrait (AVIF → WebP → JPEG). Lazy by default; it is never the LCP element. */
export function portrait(p, { sizes = '(max-width: 768px) 80vw, 360px', cls = '', loading = 'lazy' } = {}) {
    return `<picture>
        <source type="image/avif" srcset="${esc(p.avif)}" sizes="${esc(sizes)}">
        <source type="image/webp" srcset="${esc(p.webp)}" sizes="${esc(sizes)}">
        <img src="${esc(p.src)}" srcset="${esc(p.jpg)}" sizes="${esc(sizes)}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}"${cls ? ` class="${esc(cls)}"` : ''} loading="${loading}" decoding="async">
    </picture>`;
}

export const mailto = (email) => `mailto:${email}`;

/** Social links as anchors; `withIcon` adds the sprite icon, `iconOnly` hides the label visually. */
export function socialLinksHTML(socials, { cls = '', withIcon = false, iconOnly = false, showHandle = false } = {}) {
    return socials
        .map((s) => {
            const label = iconOnly ? '' : `<span>${esc(showHandle ? s.handle : s.label)}</span>`;
            return link({
                href: s.href,
                inner: `${withIcon ? icon(s.id) : ''}${label}`,
                external: true,
                sr: iconOnly || showHandle ? s.label : '',
                cls,
            });
        })
        .join('');
}

/** 32-bit FNV-1a hash: stable numbers from strings (per-project glyphs, seeds). */
export function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

/** Small deterministic PRNG (mulberry32): same seed, same sequence. */
export function prng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
