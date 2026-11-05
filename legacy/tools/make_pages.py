"""Build /about/index.html and /achievements/index.html in the case-study page
system (data-page="case"), sharing the head, nav, footer and dock markup of
the existing case studies."""
import json, os, re

ROOT = '.'
SITE = 'https://shamiltp.me/'
rewind = open('myProjectDetails/rewind.html', encoding='utf-8').read()
tail = rewind[rewind.index('    <svg width="0" height="0"'):]  # sprite + dock + </body></html>

PERSON_ID = SITE + '#person'

def head(path, title, desc, og_title, og_image, og_alt, ld):
    url = SITE + path
    return f'''<!DOCTYPE html>
<html lang="en" data-page="case">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{desc}">
    <link rel="canonical" href="{url}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="Shamil TP">
    <meta name="theme-color" content="#F5F2EB">
    <meta property="og:type" content="{'profile' if path == 'about/' else 'website'}">
    <meta property="og:site_name" content="Shamil TP">
    <meta property="og:title" content="{og_title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:url" content="{url}">
    <meta property="og:image" content="{og_image}">
    <meta property="og:image:alt" content="{og_alt}">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@ShamilTp6">
    <meta name="twitter:title" content="{og_title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="{og_image}">
    <link rel="icon" href="../favicon.ico" sizes="32x32">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="../apple-touch-icon.png">
    <link rel="manifest" href="../site.webmanifest">
    <script type="application/ld+json">
{json.dumps(ld, indent=4, ensure_ascii=False)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="../css/tokens.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/case-base.css">
    <!-- Picks the design (kept from the previous page when following a link) before the body renders. -->
    <script src="../js/design-registry.js"></script>
    <script src="../js/boot.js"></script>
    <script type="module" src="../js/case-main.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></noscript>
</head>
<body>
    <a class="skip-link" href="#main">Skip to content</a>
    <nav class="navbar" aria-label="Site">
        <div class="container nav-container">
            <a href="../" class="logo">shamiltp<span class="highlight">.me</span></a>
            <ul class="nav-links">
                <li><a href="../">Home</a></li>
                <li><a href="../about/">About</a></li>
                <li><a href="../myProjectDetails/mycontributions.html">Projects</a></li>
                <li><a href="../achievements/">Achievements</a></li>
            </ul>
        </div>
    </nav>
'''

def breadcrumb_ld(name, path):
    return {
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE},
            {'@type': 'ListItem', 'position': 2, 'name': name, 'item': SITE + path},
        ],
    }

def footer():
    return '''    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Shamil TP · <a href="../">shamiltp.me</a> · <a href="../about/">About</a> · <a href="../myProjectDetails/mycontributions.html">Projects</a> · <a href="../achievements/">Achievements</a></p>
        </div>
    </footer>


'''

PERSON = {
    '@type': 'Person',
    '@id': PERSON_ID,
    'name': 'Shamil TP',
    'alternateName': 'Shamil T P',
    'url': SITE,
    'image': SITE + 'assets/img/profile-700.jpg',
    'jobTitle': 'Full Stack Developer',
    'affiliation': {'@type': 'CollegeOrUniversity', 'name': "St. Joseph's College (Autonomous), Devagiri"},
    'alumniOf': {'@type': 'CollegeOrUniversity', 'name': 'Safi Institute of Advanced Study'},
    'sameAs': ['https://github.com/shamil-tp', 'https://www.linkedin.com/in/shamil-tp/', 'https://x.com/ShamilTp6'],
}

# ------------------------------------------------------------------ about
about_path = 'about/'
about_desc = "Shamil TP is a backend-focused full stack developer from Kerala, studying for an MCA at St. Joseph's College, Devagiri. Projects, home server and IoT work."
about_ld = {
    '@context': 'https://schema.org',
    '@graph': [
        breadcrumb_ld('About', about_path),
        {
            '@type': 'ProfilePage',
            '@id': SITE + about_path + '#page',
            'url': SITE + about_path,
            'name': 'About Shamil TP',
            'description': about_desc,
            'isPartOf': {'@id': SITE + '#website'},
            'mainEntity': {'@id': PERSON_ID},
            'inLanguage': 'en',
        },
        {**PERSON, 'mainEntityOfPage': {'@id': SITE + about_path + '#page'}},
    ],
}

def evidence(rows):
    return '\n'.join(f'                        <tr><td>{a}</td><td>{b}</td></tr>' for a, b in rows)

P = '../myProjectDetails/'
tech_rows = [
    ('Node.js &amp; Express', f'<a href="{P}njin.html">N-jin</a>, <a href="{P}blogify.html">Blogify</a>, <a href="{P}osmium.html">Osmium</a>, <a href="{P}skylark.html">Skylark</a>, <a href="{P}coffeecat.html">coffeeCat</a>'),
    ('Python &amp; FastAPI', f'<a href="{P}oopspilot.html">OpsPilot</a> backend'),
    ('Go', f'<a href="{P}rewind.html">Rewind</a>, a single Go binary'),
    ('Next.js', f'<a href="{P}regretmap.html">RegretMap</a>'),
    ('Redis', f'<a href="{P}njin.html">N-jin</a> caching layer'),
    ('PostgreSQL, Supabase, MongoDB, SQLite', f'<a href="{P}oopspilot.html">OpsPilot</a>, <a href="{P}regretmap.html">RegretMap</a>, <a href="{P}njin.html">N-jin</a>, <a href="{P}rewind.html">Rewind</a>'),
    ('Webhooks', f'GitHub webhooks in <a href="{P}oopspilot.html">OpsPilot</a>'),
    ('GitHub Actions CI/CD', f'Test, build and deploy pipelines and tag-driven releases: <a href="{P}rewind.html">Rewind</a> (<a href="https://github.com/shamil-tp/rewind/releases">releases</a>), <a href="{P}oopspilot.html">OpsPilot</a>'),
    ('Cloudflare', f'Cloudflare R2 storage in <a href="{P}lume.html">LUME</a>'),
    ('FFmpeg &amp; HLS', f'<a href="{P}lume.html">LUME</a> media pipeline'),
    ('Nginx &amp; Ubuntu Server', 'My home server (below)'),
    ('MicroPython, ESP32, Raspberry Pi Pico 2 W', '<a href="https://github.com/shamil-tp/micropython">shamil-tp/micropython</a>'),
    ('Agentic workflow automation, Google Apps Script', 'Automation work; no public write-up yet'),
]

about_body = f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <div class="container"><ol><li><a href="../">Home</a></li><li><span aria-current="page">About</span></li></ol></div>
    </nav>

    <header class="page-header">
        <div class="container">
            <h1 class="page-title">About Shamil TP</h1>
            <p class="page-subtitle">Backend-focused full stack developer from Kerala, India, studying for an MCA at St. Joseph's College (Autonomous), Devagiri.</p>
        </div>
    </header>

    <main id="main" class="main-content">
        <div class="container content-grid">
            <div class="main-column">

                <section class="content-section" id="background">
                    <h2 class="section-heading">Background</h2>
                    <div class="prose">
                        <p>I'm Shamil TP (my name appears as Shamil T P on some certificates, and my handle is <strong>shamil-tp</strong> on GitHub). I'm a developer motivated by a sincere interest in how the internet works underneath. I can build responsive frontends, but my area is the backend, where data efficiency, server architecture and logic come together.</p>
                        <p>I like low-level details because memory and performance work has a noticeable effect, and I enjoy making systems faster and more dependable. Since November 2023 I've worked as a freelance full stack developer for independent clients, and from December 2024 to March 2025 I was a full stack development intern at Fugipie Technologies.</p>
                    </div>
                    <p class="page-links">
                        <a class="link-btn primary" href="../myProjectDetails/mycontributions.html">All projects</a>
                        <a class="link-btn" href="../achievements/">Achievements</a>
                        <a class="link-btn" href="../Shamil_TP_Resume_ATS(1).pdf" type="application/pdf">Resume (PDF)</a>
                    </p>
                </section>

                <hr class="section-divider">

                <section class="content-section" id="education">
                    <h2 class="section-heading">Education</h2>
                    <table class="info-table">
                        <tr><td>Now</td><td><strong>Master of Computer Applications (MCA)</strong>, St. Joseph's College (Autonomous), Devagiri, Kozhikode · 2026–2028 batch, in progress</td></tr>
                        <tr><td>2025</td><td><strong>Bachelor of Computer Application (BCA)</strong>, Safi Institute of Advanced Study · graduated March 2025, CGPA 7.76/10</td></tr>
                        <tr><td>2025</td><td><strong>MERN Stack Web Development</strong>, DataTribe · 6-month course, May–November 2025, grade A+ (<a href="../achievements/#datatribe-mern-2025">certificate</a>)</td></tr>
                    </table>
                </section>

                <hr class="section-divider">

                <section class="content-section" id="home-server">
                    <h2 class="section-heading">My home server</h2>
                    <div class="prose">
                        <p>I maintain a personal home server running <strong>Ubuntu Server</strong>, with <strong>Nginx</strong> in front, and I deploy most of my backends to it.</p>
                        <p>Releases are automated with <strong>GitHub Actions</strong>. <a href="{P}rewind.html">Rewind</a>, my self-hosted music server, is the clearest example: every push runs formatting, vetting and race-detector tests; deploys test, build, smoke-test and ship over SSH; and a version tag builds and publishes a release (<a href="https://github.com/shamil-tp/rewind/releases">see its releases</a>).</p>
                    </div>
                </section>

                <hr class="section-divider">

                <section class="content-section" id="iot">
                    <h2 class="section-heading">IoT experiments</h2>
                    <div class="prose">
                        <p>Away from the web, I'm interested in IoT. I write <strong>MicroPython</strong> for the <strong>ESP32</strong> and the <strong>Raspberry Pi Pico 2 W</strong>; the experiments live in <a href="https://github.com/shamil-tp/micropython">github.com/shamil-tp/micropython</a>.</p>
                    </div>
                </section>

                <hr class="section-divider">

                <section class="content-section" id="skills">
                    <h2 class="section-heading">What I use, and where</h2>
                    <div class="prose">
                        <p>Each technology with the work that shows it.</p>
                    </div>
                    <table class="info-table">
{evidence(tech_rows)}
                    </table>
                </section>

                <hr class="section-divider">

                <section class="content-section" id="hackathons">
                    <h2 class="section-heading">Hackathons and events</h2>
                    <div class="prose">
                        <p>My first hackathon was Beyond Us in 2023. In 2026 my teams built <a href="{P}regretmap.html">RegretMap</a> at Layover (top 13) and <a href="{P}oopspilot.html">OpsPilot</a> at the Gateways 2026 hackathon (top 37), and I took part in the AI Unplugged 2026 symposium. Details and certificates are on the <a href="../achievements/">achievements page</a>.</p>
                    </div>
                </section>

            </div>

            <aside class="sidebar-column">
                <div class="sidebar-widget" id="contact">
                    <h2 class="widget-title">Official profiles</h2>
                    <div class="prose">
                        <p>These are mine; other developers share the name Shamil.</p>
                    </div>
                    <div class="stack">
                        <a href="../" class="link-btn link-btn--block"><i class="bi bi-house"></i> shamiltp.me</a>
                        <a href="https://github.com/shamil-tp" class="link-btn link-btn--block"><i class="bi bi-github"></i> GitHub: shamil-tp</a>
                        <a href="https://www.linkedin.com/in/shamil-tp/" class="link-btn link-btn--block"><i class="bi bi-linkedin"></i> LinkedIn: in/shamil-tp</a>
                        <a href="https://x.com/ShamilTp6" class="link-btn link-btn--block"><i class="bi bi-twitter-x"></i> X: @ShamilTp6</a>
                        <a href="mailto:shamiltp073@gmail.com" class="link-btn primary link-btn--block"><i class="bi bi-envelope"></i> shamiltp073@gmail.com</a>
                    </div>
                </div>
                <div class="sidebar-widget">
                    <h2 class="widget-title">Live projects on my domain</h2>
                    <div class="stack">
                        <a href="https://opspilot.shamiltp.me" class="link-btn link-btn--block"><i class="bi bi-robot"></i> opspilot.shamiltp.me</a>
                        <a href="https://regret-map.shamiltp.me/" class="link-btn link-btn--block"><i class="bi bi-geo-alt"></i> regret-map.shamiltp.me</a>
                    </div>
                </div>
            </aside>
        </div>
    </main>

'''

# ------------------------------------------------------------------ achievements
# Facts mirror js/content.js (achievements, certifications); sources are the certificates.
ACH = [
    dict(id='layover-2026', h='Layover 2026: top 13 with RegretMap', kind='Hackathon', organizer='TinkerHub', place='TinkerSpace Calicut, Kozhikode',
         date='10–11 October 2026', start='2026-10-10', end='2026-10-11', result='Selected in the top 13 projects',
         project=('RegretMap', 'regretmap.html'),
         text=f'<p>Layover was an overnight hackathon organised by TinkerHub at TinkerSpace Calicut, running from the evening of 10 October to the morning of 11 October 2026. Our team built <a href="{P}regretmap.html">RegretMap</a>, a community map of travel lessons with AI summaries and a chat grounded only in real traveller stories, and it was selected among the top 13 projects.</p><p>I set up the project\'s foundation and built the map, data layer, authentication, comments and the Gemini key pool. RegretMap is live at <a href="https://regret-map.shamiltp.me/">regret-map.shamiltp.me</a>.</p>',
         cert='layover-2026', original='Layover2026.png', w=717, hgt=752, cap='Proof of participation, issued by TinkerHub.', portrait=True),
    dict(id='gateways-2026', h='Gateways 2026: top 37 with OpsPilot', kind='Hackathon', organizer='Department of Computer Science, CHRIST (Deemed to be University)', place='Bangalore',
         date='30 September – 1 October 2026', start='2026-09-30', end='2026-10-01', result='Placed in the top 37',
         project=('OpsPilot', 'oopspilot.html'),
         text=f'<p>24° Shift was the international-level hackathon of Gateways 2026, the national-level inter-collegiate IT fest run by the Department of Computer Science at CHRIST (Deemed to be University), Bangalore. Our team built <a href="{P}oopspilot.html">OpsPilot</a>, an incident-response copilot that investigates outages from real evidence, proposes fixes and executes them only after a human approves, and placed in the top 37.</p><p>I built OpsPilot\'s FastAPI backend, deployment, CI/CD and GitHub webhooks. It is live at <a href="https://opspilot.shamiltp.me">opspilot.shamiltp.me</a>.</p>',
         cert='gateways-2026', original='Gateways2026.png', w=1400, hgt=987, cap='Certificate of participation, Gateways 2026 (ID GW26-REG-174658).'),
    dict(id='ai-unplugged-2026', h='AI Unplugged 2026', kind='Symposium', organizer="Department of Computer Science, St. Joseph's College (Autonomous), Devagiri", place='Kozhikode',
         date='13 July 2026', start='2026-07-13', end='2026-07-13', result='Participant', project=None,
         text="<p>An international symposium on artificial intelligence and emerging technologies, organised by the Department of Computer Science at St. Joseph's College (Autonomous), Devagiri. I took part as a participant.</p>",
         cert='ai-unplugged-2026', original='AiUnplugged2026.jpg', w=1400, hgt=990, cap='Certificate of participation.'),
    dict(id='beyond-us-2023', h='Beyond Us 2023, my first hackathon', kind='Hackathon', organizer='GTech µLearn, in association with the Kerala Knowledge Economy Mission (KKEM)', place='Online',
         date='8–9 July 2023', start='2023-07-08', end='2023-07-09', result='Participant', project=None,
         text='<p>My first hackathon: Beyond Us, a 24-hour online hackathon conducted by GTech µLearn in association with the Kerala Knowledge Economy Mission.</p>',
         cert='beyond-us-2023', original='Beyond_us2023.jpg', w=987, hgt=774, cap='Certificate of participation (ID µ2023B10090).'),
]

def figure(a):
    portrait = ' cert-figure--portrait' if a.get('portrait') or a['hgt'] > a['w'] else ''
    return f'''                    <figure class="cert-figure{portrait}">
                        <img src="../assets/certificates/{a['cert']}-640.jpg" srcset="../assets/certificates/{a['cert']}-640.jpg 640w, ../assets/certificates/{a['cert']}-full.jpg {a['w']}w" sizes="(max-width: 760px) 92vw, 44rem" width="{a['w']}" height="{a['hgt']}" alt="{a['cap'].rstrip('.')} for Shamil T P, {a['h'].split(':')[0].split(',')[0]}" loading="lazy" decoding="async">
                        <figcaption>{a['cap']} <a href="../certificates/{a['original']}">Original file</a></figcaption>
                    </figure>'''

def entry(a):
    rows = [('Type', a['kind']), ('Organised by', a['organizer']), ('Where', a['place']),
            ('When', f'<time datetime="{a["start"]}">{a["date"]}</time>'), ('Result', a['result'])]
    if a['project']:
        rows.append(('Project', f'<a href="{P}{a["project"][1]}">{a["project"][0]} case study</a>'))
    return f'''                <section class="content-section" id="{a['id']}" aria-labelledby="{a['id']}-title">
                    <h2 class="section-heading" id="{a['id']}-title">{a['h']}</h2>
                    <div class="prose">
                        {a['text']}
                    </div>
                    <table class="info-table">
{evidence(rows)}
                    </table>
{figure(a)}
                </section>'''

course = dict(id='datatribe-mern-2025', h='MERN Stack Web Development, DataTribe', cert='datatribe-mern-2025', original='fullstackWebDevelopment2026.jpg', w=800, hgt=1132,
              cap='Certificate of completion (ID MERN2A08), issued 1 December 2025.')

ach_path = 'achievements/'
ach_desc = "Shamil TP's hackathons and certificates: Layover 2026 (top 13, RegretMap), Gateways 2026 (top 37, OpsPilot), AI Unplugged 2026 and Beyond Us 2023."

def event_ld(a):
    node = {
        '@type': 'Event',
        'name': a['h'].split(':')[0].replace(', my first hackathon', ''),
        'startDate': a['start'],
        'endDate': a['end'],
        'organizer': {'@type': 'Organization', 'name': a['organizer']},
        'url': SITE + ach_path + '#' + a['id'],
    }
    if a['place'] == 'Online':
        node['eventAttendanceMode'] = 'https://schema.org/OnlineEventAttendanceMode'
        node['location'] = {'@type': 'VirtualLocation', 'url': SITE + ach_path + '#' + a['id']}
    else:
        node['eventAttendanceMode'] = 'https://schema.org/OfflineEventAttendanceMode'
        node['location'] = {'@type': 'Place', 'name': a['place'], 'address': {'@type': 'PostalAddress', 'addressLocality': a['place'].split(', ')[-1], 'addressCountry': 'IN'}}
    return node

ach_ld = {
    '@context': 'https://schema.org',
    '@graph': [
        breadcrumb_ld('Achievements', ach_path),
        {
            '@type': 'CollectionPage',
            '@id': SITE + ach_path + '#page',
            'url': SITE + ach_path,
            'name': 'Achievements and certificates of Shamil TP',
            'description': ach_desc,
            'isPartOf': {'@id': SITE + '#website'},
            'about': {'@id': PERSON_ID},
            'inLanguage': 'en',
            'mainEntity': {
                '@type': 'ItemList',
                'name': 'Hackathons and events Shamil TP took part in',
                'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'item': event_ld(a)} for i, a in enumerate(ACH)],
            },
        },
    ],
}

ach_body = f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <div class="container"><ol><li><a href="../">Home</a></li><li><span aria-current="page">Achievements</span></li></ol></div>
    </nav>

    <header class="page-header">
        <div class="container">
            <h1 class="page-title">Achievements and certificates</h1>
            <p class="page-subtitle">Hackathons, events and courses Shamil TP has taken part in, newest first, each with its certificate as issued.</p>
        </div>
    </header>

    <main id="main" class="main-content">
        <div class="container content-grid">
            <div class="main-column">

{(chr(10) + '                <hr class="section-divider">' + chr(10) + chr(10)).join(entry(a) for a in ACH)}

                <hr class="section-divider">

                <section class="content-section" id="{course['id']}" aria-labelledby="{course['id']}-title">
                    <h2 class="section-heading" id="{course['id']}-title">{course['h']}</h2>
                    <div class="prose">
                        <p>A 6-month course in the MERN stack (MongoDB, Express, React and Node.js), from 19 May to 28 November 2025, completed with grade A+.</p>
                    </div>
{figure(dict(course, portrait=True))}
                </section>

            </div>

            <aside class="sidebar-column">
                <div class="sidebar-widget">
                    <h2 class="widget-title">At a glance</h2>
                    <table class="info-table">
                        <tr><td>Hackathons</td><td>3</td></tr>
                        <tr><td>Best placing</td><td>Top 13, Layover 2026</td></tr>
                        <tr><td>Symposiums</td><td>1</td></tr>
                        <tr><td>Courses</td><td>1</td></tr>
                    </table>
                </div>
                <div class="sidebar-widget">
                    <h2 class="widget-title">Jump to</h2>
                    <div class="stack">
{chr(10).join(f'                        <a href="#{a["id"]}" class="link-btn link-btn--block">{a["h"].split(":")[0].replace(", my first hackathon", "")}</a>' for a in ACH)}
                        <a href="#{course['id']}" class="link-btn link-btn--block">DataTribe MERN course</a>
                    </div>
                </div>
                <div class="sidebar-widget">
                    <h2 class="widget-title">More about me</h2>
                    <div class="stack">
                        <a href="../about/" class="link-btn primary link-btn--block">About Shamil TP</a>
                        <a href="../myProjectDetails/mycontributions.html" class="link-btn link-btn--block">All projects</a>
                    </div>
                </div>
            </aside>
        </div>
    </main>

'''

for path, title, desc, ogt, ogimg, ogalt, ld, body in [
    (about_path, 'About Shamil TP: Developer, MCA Student and Self-Hoster', about_desc, 'About Shamil TP', SITE + 'assets/og/home.png', 'Shamil TP — portfolio', about_ld, about_body),
    (ach_path, 'Achievements and Certificates | Shamil TP', ach_desc, 'Achievements and certificates of Shamil TP', SITE + 'assets/og/home.png', 'Shamil TP — portfolio', ach_ld, ach_body),
]:
    os.makedirs(path, exist_ok=True)
    html = head(path, title, desc, ogt, ogimg, ogalt, ld) + body + footer() + tail
    open(os.path.join(path, 'index.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print(path, len(html))
