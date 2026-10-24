# AIPRC website (static)

Static rebuild of https://aiprc.org — 5 pages, no build step. Each `index.html` is fully self-contained (fonts, images and scripts are embedded).

## Structure
```
index.html                  Home
about/index.html            About
news/index.html             News
contact/index.html          Contact
privacy-policy/index.html   Privacy Policy
vercel.json                 Clean URLs with trailing slash
```
Internal links use root paths (`/about/`, `/news/`…), so serve from the domain root.

## Deploy
1. Create a GitHub repo (e.g. `aiprc-site`) and push this folder as the repo root:
   ```
   git init && git add . && git commit -m "Initial static site"
   git branch -M main
   git remote add origin git@github.com:<org>/aiprc-site.git
   git push -u origin main
   ```
2. In Vercel: Add New → Project → import the repo.
   - Framework preset: **Other**
   - Build command: *(empty)* · Output directory: *(empty / root)*
3. Deploy. Add the custom domain under Project → Settings → Domains.

## Local preview
`npx serve .` then open http://localhost:3000

## Open items
- Footer social icons (LinkedIn, X, Facebook) have placeholder `#` links — add real account URLs.
- Edits: the source is maintained as Design Components in Claude Design; re-export there and replace the HTML files rather than hand-editing the bundled HTML.
