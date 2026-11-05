/**
 * Design D — Desktop OS.
 * Each section is an application window on a retro desktop.
 *
 * Desktop mode (wide + tall screens): windows float, can be dragged by the
 * title bar (or moved with the arrow keys on the grip button), focused to
 * the front, minimised to the taskbar, maximised and closed. Nothing is lost
 * by closing: desktop icons, the taskbar and the Start menu reopen everything,
 * and #hash links open the matching window.
 *
 * Stacked mode (phones, tablets, short screens): windows sit in normal page
 * flow. Minimise collapses a window to its title bar, close hides it, and
 * the taskbar brings it back.
 *
 * A generative-UI variation chooses which side the desktop icons sit on
 * (icons), which window starts in front (front), how many start open (open)
 * and the open-animation length (--os-open-ms). Every window is always
 * reachable from the icons, taskbar and Start menu whatever the variation.
 */
import { menuToggle } from '../interactions.js';

const APPS = [
    { id: 'projects', title: 'Projects', ext: '', icon: 'folder' },
    { id: 'about', title: 'About', ext: '.txt', icon: 'doc' },
    { id: 'skills', title: 'Skills', ext: '.cfg', icon: 'chip' },
    { id: 'experience', title: 'Experience', ext: '.log', icon: 'case' },
    { id: 'contact', title: 'Contact', ext: '', icon: 'mail' },
];

const DESKTOP_MQ = '(min-width: 1024px) and (min-height: 620px)';
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;
const MIN_VISIBLE = 96; // px of a dragged window that must stay on the desktop

/* Authored pixel-style icons (24×24, shared palette). */
const ICONS = {
    folder: '<path d="M2 6h8l2 2h10v12H2z" fill="#f6d25b"/><path d="M2 9h20v11H2z" fill="#ffe58a"/><path d="M2 6h8l2 2h10v12H2z" fill="none" stroke="#1b1b1b" stroke-width="1.5"/>',
    doc: '<path d="M5 2h10l4 4v16H5z" fill="#fff"/><path d="M15 2v4h4" fill="#d9d9d9"/><path d="M5 2h10l4 4v16H5z" fill="none" stroke="#1b1b1b" stroke-width="1.5"/><path d="M8 10h8M8 13h8M8 16h5" stroke="#1b1b1b" stroke-width="1.5"/>',
    chip: '<rect x="6" y="6" width="12" height="12" fill="#5ab2ff" stroke="#1b1b1b" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" fill="#0c3d8a"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="#1b1b1b" stroke-width="1.5"/>',
    case: '<rect x="2" y="7" width="20" height="13" fill="#c8874a" stroke="#1b1b1b" stroke-width="1.5"/><path d="M8 7V4h8v3" fill="none" stroke="#1b1b1b" stroke-width="1.5"/><path d="M2 12h20" stroke="#1b1b1b" stroke-width="1.5"/><rect x="10" y="10.5" width="4" height="3" fill="#ffe58a" stroke="#1b1b1b"/>',
    mail: '<rect x="2" y="5" width="20" height="14" fill="#fff" stroke="#1b1b1b" stroke-width="1.5"/><path d="M2 5l10 8 10-8" fill="none" stroke="#1b1b1b" stroke-width="1.5"/><rect x="15" y="12" width="5" height="5" fill="#e04848"/>',
    pdf: '<path d="M5 2h10l4 4v16H5z" fill="#fff"/><path d="M5 2h10l4 4v16H5z" fill="none" stroke="#1b1b1b" stroke-width="1.5"/><rect x="3" y="12" width="14" height="6" fill="#e04848"/><path d="M5.5 16.5v-3h1.3a1 1 0 0 1 0 2H5.5M9.5 16.5v-3h1a1.5 1.5 0 0 1 0 3zM13.5 16.5v-3h2M13.5 15h1.5" stroke="#fff" stroke-width="0.9" fill="none"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="#7fd0ff" stroke="#1b1b1b" stroke-width="1.5"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="#1b1b1b" stroke-width="1.2"/>',
    start: '<rect x="3" y="3" width="8" height="8" fill="#e04848"/><rect x="13" y="3" width="8" height="8" fill="#3cb44b"/><rect x="3" y="13" width="8" height="8" fill="#4363d8"/><rect x="13" y="13" width="8" height="8" fill="#ffd400"/>',
};

const CONTROL_ICONS = {
    minimize: '<path d="M3 11h8" stroke="currentColor" stroke-width="2"/>',
    maximize: '<rect x="2.5" y="2.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 3.5h9" stroke="currentColor" stroke-width="2"/>',
    close: '<path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2"/>',
    grip: '<path d="M7 1v12M1 7h12M7 1l-2 2M7 1l2 2M7 13l-2-2M7 13l2-2M1 7l2-2M1 7l2 2M13 7l-2-2M13 7l-2 2" stroke="currentColor" stroke-width="1.3" fill="none"/>',
};

const pixelIcon = (name, cls = 'os-pix') =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
const controlIcon = (name) => `<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">${CONTROL_ICONS[name]}</svg>`;

function windowShell(app, h, body, { statusText = '' } = {}) {
    return `
    <section id="${app.id}" class="os-window" data-window="${app.id}" aria-labelledby="${app.id}-title" tabindex="-1">
        <div class="os-titlebar" data-drag-handle>
            ${pixelIcon(app.icon, 'os-pix os-pix--title')}
            <h2 id="${app.id}-title" class="os-title">${h.esc(app.title)}<span aria-hidden="true">${h.esc(app.ext)}</span></h2>
            <div class="os-controls">
                <button type="button" class="os-ctl os-ctl--grip" data-action="move" aria-label="Move ${h.esc(app.title)} window with arrow keys">${controlIcon('grip')}</button>
                <button type="button" class="os-ctl" data-action="minimize" aria-label="Minimize ${h.esc(app.title)}">${controlIcon('minimize')}</button>
                <button type="button" class="os-ctl os-ctl--max" data-action="maximize" aria-label="Maximize ${h.esc(app.title)}" aria-pressed="false">${controlIcon('maximize')}</button>
                <button type="button" class="os-ctl" data-action="close" aria-label="Close ${h.esc(app.title)}">${controlIcon('close')}</button>
            </div>
        </div>
        <div class="os-window__body">${body}</div>
        ${statusText ? `<p class="os-status">${statusText}</p>` : ''}
    </section>`;
}

export function render(c, h) {
    const { person, contact } = c;
    const year = new Date().getFullYear();
    const app = (id) => APPS.find((a) => a.id === id);

    const projectRows = c.projects
        .map(
            (p) => `
        <li class="os-file">
            ${pixelIcon(p.source ? 'folder' : 'case')}
            <div class="os-file__main">
                <h3 class="os-file__name"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></h3>
                <p class="os-file__kind">${h.esc(p.kicker)}</p>
                <p class="os-file__summary">${h.esc(p.summary)}</p>
                <p class="os-file__stack"><span class="visually-hidden">Tech stack: </span>${p.stack.map((t) => h.esc(t)).join(' · ')}</p>
                <p class="os-file__links">${h.projectLinksHTML(p, { cls: 'os-btn' })}</p>
            </div>
        </li>`
        )
        .join('');

    const projects = windowShell(
        app('projects'),
        h,
        `<div class="os-toolbar" role="presentation"><span>Address</span><span class="os-field">C:\\Shamil\\Projects</span></div>
         <ul class="os-files">${projectRows}</ul>
         <p class="os-after"><a class="os-btn" href="${h.esc(c.caseStudiesHref)}">Open all case studies</a></p>`,
        { statusText: `${c.projects.length} object(s)` }
    );

    const about = windowShell(
        app('about'),
        h,
        `<div class="os-about">
            <figure class="os-inset os-about__photo">${h.portrait(person.portrait, { sizes: '160px' })}</figure>
            <div class="os-about__text">
                <p class="os-about__who"><strong>${h.esc(person.name)}</strong><br>${h.esc(person.role)} · ${h.esc(person.focus)}<br>${h.esc(person.location)}</p>
                <p class="os-about__tagline">${h.esc(person.tagline)}</p>
                ${person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}
                <p><a class="os-btn" href="${h.esc(person.resume.href)}" type="application/pdf">${h.esc(person.resume.label)}</a></p>
            </div>
        </div>`,
        { statusText: person.status }
    );

    const skills = windowShell(
        app('skills'),
        h,
        `<div class="os-groups">${c.skills
            .map(
                (g) => `
            <div class="os-group">
                <h3 class="os-group__title">${h.esc(g.group)}</h3>
                <ul>${g.items.map((s) => `<li><span class="os-check" aria-hidden="true"></span>${h.esc(s)}</li>`).join('')}</ul>
            </div>`
            )
            .join('')}</div>`
    );

    const experience = windowShell(
        app('experience'),
        h,
        `<ol class="os-log">${c.experience
            .map(
                (e) => `
            <li class="os-log__entry">
                <p class="os-log__date">${h.dateRange(e)}</p>
                <h3>${h.esc(e.role)}</h3>
                <p class="os-log__org">${h.esc(e.org)}</p>
                <ul>${e.bullets.map((b) => `<li>${h.rich(b)}</li>`).join('')}</ul>
            </li>`
            )
            .join('')}</ol>
         <h3 class="os-subhead">Education</h3>
         <ul class="os-log">${c.education
             .map(
                 (e) => `
            <li class="os-log__entry">
                <p class="os-log__date">${h.esc(e.org)}</p>
                <h4>${h.esc(e.title)}</h4>
                ${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}
            </li>`
             )
             .join('')}</ul>
         <h3 class="os-subhead">Hackathons &amp; events</h3>
         <ul class="os-log">${c.achievements
             .map(
                 (e) => `
            <li class="os-log__entry">
                <p class="os-log__date">${h.esc(e.org)}</p>
                <h4>${h.esc(e.title)}</h4>
                ${e.meta.map((m) => `<p>${h.esc(m)}</p>`).join('')}
            </li>`
             )
             .join('')}</ul>
         <p class="os-more"><a href="${h.esc(c.achievementsHref)}">Achievements and certificates</a> · <a href="${h.esc(c.aboutHref)}">Full profile</a></p>`
    );

    const mail = windowShell(
        app('contact'),
        h,
        `<div class="os-mail">
            <p class="os-mail__row"><span>To:</span> <a class="os-field os-field--link" href="${h.esc(h.mailto(contact.email))}">${h.esc(contact.email)}</a></p>
            <p class="os-mail__row"><span>Phone:</span> <a class="os-field os-field--link" href="${h.esc(contact.phone.href)}">${h.esc(contact.phone.label)}</a></p>
            <p class="os-mail__row"><span>Where:</span> <span class="os-field">${h.esc(contact.location)}</span></p>
            <p class="os-mail__body os-inset">${h.esc(contact.message)}</p>
            <p class="os-mail__actions">
                <a class="os-btn os-btn--default" href="${h.esc(h.mailto(contact.email))}">Write an email</a>
                ${c.socials.map((s) => h.link({ href: s.href, text: s.label, external: true, cls: 'os-btn' })).join('')}
            </p>
        </div>`
    );

    const desktopIcons = APPS.map(
        (a) => `<li><a class="os-icon" href="#${a.id}" data-open="${a.id}">${pixelIcon(a.icon)}<span>${h.esc(a.title)}<span class="os-icon__ext">${h.esc(a.ext)}</span></span></a></li>`
    ).join('');

    const startItems = APPS.map(
        (a) => `<li><a href="#${a.id}" data-open="${a.id}">${pixelIcon(a.icon)}${h.esc(a.title)}</a></li>`
    ).join('');

    const tasks = APPS.map(
        (a) => `<li><button type="button" class="os-task" data-task="${a.id}" aria-pressed="false">${pixelIcon(a.icon)}<span>${h.esc(a.title)}</span></button></li>`
    ).join('');

    return `
<div class="os">
    <div class="os-desktop">
        <div class="os-wallpaper">
            <h1 id="hero-title" class="os-hero">${h.esc(person.name)}</h1>
            <p class="os-hero__role">${h.esc(person.role)} — ${h.esc(person.focus)}</p>
            <p class="os-hero__tagline">${h.esc(person.tagline)}</p>
        </div>

        <nav class="os-icons" aria-label="Primary">
            <ul>
                ${desktopIcons}
                <li><a class="os-icon" href="${h.esc(person.resume.href)}" type="application/pdf">${pixelIcon('pdf')}<span>Resume<span class="os-icon__ext">.pdf</span></span></a></li>
                <li><a class="os-icon" href="${h.esc(c.caseStudiesHref)}">${pixelIcon('globe')}<span>Case studies</span></a></li>
            </ul>
        </nav>

        <main id="main" class="os-windows" tabindex="-1">
            ${projects}${about}${skills}${experience}${mail}
        </main>
    </div>

    <footer class="os-taskbar">
        <button type="button" class="os-start" aria-expanded="false" aria-controls="os-startmenu">${pixelIcon('start')}<span>Start</span></button>
        <div class="os-startmenu" id="os-startmenu">
            <p class="os-startmenu__side" aria-hidden="true">${h.esc(person.name)}</p>
            <ul>
                ${startItems}
                <li><a href="${h.esc(person.resume.href)}" type="application/pdf">${pixelIcon('pdf')}Resume (PDF)</a></li>
                <li><a href="${h.esc(c.caseStudiesHref)}">${pixelIcon('globe')}All case studies</a></li>
            </ul>
        </div>
        <ul class="os-tasks" aria-label="Open windows">${tasks}</ul>
        <p class="os-tray"><span>© ${year}</span> <time class="os-clock" aria-hidden="true"></time></p>
    </footer>
</div>`;
}

export function init(root, ctx) {
    const area = root.querySelector('.os-windows');
    const windows = new Map([...root.querySelectorAll('.os-window')].map((w) => [w.dataset.window, w]));
    const tasks = new Map([...root.querySelectorAll('.os-task')].map((b) => [b.dataset.task, b]));
    const mq = window.matchMedia(DESKTOP_MQ);
    const opts = { signal: ctx.signal };
    let z = 10;
    const v = ctx.variation?.layout ?? {};
    const startFront = state0Front(v.front);
    const openMs = () => {
        const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--os-open-ms'));
        return Number.isFinite(ms) ? ms : 180;
    };

    // Window state lives in JS; the DOM reflects it via classes.
    const state = new Map(
        [...windows.keys()].map((id) => [id, { open: true, minimized: false, maximized: false, x: 0, y: 0, w: 0, h: 0 }])
    );

    const isDesktop = () => mq.matches;

    function syncTask(id) {
        const s = state.get(id);
        const visible = s.open && !s.minimized;
        tasks.get(id)?.setAttribute('aria-pressed', String(visible));
        tasks.get(id)?.classList.toggle('is-closed', !s.open);
    }

    function apply(id) {
        const win = windows.get(id);
        const s = state.get(id);
        win.classList.toggle('is-closed', !s.open);
        win.classList.toggle('is-minimized', s.minimized);
        win.classList.toggle('is-maximized', s.maximized && isDesktop());
        win.querySelector('[data-action="maximize"]').setAttribute('aria-pressed', String(s.maximized));
        win.querySelector('[data-action="minimize"]').setAttribute('aria-expanded', String(!s.minimized));
        if (isDesktop() && !s.maximized) {
            win.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
            win.style.width = `${s.w}px`;
            win.style.height = s.h ? `${s.h}px` : '';
        } else {
            win.style.transform = '';
            win.style.width = '';
            win.style.height = '';
        }
        syncTask(id);
    }

    function front(id) {
        const win = windows.get(id);
        win.style.zIndex = String(++z);
        windows.forEach((w) => w.classList.toggle('is-active', w === win));
    }

    function isFront(id) {
        return windows.get(id).classList.contains('is-active');
    }

    function open(id, { focus = true } = {}) {
        const s = state.get(id);
        if (!s) return;
        s.open = true;
        s.minimized = false;
        apply(id);
        front(id);
        const win = windows.get(id);
        // Authored moment: windows open with a short zoom from slightly smaller.
        const duration = openMs();
        if (isDesktop() && !s.maximized && !ctx.reducedMotion && win.animate && duration > 0) {
            const base = `translate3d(${s.x}px, ${s.y}px, 0)`;
            win.animate(
                [{ opacity: 0, transform: `${base} scale(0.96)` }, { opacity: 1, transform: `${base} scale(1)` }],
                { duration, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
            );
        }
        if (focus) win.focus({ preventScroll: isDesktop() });
        if (!isDesktop()) win.scrollIntoView({ block: 'start', behavior: ctx.reducedMotion ? 'instant' : 'smooth' });
    }

    function minimize(id) {
        const s = state.get(id);
        s.minimized = !isDesktop() ? !s.minimized : true;
        apply(id);
        if (isDesktop()) tasks.get(id)?.focus();
    }

    function close(id) {
        const s = state.get(id);
        s.open = false;
        s.maximized = false;
        apply(id);
        tasks.get(id)?.focus();
    }

    function toggleMax(id) {
        const s = state.get(id);
        s.maximized = !s.maximized;
        apply(id);
        front(id);
    }

    /** Default cascade for desktop mode, sized from the desktop area. */
    function layout() {
        const W = area.clientWidth;
        const H = area.clientHeight;
        const left = Math.min(150, W * 0.12); // clear of the desktop icons
        const three = v.open === 'three';
        const plan = {
            projects: { x: W * 0.36, y: H * 0.04, w: Math.min(W * 0.6, 900), h: H * 0.9, minimized: false },
            about: { x: left, y: H * 0.08, w: Math.min(W * 0.36, 520), h: H * 0.7, minimized: false },
            skills: { x: left + 40, y: H * (three ? 0.26 : 0.14), w: Math.min(W * 0.42, 600), h: H * (three ? 0.6 : 0.72), minimized: !three },
            experience: { x: left + 80, y: H * 0.06, w: Math.min(W * 0.5, 700), h: H * 0.86, minimized: true },
            contact: { x: W * 0.42, y: H * 0.22, w: Math.min(W * 0.4, 520), h: 0, minimized: true },
        };
        // Icons on the right: the whole arrangement mirrors so windows stay clear of them.
        const mirror = v.icons === 'right';
        for (const [id, p] of Object.entries(plan)) {
            const s = state.get(id);
            const x = mirror ? W - p.x - p.w : p.x;
            Object.assign(s, { x: Math.round(x), y: Math.round(p.y), w: Math.round(p.w), h: Math.round(p.h), minimized: p.minimized, open: true, maximized: false });
        }
    }

    function clamp(s) {
        const W = area.clientWidth;
        const H = area.clientHeight;
        s.x = Math.min(Math.max(s.x, MIN_VISIBLE - s.w), W - MIN_VISIBLE);
        s.y = Math.min(Math.max(s.y, 0), H - 40);
    }

    function setMode() {
        root.querySelector('.os').classList.toggle('is-desktop', isDesktop());
        if (isDesktop()) {
            layout();
        } else {
            state.forEach((s) => Object.assign(s, { open: true, minimized: false, maximized: false }));
        }
        state.forEach((_, id) => apply(id));
        // With three windows open, Skills sits in the middle of the stack.
        if (isDesktop() && v.open === 'three') front('skills');
        front(startFront === 'about' ? 'projects' : 'about');
        front(startFront);
    }

    setMode();
    mq.addEventListener('change', setMode, opts);

    // ---- Window controls ----
    area.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const id = btn.closest('.os-window').dataset.window;
        if (btn.dataset.action === 'minimize') minimize(id);
        else if (btn.dataset.action === 'maximize') toggleMax(id);
        else if (btn.dataset.action === 'close') close(id);
    }, opts);

    // Bring to front on interaction.
    area.addEventListener('pointerdown', (e) => {
        const win = e.target.closest('.os-window');
        if (win) front(win.dataset.window);
    }, opts);
    area.addEventListener('focusin', (e) => {
        const win = e.target.closest('.os-window');
        if (win && !isFront(win.dataset.window)) front(win.dataset.window);
    }, opts);

    // ---- Dragging (pointer, desktop mode only) ----
    let drag = null;
    area.addEventListener('pointerdown', (e) => {
        const handle = e.target.closest('[data-drag-handle]');
        if (!handle || !isDesktop() || e.button !== 0 || drag || e.target.closest('button')) return;
        const id = handle.closest('.os-window').dataset.window;
        const s = state.get(id);
        if (s.maximized) return;
        drag = { id, pointer: e.pointerId, sx: e.clientX, sy: e.clientY, ox: s.x, oy: s.y, el: windows.get(id) };
        handle.setPointerCapture(e.pointerId);
        drag.el.classList.add('is-dragging');
        e.preventDefault();
    }, opts);

    area.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.pointer) return;
        const s = state.get(drag.id);
        s.x = drag.ox + e.clientX - drag.sx;
        s.y = drag.oy + e.clientY - drag.sy;
        clamp(s);
        drag.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    }, opts);

    const endDrag = (e) => {
        if (!drag || e.pointerId !== drag.pointer) return;
        drag.el.classList.remove('is-dragging');
        drag = null;
    };
    area.addEventListener('pointerup', endDrag, opts);
    area.addEventListener('pointercancel', endDrag, opts);

    // Double-click a title bar to maximise/restore (desktop convention).
    area.addEventListener('dblclick', (e) => {
        const handle = e.target.closest('[data-drag-handle]');
        if (handle && isDesktop() && !e.target.closest('button')) toggleMax(handle.closest('.os-window').dataset.window);
    }, opts);

    // ---- Keyboard move: arrow keys on the grip button ----
    area.addEventListener('keydown', (e) => {
        const grip = e.target.closest('[data-action="move"]');
        if (!grip || !isDesktop()) return;
        const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!delta) return;
        e.preventDefault();
        const id = grip.closest('.os-window').dataset.window;
        const s = state.get(id);
        if (s.maximized) return;
        const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
        s.x += delta[0] * step;
        s.y += delta[1] * step;
        clamp(s);
        apply(id);
    }, opts);

    // ---- Taskbar ----
    root.querySelector('.os-tasks').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-task]');
        if (!btn) return;
        const id = btn.dataset.task;
        const s = state.get(id);
        if (isDesktop() && s.open && !s.minimized && isFront(id)) minimize(id);
        else open(id);
    }, opts);

    // ---- Icons and Start menu links open windows (hash links still work without JS) ----
    root.addEventListener('click', (e) => {
        const link = e.target.closest('[data-open]');
        if (!link) return;
        e.preventDefault();
        const id = link.dataset.open;
        history.replaceState(null, '', `#${id}`);
        open(id);
    }, opts);

    menuToggle(root.querySelector('.os-start'), root.querySelector('.os-startmenu'), ctx);

    // ---- Clock ----
    const clock = root.querySelector('.os-clock');
    const tick = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clock.dateTime = now.toISOString();
    };
    tick();
    const timer = setInterval(tick, 30_000);
    ctx.onCleanup(() => clearInterval(timer));

    // Re-fit windows after the viewport shrinks.
    window.addEventListener('resize', () => {
        if (!isDesktop()) return;
        state.forEach((s, id) => {
            clamp(s);
            apply(id);
        });
    }, { ...opts, passive: true });

    // Engine hook for #hash navigation.
    navigateImpl = (id) => {
        if (state.has(id)) open(id, { focus: true });
    };
    ctx.onCleanup(() => {
        navigateImpl = null;
    });
}

let navigateImpl = null;

/** The window that starts in front: Projects (default) or About. */
const state0Front = (front) => (front === 'about' ? 'about' : 'projects');

export function navigate(id) {
    navigateImpl?.(id);
}
