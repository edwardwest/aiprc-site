# AIPRC clone audit: aiprc.org vs aiprc-site-blue.vercel.app

> **Status (29 Oct 2026):** this audit describes the old Claude Design export. Branch `rebuild-static` replaces it with plain HTML/CSS and fixes everything below except the hidden `/learn-more/` pages (waiting on a WordPress export). See `README.md`.

Audited 29 Oct 2026 against commit `59e9266` ("Initial static site"). Compared at desktop (1440px) and mobile (390px) using full-page screenshots, rendered text, computed fonts and image loading on both sites.

Severity: **[BROKEN]** visibly wrong or missing on the live clone · **[DIFF]** visible design difference · **[MINOR]** small detail · **[SEO/OPS]** not visible, but matters at launch.

---

## 0. Structural issue: fix this first

**The clone isn't hand-editable source code.** Each `index.html` is a self-unpacking "Claude Design" bundle (450 KB to 2.7 MB). The real page markup sits as an escaped JSON string inside a `<script>`, and every image, font and React itself is gzipped base64 inside the same file. The page renders only after JavaScript unpacks it: with JS off it shows "This page requires JavaScript to display", and search engines and link previews see an empty page.

This defeats the main goal ("prompt future changes"). Every edit means round-tripping through Claude Design, or editing a 2.7 MB escaped blob. Every page also re-ships React, all fonts and the shared images.

**Recommendation:** unpack it into a normal static site (plain HTML + one shared CSS file + an `/assets` folder, header and footer shared). The bundle's source markup and all its embedded assets can be extracted mechanically (already tested), so nothing is lost. The fixes below then become ordinary edits.

---

## 1. Site-wide (header, footer, every page)

### Header / nav
- [ ] **[BROKEN]** On About, News, Contact and Privacy, the **header logo is a broken image** ("AIPRC logo" alt text shows) and the **mobile hamburger icon is broken**. They point to `images/logo_aiprc_black_1.svg` and `images/icons/menu-bar.svg`, and there is no `images/` folder in the repo (404). Only the homepage works, because its images are embedded.
- [ ] **[DIFF]** Nav font is **Inter** on the original, Roboto on the clone. Colour should be navy `#001A33` (clone uses black). The active page should be weight 600 (clone uses 500), and "Home" isn't marked active on the homepage.
- [ ] **[DIFF]** Mobile menu. Original: full-width light-blue panel, links **centred**, and the hamburger **turns into an X** when open. Clone: inset card with a drop shadow, links left-aligned, icon never changes.
- [ ] **[MINOR]** "Home" on the homepage links to `#top`; the original links to `/`.

### Footer
- [ ] **[BROKEN]** On About, News, Contact and Privacy, the **Disclaimer ⚠ icon, all 3 social icons and the white footer logo are broken** (same missing `images/` folder).
- [ ] **[DIFF]** The Disclaimer card is missing the **3 icons** next to Call (phone), Text (chat bubbles) and In a crisis (document). The mobile crisis bar is also missing its phone and document icons.
- [ ] **[DIFF]** Social icons. Original: outlined circular LinkedIn / X / Facebook glyph icons, about 25px. Clone: small filled navy dots with the letters "in / X / f" (where they load at all). Both sites have no real URLs (see Actions).
- [ ] **[DIFF]** Footer nav links (Home/About/News/Contact/Privacy Policy) should be **bold (600) navy**; the clone has regular black.
- [ ] **[DIFF]** The **"Scroll to Top"** floating button (bottom-right, appears on scroll) is missing.
- [ ] **[MINOR]** The clone turned 1-800-950-6264 and 988 into underlined tap-to-call links. On the original they are plain text. Keep or revert? (see Actions)
- [ ] **[MINOR]** The **"Skip to content"** accessibility link is missing.

### Motion / animation (original has it, clone doesn't)
- [ ] **[DIFF]** Home hero: the heads and circuit line **draw themselves in** over about 5 seconds (an animated SVG, `image_hero_headandline_animated2.svg`; mobile uses `image_home_section1_herofull_mobile2_animated.svg`). The clone uses a static SVG. Both animated files are in your Site Assets folder.
- [ ] **[DIFF]** Home hero background grid squares **fade in and follow the mouse** (parallax). The clone's are static, and darker and larger than the original's.
- [ ] **[DIFF]** Fade-in entrance animations on the home hero images and the About hero.
- [ ] **[DIFF]** About and News hero illustrations have a **scroll-linked fade and scale effect**.

### Text styling lost in several places
- [ ] **[DIFF]** Several bold phrases rendered as regular text. They are listed per page below.

### SEO / launch readiness
- [ ] **[SEO/OPS]** **Google Analytics tag `GT-TBVGT3GG` is missing.** Traffic tracking stops at cutover.
- [ ] **[SEO/OPS]** Missing: `<link rel="canonical">`, Open Graph tags (og:title/description/url/site_name/type; About also has og:image), Twitter card, JSON-LD schema (Organization, WebSite, WebPage, Breadcrumb) and apple-touch-icon.
- [ ] **[SEO/OPS]** Missing `robots.txt`, `sitemap.xml` and a custom 404 page.
- [ ] **[SEO/OPS]** Old WordPress URLs not on the clone (see section 7) will 404 after cutover unless redirected.

---

## 2. Home (`/`), top to bottom

1. **Header**: see site-wide.
2. **Hero**
   - [ ] **[DIFF]** Line-drawing animation and mouse-follow grid missing (see Motion).
   - [ ] **[MINOR]** H1 sits about 15px lower than the original.
   - [ ] **[MINOR]** Hero image alt text has been shortened. The original also describes the circuit diagram and single line.
3. **Our Affiliations**
   - [ ] **[DIFF] mobile**: the original is an **auto-rotating logo carousel with dots**. The clone shows one logo and no dots.
4. **The Psychological Effects of AI**
   - [ ] **[DIFF]** Literature Review card: the **thin vertical divider** between the text and the download icon is missing.
   - [ ] **[SEO/OPS]** The PDF link still points to `aiprc.org/wp-content/uploads/2026/10/AIPRC-Literature-Review-Digital-Edition-October-2026.pdf`. It breaks when WordPress is switched off, so the PDF needs to be hosted in the repo.
   - [ ] **[BROKEN] mobile**: the right edge of the body text is **cut off**. The column overflows the screen ("span a", "clinicians and" are clipped).
5. **Our Research**
   - [ ] **[DIFF]** The 4 bullet points ("Document and understand…", "Support clinicians…", "Inform safer AI…", "Help people…") should be **bold**, with a **thin vertical divider** between each icon and its text. Both are missing.
6. **How to Submit your Research Contribution**
   - [ ] **[DIFF]** The clone adds a grid-square background behind the text that the original doesn't have here.
   - [ ] **[MINOR]** The heading sits higher. On the original it's vertically centred with the woman-at-laptop illustration.
7. **Submit Your Story, Securely and Anonymously**
   - [ ] **[DIFF]** The 3 feature icons should all be different: **shield** (Secure data transmission), **crossed-out person** (Anonymous submission) and **document with tick** (Ethical research practices). The clone uses the same shield for all three.
8. **Your submission could include:**
   - [ ] **[DIFF]** Card titles (Chat Logs or Screenshots / Provide a Link / Written Account) should be **bold (700)**; the clone has 400.
   - [ ] **[MINOR] mobile**: the heading should wrap onto 2 lines. The clone forces 1 line to the screen edge.
9. **Behavioral Data Research Initiative**
   - [ ] **[DIFF]** The heading should fit on **one line** on desktop; the clone's container is narrower, so it wraps to 2.
10. **Have you noticed changes from using AI tools?** (dark band)
    - [ ] **[DIFF]** "Contribute your experience" button: the original has a **soft glow/halo and a white outline ring**. The clone's is a plain pill.
    - [ ] **[MINOR]** IRB email link colour should be pastel blue `#C3D8EA`; the clone's is grey.
11. **Footer**: see site-wide.

## 3. About (`/about/`), top to bottom

1. **Header**: [BROKEN] logo and hamburger (site-wide).
2. **Hero**
   - [ ] **[DIFF]** The **"About Us"** eyebrow above the H1 is missing.
   - [ ] **[DIFF]** Hero line art: the original is a **light, faded grey** line (`…headtick_longfade3.svg`) with the scroll fade/scale effect. The clone's line is dark and heavy.
   - [ ] **[BROKEN] mobile**: the hero illustration is **tiny** (thumbnail-sized). On the original it spans the screen width.
   - [ ] **[DIFF]** The round **"scroll down" chevron button** below the hero is missing.
3. **The Issue at Hand**
   - [ ] **[DIFF]** "**Clinicians and researchers have begun identifying a range of AI-related psychological conditions that warrant systematic study.**" should be bold.
   - [ ] **[MINOR]** The original has a larger gap after the first paragraph.
4. **Mission bullets (4)**
   - [ ] **[DIFF]** Should be bold, with vertical dividers (same as the homepage).
5. **Partners**
   - [ ] **[MINOR]** The original has more space above the band. The original uses a carousel widget here on smaller screens.
6. **Our Team**: content matches. [MINOR] slightly tighter spacing; alt text changed from "Headshot of…" to "Portrait of…".
7. **Footer**: [BROKEN] icons and logo (site-wide).

## 4. News (`/news/`), top to bottom

1. **Header**: [BROKEN] logo and hamburger.
2. **Hero**
   - [ ] **[DIFF]** The **"Stay up to date"** eyebrow above the H1 is missing.
   - [ ] **[DIFF]** H1 "News & Press Releases" should be on **one line**; the clone wraps to 2.
   - [ ] **[MINOR]** Document illustration is slightly smaller (824px vs 896px wide); the scroll effect is missing.
   - [ ] **[DIFF]** The round **"scroll down" chevron button** is missing.
3. **Media release body**
   - [ ] **[DIFF]** "Psychologists and Civil Society Leaders due to Meet…" should be **bold italic** (the clone isn't italic).
   - [ ] **[BROKEN] Pull quote 1 missing**, between the first paragraph and "Notable speakers…". Bold italic: *"We are in a public health emergency," said Dalia Hashad, Chief State Affairs Officer at the Future of Life Institute. "AI is fueling devastating real-world harms for children, families, and entire communities…to do what industry won't."*
   - [ ] **[BROKEN] Pull quote 2 missing**, before the Tristan Harris paragraph. Bold italic: *"The psychological science is clear: our happiness, our life purpose, and even our lifespans are tied directly to the quality of our human relationships," said Mitch Prinstein of UNC Winston Center…"…a real turning point for our species"*.
   - [ ] **[BROKEN] Media contact sign-off missing** at the end: "Kathryn Morrissey / Co-Director, AI Psychological Research Coalition / Kathryn@aiprc.org" (mailto link), followed by a horizontal rule.
4. **Footer**: [BROKEN] icons and logo.

## 5. Contact (`/contact/`), top to bottom

1. **Header**: [BROKEN] logo and hamburger.
2. **Left column**
   - [ ] **[DIFF]** The intro "Get in touch regarding research…" should be **bold**.
   - [ ] **[BROKEN] Kathryn Morrissey contact block missing**, between General Enquiries and the address: envelope icon, "Kathryn Morrissey" (heading), "Co-Director, AI Psychological Research", and a mailto link to Kathryn@aiprc.org.
   - [ ] **[DIFF]** The envelope and building icons are **brown/orange** in the clone and should be navy `#113768`.
3. **Right column (Mental Health Crises or Emergencies)**
   - [ ] **[DIFF]** Country names (United States, United Kingdom, Australia, Canada) should be **bold**.
   - [ ] **[DIFF]** The link-chain icons are brown/orange and should be navy.
   - [ ] **[MINOR]** Vertical alignment and spacing differ: on the original the right column starts lower and the page is about 130px taller.
4. **Footer**: [BROKEN] icons and logo.

## 6. Privacy Policy (`/privacy-policy/`)

1. **Header**: [BROKEN] logo and hamburger.
2. **Body**
   - [ ] **[DIFF]** "**919-966-3113**" should be bold.
   - [ ] **[MINOR]** IRB email link colour should be ultramarine `#113768` (the clone uses navy).
3. **Footer**: [BROKEN] icons and logo.

## 7. Original pages that were never cloned

These are live on aiprc.org but not linked from the main nav:

| URL | What it is |
|---|---|
| `/conference/` | Full "AIPRC First Annual Conference" page (Join Us, Request Invitation, Program…). Live and indexable. |
| `/about-full-initial-content/` | An older, longer version of About. Looks like a draft. |
| `/team_member/*` (7) | WordPress profile pages for each team member |
| `/casestudies/*` (8) | Case studies (Adam Raine, Belgian man, Geoff Lewis…) |
| `/reseachandpress/*` (9) | Research & press items (Forbes, Rolling Stone, Mashable…) |
| `/displaylocation/resources/`, `/2025/09/15/hello-world/` | WordPress archive / default post |

---

## 8. Asset check against `Site Assets` folder

Every image the 5 live pages use is in your local Site Assets folder **except**:
- Team headshots: `tali.jpg`, `Kathryn.jpg`, `rachel.jpg`, `Zak-Stein.jpg` (already embedded inside the clone's About bundle, so they can be extracted from there)
- `AIPRC-Literature-Review-Digital-Edition-October-2026.pdf` (only on the WordPress server)

The icons that are missing on the clone (footer phone/chat/document, the anonymous-person and document-tick icons, social glyphs, scroll-down chevron) are standard icon-library glyphs on the original. They can be recreated as inline SVG, so you don't need to supply anything.

---

## 9. Decisions (29 Oct 2026)

1. Rebuild as plain HTML/CSS (source of truth moves from Claude Design to this repo).
2. Clone `/conference/` too. Don't clone the WordPress custom-post-type single pages (team profiles, case studies, research & press, hello-world, `/about-full-initial-content/`). Instead, team members, case studies and news articles get a simple data structure, so new items can be added by asking Claude Code and they appear automatically.
3. Social: LinkedIn only → https://www.linkedin.com/company/ai-prc/home/. Remove X and Facebook.
4. Download and rehost the Literature Review PDF.
5. GA: explained; awaiting confirmation.
6. Keep the tap-to-call phone links.

## 10. Still open before the rebuild

- Conference "Request Invitation" popup form (First name, Last name, LinkedIn URL, Email, Resume upload): where submissions go, and whether the form should still be live now the 19–20 Oct conference has passed.
- Case studies and research/press items aren't shown on any live page, and their content is in WordPress ACF fields that aren't publicly readable. Migrating them needs a WordPress export.
- News: how the page should behave once there's more than one article.
- Build tool: a small static site generator (Eleventy), so data files become plain HTML at deploy time.
- Work on a branch with a Vercel preview, rather than pushing straight to `main`.
