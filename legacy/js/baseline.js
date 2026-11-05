/**
 * baseline.js — the crawlable, no-JavaScript version of the homepage,
 * generated from content.js.
 *
 * index.html ships this markup inside <div id="app"> so search engines,
 * link previews and visitors without JavaScript get the full portfolio
 * (every project, skill, role and contact link) before any design runs.
 *
 * It is not built at deploy time (there is no build step): open
 * tools/baseline.html after editing content.js, copy the output into
 * index.html between the BASELINE markers. The test suite fails if the two
 * drift apart.
 */
export function baselineHTML(c, h) {
    const { person, contact } = c;
    const nav = h.sections.map((s) => `<li><a href="#${s.id}">${h.esc(s.label)}</a></li>`).join('');
    const projects = c.projects
        .map(
            (p) => `
                        <li>
                            <h3><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                            <p>${h.esc(p.kicker)}. ${h.esc(p.summary)}</p>
                            <p>Stack: ${p.stack.map((t) => h.esc(t)).join(', ')}.</p>
                            <p>${h.projectLinks(p).map((l) => `<a href="${h.esc(l.href)}">${h.esc(l.label)}<span class="visually-hidden">${h.esc(l.sr)}</span></a>`).join(' · ')}</p>
                        </li>`
        )
        .join('');
    const skills = c.skills.map((g) => `<li><strong>${h.esc(g.group)}:</strong> ${g.items.map((s) => h.esc(s)).join(', ')}</li>`).join('');
    const jobs = c.experience
        .map(
            (e) => `
                        <li>
                            <h3>${h.esc(e.role)}, ${h.esc(e.org)}</h3>
                            <p>${h.dateRange(e)}</p>
                            <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
                        </li>`
        )
        .join('');
    const education = c.education.map((e) => `<li><strong>${h.esc(e.title)}</strong>, ${h.esc(e.org)}. ${e.meta.map((m) => h.esc(m)).join(' ')}</li>`).join('');
    const events = c.achievements.map((e) => `<li><strong>${h.esc(e.title)}</strong>, ${h.esc(e.org)}. ${e.meta.map((m) => h.esc(m)).join(' ')}</li>`).join('');
    const socials = c.socials.map((s) => `<a href="${h.esc(s.href)}">${h.esc(s.label)}</a>`).join(' · ');

    return `
        <div class="baseline">
            <header class="baseline__header">
                <a href="./" class="baseline__logo">shamiltp.me</a>
                <nav aria-label="Primary">
                    <ul>${nav}</ul>
                </nav>
            </header>
            <main id="main">
                <section aria-labelledby="hero-title">
                    <h1 id="hero-title">${h.esc(person.name)}</h1>
                    <p>${h.esc(person.role)}, ${h.esc(person.focus.toLowerCase())} · ${h.esc(person.location)}</p>
                    <p>${h.esc(person.tagline)}</p>
                    <p><a href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a></p>
                </section>
                <section id="about" aria-labelledby="about-title">
                    <h2 id="about-title">About</h2>
                    ${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('\n                    ')}
                </section>
                <section id="projects" aria-labelledby="projects-title">
                    <h2 id="projects-title">Projects</h2>
                    <ul>${projects}
                    </ul>
                    <p><a href="${h.esc(c.caseStudiesHref)}">All case studies</a></p>
                </section>
                <section id="skills" aria-labelledby="skills-title">
                    <h2 id="skills-title">Skills</h2>
                    <ul>${skills}</ul>
                </section>
                <section id="experience" aria-labelledby="experience-title">
                    <h2 id="experience-title">Experience</h2>
                    <ul>${jobs}
                    </ul>
                    <h3>Education</h3>
                    <ul>${education}</ul>
                    <h3>Hackathons and events</h3>
                    <ul>${events}</ul>
                    <p><a href="${h.esc(c.achievementsHref)}">Achievements and certificates</a> · <a href="${h.esc(c.aboutHref)}">About Shamil TP: background, education and setup</a></p>
                </section>
                <section id="contact" aria-labelledby="contact-title">
                    <h2 id="contact-title">Contact</h2>
                    <p>${h.esc(contact.message)}</p>
                    <p><a href="mailto:${h.esc(contact.email)}">${h.esc(contact.email)}</a> · <a href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a> · ${h.esc(contact.location)}</p>
                    <p>${socials}</p>
                </section>
            </main>
        </div>
    `;
}

/** schema.org ItemList of the projects, for the homepage JSON-LD (facts from content.js only). */
export function projectsJsonLd(c, siteUrl) {
    return {
        '@type': 'ItemList',
        '@id': `${siteUrl}#projects`,
        name: `Projects by ${c.person.name}`,
        numberOfItems: c.projects.length,
        itemListElement: c.projects.map((p, i) => {
            const item = {
                '@type': p.source ? 'SoftwareSourceCode' : 'CreativeWork',
                name: p.name,
                description: p.summary,
                url: `${siteUrl}${p.caseStudy}`,
                creator: { '@id': `${siteUrl}#person` },
                keywords: p.stack.join(', '),
            };
            if (p.source) item.codeRepository = p.source;
            return { '@type': 'ListItem', position: i + 1, item };
        }),
    };
}
