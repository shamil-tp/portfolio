/**
 * Design 09 — Studio.
 * A playful independent studio: four colour blocks that each own a section,
 * big condensed grotesque type, serif italics for the editorial asides, and
 * project cards in three different layouts so the work never reads as a
 * template grid. Unlike the Brutalist design (hard edges, block shadows,
 * mono labels), everything here is soft-cornered, flat and tactile: cards
 * tilt toward the pointer, a "View" badge follows it, buttons squish.
 */
import { menuToggle, revealOnScroll, trackActiveSection, frameLoop } from '../interactions.js';

const TONES = ['tomato', 'cobalt', 'lilac', 'mint'];
// Layout rhythms for the work list (wide feature, two halves, one tall-with-side),
// chosen by the variation; each keeps the halves paired so rows always fill.
const RHYTHMS = {
    a: ['wide', 'half', 'half', 'side'],
    b: ['half', 'half', 'side', 'wide'],
    c: ['side', 'half', 'half', 'wide'],
};

export function render(c, h, variation) {
    const { person, contact } = c;
    const LAYOUTS = RHYTHMS[variation?.layout.rhythm] ?? RHYTHMS.a;
    const year = new Date().getFullYear();
    const nav = h.sections.map((s, i) => `<li><a href="#${s.id}" data-tone="${TONES[i % TONES.length]}">${h.esc(s.label)}</a></li>`).join('');

    const card = (p, i) => {
        const layout = LAYOUTS[i % LAYOUTS.length];
        const tone = TONES[i % TONES.length];
        return `
        <li class="st-card st-card--${layout}" data-tone="${tone}" data-reveal style="--i:${i % 2}">
            <article aria-labelledby="st-p-${p.slug}">
                <h3 class="st-card__name" id="st-p-${p.slug}"><a href="${h.esc(p.caseStudy)}" class="st-card__link">${h.esc(p.name)}</a></h3>
                <p class="st-card__meta"><em>${h.esc(p.kicker)}</em></p>
                <p class="st-card__summary">${h.esc(p.summary)}</p>
                <p class="st-card__stack">${p.stack.map((t) => `<span>${h.esc(t)}</span>`).join('')}</p>
                <p class="st-card__links">${h.projectLinksHTML(p, { cls: 'st-chip', decorate: (l) => h.icon(l.external ? 'arrow-up-right' : 'arrow-right') })}</p>
                <span class="st-card__badge" aria-hidden="true">View</span>
            </article>
        </li>`;
    };

    const skills = c.skills
        .map((g, i) => `<li class="st-skill" data-reveal style="--i:${i % 3}"><h3>${h.esc(g.group)}</h3><p>${g.items.map((s) => h.esc(s)).join('<span aria-hidden="true"> / </span>')}</p></li>`)
        .join('');

    const yearsOf = (e) => {
        const a = e.start.datetime?.slice(0, 4);
        const b = e.end.datetime?.slice(0, 4);
        return b && b !== a ? `${a}–${b.slice(2)}` : e.end.datetime ? a : `${a}–`;
    };

    const jobs = c.experience
        .map(
            (e) => `
        <li class="st-job" data-reveal>
            <p class="st-job__years" aria-hidden="true">${h.esc(yearsOf(e))}</p>
            <div>
                <h3>${h.esc(e.role)}</h3>
                <p class="st-job__meta"><em>${h.esc(e.org)}</em> · ${h.dateRange(e)}</p>
                <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
            </div>
        </li>`
        )
        .join('');

    return `
<div class="st">
    <header class="st-header">
        <a class="st-logo" href="#main">${h.esc(person.name)}</a>
        <button class="st-menu-btn" type="button" aria-expanded="false" aria-controls="st-nav">Menu</button>
        <nav class="st-nav" id="st-nav" aria-label="Primary"><ul>${nav}</ul></nav>
    </header>

    <main id="main" tabindex="-1">
        <section class="st-hero" aria-labelledby="hero-title">
            <h1 id="hero-title" class="st-hero__name">
                <span class="st-hero__first">${h.esc(person.firstName)}</span>
                <span class="st-hero__last">${h.esc(person.lastName)}<svg class="st-squiggle" viewBox="0 0 240 40" aria-hidden="true" focusable="false"><path d="M4 26 C 30 6, 50 38, 78 20 S 126 4, 150 22 S 206 36, 236 12"/></svg></span>
            </h1>
            <p class="st-hero__lede"><em>${h.esc(person.role)}, ${h.esc(person.focus.toLowerCase())}.</em> ${h.esc(person.tagline)}</p>
            <p class="st-hero__status"><span class="st-dot" aria-hidden="true"></span>${h.esc(person.status)} · ${h.esc(person.location)}</p>
            <p class="st-hero__actions">
                <a class="st-btn st-btn--ink" href="#projects">See the work</a>
                <a class="st-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a>
            </p>
        </section>

        <section id="projects" class="st-section st-work" aria-labelledby="projects-title">
            <header class="st-section__head">
                <h2 id="projects-title">Selected work</h2>
                <p><em>${c.projects.length} projects</em>, each with a case study: how it works, the stack, and exactly what I built.</p>
            </header>
            <ul class="st-cards">${c.projects.map(card).join('')}</ul>
            <p class="st-more"><a class="st-btn" href="${h.esc(c.caseStudiesHref)}">Every case study</a></p>
        </section>

        <section id="about" class="st-section st-block" data-tone="lilac" aria-labelledby="about-title">
            <div class="st-about">
                <figure class="st-about__photo" data-reveal>${h.portrait(person.portrait, { sizes: '(max-width: 768px) 70vw, 30vw' })}</figure>
                <div class="st-about__text" data-reveal style="--i:1">
                    <h2 id="about-title">About</h2>
                    ${person.about.map((p, i) => `<p${i === 0 ? ' class="st-about__lead"' : ''}>${h.esc(p)}</p>`).join('')}
                </div>
            </div>
        </section>

        <section id="skills" class="st-section st-block" data-tone="mint" aria-labelledby="skills-title">
            <header class="st-section__head"><h2 id="skills-title">Skills</h2></header>
            <ul class="st-skills">${skills}</ul>
        </section>

        <section id="experience" class="st-section" aria-labelledby="experience-title">
            <header class="st-section__head"><h2 id="experience-title">Experience</h2></header>
            <ol class="st-jobs">${jobs}</ol>
            <h3 class="st-subhead">Education</h3>
            <ul class="st-edu">${c.education.map((e) => `<li data-reveal><h4>${h.esc(e.title)}</h4><p><em>${h.esc(e.org)}</em></p>${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}</li>`).join('')}</ul>
            <h3 class="st-subhead">Hackathons &amp; events</h3>
            <ul class="st-edu">${c.achievements.map((e) => `<li data-reveal><h4>${h.esc(e.title)}</h4><p><em>${h.esc(e.org)}</em></p>${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}</li>`).join('')}</ul>
            <p class="st-more"><a class="st-btn st-btn--ink" href="${h.esc(c.achievementsHref)}">Achievements &amp; certificates</a> <a class="st-btn" href="${h.esc(c.aboutHref)}">Full profile</a></p>
        </section>

        <section id="contact" class="st-section st-block st-contact" data-tone="cobalt" aria-labelledby="contact-title">
            <h2 id="contact-title">Say hello</h2>
            <p class="st-contact__lead">${h.esc(contact.message)}</p>
            <a class="st-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
            <ul class="st-contact__list">
                <li><a class="st-chip" href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a></li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, inner: `${h.esc(s.label)} ${h.icon('arrow-up-right')}`, external: true, cls: 'st-chip' })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="st-footer">
        <p>© ${year} ${h.esc(person.name)} · <em>${h.esc(contact.location)}</em></p>
        <p><a href="#main">Back to top</a></p>
    </footer>
</div>`;
}

/** Cards lean toward the pointer and a "View" badge follows it (fine pointers only). */
function tactileCards(root, ctx) {
    const opts = { signal: ctx.signal };
    let active = null;
    let tx = 0, ty = 0, x = 0, y = 0, rx = 0, ry = 0, trx = 0, try_ = 0;
    const wake = frameLoop(ctx, (dt) => {
        if (!active) return false;
        const k = 1 - Math.pow(0.001, dt / 1000);
        x += (tx - x) * k;
        y += (ty - y) * k;
        rx += (trx - rx) * k;
        ry += (try_ - ry) * k;
        active.badge.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        active.el.style.transform = `rotate(${ry.toFixed(2)}deg) translate3d(0, ${rx.toFixed(2)}px, 0)`;
        return Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || Math.abs(trx - rx) > 0.01 || Math.abs(try_ - ry) > 0.01;
    });

    root.querySelectorAll('.st-card article').forEach((el) => {
        const badge = el.querySelector('.st-card__badge');
        el.addEventListener('pointerenter', (e) => {
            if (!ctx.finePointer || ctx.reducedMotion || e.pointerType !== 'mouse') return;
            const r = el.getBoundingClientRect();
            active = { el, badge, r };
            x = tx = e.clientX - r.left;
            y = ty = e.clientY - r.top;
            el.classList.add('is-hover');
            wake();
        }, opts);
        el.addEventListener('pointermove', (e) => {
            if (!active || active.el !== el) return;
            tx = e.clientX - active.r.left;
            ty = e.clientY - active.r.top;
            // Lean slightly toward the side the pointer is on.
            try_ = ((tx / active.r.width) - 0.5) * -1.6;
            trx = -4;
            // Hide the badge over links so it never hides what you're about to click.
            el.classList.toggle('is-over-link', !!e.target.closest('a:not(.st-card__link)'));
            wake();
        }, { ...opts, passive: true });
        el.addEventListener('pointerleave', () => {
            if (!active || active.el !== el) return;
            el.classList.remove('is-hover', 'is-over-link');
            el.style.transform = '';
            active = null;
            trx = try_ = rx = ry = 0;
        }, opts);
    });
}

export function init(root, ctx) {
    menuToggle(root.querySelector('.st-menu-btn'), root.querySelector('.st-nav'), ctx, { closeAbove: '(min-width: 861px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.st-nav a')], ctx);
    tactileCards(root, ctx);
}
