/**
 * Design C — Depth: the Systems Maquette.
 *
 * The portfolio as a clay architectural model you can turn and explore
 * (Three.js, loaded only for this design). Buildings are projects: floors =
 * technologies in the stack, roof colour = area. The plaza holds About
 * (monolith), Skills (six stones) and Contact (mast).
 *
 * The HTML layer does the real work: every object has a button positioned
 * over it, the project panel is ordinary HTML with real links, and below the
 * model the page continues as normal sections. Without WebGL the same
 * buttons become a list, so nothing depends on the canvas.
 *
 * Controls: drag to turn · click/tap or Enter on a label to open ·
 * ←/→ step through projects · Esc closes · "Reset view" returns to the
 * current chapter's view.
 *
 * Scroll story: the model stays pinned while seven chapters scroll past
 * (overview, three featured projects, skills, about, contact). Each chapter
 * has a fixed camera viewpoint; an IntersectionObserver moves the camera when
 * a chapter becomes active. The visitor has priority: once they drag the
 * model or open a panel, scrolling leaves the camera alone until the next
 * chapter. Native scrolling throughout, no scroll listeners. This design is
 * excluded from generative UI, so its palette and scene never vary.
 */
import { menuToggle, revealOnScroll, trackActiveSection } from '../interactions.js';
import { hash } from '../render-helpers.js';

// 4×4 grid around a 2×2 central plaza: 12 building plots, in reading order.
const PLOTS = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [3, 1], [0, 2], [3, 2], [0, 3], [1, 3], [2, 3], [3, 3]];

// Areas, from each project's own category line. Roof colour encodes the area.
const AREAS = [
    { id: 'ai', label: 'AI agents', color: '#d39a4a', test: (k) => /\bAI\b/.test(k) },
    { id: 'stream', label: 'Streaming & media', color: '#6f8fb8', test: (k) => /Stream|Media/.test(k) },
    { id: 'client', label: 'Client projects', color: '#c96f55', test: (k) => /Client/.test(k) },
    { id: 'web', label: 'Web & systems', color: '#8fae8b', test: () => true },
];

const STONE_COLORS = ['#c8bba6', '#a99c86', '#d6cbb8', '#9b8f7b', '#bfb19a', '#b3a58e'];

const areaOf = (p) => AREAS.find((a) => a.test(p.kicker));

let state = null; // per-mount runtime state, reset by cleanup()

/**
 * Story chapters: id, camera view (scene.story options) and copy, all from
 * content.js. Turns are small (radians off home) so movement stays calm.
 */
function chapters(c) {
    const featured = c.projects.slice(0, 3);
    return [
        { id: 'overview', label: 'Overview', view: { id: null, turn: 0 } },
        ...featured.map((p, i) => ({ id: `p-${p.slug}`, label: p.name, project: p, view: { id: p.slug, turn: [-0.35, 0.3, -0.15][i] } })),
        { id: 'skills', label: 'Skills', view: { id: 'skills', turn: 0.45, radius: 15 } },
        { id: 'about', label: 'About', view: { id: 'about', turn: -0.4, radius: 14 } },
        { id: 'contact', label: 'Contact', view: { id: 'contact', turn: 0.6, radius: 16 } },
    ];
}

function chapterHTML(ch, c, h, i, total) {
    const n = `<p class="dp-chapter__n">${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</p>`;
    if (ch.id === 'overview') {
        return `${n}<h2 class="dp-chapter__title">A model of the work</h2>
            <p>${c.projects.length} buildings stand around a plaza, one for each project. Floors count the technologies in its stack; the roof colour marks its area.</p>
            <p class="dp-chapter__hint">Scroll to walk through it, or drag the model to look around yourself.</p>`;
    }
    if (ch.project) {
        const p = ch.project;
        return `${n}<p class="dp-chapter__kicker"><span style="--area:${areaOf(p).color}" aria-hidden="true"></span>${h.esc(p.kicker)}</p>
            <h2 class="dp-chapter__title">${h.esc(p.name)}</h2>
            <p>${h.esc(p.summary)}</p>
            <p class="dp-chapter__meta">${p.stack.length} floors · ${p.stack.map((t) => h.esc(t)).join(' · ')}</p>
            <p class="dp-chapter__links"><a class="dp-btn dp-btn--small" href="${h.esc(p.caseStudy)}">Read the case study ${h.icon('arrow-right')}</a><button type="button" class="dp-btn dp-btn--small" data-open-item="${p.slug}">Open in the model</button></p>`;
    }
    if (ch.id === 'skills') {
        return `${n}<h2 class="dp-chapter__title">Six stones on the plaza</h2>
            <p>One for each skill group: ${c.skills.map((g) => h.esc(g.group)).join(', ')}.</p>
            <p class="dp-chapter__links"><a class="dp-btn dp-btn--small" href="#skills">Every skill ${h.icon('arrow-right')}</a></p>`;
    }
    if (ch.id === 'about') {
        return `${n}<h2 class="dp-chapter__title">The monolith: about me</h2>
            <p>${h.esc(c.person.about[0])}</p>
            <p class="dp-chapter__links"><a class="dp-btn dp-btn--small" href="#about">Read more ${h.icon('arrow-right')}</a></p>`;
    }
    return `${n}<h2 class="dp-chapter__title">The mast: get in touch</h2>
        <p>${h.esc(c.contact.message)}</p>
        <p class="dp-chapter__links"><a class="dp-btn dp-btn--small dp-btn--solid" href="${h.esc(h.mailto(c.contact.email))}">${h.esc(c.contact.email)}</a></p>`;
}

export function render(c, h) {
    const { person, contact } = c;
    const year = new Date().getFullYear();
    const nav = h.sections.map((s) => `<li><a href="#${s.id}">${h.esc(s.label)}</a></li>`).join('');

    const labels = [
        ...c.projects.map(
            (p, i) => `<button type="button" class="dp-tag" data-item="${p.slug}" style="--area:${areaOf(p).color}" aria-describedby="dp-tag-${p.slug}">
                <span class="dp-tag__swatch" aria-hidden="true"></span>${h.esc(p.name)}
                <span class="visually-hidden" id="dp-tag-${p.slug}">${h.esc(p.kicker)}, ${p.stack.length} technologies. Opens project details.</span>
            </button>`
        ),
        `<button type="button" class="dp-tag dp-tag--landmark" data-item="about">About</button>`,
        `<button type="button" class="dp-tag dp-tag--landmark" data-item="skills">Skills</button>`,
        `<button type="button" class="dp-tag dp-tag--landmark" data-item="contact">Contact</button>`,
    ].join('');

    const story = chapters(c);
    const tour = story.map((ch, i) => `<article class="dp-chapter" data-chapter="${ch.id}" aria-label="${h.esc(ch.label)}">${chapterHTML(ch, c, h, i, story.length)}</article>`).join('');
    const progress = story.map((ch, i) => `<li><button type="button" class="dp-progress__dot" data-goto="${ch.id}" aria-label="Chapter ${i + 1}: ${h.esc(ch.label)}"></button></li>`).join('');

    const legend = AREAS.map((a) => `<li><span style="--area:${a.color}" aria-hidden="true"></span>${h.esc(a.label)}</li>`).join('');

    const projectRows = c.projects
        .map(
            (p) => `
        <li class="dp-row" data-reveal>
            <h3 class="dp-row__name"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
            <p class="dp-row__kind"><span style="--area:${areaOf(p).color}" aria-hidden="true"></span>${h.esc(p.kicker)}</p>
            <p class="dp-row__summary">${h.esc(p.summary)}</p>
            <p class="dp-row__stack"><span class="visually-hidden">Tech stack: </span>${p.stack.map((t) => h.esc(t)).join(' · ')}</p>
            <p class="dp-row__links">${h.projectLinksHTML(p, { cls: 'dp-link', decorate: (l) => h.icon(l.external ? 'arrow-up-right' : 'arrow-right') })}</p>
        </li>`
        )
        .join('');

    const skills = c.skills
        .map((g, i) => `<li class="dp-slab" data-reveal style="--i:${i % 3};--stone:${STONE_COLORS[i]}"><h3>${h.esc(g.group)}</h3><ul>${g.items.map((s) => `<li>${h.esc(s)}</li>`).join('')}</ul></li>`)
        .join('');

    const jobs = c.experience
        .map((e) => `<li class="dp-job" data-reveal><p class="dp-job__date">${h.dateRange(e)}</p><h3>${h.esc(e.role)} <span>· ${h.esc(e.org)}</span></h3><ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul></li>`)
        .join('');

    const educationOf = (list) =>
        list
        .map((e) => `<li class="dp-job dp-job--edu" data-reveal><p class="dp-job__date">${h.esc(e.org)}</p><h3>${h.esc(e.title)}</h3><ul>${e.meta.map((m) => `<li>${h.esc(m)}</li>`).join('')}</ul></li>`)
        .join('');

    const education = educationOf(c.education);
    const events = educationOf(c.achievements);

    return `
<div class="dp">
    <header class="dp-header">
        <a class="dp-brand" href="#main">${h.esc(person.name)}</a>
        <button class="dp-menu-btn" type="button" aria-expanded="false" aria-controls="dp-nav">Menu</button>
        <nav class="dp-nav" id="dp-nav" aria-label="Primary"><ul>${nav}</ul></nav>
    </header>

    <main id="main" tabindex="-1">
        <section class="dp-stage" aria-labelledby="hero-title">
            <div class="dp-intro">
                <h1 id="hero-title" class="dp-intro__name">${h.esc(person.name)}</h1>
                <p class="dp-intro__role">${h.esc(person.role)} · ${h.esc(person.focus)}</p>
                <p class="dp-intro__tagline">${h.esc(person.tagline)}</p>
                <p class="dp-intro__actions">
                    <button type="button" class="dp-btn dp-btn--solid" data-explore>Explore the model</button>
                    <a class="dp-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)} ${h.icon('download')}</a>
                </p>
                <div class="dp-key">
                    <p class="dp-key__title">Reading the model</p>
                    <p>Each building is a project. <strong>Floors</strong> = technologies in its stack. <strong>Roof</strong> = its area:</p>
                    <ul class="dp-key__areas">${legend}</ul>
                </div>
            </div>

            <div class="dp-scene" data-state="loading">
                <ol class="dp-progress" aria-label="Tour chapters">${progress}</ol>
                <div class="dp-tags" role="group" aria-label="Projects and landmarks in the model. Use the arrow keys to move between them.">${labels}</div>
                <p class="dp-status" role="status">Loading the model…</p>
                <p class="dp-hint" aria-hidden="true">Drag to turn · select a building · ← → to step through</p>
                <div class="dp-hud">
                    <button type="button" class="dp-hud__btn" data-turn="-1" aria-label="Turn the model left">${h.icon('arrow-right', 'dp-flip')}</button>
                    <button type="button" class="dp-hud__btn" data-reset>Reset view</button>
                    <button type="button" class="dp-hud__btn" data-turn="1" aria-label="Turn the model right">${h.icon('arrow-right')}</button>
                    <a class="dp-hud__btn" href="#projects">List view</a>
                </div>
                <aside class="dp-panel" hidden tabindex="-1" aria-labelledby="dp-panel-title">
                    <div class="dp-panel__body"></div>
                    <p class="dp-panel__nav">
                        <button type="button" class="dp-hud__btn" data-step="-1">Previous</button>
                        <button type="button" class="dp-hud__btn" data-step="1">Next</button>
                        <button type="button" class="dp-hud__btn dp-panel__close" data-close>Close <kbd>Esc</kbd></button>
                    </p>
                </aside>
            </div>

            <div class="dp-tour" aria-label="A guided tour of the model">${tour}</div>
        </section>

        <section id="projects" class="dp-section" aria-labelledby="projects-title">
            <header class="dp-section__head">
                <h2 id="projects-title">Projects</h2>
                <p>The same ${c.projects.length} buildings as a list. Each has a case study covering how it works, the stack, and exactly what I did.</p>
            </header>
            <ol class="dp-rows">${projectRows}</ol>
            <p class="dp-more"><a class="dp-btn" href="${h.esc(c.caseStudiesHref)}">All case studies ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="about" class="dp-section dp-about" aria-labelledby="about-title">
            <figure class="dp-about__photo" data-reveal>${h.portrait(person.portrait, { sizes: '(max-width: 768px) 70vw, 28vw' })}</figure>
            <div class="dp-about__text" data-reveal style="--i:1">
                <h2 id="about-title">About</h2>
                ${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}
            </div>
        </section>

        <section id="skills" class="dp-section" aria-labelledby="skills-title">
            <header class="dp-section__head"><h2 id="skills-title">Skills</h2><p>One stone on the plaza for each group.</p></header>
            <ul class="dp-slabs">${skills}</ul>
        </section>

        <section id="experience" class="dp-section" aria-labelledby="experience-title">
            <header class="dp-section__head"><h2 id="experience-title">Experience</h2></header>
            <ol class="dp-jobs">${jobs}</ol>
            <h3 class="dp-subhead">Education</h3>
            <ul class="dp-jobs">${education}</ul>
            <h3 class="dp-subhead">Hackathons &amp; events</h3>
            <ul class="dp-jobs">${events}</ul>
            <p class="dp-more"><a class="dp-btn" href="${h.esc(c.achievementsHref)}">Achievements &amp; certificates ${h.icon('arrow-right')}</a> <a class="dp-btn" href="${h.esc(c.aboutHref)}">Full profile ${h.icon('arrow-right')}</a></p>
        </section>

        <section id="contact" class="dp-section dp-contact" aria-labelledby="contact-title">
            <h2 id="contact-title">Get in touch</h2>
            <p class="dp-contact__lead">${h.esc(contact.message)}</p>
            <a class="dp-contact__email" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a>
            <ul class="dp-contact__list">
                <li><a class="dp-link" href="${h.esc(contact.phone.href)}">${h.icon('telephone')} ${h.esc(contact.phone.label)}</a></li>
                <li class="dp-contact__loc">${h.icon('geo-alt')} ${h.esc(contact.location)}</li>
                ${c.socials.map((s) => `<li>${h.link({ href: s.href, inner: `${h.icon(s.id)} ${h.esc(s.label)}`, external: true, cls: 'dp-link' })}</li>`).join('')}
            </ul>
        </section>
    </main>

    <footer class="dp-footer">
        <p>© ${year} ${h.esc(person.name)}</p>
        <p><a class="dp-link" href="#main">Back to top</a></p>
    </footer>
</div>`;
}

/** Panel content for a project or landmark, from content.js only. */
function panelHTML(id, c, h) {
    const p = c.projects.find((x) => x.slug === id);
    if (p) {
        const links = h.projectLinks(p);
        const hasPublic = links.some((l) => l.external);
        return `
            <h2 id="dp-panel-title" class="dp-panel__title">${h.esc(p.name)}</h2>
            <p class="dp-panel__kind">${h.esc(p.kicker)}</p>
            <p class="dp-panel__area"><span style="--area:${areaOf(p).color}" aria-hidden="true"></span>${h.esc(areaOf(p).label)} · ${p.stack.length} floors, one per technology</p>
            <p>${h.esc(p.summary)}</p>
            <ul class="dp-panel__stack" aria-label="Tech stack">${p.stack.map((t) => `<li>${h.esc(t)}</li>`).join('')}</ul>
            <p class="dp-panel__links">${h.projectLinksHTML(p, { cls: 'dp-btn dp-btn--small', decorate: (l) => h.icon(l.external ? 'arrow-up-right' : 'arrow-right') })}</p>
            ${hasPublic ? '' : '<p class="dp-panel__note">Built for a client: no public repository or demo. The case study covers what can be shared.</p>'}`;
    }
    if (id === 'about') {
        return `
            <h2 id="dp-panel-title" class="dp-panel__title">${h.esc(c.person.name)}</h2>
            <p class="dp-panel__kind">${h.esc(c.person.role)} · ${h.esc(c.person.location)}</p>
            ${c.person.about.map((t) => `<p>${h.esc(t)}</p>`).join('')}
            <p class="dp-panel__links"><a class="dp-btn dp-btn--small" href="#about">Read on the page ${h.icon('arrow-right')}</a><a class="dp-btn dp-btn--small" href="${h.esc(c.person.resume.href)}" type="application/pdf">${h.esc(c.person.resume.label)}</a></p>`;
    }
    if (id === 'skills') {
        return `
            <h2 id="dp-panel-title" class="dp-panel__title">Skills</h2>
            <p class="dp-panel__kind">Six stones, six groups</p>
            <dl class="dp-panel__skills">${c.skills.map((g) => `<dt>${h.esc(g.group)}</dt><dd>${g.items.map((s) => h.esc(s)).join(' · ')}</dd>`).join('')}</dl>`;
    }
    if (id === 'contact') {
        return `
            <h2 id="dp-panel-title" class="dp-panel__title">Contact</h2>
            <p>${h.esc(c.contact.message)}</p>
            <p class="dp-panel__links">
                <a class="dp-btn dp-btn--small dp-btn--solid" href="${h.esc(h.mailto(c.contact.email))}">${h.esc(c.contact.email)}</a>
                <a class="dp-btn dp-btn--small" href="${h.esc(c.contact.phone.href)}">${h.esc(c.contact.phone.label)}</a>
                ${c.socials.map((s) => h.link({ href: s.href, text: s.label, external: true, cls: 'dp-btn dp-btn--small' })).join('')}
            </p>`;
    }
    return '';
}

export function init(root, ctx) {
    menuToggle(root.querySelector('.dp-menu-btn'), root.querySelector('.dp-nav'), ctx, { closeAbove: '(min-width: 801px)' });
    revealOnScroll(root, ctx);
    trackActiveSection(root, [...root.querySelectorAll('.dp-nav a')], ctx);
    setupMaquette(root, ctx);
}

function setupMaquette(root, ctx) {
    const sceneEl = root.querySelector('.dp-scene');
    const tagsEl = root.querySelector('.dp-tags');
    const tags = new Map([...root.querySelectorAll('.dp-tag')].map((b) => [b.dataset.item, b]));
    const order = [...tags.keys()];
    const projectIds = order.filter((id) => !['about', 'skills', 'contact'].includes(id));
    const panel = root.querySelector('.dp-panel');
    const panelBody = panel.querySelector('.dp-panel__body');
    const status = root.querySelector('.dp-status');
    const opts = { signal: ctx.signal };
    let scene = null;
    let openId = null;
    let lastTrigger = null;
    const story = chapters(ctx.content);
    let chapter = story[0];
    let userControl = false; // set by drag or panel; cleared when the next chapter starts

    state = { ctx };
    const { content, helpers } = ctx;

    const setState = (s) => (sceneEl.dataset.state = s);
    const dismissHint = () => sceneEl.classList.add('is-touched');

    // ---- Panel ----
    function open(id, { trigger } = {}) {
        openId = id;
        lastTrigger = trigger || tags.get(id) || lastTrigger;
        panelBody.innerHTML = panelHTML(id, content, helpers);
        panel.hidden = false;
        panel.dataset.kind = projectIds.includes(id) ? 'project' : 'landmark';
        tags.forEach((b, key) => b.setAttribute('aria-pressed', String(key === id)));
        updateInset();
        scene?.focus(id);
        dismissHint();
        panel.focus({ preventScroll: true });
    }

    function close() {
        if (!openId) return;
        openId = null;
        panel.hidden = true;
        tags.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        scene?.setInset(0, 0);
        // Back to where the story was, rather than the bare overview.
        if (scene) userControl ? scene.focus(null) : scene.story(chapter.view);
        lastTrigger?.focus({ preventScroll: true });
    }

    // Keep the selected building in the part of the model the panel doesn't cover.
    function updateInset() {
        if (!scene || panel.hidden) return;
        const sheet = window.matchMedia('(max-width: 960px)').matches;
        scene.setInset(sheet ? 0 : panel.offsetWidth + 16, sheet ? panel.offsetHeight : 0);
    }
    window.addEventListener('resize', updateInset, { ...opts, passive: true });

    function step(dir) {
        const list = projectIds;
        const i = Math.max(0, list.indexOf(openId));
        const next = list[(i + dir + list.length) % list.length];
        open(next, { trigger: tags.get(next) });
    }

    // ---- Labels (the accessible face of every object) ----
    tagsEl.addEventListener('click', (e) => {
        const b = e.target.closest('.dp-tag');
        if (b) open(b.dataset.item, { trigger: b });
    }, opts);

    tagsEl.addEventListener('focusin', (e) => scene?.setHover(e.target.closest('.dp-tag')?.dataset.item ?? null), opts);
    tagsEl.addEventListener('focusout', () => scene?.setHover(null), opts);
    tagsEl.addEventListener('pointerover', (e) => scene?.setHover(e.target.closest('.dp-tag')?.dataset.item ?? null), opts);
    tagsEl.addEventListener('pointerout', () => scene?.setHover(null), opts);

    // Arrow keys move between labels (roving through the model).
    tagsEl.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const i = order.indexOf(document.activeElement?.dataset.item);
        tags.get(order[(i + dir + order.length) % order.length]).focus();
    }, opts);

    // ---- Panel controls ----
    panel.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) close();
        const s = e.target.closest('[data-step]');
        if (s) step(Number(s.dataset.step));
    }, opts);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && openId) close();
        if (openId && panel.dataset.kind === 'project' && !e.target.closest('input, textarea') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && panel.contains(document.activeElement)) {
            e.preventDefault();
            step(e.key === 'ArrowRight' ? 1 : -1);
        }
    }, opts);

    // ---- HUD ----
    root.querySelector('.dp-hud').addEventListener('click', (e) => {
        if (e.target.closest('[data-reset]')) {
            close();
            userControl = false;
            scene?.story(chapter.view);
        }
        const t = e.target.closest('[data-turn]');
        if (t) {
            scene?.rotate(Number(t.dataset.turn) * 0.6);
            dismissHint();
        }
    }, opts);

    root.querySelector('[data-explore]').addEventListener('click', () => {
        sceneEl.scrollIntoView({ block: 'center', behavior: ctx.reducedMotion ? 'instant' : 'smooth' });
        tags.get(projectIds[0])?.focus({ preventScroll: true });
        dismissHint();
    }, opts);

    sceneEl.addEventListener('maquette:interact', () => {
        dismissHint();
        userControl = true;
    }, opts);

    // ---- Scroll story ----
    const chapterEls = new Map([...root.querySelectorAll('.dp-chapter')].map((el) => [el.dataset.chapter, el]));
    const dots = new Map([...root.querySelectorAll('.dp-progress__dot')].map((b) => [b.dataset.goto, b]));

    function enterChapter(id) {
        const next = story.find((ch) => ch.id === id);
        if (!next || next === chapter) return;
        chapter = next;
        userControl = false; // a new chapter hands the camera back to the story
        chapterEls.forEach((el, key) => el.classList.toggle('is-active', key === id));
        dots.forEach((b, key) => (key === id ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
        if (!openId) scene?.story(chapter.view);
    }
    chapterEls.get(story[0].id)?.classList.add('is-active');
    dots.get(story[0].id)?.setAttribute('aria-current', 'step');

    // The chapter crossing the reading band is the active one: the middle of the
    // viewport beside the model, or the band below it where the model pins on top.
    const narrow = window.matchMedia('(max-width: 960px)');
    let chapterIO = null;
    function observeChapters() {
        chapterIO?.disconnect();
        chapterIO = new IntersectionObserver((entries) => {
            const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (hit) enterChapter(hit.target.dataset.chapter);
        }, { rootMargin: narrow.matches ? '-62% 0px -18% 0px' : '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5] });
        chapterEls.forEach((el) => chapterIO.observe(el));
    }
    observeChapters();
    narrow.addEventListener('change', observeChapters, opts);
    ctx.onCleanup(() => chapterIO?.disconnect());

    root.querySelector('.dp-progress').addEventListener('click', (e) => {
        const b = e.target.closest('[data-goto]');
        if (!b) return;
        chapterEls.get(b.dataset.goto)?.scrollIntoView({ block: narrow.matches ? 'end' : 'center', behavior: ctx.reducedMotion ? 'instant' : 'smooth' });
    }, opts);

    root.querySelector('.dp-tour').addEventListener('click', (e) => {
        const b = e.target.closest('[data-open-item]');
        if (b) open(b.dataset.openItem, { trigger: b });
    }, opts);

    // ---- Label placement (written straight to each label's transform) ----
    function place(positions) {
        for (const [id, p] of positions) {
            const b = tags.get(id);
            if (!b) continue;
            b.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
            b.classList.toggle('is-behind', !p.visible);
        }
    }

    // ---- Boot the 3D scene; anything failing leaves the list mode in place ----
    const fallback = (why) => {
        scene?.dispose();
        scene = null;
        setState('fallback');
        status.textContent = why;
        tags.forEach((b) => (b.style.transform = ''));
    };

    (async () => {
        try {
            const { supportsWebGL, loadThree, createScene } = await import('./depth-scene.js');
            if (!supportsWebGL()) return fallback('3D isn’t available in this browser, so the model is shown as a list.');
            const THREE = await loadThree();
            if (ctx.signal.aborted) return;
            const items = [
                ...content.projects.map((p, i) => {
                    const hsh = hash(p.slug);
                    return {
                        id: p.slug,
                        kind: 'building',
                        floors: Math.max(1, p.stack.length),
                        accent: areaOf(p).color,
                        cell: PLOTS[i % PLOTS.length],
                        // Footprint varies per project (stable: from its slug), within the plot.
                        w: 1.0 + ((hsh % 7) / 7) * 0.32,
                        d: 1.0 + (((hsh >> 3) % 7) / 7) * 0.32,
                    };
                }),
                { id: 'about', kind: 'monolith' },
                { id: 'skills', kind: 'stones', count: content.skills.length, palette: STONE_COLORS },
                { id: 'contact', kind: 'mast' },
            ];
            const host = sceneEl;
            scene = createScene({
                THREE,
                host,
                items,
                onHover: (id) => tags.forEach((b, key) => b.classList.toggle('is-hot', key === id)),
                onSelect: (id) => open(id),
                onProject: place,
                reducedMotion: () => ctx.reducedMotion,
                onLost: () => fallback('The 3D view stopped responding, so the model is shown as a list.'),
            });
            setState('ready');
            status.textContent = 'Model ready. Drag to turn it, or use the labels.';
            if (!openId) scene.story(chapter.view);
        } catch (err) {
            console.warn('[portfolio] maquette unavailable', err);
            if (!ctx.signal.aborted) fallback('The 3D model couldn’t load, so it’s shown as a list.');
        }
    })();

    ctx.onCleanup(() => {
        scene?.dispose();
        scene = null;
        state = null;
    });
}

export function cleanup() {
    state = null;
}
