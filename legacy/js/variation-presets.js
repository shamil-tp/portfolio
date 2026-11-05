/**
 * variation-presets.js — what each design is allowed to vary, and how.
 *
 * For every design that supports generative UI:
 *   tokens    colour role → the design's own CSS custom property
 *   theme     the role that becomes <meta name="theme-color">
 *   curated   hand-checked palettes (always valid, also the fallback)
 *   generate  a palette recipe in OKLCH that keeps the design's identity
 *   contrast  [fg, bg, minimum, adjust] pairs that must pass WCAG; `adjust`
 *             names which side may move (the other is fixed or literal)
 *   layout    dimension → curated options (first option = the safe default)
 *   type      typography presets (CSS custom properties)
 *   motion    motion presets (CSS custom properties)
 *
 * Nothing here is an arbitrary value: options are designed compositions the
 * stylesheets implement and the layout validator checks.
 *
 * The Depth design is not listed: it is excluded from generative UI.
 */
import { oklch, hue, pick, range } from './palette-generator.js';

const WHITE = '#ffffff';
const BLACK = '#000000';

/** Name a hue for palette labels (shown in the design dock's tooltip). */
function hueName(h) {
    const names = [[15, 'red'], [45, 'orange'], [75, 'amber'], [105, 'yellow'], [135, 'lime'], [165, 'green'], [195, 'teal'], [225, 'cyan'], [255, 'blue'], [285, 'indigo'], [315, 'violet'], [345, 'pink']];
    const hh = hue.wrap(h);
    return (names.find(([max]) => hh < max) ?? [0, 'red'])[1];
}

export const PRESETS = {
    /* ------------------------------------------------------------------ */
    minimal: {
        tokens: { paper: '--sw-paper', ink: '--sw-ink', mid: '--sw-mid', rule: '--sw-rule', accent: '--sw-red' },
        theme: 'paper', // role used for <meta name="theme-color">
        curated: [
            { name: 'Signal red on paper', roles: { paper: '#f2f1ed', ink: '#121211', mid: '#57564f', rule: '#cbc9c1', accent: '#d0211a' } },
            { name: 'Klein blue on white', roles: { paper: '#f6f6f4', ink: '#111214', mid: '#53555c', rule: '#cfd0d3', accent: '#1f3fd1' } },
            { name: 'Green on warm grey', roles: { paper: '#efede7', ink: '#141512', mid: '#55574f', rule: '#c9c7be', accent: '#14783c' } },
        ],
        // Restrained: near-neutral paper and ink, one strong signal colour.
        generate(rand) {
            const accentHue = pick(rand, [25, 30, 250, 262, 150, 300, 45]);
            const warm = rand() < 0.6;
            const ph = warm ? range(rand, 70, 95) : range(rand, 220, 260);
            return {
                name: `${hueName(accentHue)} signal on ${warm ? 'warm' : 'cool'} paper`,
                roles: {
                    paper: oklch(range(rand, 0.955, 0.972), range(rand, 0.004, 0.011), ph),
                    ink: oklch(0.19, 0.006, ph),
                    mid: oklch(0.46, 0.01, ph),
                    rule: oklch(0.83, 0.01, ph),
                    accent: oklch(0.55, 0.2, accentHue),
                },
            };
        },
        contrast: [['ink', 'paper', 7, 'fg'], ['mid', 'paper', 4.5, 'fg'], ['accent', 'paper', 4.5, 'fg'], [WHITE, 'accent', 4.5, 'bg']],
        layout: { hero: ['index', 'stacked', 'split'], projects: ['rows', 'alternate', 'grid'] },
        type: [
            { name: 'Grotesk 600', vars: { '--sw-name-weight': '600', '--sw-display-scale': '1' } },
            { name: 'Grotesk 500, larger', vars: { '--sw-name-weight': '500', '--sw-display-scale': '1.07' } },
            { name: 'Grotesk 700, compact', vars: { '--sw-name-weight': '700', '--sw-display-scale': '0.92' } },
        ],
        motion: [
            { name: 'measured', vars: { '--sw-rise-dur': '900ms', '--reveal-dur': '700ms' } },
            { name: 'brisk', vars: { '--sw-rise-dur': '620ms', '--reveal-dur': '450ms' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    brutalist: {
        tokens: { paper: '--br-paper', block: '--br-yellow', blockB: '--br-pink', blockC: '--br-cyan', hot: '--br-orange', deep: '--br-blue' },
        theme: 'block', // role used for <meta name="theme-color">
        curated: [
            { name: 'Yellow, pink, cyan', roles: { paper: '#fffdf5', block: '#fff200', blockB: '#ff9ed2', blockC: '#7ff0ff', hot: '#ff5c1a', deep: '#2433ff' } },
            { name: 'Lime and violet', roles: { paper: '#fbfdf3', block: '#c6ff3d', blockB: '#d9b8ff', blockC: '#ffd166', hot: '#ff7a1a', deep: '#5b1bd8' } },
            { name: 'Cyan and red', roles: { paper: '#f6fdff', block: '#5ff2ff', blockB: '#ffc2c2', blockC: '#fff38a', hot: '#ff4a3d', deep: '#0b3bd6' } },
        ],
        // Expressive: one loud light block colour, split-complementary partners, a deep contrast colour.
        generate(rand) {
            const h = pick(rand, [100, 92, 132, 195, 335, 70]);
            const [s1, s2] = hue.split(h, 30);
            return {
                name: `${hueName(h)} block`,
                roles: {
                    paper: oklch(0.985, 0.012, h),
                    block: oklch(range(rand, 0.89, 0.93), 0.19, h),
                    blockB: oklch(0.84, 0.11, s1),
                    blockC: oklch(0.88, 0.1, s2),
                    hot: oklch(0.7, 0.19, hue.wrap(h - 60)),
                    deep: oklch(0.45, 0.22, hue.wrap(h + 165)),
                },
            };
        },
        contrast: [
            [BLACK, 'paper', 12, 'bg'], [BLACK, 'block', 7, 'bg'], [BLACK, 'blockB', 7, 'bg'], [BLACK, 'blockC', 7, 'bg'],
            [BLACK, 'hot', 4.5, 'bg'], [WHITE, 'deep', 4.5, 'bg'], ['block', BLACK, 7, 'fg'],
        ],
        layout: { hero: ['offset', 'stack', 'split'], wall: ['asym', 'list', 'grid'] },
        type: [
            { name: 'Outfit 900', vars: { '--br-display-weight': '900', '--br-display-track': '-0.04em' } },
            { name: 'Outfit 800, tighter', vars: { '--br-display-weight': '800', '--br-display-track': '-0.055em' } },
        ],
        motion: [
            { name: 'slam', vars: { '--br-ticker-dur': '60s', '--br-ticker-dir': 'normal', '--reveal-dur': '420ms' } },
            { name: 'fast ticker, reversed', vars: { '--br-ticker-dur': '38s', '--br-ticker-dir': 'reverse', '--reveal-dur': '320ms' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    // Retro OS: only era-appropriate desktop schemes (wallpaper + title bars), no generated hues.
    os: {
        tokens: { wall: '--os-wall', wallDark: '--os-wall-dark', title: '--os-navy', title2: '--os-navy-2' },
        theme: 'wall', // role used for <meta name="theme-color">
        curated: [
            { name: 'Teal', roles: { wall: '#0f7c7a', wallDark: '#0b5e5c', title: '#00007b', title2: '#1a5fb0' } },
            { name: 'Plum', roles: { wall: '#5e3f5e', wallDark: '#432c43', title: '#4f1f4f', title2: '#7a3f7a' } },
            { name: 'Spruce', roles: { wall: '#3b6b4c', wallDark: '#2b5038', title: '#1f4a2c', title2: '#3a6e4a' } },
            { name: 'Storm', roles: { wall: '#3e4c6a', wallDark: '#2c3750', title: '#1b2a4d', title2: '#44587f' } },
            { name: 'Marine', roles: { wall: '#1d5b78', wallDark: '#144259', title: '#003d66', title2: '#1d6596' } },
            { name: 'Brick', roles: { wall: '#7a3b2c', wallDark: '#5b2a1f', title: '#6a1d0f', title2: '#9a4430' } },
            { name: 'Slate', roles: { wall: '#4a5662', wallDark: '#363f48', title: '#283642', title2: '#566878' } },
            { name: 'Desert', roles: { wall: '#7c6446', wallDark: '#5c4a33', title: '#6b4a1a', title2: '#94703a' } },
        ],
        generate: null,
        contrast: [[WHITE, 'wall', 4.5, 'bg'], [WHITE, 'title', 4.5, 'bg'], [WHITE, 'title2', 4.5, 'bg']],
        layout: { icons: ['left', 'right'], front: ['projects', 'about'], open: ['two', 'three'] },
        type: [{ name: 'IBM Plex', vars: {} }],
        motion: [
            { name: 'zoom open', vars: { '--os-open-ms': '180' } },
            { name: 'instant open', vars: { '--os-open-ms': '0' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    editorial: {
        tokens: { paper: '--ed-paper', paper2: '--ed-paper-2', ink: '--ed-ink', muted: '--ed-muted', hair: '--ed-hair', accent: '--ed-red' },
        theme: 'paper', // role used for <meta name="theme-color">
        curated: [
            { name: 'Oxblood on cream', roles: { paper: '#f3eee4', paper2: '#ebe4d6', ink: '#1d1a16', muted: '#5a5248', hair: '#cfc5b3', accent: '#8a2a1c' } },
            { name: 'Navy on newsprint', roles: { paper: '#efede6', paper2: '#e5e2d8', ink: '#16181d', muted: '#4f535c', hair: '#c9c6bb', accent: '#1d3a6e' } },
            { name: 'Forest on ivory', roles: { paper: '#f4f1e8', paper2: '#e9e5d8', ink: '#181b16', muted: '#4d5348', hair: '#ccc8b8', accent: '#24543a' } },
        ],
        // Sophisticated: tinted paper, ink from the same family, one deep accent.
        generate(rand) {
            const ph = pick(rand, [80, 70, 90, 220, 30, 140]);
            const ah = pick(rand, [28, 255, 155, 320, 55, 200]);
            const paper = oklch(range(rand, 0.955, 0.968), range(rand, 0.012, 0.024), ph);
            return {
                name: `${hueName(ah)} on ${hueName(ph)}-tinted paper`,
                roles: {
                    paper,
                    paper2: oklch(paper.L - 0.03, paper.C + 0.005, ph),
                    ink: oklch(0.21, 0.012, ph),
                    muted: oklch(0.45, 0.02, ph),
                    hair: oklch(0.83, 0.02, ph),
                    accent: oklch(0.43, 0.13, ah),
                },
            };
        },
        contrast: [['ink', 'paper', 7, 'fg'], ['muted', 'paper', 4.5, 'fg'], ['muted', 'paper2', 4.5, 'fg'], ['accent', 'paper', 4.5, 'fg'], ['accent', 'paper2', 4.5, 'fg']],
        layout: { cover: ['center', 'split', 'left'], stories: ['three', 'two', 'alternate'], lead: ['split', 'stacked'] },
        type: [
            { name: 'Bodoni 800', vars: { '--ed-head-weight': '800' } },
            { name: 'Bodoni 600', vars: { '--ed-head-weight': '600' } },
        ],
        motion: [
            { name: 'paced', vars: { '--reveal-dur': '900ms' } },
            { name: 'quiet', vars: { '--reveal-dur': '600ms' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    generative: {
        tokens: { bg: '--g-bg', ink: '--g-ink', a: '--g-a', b: '--g-b', c: '--g-c' },
        theme: 'bg', // role used for <meta name="theme-color">
        curated: [
            { name: 'Signal', roles: { bg: '#f4f1ea', ink: '#16161d', a: '#e8492a', b: '#2f5dff', c: '#ffc53d' } },
            { name: 'Night', roles: { bg: '#14141b', ink: '#f2efe8', a: '#ffd166', b: '#c93a5c', c: '#06d6a0' } },
            { name: 'Clay', roles: { bg: '#f6eee2', ink: '#1d1b16', a: '#d14e26', b: '#14807e', c: '#f2b705' } },
        ],
        // More expressive: a triad or split-complementary set on a light or dark ground.
        generate(rand) {
            const h = range(rand, 0, 360);
            const dark = rand() < 0.25;
            const strategy = rand() < 0.5 ? 'triad' : 'split';
            const [ha, hb, hc] = strategy === 'triad' ? hue.triad(h) : [h, ...hue.split(h, 35)];
            return {
                name: `${strategy === 'triad' ? 'Triad' : 'Split'} from ${hueName(h)}${dark ? ', night' : ''}`,
                roles: {
                    bg: dark ? oklch(0.18, 0.02, h) : oklch(0.965, 0.012, h),
                    ink: dark ? oklch(0.95, 0.01, h) : oklch(0.19, 0.02, h),
                    a: oklch(0.66, 0.19, ha),
                    b: oklch(0.55, 0.2, hb),
                    c: oklch(0.83, 0.15, hc),
                },
            };
        },
        contrast: [['ink', 'bg', 12, 'fg'], ['a', 'bg', 3, 'fg'], ['#16161d', 'c', 4.5, 'bg'], [WHITE, 'b', 3, 'bg']],
        layout: { composition: ['left', 'right', 'stack'], grid: ['four', 'three'], tile: ['60', '48', '72'] },
        type: [
            { name: 'Syne 800', vars: { '--gn-name-scale': '1' } },
            { name: 'Syne 800, larger', vars: { '--gn-name-scale': '1.08' } },
        ],
        motion: [
            { name: 'turn', vars: { '--gn-turn-ms': '900ms' } },
            { name: 'slow turn', vars: { '--gn-turn-ms': '1400ms' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    terminal: {
        tokens: { bg: '--tm-bg', bg2: '--tm-bg-2', line: '--tm-line', fg: '--tm-fg', dim: '--tm-dim', user: '--tm-user', path: '--tm-path', link: '--tm-link', ok: '--tm-ok', err: '--tm-err' },
        theme: 'bg', // role used for <meta name="theme-color">
        curated: [
            { name: 'Graphite', roles: { bg: '#15171c', bg2: '#1b1e25', line: '#2a2e37', fg: '#d4d7dd', dim: '#8d939e', user: '#72d3b8', path: '#e6c07b', link: '#8fb7ff', ok: '#9fd68a', err: '#f2907f' } },
            { name: 'Midnight', roles: { bg: '#121626', bg2: '#181d31', line: '#272e48', fg: '#d6dbea', dim: '#8a92ad', user: '#7fd3e6', path: '#f0b46c', link: '#a9b8ff', ok: '#a6e08e', err: '#f49595' } },
            { name: 'Moss', roles: { bg: '#141a16', bg2: '#1a221c', line: '#28332b', fg: '#d3dbd4', dim: '#8a978d', user: '#9ad98a', path: '#e3c86e', link: '#86c3e8', ok: '#b7e07e', err: '#ef9a86' } },
        ],
        // Dark only (a terminal's identity), with distinct hues for prompt, path and links.
        generate(rand) {
            const bh = pick(rand, [255, 235, 280, 160, 30, 210]);
            const bg = oklch(range(rand, 0.17, 0.2), range(rand, 0.012, 0.03), bh);
            const uh = pick(rand, [165, 150, 190, 125]);
            const ph = pick(rand, [80, 62, 40, 330]);
            const lh = pick(rand, [255, 230, 210, 285]);
            return {
                name: `${hueName(bh)} shell`,
                roles: {
                    bg,
                    bg2: oklch(bg.L + 0.03, bg.C, bh),
                    line: oklch(bg.L + 0.09, bg.C, bh),
                    fg: oklch(0.88, 0.01, bh),
                    dim: oklch(0.68, 0.015, bh),
                    user: oklch(0.8, 0.12, uh),
                    path: oklch(0.82, 0.12, ph),
                    link: oklch(0.77, 0.11, lh),
                    ok: oklch(0.8, 0.14, 135),
                    err: oklch(0.73, 0.14, 25),
                },
            };
        },
        contrast: [
            ['fg', 'bg', 10, 'fg'], ['dim', 'bg', 4.5, 'fg'], ['dim', 'bg2', 4.5, 'fg'], ['user', 'bg', 4.5, 'fg'], ['path', 'bg', 4.5, 'fg'],
            ['link', 'bg', 4.5, 'fg'], ['ok', 'bg', 4.5, 'fg'], ['err', 'bg', 4.5, 'fg'], ['bg', 'path', 7, 'bg'],
        ],
        layout: { frame: ['full', 'window'], prompt: ['full', 'short'], intro: ['whoami', 'readme'], listing: ['detailed', 'compact'] },
        type: [
            { name: 'Fira Code 15', vars: { '--tm-scale': '1' } },
            { name: 'Fira Code 14', vars: { '--tm-scale': '0.94' } },
        ],
        motion: [
            { name: 'blinking cursor', vars: { '--tm-blink': '1.1s' } },
            { name: 'slow cursor', vars: { '--tm-blink': '1.6s' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    // Blueprint: real drafting media, each with a slight hue drift.
    blueprint: {
        tokens: { vellum: '--bp-vellum', vellum2: '--bp-vellum-2', ink: '--bp-ink', graphite: '--bp-graphite', muted: '--bp-muted', pencil: '--bp-red' },
        theme: 'vellum', // role used for <meta name="theme-color">
        curated: [
            { name: 'Blue ink on vellum', medium: 'vellum', roles: { vellum: '#f2f1ea', vellum2: '#e9e8df', ink: '#1d4f91', graphite: '#22272e', muted: '#556070', pencil: '#c2410c' } },
            { name: 'Cyanotype', medium: 'cyanotype', roles: { vellum: '#1d4a86', vellum2: '#173c6e', ink: '#f2f6fb', graphite: '#eef3f9', muted: '#c4d3e6', pencil: '#ffd27a' } },
            { name: 'Sepia print', medium: 'sepia', roles: { vellum: '#efe6d2', vellum2: '#e5dac2', ink: '#5a3418', graphite: '#2b2219', muted: '#6a5747', pencil: '#a63a17' } },
            { name: 'Graphite on white', medium: 'graphite', roles: { vellum: '#fbfbf8', vellum2: '#efefea', ink: '#1f2329', graphite: '#1f2329', muted: '#585e68', pencil: '#1f55c7' } },
        ],
        generate(rand) {
            const medium = pick(rand, ['vellum', 'cyanotype', 'sepia', 'graphite']);
            const j = range(rand, -8, 8);
            const recipes = {
                vellum: () => ({ vellum: oklch(0.955, 0.01, 95 + j), vellum2: oklch(0.925, 0.012, 95 + j), ink: oklch(0.42, 0.13, 258 + j), graphite: oklch(0.26, 0.012, 258), muted: oklch(0.48, 0.03, 258), pencil: oklch(0.55, 0.17, 40 + j) }),
                cyanotype: () => ({ vellum: oklch(0.42, 0.11, 258 + j), vellum2: oklch(0.37, 0.1, 258 + j), ink: oklch(0.97, 0.01, 250), graphite: oklch(0.96, 0.01, 250), muted: oklch(0.86, 0.03, 250), pencil: oklch(0.88, 0.12, 85 + j) }),
                sepia: () => ({ vellum: oklch(0.925, 0.03, 82 + j), vellum2: oklch(0.89, 0.035, 82 + j), ink: oklch(0.37, 0.07, 50 + j), graphite: oklch(0.25, 0.02, 50), muted: oklch(0.47, 0.03, 50), pencil: oklch(0.5, 0.15, 32 + j) }),
                graphite: () => ({ vellum: oklch(0.985, 0.003, 95), vellum2: oklch(0.95, 0.004, 95), ink: oklch(0.24, 0.012, 260 + j), graphite: oklch(0.24, 0.012, 260 + j), muted: oklch(0.48, 0.015, 260), pencil: oklch(0.5, 0.19, 262 + j) }),
            };
            const label = { vellum: 'Blue ink on vellum', cyanotype: 'Cyanotype', sepia: 'Sepia print', graphite: 'Graphite on white' }[medium];
            return { name: `${label} (drift ${j >= 0 ? '+' : ''}${j.toFixed(0)}°)`, medium, roles: recipes[medium]() };
        },
        contrast: [['ink', 'vellum', 4.5, 'fg'], ['ink', 'vellum2', 4.5, 'fg'], ['graphite', 'vellum', 7, 'fg'], ['muted', 'vellum', 4.5, 'fg'], ['pencil', 'vellum', 4.5, 'fg']],
        layout: { orientation: ['horizontal', 'vertical'], cover: ['stacked', 'side'] },
        type: [
            { name: 'Archivo condensed', vars: { '--bp-stretch': '70%', '--bp-cover-stretch': '62%' } },
            { name: 'Archivo semi-condensed', vars: { '--bp-stretch': '82%', '--bp-cover-stretch': '75%' } },
        ],
        motion: [
            { name: 'ruled', vars: { '--bp-draw-ms': '1100ms' } },
            { name: 'quick draft', vars: { '--bp-draw-ms': '650ms' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    studio: {
        tokens: { paper: '--st-paper', soft: '--st-soft', one: '--st-tomato', two: '--st-cobalt', three: '--st-lilac', four: '--st-mint' },
        theme: 'paper', // role used for <meta name="theme-color">
        curated: [
            { name: 'Tomato, cobalt, lilac, mint', roles: { paper: '#f7f2e8', soft: '#4a463f', one: '#ff5a36', two: '#2b48ff', three: '#cdbdff', four: '#b9efcf' } },
            { name: 'Coral, forest, butter, sky', roles: { paper: '#f8f4ec', soft: '#47443d', one: '#ff7a59', two: '#1f6b46', three: '#ffe48a', four: '#bfe3ff' } },
            { name: 'Pink, ink-blue, peach, sage', roles: { paper: '#f9f3f1', soft: '#4a4240', one: '#ff6fa8', two: '#2d3a8c', three: '#ffc9a8', four: '#c9e4c5' } },
        ],
        // Bold but controlled: a quartet built from one base hue (one warm hero, one deep, two light).
        generate(rand) {
            const h = range(rand, 0, 360);
            return {
                name: `Quartet from ${hueName(h)}`,
                roles: {
                    paper: oklch(0.965, 0.015, hue.wrap(h + 40)),
                    soft: oklch(0.4, 0.015, h),
                    one: oklch(0.66, 0.19, h),
                    two: oklch(0.47, 0.2, hue.wrap(h + 150)),
                    three: oklch(0.84, 0.1, hue.wrap(h + 60)),
                    four: oklch(0.89, 0.09, hue.wrap(h + 210)),
                },
            };
        },
        contrast: [
            ['#191919', 'paper', 12, 'bg'], ['soft', 'paper', 4.5, 'fg'], ['#191919', 'one', 4.5, 'bg'], [WHITE, 'two', 4.5, 'bg'],
            ['#191919', 'three', 7, 'bg'], ['#191919', 'four', 7, 'bg'], ['two', 'paper', 3, 'fg'],
        ],
        layout: { hero: ['offset', 'right', 'inline'], rhythm: ['a', 'b', 'c'], edge: ['scallop', 'wave', 'zigzag'] },
        type: [
            { name: 'Bricolage condensed', vars: { '--st-stretch': '75%' } },
            { name: 'Bricolage semi-condensed', vars: { '--st-stretch': '88%' } },
        ],
        motion: [
            { name: 'springy', vars: { '--st-spring': 'cubic-bezier(0.34, 1.4, 0.64, 1)' } },
            { name: 'settled', vars: { '--st-spring': 'cubic-bezier(0.23, 1, 0.32, 1)' } },
        ],
    },

    /* ------------------------------------------------------------------ */
    garden: {
        tokens: { paper: '--gd-paper', sheet: '--gd-sheet', ink: '--gd-ink', muted: '--gd-muted', line: '--gd-line', moss: '--gd-moss', fern: '--gd-fern', sage: '--gd-sage', olive: '--gd-olive', clay: '--gd-clay', sand: '--gd-sand' },
        theme: 'paper', // role used for <meta name="theme-color">
        curated: [
            { name: 'Late summer', roles: { paper: '#f3eee2', sheet: '#fbf8f0', ink: '#1f2a22', muted: '#566255', line: '#d9d1bf', moss: '#2f4a3a', fern: '#5d7f4f', sage: '#8fa98a', olive: '#7c8f4e', clay: '#c47f5e', sand: '#e6dcc4' } },
        ],
        // Seasons: natural hue relationships for leaves, blossom and paper.
        generate(rand) {
            const season = pick(rand, [
                { name: 'Spring', green: 145, bloom: 10, paper: 95 },
                { name: 'Summer', green: 150, bloom: 62, paper: 85 },
                { name: 'Autumn', green: 112, bloom: 42, paper: 72 },
                { name: 'Winter', green: 188, bloom: 305, paper: 230 },
            ]);
            const j = range(rand, -6, 6);
            const g = season.green + j;
            return {
                name: season.name,
                roles: {
                    paper: oklch(0.95, 0.02, season.paper),
                    sheet: oklch(0.982, 0.012, season.paper),
                    ink: oklch(0.25, 0.03, g),
                    muted: oklch(0.48, 0.03, g),
                    line: oklch(0.86, 0.025, season.paper),
                    moss: oklch(0.36, 0.05, g),
                    fern: oklch(0.5, 0.08, g),
                    sage: oklch(0.71, 0.06, g),
                    olive: oklch(0.63, 0.1, hue.wrap(g - 25)),
                    clay: oklch(0.65, 0.11, season.bloom + j),
                    sand: oklch(0.87, 0.04, season.paper),
                },
            };
        },
        contrast: [['ink', 'paper', 7, 'fg'], ['muted', 'paper', 4.5, 'fg'], ['moss', 'paper', 4.5, 'fg'], ['moss', 'sheet', 4.5, 'fg'], ['fern', 'paper', 4.5, 'fg'], ['paper', 'moss', 4.5, 'bg']],
        layout: { hero: ['left', 'right', 'stacked'], specimens: ['staggered', 'two', 'rows'], density: ['5', '4', '6'] },
        type: [
            { name: 'Young Serif', vars: { '--gd-name-scale': '1' } },
            { name: 'Young Serif, larger', vars: { '--gd-name-scale': '1.1' } },
        ],
        motion: [
            { name: 'growing', vars: { '--gd-grow-ms': '1400ms' } },
            { name: 'quick growth', vars: { '--gd-grow-ms': '900ms' } },
        ],
    },
};
