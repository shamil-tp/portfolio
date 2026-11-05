/**
 * boot.js — picks this page load's design before the body renders.
 *
 * Classic script, loaded synchronously in <head> right after
 * design-registry.js. It:
 *   1. chooses a design:
 *        - ?design=<id> always wins (test hook);
 *        - following a link within the site (or Back/Forward) keeps the
 *          visitor's current design, so the site feels like one place;
 *        - a refresh, or arriving from outside, picks a random design that
 *          is not the one shown last in this tab;
 *   2. sets <html data-design> and starts loading that design's stylesheet
 *      (the homepage or case-study variant, from <html data-page>) and fonts,
 *   3. hides the page (via .is-design-loading) until the engine is ready, so
 *      visitors never see the wrong design flash.
 *
 * Registry paths are relative to the site root, which is derived from this
 * script's own URL, so pages in sub-folders (myProjectDetails/) resolve them
 * correctly and the site works under a GitHub Pages project path.
 *
 * The selection helpers are exposed on window.PortfolioBoot for the engine's
 * "Surprise me" control.
 */
(function () {
    'use strict';

    var registry = window.PortfolioRegistry;
    var root = document.documentElement;
    var isCase = root.getAttribute('data-page') === 'case';
    // js/boot.js -> site root
    var siteRoot = new URL('../', document.currentScript ? document.currentScript.src : window.location.href);
    var STORAGE_KEY = 'portfolio:lastDesign';
    // If the engine never finishes (blocked module, very old browser), show the
    // static fallback content instead of a blank page.
    var FAILSAFE_MS = 4000;

    if (!registry || !registry.designs || !registry.designs.length) return;

    function byId(id) {
        for (var i = 0; i < registry.designs.length; i++) {
            if (registry.designs[i].id === id) return registry.designs[i];
        }
        return null;
    }

    function readLast() {
        try { return window.sessionStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function remember(id) {
        try { window.sessionStorage.setItem(STORAGE_KEY, id); } catch (e) { /* storage blocked: repeats become possible, nothing breaks */ }
    }

    // Uniform integer in [0, max). crypto when available, Math.random otherwise.
    // This is variety, not security.
    function randomIndex(max) {
        if (window.crypto && window.crypto.getRandomValues) {
            var buf = new Uint32Array(1);
            var limit = Math.floor(0x100000000 / max) * max; // reject the biased tail
            do { window.crypto.getRandomValues(buf); } while (buf[0] >= limit);
            return buf[0] % max;
        }
        return Math.floor(Math.random() * max);
    }

    // Random design that is not `excludeId` (when there is more than one).
    function pick(excludeId) {
        var pool = registry.designs.filter(function (d) { return d.id !== excludeId; });
        if (!pool.length) pool = registry.designs;
        return pool[randomIndex(pool.length)];
    }

    function navigationType() {
        try {
            var entry = window.performance.getEntriesByType('navigation')[0];
            if (entry) return entry.type; // navigate | reload | back_forward | prerender
        } catch (e) { /* fall through */ }
        return 'navigate';
    }

    function cameFromThisSite() {
        try { return !!document.referrer && new URL(document.referrer).origin === window.location.origin; } catch (e) { return false; }
    }

    /** Keep the current design when moving between pages of this site; re-roll on refresh. */
    function shouldKeep(last) {
        if (!last || !byId(last)) return false;
        var type = navigationType();
        if (type === 'reload') return false;
        if (type === 'back_forward') return true;
        return cameFromThisSite();
    }

    function requested() {
        try {
            var id = new URLSearchParams(window.location.search).get('design');
            return id ? byId(id) : null;
        } catch (e) {
            return null;
        }
    }

    // Font stylesheets are cached after first use, so they are added once and
    // never removed; only the design stylesheet is swapped. The promise lets the
    // engine wait for a design's fonts before revealing it (no layout shift).
    var fontLoads = {};
    function ensureFonts(design) {
        if (!design.fonts) return Promise.resolve();
        if (fontLoads[design.id]) return fontLoads[design.id];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = design.fonts;
        link.setAttribute('data-fonts', design.id);
        fontLoads[design.id] = new Promise(function (resolve) {
            link.addEventListener('load', resolve, { once: true });
            link.addEventListener('error', resolve, { once: true }); // fall back to system fonts
        });
        document.head.appendChild(link);
        return fontLoads[design.id];
    }

    /** Resolve once the design's web fonts are usable, or after `capMs`, whichever is first. */
    function fontsSettled(design, capMs) {
        var settled = ensureFonts(design).then(function () {
            return document.fonts && document.fonts.ready ? document.fonts.ready : null;
        });
        var cap = new Promise(function (resolve) { window.setTimeout(resolve, capMs); });
        return Promise.race([settled, cap]);
    }

    /**
     * Start loading a design stylesheet. With `inactive`, it downloads under
     * media="print" (fetched, but not applied) so it can't restyle the current
     * design before the engine swaps it in.
     */
    function loadStylesheet(design, inactive) {
        ensureFonts(design);
        var path = isCase ? design.caseStylesheet : design.stylesheet;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = new URL(path, siteRoot).href;
        link.setAttribute('data-design-css', design.id);
        if (inactive) link.media = 'print';
        var ready = new Promise(function (resolve, reject) {
            link.addEventListener('load', function () { resolve(link); }, { once: true });
            link.addEventListener('error', function () { reject(new Error('Stylesheet failed: ' + path)); }, { once: true });
        });
        // The engine awaits `ready` later; mark it handled now so an early
        // failure isn't reported as an unhandled rejection before then.
        ready.catch(function () {});
        document.head.appendChild(link);
        return { link: link, ready: ready };
    }

    var last = readLast();
    var kept = !requested() && shouldKeep(last);
    var initial = requested() || (kept ? byId(last) : pick(last));
    remember(initial.id);

    root.setAttribute('data-design', initial.id);
    root.classList.add('js', 'is-design-loading');

    var initialStyles = loadStylesheet(initial, false);

    var failsafe = window.setTimeout(function () {
        root.classList.remove('is-design-loading');
    }, FAILSAFE_MS);

    window.PortfolioBoot = {
        initial: initial,
        // true when the visitor followed a link inside the site: the visit's
        // design and generated variation are kept rather than re-rolled.
        kept: kept,
        isCase: isCase,
        siteRoot: siteRoot.href,
        initialStyles: initialStyles,
        byId: byId,
        pick: pick,
        remember: remember,
        loadStylesheet: loadStylesheet,
        fontsSettled: fontsSettled,
        cancelFailsafe: function () { window.clearTimeout(failsafe); },
    };
})();
