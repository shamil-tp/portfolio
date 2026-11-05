/**
 * design-registry.js — the list of design identities.
 *
 * A classic (non-module) script loaded synchronously in <head>, so boot.js can
 * pick a design and start fetching its stylesheet before the body renders.
 * The engine (an ES module) reads the same object from window, so this is the
 * only place a design is declared.
 *
 * Each entry:
 *   id          unique key, used in ?design=<id> and data-design="<id>"
 *   name        human-readable name shown in the design indicator
 *   description one line about the experience
 *   stylesheet      homepage stylesheet, path relative to the site root
 *   caseStylesheet  case-study stylesheet (myProjectDetails/), same rules
 *   fonts       optional Google Fonts stylesheet URL (null = self-hosted/system)
 *   module      path relative to js/; exports render(content, h) and
 *               init(root, ctx) for the homepage, and may export cleanup()
 *               and enhanceCase(ctx, h) for case-study pages
 *   supportsGenerativeUI  true: each visit gets a generated variation of this
 *               design (palette, layout, type, motion; see js/generative-ui.js).
 *               false: the design always looks the same (Depth).
 *   themeColor  value for <meta name="theme-color">
 */
window.PortfolioRegistry = {
    defaultId: 'minimal',
    designs: [
        {
            id: 'minimal',
            name: 'Swiss',
            description: 'A precise twelve-column grid, one red accent and a numbered index.',
            stylesheet: 'css/design-minimal.css',
            caseStylesheet: 'css/case-minimal.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
            module: 'designs/minimal.js',
            supportsGenerativeUI: true,
            themeColor: '#f2f1ed',
        },
        {
            id: 'brutalist',
            name: 'Brutalist',
            description: 'Oversized type, hard borders, offset shadows and loud colour blocks.',
            stylesheet: 'css/design-brutalist.css',
            caseStylesheet: 'css/case-brutalist.css',
            fonts: null,
            module: 'designs/brutalist.js',
            supportsGenerativeUI: true,
            themeColor: '#fff200',
        },
        {
            id: 'depth',
            name: 'Depth',
            description: 'A clay model of the portfolio to turn and explore: buildings are projects.',
            stylesheet: 'css/design-3d.css',
            caseStylesheet: 'css/case-3d.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;700&family=Hanken+Grotesk:wght@400;500&display=swap',
            module: 'designs/depth.js',
            supportsGenerativeUI: false, // the maquette keeps one fixed identity
            themeColor: '#0e141a',
        },
        {
            id: 'os',
            name: 'Desktop OS',
            description: 'A retro desktop with draggable windows, icons and a taskbar.',
            stylesheet: 'css/design-os.css',
            caseStylesheet: 'css/case-os.css',
            fonts: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&family=Silkscreen&display=swap',
            module: 'designs/os.js',
            supportsGenerativeUI: true,
            themeColor: '#0f7c7a',
        },
        {
            id: 'editorial',
            name: 'Editorial',
            description: 'A magazine feature: serif headlines, drop caps and ruled columns.',
            stylesheet: 'css/design-editorial.css',
            caseStylesheet: 'css/case-editorial.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap',
            module: 'designs/editorial.js',
            supportsGenerativeUI: true,
            themeColor: '#f3eee4',
        },
        {
            id: 'generative',
            name: 'Generative',
            description: 'Tiles, glyphs and palette generated from a seed on every visit.',
            stylesheet: 'css/design-generative.css',
            caseStylesheet: 'css/case-generative.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Syne:wght@500..800&family=Manrope:wght@400..700&display=swap',
            module: 'designs/generative.js',
            supportsGenerativeUI: true,
            themeColor: '#f4f1ea',
        },
        {
            id: 'terminal',
            name: 'Terminal',
            description: 'A portfolio shell: real commands for about, projects, skills and contact.',
            stylesheet: 'css/design-terminal.css',
            caseStylesheet: 'css/case-terminal.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap',
            module: 'designs/terminal.js',
            supportsGenerativeUI: true,
            themeColor: '#15171c',
        },
        {
            id: 'blueprint',
            name: 'Blueprint',
            description: 'A drawing set: a project schematic, schedules, notes and a title block.',
            stylesheet: 'css/design-blueprint.css',
            caseStylesheet: 'css/case-blueprint.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Chivo+Mono:wght@400;500&display=swap',
            module: 'designs/blueprint.js',
            supportsGenerativeUI: true,
            themeColor: '#f2f1ea',
        },
        {
            id: 'studio',
            name: 'Studio',
            description: 'A playful independent studio: colour blocks, big type, tactile cards.',
            stylesheet: 'css/design-studio.css',
            caseStylesheet: 'css/case-studio.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Cormorant:ital,wght@1,500&display=swap',
            module: 'designs/studio.js',
            supportsGenerativeUI: true,
            themeColor: '#f7f2e8',
        },
        {
            id: 'garden',
            name: 'Garden',
            description: 'A calm generative garden: every project grows its own plant.',
            stylesheet: 'css/design-garden.css',
            caseStylesheet: 'css/case-garden.css',
            fonts: 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Mulish:wght@400..700&display=swap',
            module: 'designs/garden.js',
            supportsGenerativeUI: true,
            themeColor: '#f3eee2',
        },
    ],
};
