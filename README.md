# AIPRC website (aiprc.org)

**What it does:** the public website for the AI Psychological Research Coalition, rebuilt from WordPress + Elementor Pro into plain HTML/CSS so it can be edited by asking Claude Code.
**Why:** the WordPress build needed Elementor to edit and was slow (about 5.6s to load the homepage, versus about 0.1s for the rebuild). The first Claude Design export (commit `59e9266`) wasn't editable source and had broken images.
Rebuilt Oct 2026 on branch `rebuild-static` of `edwardwest/aiprc-site`; deployed by Vercel.

## Status

| Part | Status |
|---|---|
| Home, About, News, Contact, Privacy Policy | ⏳ Built on branch `rebuild-static` (Vercel preview), waiting on review and merge to `main` |
| News page as a card grid (from `data/news.json`) | ⏳ Built, 2 cards; waiting on review |
| `/conference/` (hidden, noindex; form shows "This event has already passed.") | ⏳ Built, waiting on review |
| `/learn-more/resources/` and `/learn-more/taxonomy/` (hidden) | ❌ Not built: these pages are drafts in WordPress, so their content isn't public. Needs a WordPress export |
| Google Analytics (tag `GT-TBVGT3GG`) | ⏳ In the code; only fires on aiprc.org, so it starts at domain cutover |
| aiprc.org domain | ❌ Still points at WordPress |

## How it works

```
partials/header.html, footer.html ─┐
data/news.json ────────────────────┼─► node scripts/build.js ─► rewrites marked regions in each page's index.html
assets/img/icons/*.svg ────────────┘                              + sitemap.xml ─► git push ─► Vercel serves files as-is
```

- **Pages are plain committed HTML.** The build script only refreshes marked regions inside them: the shared header and footer, news cards and inline icons. Vercel runs no build step.
- **One stylesheet:** `assets/css/site.css`, after `modern-normalize.css`. Breakpoints: tablet ≤1024px, mobile ≤767px, matching the original Elementor site.
- **Hidden pages** (conference, learn-more) carry `noindex`, aren't linked from the nav and are left out of `sitemap.xml`.

## Outputs

| URL | Source file |
|---|---|
| `/`, `/about/`, `/news/`, `/contact/`, `/privacy-policy/` | `index.html`, `about/index.html`, … |
| `/conference/` (hidden) | `conference/index.html` |
| Literature Review PDF | `assets/docs/AIPRC-Literature-Review-Digital-Edition-October-2026.pdf` |
| 16 Oct 2026 media release PDF | `assets/docs/news/2026-10-16-aiprc-media-release.pdf` (made from the old News page text) |
| Old WordPress URLs | 301 redirects in `vercel.json` (team / case study / press pages → About, Home or News) |

## What it touches

| System | Access | Managed where |
|---|---|---|
| GitHub `edwardwest/aiprc-site` | collaborator write access | GitHub |
| Vercel project (deploys `main`; preview per branch) | Vercel account linked to the repo | Vercel dashboard |
| Google Analytics, tag `GT-TBVGT3GG` | the account owner's Google login | analytics.google.com |
| Qualtrics survey (the "Contribute your experience" links) | UNC | external, link only |

No secrets are stored in this repo.

## Day to day

- **Add a news item:** ask Claude Code ("add this press release to News" plus the link). It adds an entry to `data/news.json` and runs the build. Rules are in `CLAUDE.md`.
- **Change text:** edit the page's `index.html`, or `partials/` for the header and footer, then run `node scripts/build.js`.
- **Preview locally:** `npx serve .` and open the printed URL.
- **Publish:** commit and push; Vercel redeploys automatically (previews for branches, live for `main`).

## Cost and limits

- **Hosting:** Vercel, free plan for a static site of this size. The site is about 3 MB in total (mostly the 1 MB Literature Review PDF and the conference photo).

## Known gaps

- **Resources and taxonomy pages** aren't built yet (waiting on the WordPress export).
- **Small layout differences:** tablet widths are within about 10–35px of the original. On mobile, About wraps one paragraph a line differently.
- **Fonts are self-hosted variable fonts,** so text can wrap a word differently from the old Google Fonts in rare cases.

## Next steps

1. **Review the Vercel preview** for `rebuild-static`, then merge to `main` (owner).
2. **Export WordPress** (Tools → Export → All content) so the case studies and research/press items can become `data/resources.json` and the two hidden learn-more pages.
3. **Domain cutover:** point aiprc.org at Vercel (DNS access needed). Keep WordPress until the redirects are confirmed working.

## Decisions (29 Oct 2026)

- **Plain HTML plus a tiny build script, not a framework:** the owner asked for plain HTML/CSS; the script exists only so news cards and the shared header and footer stay consistent.
- **Team members are hardcoded** in `about/index.html`, because they rarely change.
- **News cards link out** (PDF or source site) in a new tab; there are no article pages on this site.
- **Tap-to-call phone links kept,** a deliberate difference from the original.
- **The original's hidden quirks were kept:** for example, the "How to Submit" background squares never appeared on the old site, so they aren't on this one either.
