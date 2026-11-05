/**
 * generative-ui.js — one art-directed variation of the active design per visit.
 *
 * A variation is fully determined by (design, seed): palette, layout,
 * typography and motion presets all come from one seeded PRNG, so any
 * variation can be reproduced with ?variation=<seed> (a test hook, not UI).
 *
 * Lifecycle:
 *   seedFor()   new seed on a fresh load (avoiding the last combination
 *               shown for this design in this tab); the same seed when the
 *               visitor follows a link inside the site, so a visit stays
 *               visually stable.
 *   build()     palette (curated or generated, contrast-validated and
 *               repaired), layout, type and motion.
 *   apply()     writes the design's own custom properties and data-v-*
 *               attributes on <html>; clear() removes exactly those.
 *
 * Only loaded for designs with supportsGenerativeUI (never for Depth).
 */
import { PRESETS } from './variation-presets.js';
import { contrast, ensureContrast, toHex, pick } from './palette-generator.js';
import { chooseLayout, defaultLayout, validateLayout } from './layout-generator.js';
import { prng, hash } from './render-helpers.js';

const STORE = 'portfolio:variation:';
const root = document.documentElement;
let applied = { vars: [], attrs: [] };

const read = (id) => {
    try { return JSON.parse(sessionStorage.getItem(STORE + id) || 'null'); } catch { return null; }
};
const write = (id, value) => {
    try { sessionStorage.setItem(STORE + id, JSON.stringify(value)); } catch { /* storage blocked: repeats become possible */ }
};

function freshSeed() {
    return window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 2 ** 32);
}

function requestedSeed() {
    try {
        const v = new URLSearchParams(location.search).get('variation');
        return v && /^\d+$/.test(v) ? Number(v) >>> 0 : null;
    } catch {
        return null;
    }
}

export const supports = (designId) => !!PRESETS[designId];

/* ---------- Palette ---------- */

const resolve = (palette, ref) => (ref.startsWith('#') ? ref : palette[ref]);
const isLiteral = (ref) => ref.startsWith('#');

/** Check (and, for generated palettes, repair) every contrast pair. Returns roles or null. */
function validatePalette(def, roles, repairable) {
    const out = { ...roles };
    for (let pass = 0; pass < 2; pass++) {
        for (const [fg, bg, min, adjust] of def.contrast) {
            const f = resolve(out, fg);
            const b = resolve(out, bg);
            if (contrast(f, b) >= min) continue;
            if (!repairable) return null;
            const side = adjust === 'bg' ? bg : fg;
            if (isLiteral(side)) return null;
            const fixed = ensureContrast(out[side], adjust === 'bg' ? f : b, min);
            if (!fixed) return null;
            out[side] = fixed;
        }
    }
    // Final check after repairs (a later repair can't silently break an earlier pair).
    const ok = def.contrast.every(([fg, bg, min]) => contrast(resolve(out, fg), resolve(out, bg)) >= min - 0.01);
    return ok ? out : null;
}

function paletteFor(def, rand) {
    if (def.generate && rand() < 0.6) {
        for (let attempt = 0; attempt < 4; attempt++) {
            const candidate = def.generate(rand);
            const roles = validatePalette(def, candidate.roles, true);
            if (roles) {
                const hex = Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, typeof v === 'string' ? v : toHex(v)]));
                return { name: candidate.name, source: 'generated', medium: candidate.medium, roles: hex };
            }
        }
    }
    // Curated palettes are verified the same way; the first one is the design's original.
    const curated = pick(rand, def.curated);
    const ok = validatePalette(def, curated.roles, false);
    const chosen = ok ? curated : def.curated[0];
    return { name: chosen.name, source: 'curated', medium: chosen.medium, roles: { ...chosen.roles } };
}

/* ---------- Build / apply ---------- */

export function build(designId, seed) {
    const def = PRESETS[designId];
    // Hash first: mulberry32's opening draws correlate for small seeds (e.g. ?variation=7).
    const rand = prng(hash(`${designId}:${seed}`));
    const palette = paletteFor(def, rand);
    const layout = chooseLayout(designId, def, rand);
    const type = def.type[Math.floor(rand() * def.type.length)];
    const motion = def.motion[Math.floor(rand() * def.motion.length)];
    const key = [palette.name, ...Object.values(layout), type.name, motion.name].join('|');
    return { designId, seed, key, palette, layout, type, motion };
}

/** The same variation with the design's original composition (validation fallback). */
export function withDefaultLayout(variation) {
    const layout = defaultLayout(PRESETS[variation.designId]);
    return { ...variation, layout, key: `${variation.key}|fallback`, fallback: true };
}

export function apply(variation, { layout = true } = {}) {
    clear();
    const def = PRESETS[variation.designId];
    const vars = {};
    for (const [role, hex] of Object.entries(variation.palette.roles)) {
        if (def.tokens[role]) vars[def.tokens[role]] = hex;
    }
    Object.assign(vars, variation.type.vars, variation.motion.vars);
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
    applied.vars = Object.keys(vars);

    const attrs = {};
    if (layout) for (const [dim, option] of Object.entries(variation.layout)) attrs[`data-v-${dim}`] = option;
    if (variation.palette.medium) attrs['data-v-medium'] = variation.palette.medium;
    for (const [name, value] of Object.entries(attrs)) root.setAttribute(name, value);
    applied.attrs = Object.keys(attrs);
    root.setAttribute('data-variation', String(variation.seed));
    applied.attrs.push('data-variation');
    const theme = variation.palette.roles[def.theme];
    if (theme) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme);
}

/** Remove everything apply() set, so no variation leaks into the next design. */
export function clear() {
    applied.vars.forEach((name) => root.style.removeProperty(name));
    applied.attrs.forEach((name) => root.removeAttribute(name));
    applied = { vars: [], attrs: [] };
}

/**
 * The seed for this view of `designId`.
 *   keep: the visitor followed a link inside the site (reuse this visit's seed)
 *   fresh: a refresh, a new arrival, or "Surprise me"
 */
export function seedFor(designId, { keep = false } = {}) {
    const requested = requestedSeed();
    if (requested !== null) return requested;
    const stored = read(designId);
    if (keep && stored) return stored.seed;
    let seed = freshSeed();
    for (let i = 0; i < 8 && stored && build(designId, seed).key === stored.key; i++) seed = freshSeed();
    return seed;
}

export function remember(variation) {
    write(variation.designId, { seed: variation.seed, key: variation.key });
}

export function describe(variation) {
    const layout = Object.entries(variation.layout).map(([k, v]) => `${k} ${v}`).join(', ');
    return `${variation.palette.name} · ${layout} · ${variation.type.name} · ${variation.motion.name}${variation.fallback ? ' (layout fallback)' : ''}`;
}

export { validateLayout };
