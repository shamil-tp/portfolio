/**
 * layout-generator.js — choose a curated layout combination, and check the
 * rendered result before the visitor sees it.
 *
 * Layouts are never arbitrary numbers: each dimension lists named options the
 * design's stylesheet implements. The first option of every dimension is the
 * design's original composition and the guaranteed fallback.
 */

/** Pairs of options that are not designed to work together, per design. */
const INCOMPATIBLE = {
    // A side-by-side cover already splits the width; a vertical schematic would crowd it on laptops.
    blueprint: [[{ cover: 'side' }, { orientation: 'vertical' }]],
    // Three stacked garden plants plus a stacked hero make the first screen all illustration.
    garden: [[{ hero: 'stacked' }, { density: '6' }]],
};

const matches = (layout, partial) => Object.entries(partial).every(([k, v]) => layout[k] === v);

export function defaultLayout(def) {
    return Object.fromEntries(Object.entries(def.layout).map(([dim, options]) => [dim, options[0]]));
}

/** One option per dimension, re-rolled if it lands on an incompatible pair. */
export function chooseLayout(designId, def, rand) {
    const rules = INCOMPATIBLE[designId] ?? [];
    for (let attempt = 0; attempt < 8; attempt++) {
        const layout = Object.fromEntries(Object.entries(def.layout).map(([dim, options]) => [dim, options[Math.floor(rand() * options.length)]]));
        if (!rules.some(([a, b]) => matches(layout, a) && matches(layout, b))) return layout;
    }
    return defaultLayout(def);
}

const intersects = (a, b) => a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2;

/**
 * Check the mounted page: every section is there, every project link exists,
 * nothing overflows horizontally, and the main heading doesn't collide with
 * the text after it. Returns a list of problems (empty = valid).
 */
export function validateLayout(root, content) {
    const problems = [];
    const de = document.documentElement;
    for (const id of ['main', 'hero-title', 'about', 'projects', 'skills', 'experience', 'contact']) {
        if (!document.getElementById(id)) problems.push(`missing #${id}`);
    }
    const caseLinks = new Set([...root.querySelectorAll('a[href^="myProjectDetails/"]')].map((a) => a.getAttribute('href')));
    const missing = content.projects.filter((p) => !caseLinks.has(p.caseStudy));
    if (missing.length) problems.push(`missing project links: ${missing.map((p) => p.slug).join(', ')}`);
    if (de.scrollWidth > de.clientWidth + 1) problems.push(`horizontal overflow ${de.scrollWidth}>${de.clientWidth}`);

    const h1 = document.getElementById('hero-title');
    const section = h1?.closest('section');
    if (h1 && section && h1.offsetParent) {
        const r = h1.getBoundingClientRect();
        // data-overlap="designed" marks a deliberate collision (the Brutalist sticker on the name).
        const blocks = [...section.querySelectorAll('p, a, button')].filter((el) => !h1.contains(el) && el.offsetParent && !el.closest('[data-overlap="designed"]'));
        const hit = blocks.find((el) => intersects(r, el.getBoundingClientRect()));
        if (hit) problems.push(`heading overlaps ${hit.tagName.toLowerCase()}.${hit.className}`);
    }
    return problems;
}
