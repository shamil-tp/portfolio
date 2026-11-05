/**
 * Design B — Brutalist.
 * Colour-blocked sections, 3px borders, offset block shadows, an endless
 * skills ticker and an asymmetric project wall. Motion is blunt: things snap
 * up toward their shadow on hover and slam down when pressed.
 */
import { menuToggle, revealOnScroll } from '../interactions.js';

const CARD_TONES = ['white', 'pink', 'yellow', 'white', 'cyan', 'white'];

export function render(c, h) {
    const { person, contact } = c;
    const year = new Date().getFullYear();
    const tickerItems = c.skills.flatMap((g) => g.items);
    const ticker = tickerItems.map((t) => `<li>${h.esc(t)}</li>`).join('');

    const nav = h.sections.map((s) => `<li><a href="#${s.id}">${h.esc(s.label)}</a></li>`).join('');

    const projects = c.projects
        .map(
            (p, i) => `
        <li class="br-card-wrap br-card-wrap--${i % 4}" data-reveal style="--i:${i % 2}">
            <article class="br-card br-card--${CARD_TONES[i % CARD_TONES.length]}" aria-labelledby="br-p-${p.slug}">
                <h3 class="br-card__name" id="br-p-${p.slug}"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                <p class="br-card__kind">${h.esc(p.kicker)}</p>
                <p class="br-card__summary">${h.esc(p.summary)}</p>
                <ul class="br-tags" aria-label="Tech stack">${p.stack.map((t) => `<li>${h.esc(t)}</li>`).join('')}</ul>
                <p class="br-card__links">${h.projectLinksHTML(p, { cls: 'br-btn br-btn--small', decorate: (l) => (l.external ? h.icon('arrow-up-right') : h.icon('arrow-right')) })}</p>
            </article>
        </li>`
        )
        .join('');

    const skills = c.skills
        .map(
            (g, i) => `
        <div class="br-skill" data-reveal style="--i:${i % 3}">
            <h3>${h.esc(g.group)}</h3>
            <ul>${g.items.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul>
        </div>`
        )
        .join('');

    const jobs = c.experience
        .map(
            (e) => `
        <li class="br-job" data-reveal>
            <p class="br-job__date">${h.dateRange(e)}</p>
            <h3>${h.esc(e.role)}</h3>
            <p class="br-job__org">${h.esc(e.org)}</p>
            <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
        </li>`
        )
        .join('');

    const educationOf = (list) =>
        list
        .map(
            (e) => `
        <li class="br-edu" data-reveal>
            <h4>${h.esc(e.title)}</h4>
            <p class="br-edu__org">${h.esc(e.org)}</p>
            ${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}
        </li>`
        )
        .join('');

    const education = educationOf(c.education);
    const events = educationOf(c.achievements);

    return `
<div class="br">
    <header class="br-header">
        <a class="br-logo" href="#main"><span>${h.esc(person.firstName)}</span><span>${h.esc(person.lastName)}</span></a>
        <button class="br-menu-btn" type="button" aria-expanded="false" aria-controls="br-nav">Menu</button>
        <nav class="br-nav" id="br-nav" aria-label="Primary"><ul>${nav}</ul></nav>
    </header>

    <div class="br-ticker" aria-hidden="true">
        <ul class="br-ticker__track">${ticker}${ticker}</ul>
    </div>

    <main id="main" tabindex="-1">
        <section class="br-hero" aria-labelledby="hero-title">
            <h1 id="hero-title" class="br-hero__name">
                <span class="br-hero__first">${h.esc(person.firstName)}</span>
                <span class="br-hero__last">${h.esc(person.lastName)}</span>
            </h1>
            <p class="br-sticker" data-overlap="designed"><span>${h.esc(person.focus)}</span></p>
            <div class="br-hero__panel">
                <p class="br-hero__role">${h.esc(person.role)} / ${h.esc(person.location)}</p>
                <p class="br-hero__tagline">${h.esc(person.tagline)}</p>
                <p class="br-hero__actions">
                    <a class="br-btn br-btn--ink" href="#projects">See the work ${h.icon('arrow-right')}</a>
                    <a class="br-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)} ${h.icon('download')}</a>
                </p>
            </div>
        </section>

        <section id="projects" class="br-section br-projects" aria-labelledby="projects-title">
            <div class="br-section__head">
                <h2 id="projects-title" class="br-title">Work</h2>
                <p>${c.projects.length} builds. Every one has a case study with the architecture and exactly what I did.</p>
            </div>
            <ul class="br-wall">${projects}</ul>
            <p class="br-more"><a class="br-btn br-btn--ink" href="${h.esc(c.caseStudiesHref)}">All case studies ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="about" class="br-section br-about" aria-labelledby="about-title">
            <h2 id="about-title" class="br-title">About</h2>
            <figure class="br-about__photo" data-reveal>${h.portrait(person.portrait, { sizes: '(max-width: 768px) 70vw, 30vw' })}</figure>
            <div class="br-about__text" data-reveal style="--i:1">${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}</div>
        </section>

        <section id="skills" class="br-section br-skills" aria-labelledby="skills-title">
            <h2 id="skills-title" class="br-title">Skills</h2>
            <div class="br-skills__grid">${skills}</div>
        </section>

        <section id="experience" class="br-section br-experience" aria-labelledby="experience-title">
            <h2 id="experience-title" class="br-title">Experience</h2>
            <ol class="br-jobs">${jobs}</ol>
            <h3 class="br-subtitle">Education</h3>
            <ul class="br-edus">${education}</ul>
            <h3 class="br-subtitle">Hackathons &amp; events</h3>
            <ul class="br-edus">${events}</ul>
            <p class="br-more"><a class="br-btn br-btn--ink" href="${h.esc(c.achievementsHref)}">Achievements &amp; certificates ${h.icon('arrow-right')}</a> <a class="br-btn" href="${h.esc(c.aboutHref)}">Full profile ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="contact" class="br-section br-contact" aria-labelledby="contact-title">
            <h2 id="contact-title" class="br-title">Say hello</h2>
            <p class="br-contact__lead">${h.esc(contact.message)}</p>
            <a class="br-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
            <ul class="br-contact__list">
                <li><a class="br-btn" href="${h.esc(contact.phone.href)}">${h.icon('telephone')} ${h.esc(contact.phone.label)}</a></li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, inner: `${h.icon(s.id)} ${h.esc(s.label)}`, external: true, cls: 'br-btn' })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="br-footer">
        <p>© ${year} ${h.esc(person.name)} · ${h.esc(contact.location)}</p>
        <p><a href="#main">Back to top ${h.icon('arrow-right', 'br-up')}</a></p>
    </footer>
</div>`;
}

export function init(root, ctx) {
    menuToggle(root.querySelector('.br-menu-btn'), root.querySelector('.br-nav'), ctx, { closeAbove: '(min-width: 861px)' });
    revealOnScroll(root, ctx);
}
