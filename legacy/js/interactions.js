/**
 * interactions.js — shared behaviour that designs opt into.
 *
 * Everything registers its teardown on the design context (ctx), so switching
 * designs leaves no listeners, observers or animation frames behind.
 */

export const media = {
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)'),
    fine: window.matchMedia('(hover: hover) and (pointer: fine)'),
};

/**
 * Per-design lifetime. `signal` aborts every listener added with it;
 * `onCleanup` collects anything else (observers, timers, frames).
 */
export function createContext(design) {
    const controller = new AbortController();
    const cleanups = [];
    return {
        design,
        signal: controller.signal,
        get reducedMotion() {
            return media.reduce.matches;
        },
        get finePointer() {
            return media.fine.matches;
        },
        onCleanup(fn) {
            if (typeof fn === 'function') cleanups.push(fn);
        },
        dispose() {
            controller.abort();
            while (cleanups.length) {
                try {
                    cleanups.pop()();
                } catch (err) {
                    console.error('[portfolio] cleanup failed', err);
                }
            }
        },
    };
}

/**
 * One-shot reveal for [data-reveal] elements inside `root`.
 *
 * Content is only hidden once this runs (root gets .reveal-armed), so a
 * failure here can never leave content invisible. Elements already on screen
 * reveal immediately. Stagger comes from a --i custom property set in markup.
 */
export function revealOnScroll(root, ctx, { selector = '[data-reveal]', rootMargin = '0px 0px -8% 0px' } = {}) {
    const items = [...root.querySelectorAll(selector)];
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }
    root.classList.add('reveal-armed');
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        },
        { rootMargin }
    );
    items.forEach((el) => io.observe(el));
    ctx.onCleanup(() => {
        io.disconnect();
        root.classList.remove('reveal-armed');
    });
}

/**
 * Disclosure menu: a button that shows/hides a panel (mobile navigation).
 * Escape closes and returns focus; choosing a link or clicking outside closes;
 * crossing `closeAbove` (a media query) resets it.
 */
export function menuToggle(button, panel, ctx, { closeAbove } = {}) {
    if (!button || !panel) return () => {};
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';
    const setOpen = (open, { focusButton = false } = {}) => {
        button.setAttribute('aria-expanded', String(open));
        panel.classList.toggle('is-open', open);
        document.documentElement.classList.toggle('menu-open', open);
        if (!open && focusButton) button.focus();
    };
    const opts = { signal: ctx.signal };

    button.addEventListener('click', () => setOpen(!isOpen()), opts);
    panel.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    }, opts);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) setOpen(false, { focusButton: true });
    }, opts);
    document.addEventListener('pointerdown', (e) => {
        if (isOpen() && !panel.contains(e.target) && !button.contains(e.target)) setOpen(false);
    }, opts);
    if (closeAbove) {
        const mq = window.matchMedia(closeAbove);
        mq.addEventListener('change', (e) => e.matches && setOpen(false), opts);
    }
    ctx.onCleanup(() => document.documentElement.classList.remove('menu-open'));
    return setOpen;
}

/**
 * requestAnimationFrame loop that pauses when the tab is hidden and stops on
 * cleanup. `tick(dt)` returns false to stop (e.g. once motion has settled);
 * call the returned `wake()` to restart it.
 */
export function frameLoop(ctx, tick) {
    let id = 0;
    let last = 0;
    let running = false;
    const step = (now) => {
        const dt = last ? Math.min(now - last, 64) : 16;
        last = now;
        if (tick(dt) === false || document.hidden) {
            running = false;
            last = 0;
            return;
        }
        id = requestAnimationFrame(step);
    };
    const wake = () => {
        if (running || document.hidden) return;
        running = true;
        id = requestAnimationFrame(step);
    };
    document.addEventListener('visibilitychange', () => !document.hidden && wake(), { signal: ctx.signal });
    ctx.onCleanup(() => {
        cancelAnimationFrame(id);
        running = false;
    });
    return wake;
}

/** Highlight the nav link of the section currently in view (aria-current="true"). */
export function trackActiveSection(root, links, ctx, { rootMargin = '-45% 0px -50% 0px' } = {}) {
    if (!('IntersectionObserver' in window) || !links.length) return;
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                links.forEach((a) => a.removeAttribute('aria-current'));
                byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
            }
        },
        { rootMargin }
    );
    byId.forEach((_, id) => {
        const section = root.querySelector(`#${CSS.escape(id)}`);
        if (section) io.observe(section);
    });
    ctx.onCleanup(() => io.disconnect());
}
