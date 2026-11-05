/**
 * Design A — Swiss.
 * A twelve-column grid, sticky section labels in the left columns, a single
 * red accent and hairline rules. The one authored motion moment is the hero
 * name rising out of its line boxes; everything else just fades in place.
 */
import { menuToggle, revealOnScroll, trackActiveSection } from '../interactions.js';

export function render(c, h) {
    const { person, contact } = c;
    const year = new Date().getFullYear();

    // Nav follows this design's page order: work first.
    const order = ['projects', 'about', 'skills', 'experience', 'contact'];
    const nav = order
        .map((id) => h.sections.find((s) => s.id === id))
        .map((s) => `<li><a href="#${s.id}">${s.id === 'projects' ? 'Work' : h.esc(s.label)}</a></li>`)
        .join('');

    const projects = c.projects
        .map(
            (p, i) => `
        <li class="sw-project" data-reveal style="--i:${i % 4}">
            <h3 class="sw-project__name"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
            <p class="sw-project__kind">${h.esc(p.kicker)}</p>
            <p class="sw-project__summary">${h.esc(p.summary)}</p>
            <ul class="sw-project__stack" aria-label="Tech stack">${p.stack.map((t) => `<li>${h.esc(t)}</li>`).join('')}</ul>
            <p class="sw-project__links">${h.projectLinksHTML(p, { cls: 'sw-link' })}</p>
        </li>`
        )
        .join('');

    const skills = c.skills
        .map(
            (g, i) => `
        <div class="sw-skill" data-reveal style="--i:${i % 3}">
            <h3>${h.esc(g.group)}</h3>
            <ul>${g.items.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul>
        </div>`
        )
        .join('');

    const experience = c.experience
        .map(
            (e) => `
        <li class="sw-row" data-reveal>
            <p class="sw-row__date">${h.dateRange(e)}</p>
            <div class="sw-row__title"><h3>${h.esc(e.role)}</h3><p>${h.esc(e.org)}</p></div>
            <ul class="sw-row__body">${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
        </li>`
        )
        .join('');

    const educationOf = (list) =>
        list
        .map(
            (e) => `
        <li class="sw-row" data-reveal>
            <p class="sw-row__date">${h.esc(e.org)}</p>
            <div class="sw-row__title"><h3>${h.esc(e.title)}</h3></div>
            <ul class="sw-row__body">${e.meta.map((m) => `<li>${h.esc(m)}</li>`).join('')}</ul>
        </li>`
        )
        .join('');

    const education = educationOf(c.education);
    const events = educationOf(c.achievements);

    return `
<div class="sw">
    <header class="sw-header">
        <div class="sw-wrap sw-header__inner">
            <a class="sw-header__name" href="#main">${h.esc(person.name)}</a>
            <p class="sw-header__role">${h.esc(person.role)}<br>${h.esc(person.location)}</p>
            <button class="sw-menu-btn" type="button" aria-expanded="false" aria-controls="sw-nav">Index</button>
            <nav class="sw-nav" id="sw-nav" aria-label="Primary"><ul>${nav}</ul></nav>
        </div>
    </header>

    <main id="main" tabindex="-1">
        <section class="sw-hero sw-wrap" aria-labelledby="hero-title">
            <h1 id="hero-title" class="sw-hero__name">
                <span class="sw-line"><span>${h.esc(person.firstName)}</span></span>
                <span class="sw-line"><span>${h.esc(person.lastName)}<span class="sw-dot" aria-hidden="true"></span></span></span>
            </h1>
            <nav class="sw-index" aria-label="Project index">
                <ol>${c.projects.map((p) => `<li><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></li>`).join('')}</ol>
            </nav>
            <p class="sw-hero__tagline">${h.esc(person.tagline)}</p>
            <dl class="sw-hero__meta">
                <div><dt>Role</dt><dd>${h.esc(person.role)}</dd></div>
                <div><dt>Focus</dt><dd>${h.esc(person.focus)}</dd></div>
                <div><dt>Status</dt><dd>${h.esc(person.status)}</dd></div>
            </dl>
            <ul class="sw-hero__links">
                <li><a class="sw-link" href="#projects">Selected work</a></li>
                <li><a class="sw-link" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a></li>
                <li>${h.link({ href: h.mailto(contact.email), text: 'Email', cls: 'sw-link' })}</li>
            </ul>
        </section>

        <section id="projects" class="sw-section sw-wrap" aria-labelledby="projects-title">
            <div class="sw-section__label">
                <h2 id="projects-title">Selected work</h2>
                <p>${c.projects.length} projects, each with a case study.</p>
            </div>
            <ol class="sw-projects">${projects}</ol>
            <p class="sw-section__after"><a class="sw-link" href="${h.esc(c.caseStudiesHref)}">All case studies</a></p>
        </section>

        <section id="about" class="sw-section sw-wrap" aria-labelledby="about-title">
            <div class="sw-section__label"><h2 id="about-title">About</h2></div>
            <div class="sw-about">
                <figure class="sw-about__portrait" data-reveal>${h.portrait(person.portrait, { sizes: '(max-width: 900px) 60vw, 25vw' })}</figure>
                <div class="sw-about__text" data-reveal style="--i:1">${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}</div>
            </div>
        </section>

        <section id="skills" class="sw-section sw-wrap" aria-labelledby="skills-title">
            <div class="sw-section__label"><h2 id="skills-title">Skills</h2></div>
            <div class="sw-skills">${skills}</div>
        </section>

        <section id="experience" class="sw-section sw-wrap" aria-labelledby="experience-title">
            <div class="sw-section__label"><h2 id="experience-title">Experience</h2></div>
            <div class="sw-rows">
                <ol class="sw-rowlist">${experience}</ol>
                <h3 class="sw-subhead">Education</h3>
                <ul class="sw-rowlist">${education}</ul>
                <h3 class="sw-subhead">Hackathons &amp; events</h3>
                <ul class="sw-rowlist">${events}</ul>
                <p class="sw-rows__more"><a class="sw-link" href="${h.esc(c.achievementsHref)}">Achievements and certificates</a> <a class="sw-link" href="${h.esc(c.aboutHref)}">Full profile</a></p>
            </div>
        </section>

        <section id="contact" class="sw-section sw-contact sw-wrap" aria-labelledby="contact-title">
            <div class="sw-section__label"><h2 id="contact-title">Contact</h2></div>
            <div class="sw-contact__body">
                <p class="sw-contact__lead">${h.esc(contact.message)}</p>
                <a class="sw-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
                <ul class="sw-contact__list">
                    <li><a class="sw-link" href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a></li>
                    <li>${h.esc(contact.location)}</li>
                    ${c.socials.map((s) => `<li>${h.link({ href: s.href, text: s.label, external: true, cls: 'sw-link' })}</li>`).join('')}
                </ul>
            </div>
        </section>
    </main>

    <footer class="sw-footer sw-wrap">
        <p>© ${year} ${h.esc(person.name)}</p>
        <p><a class="sw-link" href="${h.esc(person.resume.href)}" type="application/pdf">Resume</a> · <a class="sw-link" href="#main">Back to top</a></p>
    </footer>
</div>`;
}

export function init(root, ctx) {
    menuToggle(root.querySelector('.sw-menu-btn'), root.querySelector('.sw-nav'), ctx, { closeAbove: '(min-width: 900px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.sw-nav a')], ctx);
}
