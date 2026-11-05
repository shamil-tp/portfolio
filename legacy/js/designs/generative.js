/**
 * Design F — Generative.
 * A seed picks the palette, the hero composition and a Truchet tile field;
 * every project gets a glyph derived from a hash of its slug, so the same
 * project always draws the same shape (colours follow the palette).
 * "Regenerate" draws a new seed: tiles turn to their new orientation and the
 * palette shifts, but layout and content stay put.
 *
 * With a generative-UI variation (the normal case), the variation owns the
 * palette (already set on <html>), the seed, the composition, the grid and
 * the tile size; "Regenerate" then re-turns the tiles only. The built-in
 * palettes remain as the fallback when the generative engine is unavailable.
 */
import { menuToggle, revealOnScroll, trackActiveSection } from '../interactions.js';
import { hash, prng } from '../render-helpers.js';
import { content } from '../content.js';

// Curated palettes: bg, ink, three accents. All inks reach ≥ 12:1 on their bg.
const PALETTES = [
    { name: 'Signal', bg: '#f4f1ea', ink: '#16161d', a: '#ff5b3a', b: '#2f5dff', c: '#ffc53d' },
    { name: 'Garden', bg: '#eef1ea', ink: '#10201a', a: '#1f8a5b', b: '#ff7a59', c: '#e8b931' },
    { name: 'Ultra', bg: '#f3eff7', ink: '#1a1426', a: '#7a3cff', b: '#ff3d7f', c: '#1fb5a8' },
    { name: 'Night', bg: '#14141b', ink: '#f2efe8', a: '#ffd166', b: '#ef476f', c: '#06d6a0' },
    { name: 'Clay', bg: '#f6eee2', ink: '#1d1b16', a: '#e4572e', b: '#17a3a0', c: '#f2b705' },
];

const COMPOSITIONS = ['left', 'right', 'stack'];
const TILE = 60; // the arc path is drawn for a 60-unit tile; other sizes scale it
const FIELD_W = 1440;
const FIELD_H = 780;

/** Seed from crypto when available; falls back to Math.random. */
function newSeed() {
    if (window.crypto?.getRandomValues) return window.crypto.getRandomValues(new Uint32Array(1))[0] % 100000;
    return Math.floor(Math.random() * 100000);
}

function paletteVars(p) {
    return `--g-bg:${p.bg};--g-ink:${p.ink};--g-a:${p.a};--g-b:${p.b};--g-c:${p.c}`;
}

/** Truchet field: each tile holds two quarter arcs, rotated 0° or 90°. */
function tileField(seed, size = TILE) {
    const rand = prng(seed);
    const cols = Math.ceil(FIELD_W / size);
    const rows = Math.ceil(FIELD_H / size);
    const scale = size === TILE ? '' : ` scale(${size / TILE})`;
    let out = '';
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const r = rand() < 0.5 ? 0 : 90;
            const tone = ['a', 'b', 'c', 'ink'][Math.floor(rand() * 4)];
            const delay = Math.round((x + y) * 18 + rand() * 80);
            out += `<g transform="translate(${x * size} ${y * size})${scale}"><path class="gn-arc" data-tone="${tone}" style="--r:${r}deg;--d:${delay}ms" d="M0 30 A30 30 0 0 0 30 0 M30 60 A30 30 0 0 1 60 30"/></g>`;
        }
    }
    return out;
}

/** 4×4 glyph for a project, from a hash of its slug. */
function glyph(slug, h) {
    const rand = prng(hash(slug));
    const shapes = [];
    const cell = 12;
    for (let i = 0; i < 6; i++) {
        const cx = Math.floor(rand() * 4) * cell + cell / 2;
        const cy = Math.floor(rand() * 4) * cell + cell / 2;
        const tone = ['a', 'b', 'c'][i % 3];
        const kind = Math.floor(rand() * 3);
        if (kind === 0) shapes.push(`<circle cx="${cx}" cy="${cy}" r="${cell * 0.45}" data-tone="${tone}"/>`);
        else if (kind === 1) shapes.push(`<rect x="${cx - cell / 2}" y="${cy - cell / 2}" width="${cell}" height="${cell}" data-tone="${tone}"/>`);
        else shapes.push(`<path d="M${cx - cell / 2} ${cy + cell / 2} A${cell} ${cell} 0 0 1 ${cx + cell / 2} ${cy - cell / 2} L${cx + cell / 2} ${cy + cell / 2}Z" data-tone="${tone}"/>`);
    }
    return `<svg class="gn-glyph" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${shapes.join('')}</svg>`;
}

/** Column span per project card (1 or 2 of 4), deterministic per slug. */
const spanFor = (slug, i) => (i === 0 || hash(slug) % 5 === 0 ? 2 : 1);

let currentSeed = newSeed();

/** What this mount draws: from the variation when there is one, else from the local seed. */
function settings(variation) {
    if (variation) {
        return {
            seed: variation.seed % 100000,
            palette: null, // tokens are already on <html>
            paletteName: variation.palette.name,
            composition: variation.layout.composition,
            grid: variation.layout.grid,
            tile: Number(variation.layout.tile) || TILE,
        };
    }
    const palette = PALETTES[currentSeed % PALETTES.length];
    return { seed: currentSeed, palette, paletteName: palette.name, composition: COMPOSITIONS[Math.floor(currentSeed / 7) % COMPOSITIONS.length], grid: 'four', tile: TILE };
}

export function render(c, h, variation) {
    const { person, contact } = c;
    const { seed, palette, paletteName, composition, grid, tile } = settings(variation);
    const year = new Date().getFullYear();

    const nav = h.sections.map((s, i) => `<li><a href="#${s.id}" style="--k:${i}">${h.esc(s.label)}</a></li>`).join('');

    const projects = c.projects
        .map(
            (p, i) => `
        <li class="gn-card gn-card--span${spanFor(p.slug, i)}" data-reveal style="--i:${i % 4}">
            <article aria-labelledby="gn-p-${p.slug}">
                ${glyph(p.slug, h)}
                <h3 class="gn-card__name" id="gn-p-${p.slug}"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                <p class="gn-card__kind">${h.esc(p.kicker)}</p>
                <p class="gn-card__summary">${h.esc(p.summary)}</p>
                <ul class="gn-tags" aria-label="Tech stack">${p.stack.map((t) => `<li>${h.esc(t)}</li>`).join('')}</ul>
                <p class="gn-card__links">${h.projectLinksHTML(p, { cls: 'gn-link', decorate: (l) => h.icon(l.external ? 'arrow-up-right' : 'arrow-right') })}</p>
            </article>
        </li>`
        )
        .join('');

    const skills = c.skills
        .map(
            (g, i) => `
        <div class="gn-skill" data-reveal style="--i:${i % 3}" data-tone="${['a', 'b', 'c'][i % 3]}">
            <h3>${h.esc(g.group)}</h3>
            <ul>${g.items.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul>
        </div>`
        )
        .join('');

    const jobs = c.experience
        .map(
            (e) => `
        <li class="gn-job" data-reveal>
            ${glyph(e.org, h)}
            <div>
                <p class="gn-job__date">${h.dateRange(e)}</p>
                <h3>${h.esc(e.role)}</h3>
                <p class="gn-job__org">${h.esc(e.org)}</p>
                <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
            </div>
        </li>`
        )
        .join('');

    const educationOf = (list) =>
        list
        .map(
            (e) => `
        <li class="gn-job" data-reveal>
            ${glyph(e.title, h)}
            <div>
                <p class="gn-job__date">${h.esc(e.org)}</p>
                <h3>${h.esc(e.title)}</h3>
                ${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}
            </div>
        </li>`
        )
        .join('');

    const education = educationOf(c.education);
    const events = educationOf(c.achievements);

    return `
<div class="gn"${palette ? ` style="${paletteVars(palette)}"` : ''} data-composition="${composition}" data-grid="${grid}">
    <header class="gn-header">
        <a class="gn-brand" href="#main">${h.esc(person.name)}</a>
        <p class="gn-seed"><span>Seed</span> <output id="gn-seed-value">${seed}</output> <span class="gn-seed__palette" id="gn-palette">${h.esc(paletteName)}</span></p>
        <button class="gn-menu-btn" type="button" aria-expanded="false" aria-controls="gn-nav">Menu</button>
        <nav class="gn-nav" id="gn-nav" aria-label="Primary"><ul>${nav}</ul></nav>
    </header>

    <main id="main" tabindex="-1">
        <section class="gn-hero" aria-labelledby="hero-title">
            <svg class="gn-field" viewBox="0 0 ${FIELD_W} ${FIELD_H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${tileField(seed, tile)}</svg>
            <div class="gn-hero__card">
                <h1 id="hero-title" class="gn-hero__name"><span>${h.esc(person.firstName)}</span> <span>${h.esc(person.lastName)}</span></h1>
                <p class="gn-hero__role">${h.esc(person.role)} · ${h.esc(person.focus)} · ${h.esc(person.location)}</p>
                <p class="gn-hero__tagline">${h.esc(person.tagline)}</p>
                <p class="gn-hero__actions">
                    <a class="gn-btn gn-btn--solid" href="#projects">See projects ${h.icon('arrow-right')}</a>
                    <a class="gn-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a>
                    <button class="gn-btn gn-regen" type="button">${h.icon('shuffle')} Regenerate pattern</button>
                </p>
            </div>
        </section>

        <section id="projects" class="gn-section" aria-labelledby="projects-title">
            <header class="gn-section__head">
                <h2 id="projects-title">Projects</h2>
                <p>Each glyph is generated from the project's name, so it is the same on every visit.</p>
            </header>
            <ul class="gn-grid">${projects}</ul>
            <p class="gn-more"><a class="gn-btn" href="${h.esc(c.caseStudiesHref)}">All case studies ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="about" class="gn-section gn-about" aria-labelledby="about-title">
            <figure class="gn-about__photo" data-reveal>
                ${h.portrait(person.portrait, { sizes: '(max-width: 768px) 70vw, 30vw' })}
            </figure>
            <div class="gn-about__text" data-reveal style="--i:1">
                <h2 id="about-title">About</h2>
                ${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}
            </div>
        </section>

        <section id="skills" class="gn-section" aria-labelledby="skills-title">
            <header class="gn-section__head"><h2 id="skills-title">Skills</h2></header>
            <div class="gn-skills">${skills}</div>
        </section>

        <section id="experience" class="gn-section" aria-labelledby="experience-title">
            <header class="gn-section__head"><h2 id="experience-title">Experience</h2></header>
            <ol class="gn-jobs">${jobs}</ol>
            <h3 class="gn-subhead">Education</h3>
            <ul class="gn-jobs">${education}</ul>
            <h3 class="gn-subhead">Hackathons &amp; events</h3>
            <ul class="gn-jobs">${events}</ul>
            <p class="gn-more"><a class="gn-btn" href="${h.esc(c.achievementsHref)}">Achievements &amp; certificates ${h.icon('arrow-right')}</a> <a class="gn-btn" href="${h.esc(c.aboutHref)}">Full profile ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="contact" class="gn-section gn-contact" aria-labelledby="contact-title">
            <h2 id="contact-title">Contact</h2>
            <p class="gn-contact__lead">${h.esc(contact.message)}</p>
            <a class="gn-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
            <ul class="gn-contact__list">
                <li><a class="gn-link" href="${h.esc(contact.phone.href)}">${h.icon('telephone')} ${h.esc(contact.phone.label)}</a></li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, inner: `${h.icon(s.id)} ${h.esc(s.label)}`, external: true, cls: 'gn-link' })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="gn-footer">
        <p>© ${year} ${h.esc(person.name)} · ${h.esc(contact.location)}</p>
        <p><a class="gn-link" href="#main">Back to top</a></p>
    </footer>
</div>`;
}

export function init(root, ctx) {
    const shell = root.querySelector('.gn');
    menuToggle(root.querySelector('.gn-menu-btn'), root.querySelector('.gn-nav'), ctx, { closeAbove: '(min-width: 861px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.gn-nav a')], ctx);

    // Authored moment: tiles turn into place. They start a quarter turn off.
    const arcs = [...root.querySelectorAll('.gn-arc')];
    if (!ctx.reducedMotion) {
        arcs.forEach((a) => a.style.setProperty('--from', `${parseInt(a.style.getPropertyValue('--r'), 10) + 90}deg`));
        shell.classList.add('is-turning');
        requestAnimationFrame(() => requestAnimationFrame(() => shell.classList.remove('is-turning')));
    }

    const variation = ctx.variation;
    root.querySelector('.gn-regen').addEventListener('click', () => {
        currentSeed = newSeed();
        const seed = currentSeed;
        const palette = PALETTES[seed % PALETTES.length];
        const rand = prng(seed);
        arcs.forEach((a) => {
            const r = rand() < 0.5 ? 0 : 90;
            // Keep turning forward instead of snapping back.
            const prev = parseInt(a.style.getPropertyValue('--r'), 10);
            const next = prev + ((r - prev) % 180 === 0 ? 180 : 90);
            a.style.setProperty('--r', `${next}deg`);
            a.dataset.tone = ['a', 'b', 'c', 'ink'][Math.floor(rand() * 4)];
            rand();
        });
        root.querySelector('#gn-seed-value').textContent = String(seed);
        // The visit's variation keeps its palette and composition; only the pattern turns.
        if (variation) return;
        shell.setAttribute('style', paletteVars(palette));
        shell.dataset.composition = COMPOSITIONS[Math.floor(seed / 7) % COMPOSITIONS.length];
        root.querySelector('#gn-palette').textContent = palette.name;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.bg);
    }, { signal: ctx.signal });

    if (!variation) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PALETTES[currentSeed % PALETTES.length].bg);
}

/** A new seed for the next time this design is mounted. */
export function cleanup() {
    currentSeed = newSeed();
}

/**
 * Case-study pages: the same seeded system, applied to static content.
 * The palette goes on <html>, a tile band is drawn behind the page header,
 * and each project's glyph (same slug, so the same shape as on the homepage)
 * replaces its icon. Everything added here is removed on cleanup.
 */
export function enhanceCase(ctx) {
    const root = document.documentElement;
    const variation = ctx.variation;
    const seed = variation ? variation.seed % 100000 : currentSeed;
    const tile = variation ? Number(variation.layout.tile) || TILE : TILE;
    const added = [];
    // Without a variation, the design's own seeded palette goes on <html>.
    const palette = PALETTES[seed % PALETTES.length];
    const vars = variation ? {} : { '--g-bg': palette.bg, '--g-ink': palette.ink, '--g-a': palette.a, '--g-b': palette.b, '--g-c': palette.c };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    if (!variation) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.bg);

    // Same project -> same glyph as the homepage: resolve file name to content slug.
    const slugFor = (href) => {
        const file = href.split('/').pop();
        return content.projects.find((p) => p.caseStudy.endsWith(`/${file}`))?.slug ?? file.replace(/\.html$/, '');
    };

    const header = document.querySelector('.project-header, .page-header');
    if (header) {
        const field = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        field.setAttribute('class', 'gn-case-field');
        field.setAttribute('viewBox', `0 0 ${FIELD_W} ${FIELD_H}`);
        field.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        field.setAttribute('aria-hidden', 'true');
        field.innerHTML = tileField(seed, tile);
        header.prepend(field);
        added.push(field);

        if (!ctx.reducedMotion) {
            field.querySelectorAll('.gn-arc').forEach((a) => a.style.setProperty('--from', `${parseInt(a.style.getPropertyValue('--r'), 10) + 90}deg`));
            root.classList.add('gn-turning');
            requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('gn-turning')));
        }
    }

    const icon = document.querySelector('.header-icon');
    if (icon) {
        icon.insertAdjacentHTML('beforeend', glyph(slugFor(location.pathname)));
        added.push(icon.lastElementChild);
    }

    document.querySelectorAll('.project-card .card-icon').forEach((el) => {
        el.insertAdjacentHTML('beforeend', glyph(slugFor(el.closest('a').getAttribute('href'))));
        added.push(el.lastElementChild);
    });

    return () => {
        added.forEach((node) => node.remove());
        Object.keys(vars).forEach((k) => root.style.removeProperty(k));
        root.classList.remove('gn-turning');
        currentSeed = newSeed();
    };
}
