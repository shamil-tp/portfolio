/**
 * case-main.js — design engine for case-study pages (myProjectDetails/).
 *
 * Case studies keep their content as static, crawlable HTML. A design only
 * restyles it (css/case-<design>.css) and may add a light enhancement through
 * the design module's optional enhanceCase(ctx, helpers), e.g. the generative
 * design's seeded header band. "Surprise me" swaps both without a reload.
 *
 * Designs with supportsGenerativeUI carry this visit's palette, type and
 * motion over from the homepage (same seed, kept in sessionStorage); the
 * homepage's layout options don't apply to a case study, so only tokens are
 * set (apply with layout: false).
 */
import * as helpers from './render-helpers.js';
import { createContext, media } from './interactions.js';

const boot = window.PortfolioBoot;
const registry = window.PortfolioRegistry;
const root = document.documentElement;

let current = null; // { design, mod, ctx, link }
let switching = false;
let gen = null;

const loadModule = (design) => import(new URL(design.module, import.meta.url).href);

/** This view's variation for `design`, applied to <html>; null for Depth or on failure. */
async function applyVariation(design, { keep }) {
    gen?.clear();
    if (!design.supportsGenerativeUI) return null;
    try {
        gen ??= await import('./generative-ui.js');
        if (!gen.supports(design.id)) return null;
        const variation = gen.build(design.id, gen.seedFor(design.id, { keep }));
        gen.apply(variation, { layout: false });
        gen.remember(variation);
        return variation;
    } catch (err) {
        console.error(`[portfolio] variation for "${design.id}" failed`, err);
        gen?.clear();
        return null;
    }
}

function setThemeColor(color) {
    if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

function updateIndicator(design) {
    const name = document.getElementById('design-name');
    const index = document.getElementById('design-index');
    if (name) name.textContent = design.name;
    if (index) index.textContent = `${registry.designs.findIndex((d) => d.id === design.id) + 1}/${registry.designs.length}`;
    const dock = document.querySelector('.design-dock');
    if (dock) dock.title = design.description;
}

function activate(design, mod, link, variation = null) {
    const ctx = createContext(design);
    ctx.variation = variation;
    root.setAttribute('data-design', design.id);
    if (!variation) setThemeColor(design.themeColor);
    try {
        ctx.onCleanup(mod?.enhanceCase?.(ctx, helpers));
    } catch (err) {
        // Enhancements are optional; the restyled page is already complete.
        console.error(`[portfolio] case enhancement for "${design.id}" failed`, err);
    }
    current = { design, mod, ctx, link };
    updateIndicator(design);
}

function deactivate() {
    if (!current) return;
    current.ctx.dispose();
    current = null;
}

function fade(direction) {
    const el = document.body;
    if (!el.animate) return Promise.resolve();
    const reduce = media.reduce.matches;
    const frames = direction === 'out' ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }];
    return el.animate(frames, { duration: reduce ? 120 : direction === 'out' ? 160 : 280, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).finished.catch(() => {});
}

async function start() {
    if (!boot || !registry) return;
    let design = boot.initial;
    try {
        const [link, variation] = await Promise.all([boot.initialStyles.ready, applyVariation(design, { keep: boot.kept })]);
        activate(design, await loadModule(design).catch(() => null), link, variation);
        await boot.fontsSettled(design, 1000);
    } catch (err) {
        console.error(`[portfolio] case design "${design.id}" failed, falling back`, err);
        boot.initialStyles.link.remove();
        design = boot.byId(registry.defaultId);
        try {
            const styles = boot.loadStylesheet(design, false);
            const [link, variation] = await Promise.all([styles.ready, applyVariation(design, { keep: false })]);
            activate(design, await loadModule(design).catch(() => null), link, variation);
            boot.remember(design.id);
        } catch (fallbackErr) {
            // case-base.css alone still gives a complete, readable page.
            console.error('[portfolio] fallback case design failed', fallbackErr);
            root.setAttribute('data-design', 'static');
        }
    } finally {
        boot.cancelFailsafe();
        root.classList.remove('is-design-loading');
    }

    document.getElementById('design-name')?.setAttribute('aria-live', 'polite');
    const button = document.getElementById('surprise-me');
    button?.addEventListener('click', () => surprise(button));
}

async function surprise(button) {
    if (switching || !current) return;
    switching = true;
    button.setAttribute('aria-busy', 'true');
    const next = boot.pick(current.design.id);
    const styles = boot.loadStylesheet(next, true);
    try {
        const [link, mod] = await Promise.all([styles.ready, loadModule(next).catch(() => null)]);
        await fade('out');
        const previous = current.link;
        deactivate();
        previous?.remove();
        const variation = await applyVariation(next, { keep: false });
        link.media = 'all';
        window.scrollTo({ top: 0, behavior: 'instant' });
        activate(next, mod, link, variation);
        boot.remember(next.id);
        const url = new URL(location.href);
        url.searchParams.delete('design');
        url.searchParams.delete('variation');
        history.replaceState(null, '', url);
        await fade('in');
    } catch (err) {
        console.error(`[portfolio] could not switch to "${next.id}"`, err);
        styles.link.remove();
    } finally {
        switching = false;
        button.removeAttribute('aria-busy');
    }
}

start().catch((err) => {
    console.error('[portfolio] case engine failed to start', err);
    root.classList.remove('is-design-loading');
});

// Test hook, mirrors the homepage one.
window.__portfolio = {
    get current() {
        return current?.design.id ?? root.getAttribute('data-design');
    },
    designs: registry?.designs.map((d) => d.id) ?? [],
};
