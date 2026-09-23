# Manika Gupta — gotomarketaiinsight.com

Your main site: a premium, editorial-style personal site for Manika Gupta,
AI-enabled GTM marketing strategist and competitive intelligence
consultant. Plain HTML/CSS/JS, no build step, no framework — deploys as
static files.

**Pages:** Home (`index.html`), Work (`work.html`), About (`about.html`),
Contact (`contact.html`). Team, Ideas, and Careers pages existed earlier
and were removed — `data/nav.js` and `sitemap.xml` reflect the current
4-page structure.

The previous version of the site (before the current design) is preserved
under `/legacy/` — see the note at the bottom of this file.

## How to run it locally

No build tools needed. From the repo root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser (a few things — like
`fetch()` in the contact form — work best served over `http://` rather
than `file://`, but you can preview layout either way).

## How to edit text

Most copy lives directly in the page HTML files (`index.html`, `about.html`,
`work.html`, `contact.html`) inside clearly commented sections. Open the
page, find the section comment (e.g.
`<!-- ===================== HERO ===================== -->`), and edit
the text between the tags.

Content that repeats or is easier to manage as a list lives in `data/*.js`
instead — see the table below.

## Editable data files

Everything in `data/` is a small JavaScript file exporting one array or
object. Edit the values, save, refresh the page — no build step.

| File | Controls |
|---|---|
| `data/nav.js` | Navigation items (all pages) + contact details (email, phone, LinkedIn, Instagram) shown site-wide |
| `data/approach.js` | The 6 cursor-reveal boxes ("How can I help you" section) on the homepage |
| `data/workflow.js` | The 12-step GTM roadmap on the homepage |
| `data/suite-products.js` | The 4 MGs GTM Suite product cards on the Work page |
| `data/certifications.js` | Certifications shown on the About page (hidden entirely until this has real entries) |

`data/services.js` also still exists in the repo (the old 12-tile service
grid, no longer linked from any page) — safe to ignore or delete; it's
not loaded anywhere.

Each file has a comment at the top explaining its shape.

## Content that's hidden until you add it

- **Certifications** (About page) are hidden entirely until
  `data/certifications.js` has real entries — the surrounding "Technology
  Enthusiast" text still shows.
- **About page founder story** — three of the four sections (Eldest
  Daughter, Solo Traveller, Marketing Is a Way of Life) are commented out
  directly in `about.html`'s HTML, not just visually hidden. Open the file,
  find the `<!-- ... -->` block in the "ABOUT THE FOUNDER" section, and
  delete the opening/closing comment markers to bring one back once you
  have a story and photo for it.

## How to replace images

Photos live in `assets/img/`. To swap the About page headshot:

1. Add your new image to `assets/img/journey/` (JPG or WebP, ideally
   under 300KB — resize/compress before uploading if it's a large phone
   photo).
2. In `about.html`, find `<img class="s-journey-hero-photo" src="assets/img/journey/founder-headshot.jpg" ...>`
   and change the `src` to your new filename.

The homepage hero uses `assets/img/hero-grid.jpg` (the panning photo grid)
and `assets/img/manika-wide.jpg` (the cursor-reveal photo) — swap those
the same way if you ever want to update them.

## How to add a page

1. Copy an existing page (e.g. `about.html`) as a starting point.
2. Update the `<title>`, meta description, canonical/og tags, and
   `<body data-page="...">` value (this controls the active-nav underline).
3. Add the new page to `data/nav.js` so it shows up in navigation
   automatically on every page.
4. Add it to `sitemap.xml` too.

## How to update contact details

Everything (email, phone, LinkedIn, Instagram) is set in one place:
`data/nav.js`, at the top under `window.STUDIO_CONTACT`. Every page pulls
from here automatically — you never need to hunt through individual pages.

## How the contact forms work

Two forms exist — the report-request form on `contact.html`, and the
consultation-request form on `work.html`. Both are connected to
[Formspree](https://formspree.io) (one shared form, endpoint
`https://formspree.io/f/xljdngal`) and **submit silently** — the visitor
fills it in, hits send, and sees a success message on the page. No email
app opens, nothing else required.

Submissions land in the inbox tied to that Formspree account. To check
or change that, log in at formspree.io.

### If you ever need to change the endpoint

1. Log in at [formspree.io](https://formspree.io) and open (or create) a
   form to get its endpoint URL.
2. In `contact.html` and `work.html`, find
   `action="https://formspree.io/f/xljdngal"` and replace the ID with
   your new one.
3. Test by submitting the form yourself once, live.

### If the endpoint is ever removed or set back to a placeholder

`js/studio-form.js` automatically falls back to opening a pre-filled
email in the visitor's own email app instead — the form still works,
just not silently. No code changes needed either way; the behavior
follows whatever's in the `action` attribute.

## About `assets/img/journey/`

The photos on the About page — the headshot and the travel shots in the
reel — live here. Swap any of them by replacing the file (same filename)
or updating the `src` in `about.html`.

## How this deploys

This repo is connected to Vercel for static hosting — no config needed.
Push to `main` on GitHub and Vercel redeploys automatically. There are no
environment variables required, since nothing here calls a private API.

## About `/legacy/`

`/legacy/` holds an earlier version of the site — untouched, just moved.
It's excluded from `robots.txt` so it won't get indexed by search
engines, and nothing on the live site links to it. It's there purely so
nothing is lost. Delete the folder yourself whenever you're confident you
don't need it, or leave it — it costs nothing sitting unused in the repo.
