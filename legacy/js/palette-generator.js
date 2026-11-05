/**
 * palette-generator.js — colour maths for the generative UI.
 *
 * Colours are designed in OKLCH (perceptually even lightness, so "same
 * lightness, different hue" really looks the same), mapped into the sRGB
 * gamut by reducing chroma, and emitted as hex so every browser can use them.
 * Contrast is measured with the WCAG 2 relative-luminance formula and
 * repaired by moving lightness, never by guessing.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** OKLCH (L 0–1, C ≈0–0.37, h degrees) → linear sRGB [r, g, b] (may be out of gamut). */
function oklchToLinear(L, C, h) {
    const hr = (h * Math.PI) / 180;
    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
const encode = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const decode = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

/** An OKLCH colour, gamut-mapped by lowering chroma until it fits sRGB. */
export function oklch(L, C, h) {
    let c = C;
    let rgb = oklchToLinear(L, c, h);
    while (!inGamut(rgb) && c > 0) {
        c = Math.max(0, c - 0.005);
        rgb = oklchToLinear(L, c, h);
    }
    return { L, C: c, h, rgb: rgb.map(clamp01) };
}

export function toHex(color) {
    return `#${color.rgb.map((v) => Math.round(clamp01(encode(v)) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export function hexToLinear(hex) {
    const n = hex.replace('#', '');
    return [0, 2, 4].map((i) => decode(parseInt(n.slice(i, i + 2), 16) / 255));
}

const luminance = (rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

/** WCAG contrast ratio between two colours (OKLCH objects or hex strings). */
export function contrast(a, b) {
    const la = luminance(typeof a === 'string' ? hexToLinear(a) : a.rgb);
    const lb = luminance(typeof b === 'string' ? hexToLinear(b) : b.rgb);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Move `fg`'s lightness away from `bg` until the pair reaches `min`.
 * Returns the repaired colour, or null if no lightness can satisfy it.
 */
export function ensureContrast(fg, bg, min) {
    if (contrast(fg, bg) >= min) return fg;
    const bgL = luminance(typeof bg === 'string' ? hexToLinear(bg) : bg.rgb);
    const goDarker = bgL > 0.18;
    for (let step = 1; step <= 40; step++) {
        const L = clamp01(fg.L + (goDarker ? -0.0125 : 0.0125) * step);
        const next = oklch(L, fg.C, fg.h);
        if (contrast(next, bg) >= min) return next;
        if (L === 0 || L === 1) break;
    }
    return null;
}

/** Hue arithmetic for harmony strategies. */
export const hue = {
    wrap: (h) => ((h % 360) + 360) % 360,
    analogous: (h, spread = 30) => [hue.wrap(h - spread), h, hue.wrap(h + spread)],
    complement: (h) => hue.wrap(h + 180),
    split: (h, spread = 30) => [hue.wrap(h + 180 - spread), hue.wrap(h + 180 + spread)],
    triad: (h) => [h, hue.wrap(h + 120), hue.wrap(h + 240)],
};

/** Pick from a list with a PRNG. */
export const pick = (rand, list) => list[Math.floor(rand() * list.length)];
export const range = (rand, a, b) => a + (b - a) * rand();
