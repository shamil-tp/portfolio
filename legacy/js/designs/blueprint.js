/**
 * Design 08 — Blueprint.
 * The portfolio as a drawing set: a title block, a project schematic, a
 * project schedule, general notes, a legend and a revision history.
 *
 * Nothing on the drawing is decorative measurement. The schematic is computed
 * from content.js: projects are nodes (P-01…P-12 in content order), and a
 * technology gets a hub (T-01…) only when two or more projects share it, so
 * every wire states a fact. The schedule below repeats everything as a table,
 * which is also what narrow screens get instead of the schematic.
 */
import { revealOnScroll, trackActiveSection, menuToggle } from '../interactions.js';

// Stack entries that describe a project rather than name a technology.
const NOT_TECH = new Set(['private client project', 'full stack', 'automation', 'api integration', 'zero dependencies', 'dom']);
const norm = (t) => t.toLowerCase().replace(/\s+\d+(\.\d+)*$/, '').replace(/\.js$/, '').trim();

/** Technologies used by 2+ projects, with the projects that use them. */
function sharedTech(projects) {
    const map = new Map();
    projects.forEach((p) => {
        new Set(p.stack.map(norm)).forEach((key) => {
            if (NOT_TECH.has(key)) return;
            if (!map.has(key)) map.set(key, { key, label: p.stack.find((t) => norm(t) === key).replace(/\s+\d+(\.\d+)*$/, ''), projects: [] });
            map.get(key).projects.push(p.slug);
        });
    });
    return [...map.values()].filter((t) => t.projects.length > 1).sort((a, b) => b.projects.length - a.projects.length);
}

const ref = (prefix, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`;
let selectImpl = null;

export function render(c, h) {
    const { person, contact } = c;
    const now = new Date();
    const issued = now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const hubs = sharedTech(c.projects);
    const half = Math.ceil(c.projects.length / 2);
    const sheets = [
        { id: 'projects', label: 'Project schematic' },
        { id: 'about', label: 'General notes' },
        { id: 'skills', label: 'Legend' },
        { id: 'experience', label: 'Revision history' },
        { id: 'contact', label: 'Issued for contact' },
    ];

    const node = (p, i) => `
        <li><button type="button" class="bp-node" data-project="${p.slug}" aria-pressed="false" aria-describedby="bp-node-${p.slug}">
            <span class="bp-node__ref">${ref('P', i)}</span>
            <span class="bp-node__name">${h.esc(p.name)}</span>
            <span class="bp-node__kind" id="bp-node-${p.slug}">${h.esc(p.kicker)}</span>
        </button></li>`;

    const hubList = hubs
        .map(
            (t, i) => `
        <li><button type="button" class="bp-hub" data-hub="${h.esc(t.key)}" aria-describedby="bp-hub-${i}">
            <span class="bp-node__ref">${ref('T', i)}</span>
            <span class="bp-hub__name">${h.esc(t.label)}</span>
            <span class="bp-hub__count" id="bp-hub-${i}">shared by ${t.projects.length} projects</span>
        </button></li>`
        )
        .join('');

    const schedule = c.projects
        .map(
            (p, i) => `
        <tr>
            <td class="bp-mono">${ref('P', i)}</td>
            <th scope="row"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></th>
            <td>${h.esc(p.kicker)}</td>
            <td>${h.esc(p.summary)}</td>
            <td class="bp-mono">${p.stack.map((t) => h.esc(t)).join(', ')}</td>
            <td class="bp-links">${h.projectLinksHTML(p, { cls: 'bp-link' })}</td>
        </tr>`
        )
        .join('');

    const notes = [...person.about, `Based in ${contact.location}. ${person.status}.`];

    const revisions = c.experience
        .map(
            (e) => `
        <tr>
            <td class="bp-mono">${h.dateRange(e)}</td>
            <th scope="row">${h.esc(e.role)}<span class="bp-sub">${h.esc(e.org)}</span></th>
            <td><ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul></td>
        </tr>`
        )
        .join('');

    const educationOf = (list, label) =>
        list
        .map(
            (e) => `
        <tr>
            <td class="bp-mono">${label === 'Education' ? label : h.esc(e.date.label)}</td>
            <th scope="row">${h.esc(e.title)}<span class="bp-sub">${h.esc(e.org)}</span></th>
            <td><ul>${e.meta.map((m) => `<li>${h.esc(m)}</li>`).join('')}</ul></td>
        </tr>`
        )
        .join('');

    const education = educationOf(c.education, 'Education');
    const events = educationOf(c.achievements, 'Event');

    return `
<div class="bp">
    <div class="bp-sheet">
        <header class="bp-titleblock">
            <a class="bp-titleblock__name" href="#main">${h.esc(person.name)}</a>
            <dl class="bp-titleblock__meta">
                <div><dt>Discipline</dt><dd>${h.esc(person.role)} · ${h.esc(person.focus)}</dd></div>
                <div><dt>Location</dt><dd>${h.esc(person.location)}</dd></div>
                <div><dt>Issued</dt><dd class="bp-mono">${h.esc(issued)}</dd></div>
            </dl>
            <button class="bp-menu-btn" type="button" aria-expanded="false" aria-controls="bp-nav">Sheet index</button>
            <nav class="bp-nav" id="bp-nav" aria-label="Primary">
                <ol>${sheets.map((s, i) => `<li><a href="#${s.id}"><span class="bp-mono">${String(i + 1).padStart(2, '0')}</span> ${h.esc(s.label)}</a></li>`).join('')}</ol>
            </nav>
        </header>

        <main id="main" tabindex="-1">
            <section class="bp-cover" aria-labelledby="hero-title">
                <h1 id="hero-title" class="bp-cover__name">${h.esc(person.name)}</h1>
                <p class="bp-cover__role">${h.esc(person.role)}, ${h.esc(person.focus.toLowerCase())}</p>
                <p class="bp-cover__note"><span class="bp-mono">Note:</span> ${h.esc(person.tagline)}</p>
                <p class="bp-cover__actions">
                    <a class="bp-btn bp-btn--ink" href="#projects">See the projects</a>
                    <a class="bp-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a>
                </p>
            </section>

            <section id="projects" class="bp-section" aria-labelledby="projects-title">
                <header class="bp-section__head">
                    <p class="bp-section__no bp-mono" aria-hidden="true">01</p>
                    <h2 id="projects-title">Project schematic</h2>
                    <p class="bp-section__note">Projects (P) wired to the technologies they share (T). A hub appears only where two or more projects use the same technology. Select a project for its detail.</p>
                </header>

                <div class="bp-diagram" data-reveal>
                    <svg class="bp-wires" aria-hidden="true" focusable="false"></svg>
                    <ol class="bp-col bp-col--left" aria-label="Projects ${ref('P', 0)} to ${ref('P', half - 1)}">${c.projects.slice(0, half).map((p, i) => node(p, i)).join('')}</ol>
                    <ol class="bp-col bp-col--hubs" aria-label="Shared technologies">${hubList}</ol>
                    <ol class="bp-col bp-col--right" aria-label="Projects ${ref('P', half)} to ${ref('P', c.projects.length - 1)}">${c.projects.slice(half).map((p, i) => node(p, i + half)).join('')}</ol>
                </div>

                <aside class="bp-detail" aria-live="polite" aria-labelledby="bp-detail-title">
                    <p class="bp-detail__label bp-mono">Detail</p>
                    <div class="bp-detail__body"><p id="bp-detail-title" class="bp-detail__empty">Select a project node above to see its detail here.</p></div>
                </aside>

                <h3 class="bp-table-title">Project schedule</h3>
                <div class="bp-table-wrap" tabindex="0" role="region" aria-label="Project schedule">
                    <table class="bp-table bp-table--schedule">
                        <thead><tr><th scope="col">Ref</th><th scope="col">Project</th><th scope="col">Type</th><th scope="col">Description</th><th scope="col">Stack</th><th scope="col">Links</th></tr></thead>
                        <tbody>${schedule}</tbody>
                    </table>
                </div>
                <p class="bp-after"><a class="bp-btn" href="${h.esc(c.caseStudiesHref)}">All case studies</a></p>
            </section>

            <section id="about" class="bp-section" aria-labelledby="about-title">
                <header class="bp-section__head">
                    <p class="bp-section__no bp-mono" aria-hidden="true">02</p>
                    <h2 id="about-title">General notes</h2>
                </header>
                <div class="bp-about">
                    <ol class="bp-notes">${notes.map((n) => `<li data-reveal>${h.esc(n)}</li>`).join('')}</ol>
                    <figure class="bp-figure" data-reveal>
                        ${h.portrait(person.portrait, { sizes: '(max-width: 760px) 70vw, 22vw' })}
                        <figcaption class="bp-mono">Fig. 1 — ${h.esc(person.name)}</figcaption>
                    </figure>
                </div>
            </section>

            <section id="skills" class="bp-section" aria-labelledby="skills-title">
                <header class="bp-section__head">
                    <p class="bp-section__no bp-mono" aria-hidden="true">03</p>
                    <h2 id="skills-title">Legend</h2>
                    <p class="bp-section__note">Skills by group.</p>
                </header>
                <div class="bp-table-wrap" tabindex="0" role="region" aria-label="Skills legend">
                    <table class="bp-table bp-table--legend">
                        <tbody>${c.skills.map((g) => `<tr><th scope="row">${h.esc(g.group)}</th><td>${g.items.map((s) => h.esc(s)).join(' · ')}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
            </section>

            <section id="experience" class="bp-section" aria-labelledby="experience-title">
                <header class="bp-section__head">
                    <p class="bp-section__no bp-mono" aria-hidden="true">04</p>
                    <h2 id="experience-title">Revision history</h2>
                    <p class="bp-section__note">Experience, education, hackathons and events, latest first. Certificates on the <a class="bp-link" href="${h.esc(c.achievementsHref)}">achievements sheet</a>; background on the <a class="bp-link" href="${h.esc(c.aboutHref)}">profile</a>.</p>
                </header>
                <div class="bp-table-wrap" tabindex="0" role="region" aria-label="Experience">
                    <table class="bp-table bp-table--revisions">
                        <thead><tr><th scope="col">Period</th><th scope="col">Role</th><th scope="col">Notes</th></tr></thead>
                        <tbody>${revisions}${education}${events}</tbody>
                    </table>
                </div>
            </section>

            <section id="contact" class="bp-section bp-contact" aria-labelledby="contact-title">
                <header class="bp-section__head">
                    <p class="bp-section__no bp-mono" aria-hidden="true">05</p>
                    <h2 id="contact-title">Issued for contact</h2>
                </header>
                <p class="bp-contact__lead">${h.esc(contact.message)}</p>
                <dl class="bp-contact__list">
                    <div><dt>Email</dt><dd><a class="bp-link" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a></dd></div>
                    <div><dt>Phone</dt><dd><a class="bp-link" href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a></dd></div>
                    ${c.socials.map((s) => `<div><dt>${h.esc(s.label)}</dt><dd>${h.link({ href: s.href, text: s.href.replace(/^https?:\/\/(www\.)?/, ''), external: true, cls: 'bp-link' })}</dd></div>`).join('')}
                </dl>
            </section>
        </main>

        <footer class="bp-footer bp-mono">
            <p>© ${now.getFullYear()} ${h.esc(person.name)}</p>
            <p><a class="bp-link" href="#main">Back to title block</a></p>
        </footer>
    </div>
</div>`;
}

function detailHTML(p, i, h) {
    return `
        <h3 id="bp-detail-title" class="bp-detail__title"><span class="bp-mono">${ref('P', i)}</span> ${h.esc(p.name)}</h3>
        <p class="bp-detail__kind">${h.esc(p.kicker)}</p>
        <p>${h.esc(p.summary)}</p>
        <p class="bp-mono bp-detail__stack">${p.stack.map((t) => h.esc(t)).join(' / ')}</p>
        <p class="bp-detail__links">${h.projectLinksHTML(p, { cls: 'bp-btn' })}</p>`;
}

export function init(root, ctx) {
    const { content: c, helpers: h } = ctx;
    const opts = { signal: ctx.signal };
    menuToggle(root.querySelector('.bp-menu-btn'), root.querySelector('.bp-nav'), ctx, { closeAbove: '(min-width: 901px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.bp-nav a')], ctx);

    const diagram = root.querySelector('.bp-diagram');
    const svg = root.querySelector('.bp-wires');
    const detail = root.querySelector('.bp-detail__body');
    const hubs = sharedTech(c.projects);
    const nodes = new Map([...root.querySelectorAll('.bp-node')].map((n) => [n.dataset.project, n]));
    const hubEls = new Map([...root.querySelectorAll('.bp-hub')].map((n) => [n.dataset.hub, n]));
    const edges = hubs.flatMap((t, ti) => t.projects.map((slug) => ({ slug, hub: t.key, ti })));
    let selected = null;

    /**
     * Orthogonal (drafting-style) connectors, recomputed from the laid-out boxes.
     * Horizontal sheets wire across (project side → hub side); a vertical sheet
     * (variation orientation) wires down and up (project edge → hub edge).
     */
    function drawWires() {
        if (!diagram.offsetParent) return; // hidden (narrow screens)
        const box = diagram.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
        const lanes = hubs.length + 1;
        const vertical = ctx.variation?.layout.orientation === 'vertical';
        svg.innerHTML = edges
            .map((e) => {
                const n = nodes.get(e.slug).getBoundingClientRect();
                const t = hubEls.get(e.hub).getBoundingClientRect();
                if (vertical) {
                    const above = n.top < t.top;
                    const sx = n.left + n.width / 2 - box.left;
                    const sy = (above ? n.bottom : n.top) - box.top;
                    const ex = t.left + t.width / 2 - box.left;
                    const ey = (above ? t.top : t.bottom) - box.top;
                    // Each hub has its own horizontal lane in the gap.
                    const my = sy + ((ey - sy) * (e.ti + 1)) / lanes;
                    return `<path class="bp-wire" data-project="${e.slug}" data-hub="${e.hub}" pathLength="1" d="M${sx.toFixed(1)} ${sy.toFixed(1)} V${my.toFixed(1)} H${ex.toFixed(1)} V${ey.toFixed(1)}"/>
                        <circle class="bp-wire__dot" data-project="${e.slug}" data-hub="${e.hub}" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.5"/>`;
                }
                const left = n.left < t.left;
                const sx = (left ? n.right : n.left) - box.left;
                const sy = n.top + n.height / 2 - box.top;
                const ex = (left ? t.left : t.right) - box.left;
                const ey = t.top + t.height / 2 - box.top;
                // Each hub has its own vertical lane in the gutter, so wires never share a run.
                const mx = sx + ((ex - sx) * (e.ti + 1)) / lanes;
                return `<path class="bp-wire" data-project="${e.slug}" data-hub="${e.hub}" pathLength="1" d="M${sx.toFixed(1)} ${sy.toFixed(1)} H${mx.toFixed(1)} V${ey.toFixed(1)} H${ex.toFixed(1)}"/>
                        <circle class="bp-wire__dot" data-project="${e.slug}" data-hub="${e.hub}" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.5"/>`;
            })
            .join('');
        highlight(selected ? { project: selected } : null);
    }

    function highlight(target) {
        const on = (el) => {
            if (!target) return false;
            if (target.project) return el.dataset.project === target.project || (el.dataset.hub && edges.some((e) => e.slug === target.project && e.hub === el.dataset.hub));
            return el.dataset.hub === target.hub || (el.dataset.project && edges.some((e) => e.hub === target.hub && e.slug === el.dataset.project));
        };
        diagram.classList.toggle('is-tracing', !!target);
        svg.querySelectorAll('[data-project]').forEach((w) => w.classList.toggle('is-on', !!target && (target.project ? w.dataset.project === target.project : w.dataset.hub === target.hub)));
        // Boolean force: toggle(name, undefined) would flip the class instead of clearing it.
        nodes.forEach((n) => n.classList.toggle('is-on', !!on(n)));
        hubEls.forEach((n) => n.classList.toggle('is-on', !!on(n)));
    }

    function select(slug) {
        selected = slug;
        const i = c.projects.findIndex((p) => p.slug === slug);
        nodes.forEach((n, key) => n.setAttribute('aria-pressed', String(key === slug)));
        detail.innerHTML = detailHTML(c.projects[i], i, h);
        highlight({ project: slug });
    }

    diagram.addEventListener('click', (e) => {
        const n = e.target.closest('.bp-node');
        if (n) select(n.dataset.project);
    }, opts);

    const hoverTarget = (el) => (el?.closest('.bp-node') ? { project: el.closest('.bp-node').dataset.project } : el?.closest('.bp-hub') ? { hub: el.closest('.bp-hub').dataset.hub } : null);
    diagram.addEventListener('pointerover', (e) => highlight(hoverTarget(e.target) ?? (selected ? { project: selected } : null)), opts);
    diagram.addEventListener('pointerleave', () => highlight(selected ? { project: selected } : null), opts);
    diagram.addEventListener('focusin', (e) => highlight(hoverTarget(e.target)), opts);
    diagram.addEventListener('focusout', () => highlight(selected ? { project: selected } : null), opts);

    // Wires draw in once, when the schematic is revealed; later redraws (resize) appear instantly.
    svg.addEventListener('animationend', () => diagram.classList.add('is-drawn'), { ...opts, once: true });
    const ro = new ResizeObserver(() => drawWires());
    ro.observe(diagram);
    document.fonts?.ready.then(() => !ctx.signal.aborted && drawWires());
    ctx.onCleanup(() => ro.disconnect());

    selectImpl = select;
    ctx.onCleanup(() => (selectImpl = null));
}
