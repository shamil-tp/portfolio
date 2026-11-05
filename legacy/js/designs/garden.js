/**
 * Design 10 — Garden.
 * A calm, botanical portfolio. Its generative rule is stated on the page:
 * every project grows a plant whose shape comes from its name (stable from
 * visit to visit) with one stem per technology in its stack; skill beds grow
 * one stem per skill. The hero garden is seeded per visit and can be
 * regrown. Plants draw in once, sway on hover, and lean toward the pointer in
 * the hero. With reduced motion they are simply drawn, still.
 *
 * This is deliberately unlike the Generative design: organic curves and
 * negative space instead of tiles, a botanical palette instead of a graphic
 * one, and content on herbarium-style labels.
 */
import { menuToggle, revealOnScroll, trackActiveSection, frameLoop } from '../interactions.js';
import { hash, prng } from '../render-helpers.js';

const LEAF_TONES = ['var(--gd-sage)', 'var(--gd-olive)', 'var(--gd-fern)', 'var(--gd-clay)'];

/**
 * One plant as SVG markup, anchored at (x, ground).
 * stems: number of stems; height: max stem height; seed: shape.
 */
function plant({ seed, stems, height, x, ground, flower = true, delay = 0 }) {
    const rand = prng(seed);
    const n = Math.max(1, stems);
    const spread = 9 + rand() * 7; // degrees between stems
    let out = '';
    for (let i = 0; i < n; i++) {
        const angle = ((i - (n - 1) / 2) * spread + (rand() - 0.5) * 6) * (Math.PI / 180);
        const len = height * (0.62 + rand() * 0.38);
        const bend = (rand() - 0.5) * len * 0.35;
        const ex = x + Math.sin(angle) * len + bend * 0.3;
        const ey = ground - Math.cos(angle) * len;
        const c1x = x + Math.sin(angle) * len * 0.15 + bend;
        const c1y = ground - len * 0.4;
        const c2x = x + Math.sin(angle) * len * 0.7 - bend * 0.4;
        const c2y = ground - len * 0.78;
        const d = `M${x.toFixed(1)} ${ground.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
        const t0 = delay + i * 70;
        out += `<path class="gd-stem" d="${d}" pathLength="1" style="--d:${t0}ms"/>`;

        // Leaves along the stem, alternating sides.
        const leaves = 2 + Math.floor(rand() * 3);
        for (let k = 0; k < leaves; k++) {
            const t = 0.3 + (k / leaves) * 0.55 + rand() * 0.05;
            const mt = 1 - t;
            const px = mt ** 3 * x + 3 * mt ** 2 * t * c1x + 3 * mt * t ** 2 * c2x + t ** 3 * ex;
            const py = mt ** 3 * ground + 3 * mt ** 2 * t * c1y + 3 * mt * t ** 2 * c2y + t ** 3 * ey;
            const side = k % 2 ? 1 : -1;
            const rot = (angle * 180) / Math.PI + side * (38 + rand() * 22);
            const ll = 9 + rand() * 9 + height * 0.04;
            const lw = ll * (0.32 + rand() * 0.18);
            const tone = LEAF_TONES[Math.floor(rand() * 3)];
            out += `<path class="gd-leaf" d="M0 0 Q${lw.toFixed(1)} ${(-ll / 2).toFixed(1)} 0 ${(-ll).toFixed(1)} Q${(-lw).toFixed(1)} ${(-ll / 2).toFixed(1)} 0 0Z" transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${rot.toFixed(1)})" style="--d:${t0 + 300 + k * 60}ms;fill:${tone}"/>`;
        }
        // A bud or a small flower at some tips.
        if (flower && rand() > 0.45) {
            const r = 2.5 + rand() * 2.5;
            out += `<circle class="gd-bud" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${r.toFixed(1)}" style="--d:${t0 + 600}ms"/>`;
        }
    }
    return `<g class="gd-sway" style="transform-origin:${x.toFixed(1)}px ${ground.toFixed(1)}px">${out}</g>`;
}

/** The hero bed: `count` plants on evenly spaced plots (the variation's density). */
function heroGarden(seed, count = 5) {
    const rand = prng(seed);
    const W = 600;
    const ground = 380;
    const plots = Array.from({ length: count }, (_, i) => Math.round((W * (i + 0.5)) / count));
    const plants = plots
        .map((x, i) => plant({ seed: Math.floor(rand() * 1e9), stems: 2 + Math.floor(rand() * 4), height: 150 + rand() * 170, x: x + (rand() - 0.5) * 40, ground, delay: i * 120 }))
        .join('');
    return `<svg class="gd-garden" viewBox="0 0 ${W} 400" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <path class="gd-ground" d="M0 ${ground} Q${W * 0.3} ${ground - 14} ${W * 0.55} ${ground - 4} T${W} ${ground - 10} V400 H0Z"/>
        ${plants}
    </svg>`;
}

function newSeed() {
    return window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 1e9);
}

export function render(c, h, variation) {
    const { person, contact } = c;
    // The first bed is seeded by the visit's variation, so it is stable within a visit.
    const density = Number(variation?.layout.density) || 5;
    const bedSeed = variation ? variation.seed : newSeed();
    const year = new Date().getFullYear();
    const nav = h.sections.map((s) => `<li><a href="#${s.id}">${h.esc(s.label)}</a></li>`).join('');

    const specimens = c.projects
        .map(
            (p, i) => `
        <li class="gd-specimen" data-reveal style="--i:${i % 3}">
            <article aria-labelledby="gd-p-${p.slug}">
                <svg class="gd-specimen__plant" viewBox="0 0 200 220" aria-hidden="true" focusable="false">${plant({ seed: hash(p.slug), stems: p.stack.length, height: 150, x: 100, ground: 214 })}</svg>
                <div class="gd-label">
                    <h3 class="gd-label__name" id="gd-p-${p.slug}"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                    <p class="gd-label__kind">${h.esc(p.kicker)}</p>
                    <p class="gd-label__summary">${h.esc(p.summary)}</p>
                    <p class="gd-label__stack"><span>${p.stack.length} ${p.stack.length === 1 ? 'stem' : 'stems'}:</span> ${p.stack.map((t) => h.esc(t)).join(' · ')}</p>
                    <p class="gd-label__links">${h.projectLinksHTML(p, { cls: 'gd-link', decorate: (l) => h.icon(l.external ? 'arrow-up-right' : 'arrow-right') })}</p>
                </div>
            </article>
        </li>`
        )
        .join('');

    const beds = c.skills
        .map(
            (g, i) => `
        <li class="gd-bed" data-reveal style="--i:${i % 3}">
            <svg class="gd-bed__plant" viewBox="0 0 120 110" aria-hidden="true" focusable="false">${plant({ seed: hash(g.group), stems: g.items.length, height: 80, x: 60, ground: 106, flower: false })}</svg>
            <div>
                <h3>${h.esc(g.group)}</h3>
                <p>${g.items.map((s) => h.esc(s)).join(', ')}</p>
            </div>
        </li>`
        )
        .join('');

    const ring = (k) => `<svg class="gd-ring" viewBox="0 0 40 40" aria-hidden="true" focusable="false">${Array.from({ length: k }, (_, r) => `<circle cx="20" cy="20" r="${18 - r * 4}"/>`).join('')}</svg>`;

    return `
<div class="gd">
    <header class="gd-header">
        <a class="gd-brand" href="#main">${h.esc(person.name)}</a>
        <button class="gd-menu-btn" type="button" aria-expanded="false" aria-controls="gd-nav">Menu</button>
        <nav class="gd-nav" id="gd-nav" aria-label="Primary"><ul>${nav}</ul></nav>
    </header>

    <main id="main" tabindex="-1">
        <section class="gd-hero" aria-labelledby="hero-title">
            <div class="gd-hero__text">
                <h1 id="hero-title" class="gd-hero__name">${h.esc(person.name)}</h1>
                <p class="gd-hero__role">${h.esc(person.role)} · ${h.esc(person.focus)}</p>
                <p class="gd-hero__tagline">${h.esc(person.tagline)}</p>
                <p class="gd-hero__actions">
                    <a class="gd-btn gd-btn--moss" href="#projects">Walk the garden</a>
                    <a class="gd-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a>
                </p>
            </div>
            <figure class="gd-hero__garden">
                <div class="gd-hero__bed">${heroGarden(bedSeed, density)}</div>
                <figcaption>
                    <span>Every project below grows its own plant: the shape comes from its name, one stem per technology.</span>
                    <button type="button" class="gd-regrow">Regrow this bed</button>
                </figcaption>
            </figure>
        </section>

        <section id="projects" class="gd-section" aria-labelledby="projects-title">
            <header class="gd-section__head">
                <h2 id="projects-title">Projects</h2>
                <p>${c.projects.length} specimens, each pressed with its label: what it is, what it's built from, and where to read more.</p>
            </header>
            <ul class="gd-specimens">${specimens}</ul>
            <p class="gd-more"><a class="gd-btn" href="${h.esc(c.caseStudiesHref)}">All case studies</a></p>
        </section>

        <section id="about" class="gd-section gd-about" aria-labelledby="about-title">
            <figure class="gd-about__photo" data-reveal>${h.portrait(person.portrait, { sizes: '(max-width: 768px) 70vw, 30vw' })}</figure>
            <div class="gd-about__text" data-reveal style="--i:1">
                <h2 id="about-title">About</h2>
                ${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}
            </div>
        </section>

        <section id="skills" class="gd-section" aria-labelledby="skills-title">
            <header class="gd-section__head">
                <h2 id="skills-title">Skills</h2>
                <p>Six beds. Each grows one stem per skill.</p>
            </header>
            <ul class="gd-beds">${beds}</ul>
        </section>

        <section id="experience" class="gd-section" aria-labelledby="experience-title">
            <header class="gd-section__head"><h2 id="experience-title">Experience</h2></header>
            <ol class="gd-rings">
                ${c.experience
                    .map(
                        (e, i) => `
                    <li class="gd-season" data-reveal>
                        ${ring(c.experience.length - i + 1)}
                        <div>
                            <p class="gd-season__date">${h.dateRange(e)}</p>
                            <h3>${h.esc(e.role)}</h3>
                            <p class="gd-season__org">${h.esc(e.org)}</p>
                            <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
                        </div>
                    </li>`
                    )
                    .join('')}
                ${c.education
                    .map(
                        (e) => `
                    <li class="gd-season gd-season--edu" data-reveal>
                        ${ring(1)}
                        <div>
                            <p class="gd-season__date">Education</p>
                            <h3>${h.esc(e.title)}</h3>
                            <p class="gd-season__org">${h.esc(e.org)}</p>
                            <ul>${e.meta.map((m) => `<li>${h.esc(m)}</li>`).join('')}</ul>
                        </div>
                    </li>`
                    )
                    .join('')}
                ${c.achievements
                    .map(
                        (e) => `
                    <li class="gd-season gd-season--edu" data-reveal>
                        ${ring(1)}
                        <div>
                            <p class="gd-season__date">${h.esc(e.date.label)}</p>
                            <h3>${h.esc(e.title)}</h3>
                            <p class="gd-season__org">${h.esc(e.org)}</p>
                            <ul><li>${h.esc(e.meta[1])}</li></ul>
                        </div>
                    </li>`
                    )
                    .join('')}
            </ol>
            <p class="gd-more"><a class="gd-btn" href="${h.esc(c.achievementsHref)}">Achievements &amp; certificates</a> <a class="gd-btn" href="${h.esc(c.aboutHref)}">Full profile</a></p>
        </section>

        <section id="contact" class="gd-section gd-contact" aria-labelledby="contact-title">
            <h2 id="contact-title">Get in touch</h2>
            <p class="gd-contact__lead">${h.esc(contact.message)}</p>
            <a class="gd-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
            <ul class="gd-contact__list">
                <li><a class="gd-link" href="${h.esc(contact.phone.href)}">${h.icon('telephone')} ${h.esc(contact.phone.label)}</a></li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, inner: `${h.icon(s.id)} ${h.esc(s.label)}`, external: true, cls: 'gd-link' })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="gd-footer">
        <p>© ${year} ${h.esc(person.name)} · ${h.esc(contact.location)}</p>
        <p><a class="gd-link" href="#main">Back to top</a></p>
    </footer>
</div>`;
}

/** Hero plants lean toward the pointer (eased, only while it moves). */
function leanToPointer(root, ctx) {
    const bed = root.querySelector('.gd-hero__bed');
    const hero = root.querySelector('.gd-hero');
    let plants = [...bed.querySelectorAll('.gd-sway')];
    let target = 0;
    let current = 0;
    const wake = frameLoop(ctx, (dt) => {
        current += (target - current) * (1 - Math.pow(0.004, dt / 1000));
        plants.forEach((p, i) => (p.style.transform = `rotate(${(current * (0.6 + (i % 3) * 0.25)).toFixed(2)}deg)`));
        return Math.abs(target - current) > 0.01;
    });
    hero.addEventListener('pointermove', (e) => {
        if (!ctx.finePointer || ctx.reducedMotion) return;
        const r = bed.getBoundingClientRect();
        target = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))) * 4;
        wake();
    }, { signal: ctx.signal, passive: true });
    hero.addEventListener('pointerleave', () => {
        target = 0;
        wake();
    }, { signal: ctx.signal });
    return () => (plants = [...bed.querySelectorAll('.gd-sway')]);
}

export function init(root, ctx) {
    menuToggle(root.querySelector('.gd-menu-btn'), root.querySelector('.gd-nav'), ctx, { closeAbove: '(min-width: 861px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.gd-nav a')], ctx);
    const refreshPlants = leanToPointer(root, ctx);

    root.querySelector('.gd-regrow').addEventListener('click', () => {
        const bed = root.querySelector('.gd-hero__bed');
        bed.innerHTML = heroGarden(newSeed(), Number(ctx.variation?.layout.density) || 5);
        refreshPlants();
    }, { signal: ctx.signal });
}
