# AIPRC site — instructions for Claude

Project overview, status and decisions: see `README.md`. Don't duplicate them here.

## Golden rules
- Pages are plain HTML. Never hand-edit content between `<!-- @header -->`, `<!-- @footer -->` or `<!-- @cards … -->` markers; edit `partials/*.html` or `data/*.json` instead.
- After any change, run `node scripts/build.js` (needs `npm install` once). Commit the regenerated files together with the source change.
- Keep the look identical to the original Elementor site: reuse existing classes in `assets/css/site.css`; don't introduce new colours, fonts or spacing scales. Brand colours are the CSS variables at the top of `site.css`.
- Verify visually at 1440px, 1024px and 390px before saying a change is done.

## Adding a news item ("add this to News")
1. Add an object to `data/news.json` (order doesn't matter; the build sorts newest first):
   ```json
   {
     "title": "Exact headline from the source",
     "date": "YYYY-MM-DD",
     "type": "press-release",
     "source": "Publisher or issuer, e.g. PR Newswire / AIPRC / The Guardian",
     "summary": "1–2 sentence plain summary of the key point (≈200 chars max).",
     "url": "https://… or /assets/docs/news/YYYY-MM-DD-slug.pdf",
     "cta": "Optional button text, e.g. Read on PR Newswire"
   }
   ```
2. `type` must be one of the keys in `CARD_TYPES` in `scripts/build.js` (`media-release`, `press-release`, `news-article`, `research`, `case-study`, `report`). New type = add it there plus an icon `assets/img/icons/type-<name>.svg`.
3. For a PDF the user supplies, save it as `assets/docs/news/YYYY-MM-DD-short-slug.pdf` and use that path as `url`.
4. Take title/date/publisher from the source page itself (its `og:title`, date meta), not from memory. Optional `"image": "/assets/img/news/…"` shows a top image on the card.
5. Run the build, check `/news/`, commit.

## Hidden pages
- `/conference/` and future `/learn-more/*` pages: keep `<meta name="robots" content="noindex, nofollow">`, keep them out of the nav and `public: false` in `PAGES` in `scripts/build.js`. To publish one, remove the robots meta, set `public: true`, and add a nav link in `partials/header.html` only if asked.

## New pages
Copy the `<head>` from an existing page (title, description, canonical, OG tags, fonts, CSS/JS, analytics), add `data-page` on `<body>`, the header/footer markers, and register the file in `PAGES` in `scripts/build.js`.
