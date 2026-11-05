/**
 * Design 07 — Terminal.
 * The portfolio as a shell session. The page loads with a session already
 * run (whoami, about, projects, skills, experience, contact), so every
 * section is readable without typing. The prompt at the bottom accepts a
 * small, honest set of commands that print portfolio information; nothing
 * is executed on any machine, and the shell says so.
 *
 * Keyboard: Enter runs, ↑/↓ walk the history, Tab completes, Ctrl+L clears.
 * Every command is also a button in the shortcut bar (touch friendly).
 */

const PS1_FULL = '<span class="tm-ps1"><span class="tm-ps1__user">shamil@portfolio</span>:<span class="tm-ps1__path">~</span>$</span>';
const PS1_SHORT = '<span class="tm-ps1"><span class="tm-ps1__path">~</span> <span class="tm-ps1__user">$</span></span>';
// Set per mount from the variation (prompt: full | short); live commands reuse it.
let PS1 = PS1_FULL;

let navigateImpl = null;

/* ---------- Output builders (shared by the pre-run session and live commands) ---------- */

function aboutOut(c, h) {
    return `
        ${c.person.about.map((p) => `<p>${h.esc(p)}</p>`).join('')}
        <dl class="tm-kv">
            <div><dt>role</dt><dd>${h.esc(c.person.role)} (${h.esc(c.person.focus.toLowerCase())})</dd></div>
            <div><dt>location</dt><dd>${h.esc(c.person.location)}</dd></div>
            <div><dt>status</dt><dd class="tm-ok">${h.esc(c.person.status)}</dd></div>
            <div><dt>more</dt><dd>${h.link({ href: c.aboutHref, text: 'about/', cls: 'tm-link' })} · ${h.link({ href: c.achievementsHref, text: 'achievements/', cls: 'tm-link' })}</dd></div>
        </dl>`;
}

function projectsOut(c, h, { headingLevel = 3, short = false } = {}) {
    const H = `h${headingLevel}`;
    return `
        <p class="tm-dim">${c.projects.length} projects${short ? ' (short listing)' : ''} · <kbd>open &lt;name&gt;</kbd> prints one in full</p>
        <ol class="tm-projects">${c.projects
            .map(
                (p, i) => `
            <li class="tm-project">
                <span class="tm-project__n" aria-hidden="true">${String(i + 1).padStart(2, ' ')}</span>
                <${H} class="tm-project__name"><a href="${h.esc(p.caseStudy)}">${h.esc(p.name)}</a></${H}>
                <span class="tm-project__kind">${h.esc(p.kicker)}</span>
                <p class="tm-project__summary">${h.esc(p.summary)}</p>
                <p class="tm-project__links">${h.projectLinksHTML(p, { cls: 'tm-link' })}<button type="button" class="tm-inline" data-run="open ${h.esc(p.slug)}">open ${h.esc(p.slug)}</button></p>
            </li>`
            )
            .join('')}</ol>`;
}

function projectOut(p, h) {
    const links = h.projectLinks(p);
    return `
        <div class="tm-detail">
            <p class="tm-detail__title">${h.esc(p.name)} <span class="tm-dim">— ${h.esc(p.kicker)}</span></p>
            <p>${h.esc(p.summary)}</p>
            <dl class="tm-kv">
                <div><dt>stack</dt><dd>${p.stack.map((t) => h.esc(t)).join(', ')}</dd></div>
                ${links.map((l) => `<div><dt>${h.esc(l.label.toLowerCase())}</dt><dd>${h.link({ href: l.href, text: l.href.replace(/^https?:\/\//, ''), external: l.external, sr: l.sr, cls: 'tm-link' })}</dd></div>`).join('')}
            </dl>
            ${links.some((l) => l.external) ? '' : '<p class="tm-warn">client project: no public repository or demo</p>'}
        </div>`;
}

function skillsOut(c, h) {
    return `<ul class="tm-tree">${c.skills
        .map(
            (g, gi) => `<li><span class="tm-tree__branch" aria-hidden="true">${gi === c.skills.length - 1 ? '└──' : '├──'}</span> <strong>${h.esc(g.group)}</strong>
                <ul>${g.items.map((s, i) => `<li><span class="tm-tree__branch" aria-hidden="true">${gi === c.skills.length - 1 ? '    ' : '│   '}${i === g.items.length - 1 ? '└──' : '├──'}</span> ${h.esc(s)}</li>`).join('')}</ul></li>`
        )
        .join('')}</ul>`;
}

function experienceOut(c, h, { headingLevel = 3 } = {}) {
    const H = `h${headingLevel}`;
    const job = (date, title, org, lines) => `
        <li class="tm-log">
            <p class="tm-log__date">${date}</p>
            <${H} class="tm-log__title">${title} <span class="tm-dim">@ ${org}</span></${H}>
            <ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>
        </li>`;
    return `<ol class="tm-logs">
        ${c.experience.map((e) => job(h.dateRange(e), h.esc(e.role), h.esc(e.org), e.bullets.map((b) => h.rich(b)))).join('')}
        ${c.education.map((e) => job('education', h.esc(e.title), h.esc(e.org), e.meta.map((m) => h.esc(m)))).join('')}
        ${c.achievements.map((e) => job(h.esc(e.date.label), h.esc(e.title), h.esc(e.org), [h.esc(e.meta[1])])).join('')}
    </ol>`;
}

function contactOut(c, h) {
    return `
        <p>${h.esc(c.contact.message)}</p>
        <dl class="tm-kv">
            <div><dt>email</dt><dd>${h.link({ href: h.mailto(c.contact.email), text: c.contact.email, cls: 'tm-link' })}</dd></div>
            <div><dt>phone</dt><dd>${h.link({ href: c.contact.phone.href, text: c.contact.phone.label, cls: 'tm-link' })}</dd></div>
            ${c.socials.map((s) => `<div><dt>${h.esc(s.label.toLowerCase())}</dt><dd>${h.link({ href: s.href, text: s.href.replace(/^https?:\/\/(www\.)?/, ''), external: true, cls: 'tm-link' })}</dd></div>`).join('')}
            <div><dt>resume</dt><dd>${h.link({ href: c.person.resume.href, text: c.person.resume.label, cls: 'tm-link' })}</dd></div>
        </dl>`;
}

const COMMANDS = [
    { name: 'help', about: 'list the commands this shell knows' },
    { name: 'about', about: 'who I am and what I work on' },
    { name: 'projects', about: 'all projects, with links' },
    { name: 'open', args: '<name>', about: 'one project in full, e.g. open rewind' },
    { name: 'skills', about: 'skills, grouped' },
    { name: 'experience', about: 'work, education, hackathons and events' },
    { name: 'contact', about: 'email, phone and profiles' },
    { name: 'resume', about: 'link to the PDF résumé' },
    { name: 'clear', about: 'clear the screen (Ctrl+L)' },
];

function helpOut(h) {
    return `
        <p class="tm-dim">A portfolio shell. It only knows these commands; nothing runs on a real machine.</p>
        <dl class="tm-help">${COMMANDS.map((cmd) => `<div><dt><button type="button" class="tm-inline" data-run="${cmd.name}${cmd.args ? ' rewind' : ''}">${cmd.name}</button>${cmd.args ? ` <span class="tm-dim">${h.esc(cmd.args)}</span>` : ''}</dt><dd>${h.esc(cmd.about)}</dd></div>`).join('')}</dl>
        <p class="tm-dim">↑/↓ history · Tab completes · Ctrl+L clears</p>`;
}

/* ---------- Render ---------- */

export function render(c, h, variation) {
    const { person } = c;
    const v = variation?.layout ?? {};
    PS1 = v.prompt === 'short' ? PS1_SHORT : PS1_FULL;
    const readme = v.intro === 'readme';
    const short = v.listing === 'compact';
    const year = new Date().getFullYear();
    const windows = h.sections.map((s, i) => `<li><a href="#${s.id}"><span aria-hidden="true">${i}:</span>${h.esc(s.label.toLowerCase())}</a></li>`).join('');
    const block = (id, cmd, title, body) => `
        <section id="${id}" class="tm-block" aria-labelledby="${id}-title">
            <p class="tm-cmd">${PS1} <span class="tm-cmd__text">${h.esc(cmd)}</span></p>
            <h2 id="${id}-title" class="tm-heading">${h.esc(title)}</h2>
            <div class="tm-out">${body}</div>
        </section>`;

    return `
<div class="tm">
    <header class="tm-status">
        <p class="tm-status__session">[portfolio]</p>
        <nav class="tm-windows" aria-label="Primary"><ul>${windows}</ul></nav>
        <p class="tm-status__host" aria-hidden="true">${h.esc(person.name.toLowerCase().replace(/\s+/g, ''))}</p>
    </header>

    <main id="main" class="tm-screen" tabindex="-1">
        <section class="tm-block tm-block--motd" aria-labelledby="hero-title">
            <p class="tm-cmd">${PS1} <span class="tm-cmd__text">${readme ? 'cat README.md' : 'whoami'}</span></p>
            <h1 id="hero-title" class="tm-name">${readme ? '<span class="tm-name__mark" aria-hidden="true"># </span>' : ''}${h.esc(person.name)}</h1>
            <p class="tm-role">${h.esc(person.role)} · ${h.esc(person.focus)} · ${h.esc(person.location)}</p>
            <p class="tm-tagline">${h.esc(person.tagline)}</p>
            <p class="tm-dim">Type <button type="button" class="tm-inline" data-run="help">help</button> or use the buttons at the bottom. This is a portfolio, not a real shell.</p>
        </section>
        ${block('about', 'cat about.md', 'About', aboutOut(c, h))}
        ${block('projects', short ? 'projects --short' : 'projects', 'Projects', projectsOut(c, h, { short }))}
        ${block('skills', 'skills', 'Skills', skillsOut(c, h))}
        ${block('experience', 'experience', 'Experience', experienceOut(c, h))}
        ${block('contact', 'contact', 'Contact', contactOut(c, h))}
        <div class="tm-live" aria-live="polite"></div>
        <form class="tm-prompt" autocomplete="off">
            <label for="tm-input">${PS1}<span class="visually-hidden"> Enter a command, for example help</span></label>
            <span class="tm-cursor" aria-hidden="true"></span>
            <input id="tm-input" class="tm-input" type="text" placeholder=" " spellcheck="false" autocapitalize="off" autocorrect="off" enterkeyhint="go" aria-describedby="tm-input-hint">
            <p id="tm-input-hint" class="visually-hidden">Commands: ${COMMANDS.map((c2) => c2.name).join(', ')}. Up and down arrows walk the history.</p>
        </form>
        <footer class="tm-footer">
            <p class="tm-dim">© ${year} ${h.esc(person.name)} · <a class="tm-link" href="${h.esc(c.caseStudiesHref)}">all case studies</a></p>
        </footer>
    </main>

    <nav class="tm-keys" aria-label="Commands">
        ${COMMANDS.filter((x) => x.name !== 'open').map((x) => `<button type="button" class="tm-key" data-run="${x.name}">${x.name}</button>`).join('')}
    </nav>
</div>`;
}

/* ---------- Shell ---------- */

export function init(root, ctx) {
    const { content: c, helpers: h } = ctx;
    const input = root.querySelector('#tm-input');
    const live = root.querySelector('.tm-live');
    const form = root.querySelector('.tm-prompt');
    const blocks = [...root.querySelectorAll('.tm-block')];
    const history = [];
    let cursor = -1;
    const opts = { signal: ctx.signal };

    const findProject = (q) => {
        const s = q.trim().toLowerCase();
        if (!s) return null;
        const n = Number(s);
        if (Number.isInteger(n) && n >= 1 && n <= c.projects.length) return c.projects[n - 1];
        return c.projects.find((p) => p.slug === s || p.name.toLowerCase() === s) ?? c.projects.find((p) => p.name.toLowerCase().startsWith(s) || p.slug.startsWith(s));
    };

    function run(raw, { focusInput = false } = {}) {
        const line = raw.trim();
        if (!line) return;
        history.push(line);
        cursor = history.length;
        const [cmd, ...rest] = line.split(/\s+/);
        const arg = rest.join(' ');
        let out;
        switch (cmd.toLowerCase()) {
            case 'help': out = helpOut(h); break;
            case 'about': case 'whoami': out = aboutOut(c, h); break;
            case 'projects': case 'ls':
                if (/^(--short|-s)$/.test(arg)) {
                    out = projectsOut(c, h, { headingLevel: 4, short: true });
                    break;
                }
                out = arg ? (findProject(arg) ? projectOut(findProject(arg), h) : `<p class="tm-err">no project matches “${h.esc(arg)}”. Try <button type="button" class="tm-inline" data-run="projects">projects</button>.</p>`) : projectsOut(c, h, { headingLevel: 4 });
                break;
            case 'open': case 'cat': {
                if (cmd === 'cat' && /^(about|readme)(\.md)?$/i.test(arg)) {
                    out = aboutOut(c, h);
                    break;
                }
                const p = findProject(arg);
                out = p ? projectOut(p, h) : `<p class="tm-err">${arg ? `no project matches “${h.esc(arg)}”` : 'open needs a project name'}. Names: ${c.projects.map((x) => `<button type="button" class="tm-inline" data-run="open ${x.slug}">${x.slug}</button>`).join(' ')}</p>`;
                break;
            }
            case 'skills': out = skillsOut(c, h); break;
            case 'experience': case 'history': out = experienceOut(c, h, { headingLevel: 4 }); break;
            case 'contact': out = contactOut(c, h); break;
            case 'resume': out = `<p>${h.link({ href: c.person.resume.href, text: c.person.resume.label, cls: 'tm-link' })}</p>`; break;
            case 'clear':
                live.replaceChildren();
                blocks.forEach((b) => (b.hidden = true));
                live.insertAdjacentHTML('beforeend', `<p class="tm-dim tm-cleared">screen cleared · the sections are still one tap away in the bar at the top</p>`);
                if (focusInput) input.focus({ preventScroll: true });
                window.scrollTo({ top: 0, behavior: 'instant' });
                return;
            case 'sudo':
                out = `<p class="tm-err">nice try. This shell has no superuser, and no real system behind it.</p>`;
                break;
            default:
                out = `<p class="tm-err">command not found: ${h.esc(cmd)}. Try <button type="button" class="tm-inline" data-run="help">help</button>.</p>`;
        }
        const entry = document.createElement('div');
        entry.className = 'tm-entry';
        entry.innerHTML = `<p class="tm-cmd">${PS1} <span class="tm-cmd__text">${h.esc(line)}</span></p><div class="tm-out">${out}</div>`;
        live.append(entry);
        // Keyboard-initiated: output appears instantly, no animation.
        entry.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        form.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        if (focusInput) input.focus({ preventScroll: true });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value;
        input.value = '';
        run(v, { focusInput: true });
    }, opts);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && history.length) {
            e.preventDefault();
            cursor = Math.max(0, cursor - 1);
            input.value = history[cursor] ?? '';
        } else if (e.key === 'ArrowDown' && history.length) {
            e.preventDefault();
            cursor = Math.min(history.length, cursor + 1);
            input.value = history[cursor] ?? '';
        } else if (e.key === 'Tab' && input.value.trim()) {
            const v = input.value.trimStart().toLowerCase();
            const [cmd, arg] = v.split(/\s+/, 2);
            let match;
            if (arg !== undefined && ['open', 'cat', 'projects'].includes(cmd)) {
                const p = c.projects.find((x) => x.slug.startsWith(arg));
                if (p) match = `${cmd} ${p.slug}`;
            } else {
                const m = COMMANDS.find((x) => x.name.startsWith(cmd));
                if (m) match = m.name + (m.args ? ' ' : '');
            }
            if (match) {
                e.preventDefault();
                input.value = match;
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            run('clear', { focusInput: true });
        }
    }, opts);

    // Clickable commands anywhere on the screen or in the key bar.
    root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-run]');
        if (!b) return;
        run(b.dataset.run);
    }, opts);

    // Clicking empty screen space puts the caret in the prompt (fine pointers only, so taps still scroll).
    root.querySelector('.tm-screen').addEventListener('click', (e) => {
        if (!ctx.finePointer || e.target.closest('a, button, input, [data-run]') || window.getSelection()?.toString()) return;
        input.focus({ preventScroll: true });
    }, opts);

    // After `clear`, the section links bring the session back.
    const restore = () => blocks.forEach((b) => (b.hidden = false));
    root.querySelector('.tm-windows').addEventListener('click', restore, opts);
    navigateImpl = restore;
    ctx.onCleanup(() => (navigateImpl = null));
}

export function navigate(id) {
    navigateImpl?.(id);
}
