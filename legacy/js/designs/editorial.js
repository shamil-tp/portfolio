/**
 * Design E — Editorial.
 * The portfolio as a magazine feature: a masthead, a lead story (the first
 * project), ruled columns, a drop-capped profile with a pull quote, a typeset
 * skills index and a correspondence column. The authored motion moment is
 * the masthead rules drawing outward; the portrait wipes in once.
 */
import { revealOnScroll, trackActiveSection } from '../interactions.js';

export function render(c, h) {
    const { person, contact } = c;
    const now = new Date();
    const edition = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const [lead, ...rest] = c.projects;

    const nav = h.sections.map((s) => `<li><a href="#${s.id}">${h.esc(s.label)}</a></li>`).join('');

    const story = (p, i) => `
        <li class="ed-story${i % 5 === 0 ? ' ed-story--wide' : ''}" data-reveal>
            <article aria-labelledby="ed-p-${p.slug}">
                <h3 class="ed-story__head" id="ed-p-${p.slug}"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                <p class="ed-story__dateline">${h.esc(p.kicker)}</p>
                <p class="ed-story__text">${h.esc(p.summary)}</p>
                <p class="ed-story__filed"><span>Built with</span> ${p.stack.map((t) => h.esc(t)).join(', ')}</p>
                <p class="ed-story__links">${h.projectLinksHTML(p, { cls: 'ed-more' })}</p>
            </article>
        </li>`;

    const skills = c.skills
        .map(
            (g) => `
        <div class="ed-index__entry" data-reveal>
            <h3>${h.esc(g.group)}</h3>
            <p>${g.items.map((s) => `<span>${h.esc(s)}</span>`).join('<span class="ed-sep" aria-hidden="true"> · </span>')}</p>
        </div>`
        )
        .join('');

    const jobs = c.experience
        .map(
            (e) => `
        <li class="ed-job" data-reveal>
            <p class="ed-job__dateline">${h.dateRange(e)}</p>
            <h3>${h.esc(e.role)}</h3>
            <p class="ed-job__org">${h.esc(e.org)}</p>
            <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
        </li>`
        )
        .join('');

    const educationOf = (list) =>
        list
        .map(
            (e) => `
        <li>
            <h4>${h.esc(e.title)}</h4>
            <p class="ed-edu__org">${h.esc(e.org)}</p>
            ${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}
        </li>`
        )
        .join('');

    const education = educationOf(c.education);
    const events = educationOf(c.achievements);

    return `
<div class="ed">
    <header class="ed-masthead">
        <div class="ed-wrap">
            <p class="ed-masthead__meta">
                <span>${h.esc(person.location)}</span>
                <span>${h.esc(edition)}</span>
                <a href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a>
            </p>
            <h1 id="hero-title" class="ed-masthead__title">${h.esc(person.name)}</h1>
            <p class="ed-masthead__sub">${h.esc(person.role)} — ${h.esc(person.focus)}</p>
            <div class="ed-rules" aria-hidden="true"><span></span><span></span></div>
        </div>
        <nav class="ed-nav" aria-label="Primary"><ul class="ed-wrap">${nav}</ul></nav>
    </header>

    <main id="main" tabindex="-1">
        <section class="ed-wrap ed-cover" aria-label="Introduction">
            <p class="ed-cover__dek">${h.esc(person.tagline)}</p>
            <p class="ed-cover__byline">${h.esc(person.status)}. <a href="#contact">Get in touch</a>.</p>
        </section>

        <section id="projects" class="ed-wrap ed-section" aria-labelledby="projects-title">
            <header class="ed-section__flag">
                <h2 id="projects-title">Projects</h2>
                <p>${c.projects.length} case studies on how each system works, the architecture, the stack, and exactly what I contributed.</p>
            </header>

            <article class="ed-lead" aria-labelledby="ed-p-${lead.slug}" data-reveal>
                <h3 class="ed-lead__head" id="ed-p-${lead.slug}"><a href="${h.esc(lead.caseStudy)}">${h.esc(lead.name)}</a></h3>
                <p class="ed-story__dateline">${h.esc(lead.kicker)}</p>
                <p class="ed-lead__text">${h.esc(lead.summary)}</p>
                <p class="ed-story__filed"><span>Built with</span> ${lead.stack.map((t) => h.esc(t)).join(', ')}</p>
                <p class="ed-story__links">${h.projectLinksHTML(lead, { cls: 'ed-more' })}</p>
            </article>

            <ul class="ed-stories">${rest.map(story).join('')}</ul>
            <p class="ed-section__end"><a class="ed-more" href="${h.esc(c.caseStudiesHref)}">Read every case study</a></p>
        </section>

        <section id="about" class="ed-wrap ed-section ed-profile" aria-labelledby="about-title">
            <header class="ed-section__flag"><h2 id="about-title">About</h2></header>
            <figure class="ed-profile__photo" data-reveal>
                ${h.portrait(person.portrait, { sizes: '(max-width: 900px) 90vw, 33vw' })}
                <figcaption>${h.esc(person.name)}, ${h.esc(person.location)}</figcaption>
            </figure>
            <div class="ed-profile__text">
                ${person.about.map((p, i) => `<p${i === 0 ? ' class="ed-dropcap"' : ''}>${h.esc(p)}</p>`).join('')}
            </div>
            <blockquote class="ed-pull" data-reveal><p>${h.esc(person.quote)}</p></blockquote>
        </section>

        <section id="skills" class="ed-wrap ed-section" aria-labelledby="skills-title">
            <header class="ed-section__flag"><h2 id="skills-title">Skills</h2></header>
            <div class="ed-index">${skills}</div>
        </section>

        <section id="experience" class="ed-wrap ed-section ed-career" aria-labelledby="experience-title">
            <header class="ed-section__flag"><h2 id="experience-title">Experience</h2></header>
            <ol class="ed-jobs">${jobs}</ol>
            <aside class="ed-sidebar" aria-labelledby="ed-edu-title" data-reveal>
                <h3 id="ed-edu-title">Education</h3>
                <ul>${education}</ul>
                <h3>Hackathons &amp; events</h3>
                <ul>${events}</ul>
                <p class="ed-sidebar__more"><a class="ed-more" href="${h.esc(c.achievementsHref)}">Achievements and certificates</a><br><a class="ed-more" href="${h.esc(c.aboutHref)}">The full profile</a></p>
            </aside>
        </section>

        <section id="contact" class="ed-wrap ed-section ed-letters" aria-labelledby="contact-title">
            <header class="ed-section__flag"><h2 id="contact-title">Contact</h2></header>
            <p class="ed-letters__text">${h.esc(contact.message)}</p>
            <p class="ed-letters__write">Write to <a href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a></p>
            <ul class="ed-letters__list">
                <li><a href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a></li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, text: s.label, external: true })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="ed-wrap ed-colophon">
        <p>© ${now.getFullYear()} ${h.esc(person.name)}. Set in Bodoni Moda and Newsreader.</p>
        <p><a href="#main">Back to the top</a></p>
    </footer>
</div>`;
}

export function init(root, ctx) {
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.ed-nav a')], ctx);
}
