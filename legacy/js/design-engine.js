/**
 * design-engine.js — mounts, switches and tears down designs.
 *
 * Selection lives in boot.js (it has to run before the body renders); this
 * module only consumes it. A design module exports:
 *   render(content, helpers) -> HTML string for #app
 *   init(root, ctx)          -> optional cleanup function
 *   cleanup()                -> optional, called on unmount
 *   navigate(id)             -> optional, called for #hash navigation
 *                               (e.g. the OS design opens the matching window)
 *
 * Designs with supportsGenerativeUI also get a variation (palette, layout,
 * type and motion presets from js/generative-ui.js): it is applied to <html>
 * before render, passed as render's third argument and as ctx.variation, and
 * the mounted layout is validated; a failing layout is remounted with the
 * design's original composition. Depth never loads the generative module.
 */

import { content } from './content.js';
import * as helpers from './render-helpers.js';
import { createContext, media } from './interactions.js';

const boot = window.PortfolioBoot;
const registry = window.PortfolioRegistry;
const root = document.documentElement;

let app;
let baselineHTML = '';
let current = null; // { design, mod, ctx, link }
let switching = false;
let gen = null; // generative-ui module, loaded on first use

const loadModule = (design) => import(new URL(design.module, import.meta.url).href);

async function loadGenerative(design) {
    if (!design.supportsGenerativeUI) return null;
    try {
        gen ??= await import('./generative-ui.js');
        return gen.supports(design.id) ? gen : null;
    } catch (err) {
        console.error('[portfolio] generative UI unavailable; using the original design', err);
        return null;
    }
}

/** Build this view's variation, or null (excluded design, or the engine failed). */
function makeVariation(design, g, { keep }) {
    if (!g) return null;
    try {
        return g.build(design.id, g.seedFor(design.id, { keep }));
    } catch (err) {
        console.error(`[portfolio] variation for "${design.id}" failed`, err);
        return null;
    }
}

function setThemeColor(color) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && color) meta.setAttribute('content', color);
}

function updateIndicator(design, variation) {
    const name = document.getElementById('design-name');
    const index = document.getElementById('design-index');
    if (name) name.textContent = design.name;
    if (index) {
        const i = registry.designs.findIndex((d) => d.id === design.id);
        index.textContent = `${i + 1}/${registry.designs.length}`;
    }
    const dock = document.querySelector('.design-dock');
    if (dock) dock.title = variation && gen ? `${design.description}\nThis visit: ${gen.describe(variation)}` : design.description;
}

function mount(design, mod, link, variation = null) {
    const ctx = createContext(design);
    // Designs that build UI after render (panels, terminals) read content from ctx.
    ctx.content = content;
    ctx.helpers = helpers;
    ctx.variation = variation;
    if (variation) gen.apply(variation);
    else gen?.clear();
    const html = mod.render(content, helpers, variation);
    root.setAttribute('data-design', design.id);
    if (!variation) setThemeColor(design.themeColor); // a variation sets its own; before init, so a design can refine it
    app.innerHTML = html;
    try {
        const teardown = mod.init?.(app, ctx);
        ctx.onCleanup(teardown);
    } catch (err) {
        ctx.dispose();
        throw err;
    }
    current = { design, mod, ctx, link, variation };
    updateIndicator(design, variation);
}

function unmount() {
    if (!current) return;
    current.ctx.dispose();
    try {
        current.mod.cleanup?.();
    } catch (err) {
        console.error('[portfolio] design cleanup failed', err);
    }
    gen?.clear(); // no variation tokens or data-v-* may leak into the next design
    current = null;
}

/**
 * After fonts settle, check the generated layout. If it fails, remount the
 * same palette with the design's original composition (curated presets
 * should never get here; this is the safety net). Then remember it.
 */
function settleVariation() {
    const v = current?.variation;
    if (!v) return;
    const problems = gen.validateLayout(app, content);
    if (problems.length && !v.fallback) {
        console.warn(`[portfolio] variation ${v.seed} layout rejected: ${problems.join('; ')}`);
        const { design, mod, link } = current;
        unmount();
        mount(design, mod, link, gen.withDefaultLayout(v));
    }
    gen.remember(v);
}

/** Scroll to (and let the design reveal) the element named by the URL hash. */
function goToHash({ smooth = false } = {}) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    current?.mod.navigate?.(id);
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: smooth && !media.reduce.matches ? 'smooth' : 'instant' });
}

/** Opacity-only crossfade for design swaps. Reduced motion keeps it short. */
function fade(el, direction) {
    if (!el.animate) return Promise.resolve();
    const reduce = media.reduce.matches;
    const keyframes = direction === 'out' ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }];
    const duration = reduce ? 120 : direction === 'out' ? 160 : 280;
    return el
        .animate(keyframes, { duration, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'none' })
        .finished.catch(() => {});
}

/** Mount a design by id with its stylesheet already applied; used for the default fallback. */
async function mountFresh(design) {
    const styles = boot.loadStylesheet(design, false);
    const [link, mod, g] = await Promise.all([styles.ready, loadModule(design), loadGenerative(design)]);
    mount(design, mod, link, makeVariation(design, g, { keep: false }));
    return link;
}

async function mountInitial() {
    const design = boot.initial;
    try {
        const [link, mod, g] = await Promise.all([boot.initialStyles.ready, loadModule(design), loadGenerative(design)]);
        mount(design, mod, link, makeVariation(design, g, { keep: boot.kept }));
        // Reveal with the design's own fonts in place, so text doesn't reflow (CLS).
        await boot.fontsSettled(design, 1000);
        settleVariation();
        return;
    } catch (err) {
        console.error(`[portfolio] design "${design.id}" failed, falling back`, err);
        boot.initialStyles.link.remove();
    }

    const fallback = boot.byId(registry.defaultId);
    try {
        if (!fallback || fallback.id === design.id) throw new Error('No usable fallback design');
        await mountFresh(fallback);
        settleVariation();
        boot.remember(fallback.id);
    } catch (err) {
        // Last resort: the semantic content that shipped in index.html.
        console.error('[portfolio] fallback design failed; showing static content', err);
        unmount();
        app.innerHTML = baselineHTML;
        root.setAttribute('data-design', 'static');
    }
}

/** Swap to a different design without reloading. */
async function surprise(button) {
    if (switching || !current) return;
    switching = true;
    button.setAttribute('aria-busy', 'true');

    const next = boot.pick(current.design.id);
    // Downloads under media="print" so it can't touch the current design yet.
    const styles = boot.loadStylesheet(next, true);
    try {
        const [link, mod, g] = await Promise.all([styles.ready, loadModule(next), loadGenerative(next)]);
        await fade(app, 'out');
        app.style.opacity = '0'; // stay hidden while the next design and its fonts settle
        const previousLink = current.link;
        unmount();
        previousLink?.remove();
        link.media = 'all';
        window.scrollTo({ top: 0, behavior: 'instant' });
        mount(next, mod, link, makeVariation(next, g, { keep: false }));
        boot.remember(next.id);
        await boot.fontsSettled(next, 600);
        settleVariation();
        app.style.opacity = '';

        // A refresh should randomise again, so drop ?design= and any #hash.
        const url = new URL(location.href);
        url.searchParams.delete('design');
        url.searchParams.delete('variation');
        url.hash = '';
        history.replaceState(null, '', url);

        await fade(app, 'in');
    } catch (err) {
        console.error(`[portfolio] could not switch to "${next.id}"`, err);
        styles.link.remove();
        app.style.opacity = '';
    } finally {
        switching = false;
        button.removeAttribute('aria-busy');
    }
}

export async function start() {
    app = document.getElementById('app');
    if (!boot || !registry || !app) return;
    baselineHTML = app.innerHTML;

    try {
        await mountInitial();
    } finally {
        boot.cancelFailsafe();
        root.classList.remove('is-design-loading');
    }

    // Announce later switches, not the initial render.
    document.getElementById('design-name')?.setAttribute('aria-live', 'polite');

    const button = document.getElementById('surprise-me');
    button?.addEventListener('click', () => surprise(button));

    window.addEventListener('hashchange', () => goToHash({ smooth: true }));
    if (location.hash) {
        // Wait a frame so layout (and web fonts that are already cached) settle first.
        requestAnimationFrame(() => goToHash());
    }

    // Test hook for automated browser checks; not part of the visible UI.
    window.__portfolio = {
        get current() {
            return current?.design.id ?? root.getAttribute('data-design');
        },
        designs: registry.designs.map((d) => d.id),
        get variation() {
            const v = current?.variation;
            return v ? { seed: v.seed, key: v.key, palette: v.palette, layout: v.layout, type: v.type.name, motion: v.motion.name, fallback: !!v.fallback } : null;
        },
    };
}
