#!/usr/bin/env node
/*
 * AIPRC site build. Zero dependencies. Run from the repo root:  node scripts/build.js
 *
 * Every page is a plain, committed HTML file. This script rewrites the marked regions
 * inside them in place, so it is safe to run as often as you like:
 *
 *   <!-- @header -->…<!-- /@header -->     ← partials/header.html (active link from <body data-page>)
 *   <!-- @footer -->…<!-- /@footer -->     ← partials/footer.html
 *   <!-- @cards news -->…<!-- /@cards -->  ← one card per entry in data/news.json (newest first)
 *   <svg data-icon="phone" …></svg>       ← assets/img/icons/phone.svg, keeping your attributes
 *
 * It also regenerates sitemap.xml and copies the CSS reset from node_modules.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://aiprc.org';
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);

// Pages and whether they are public (in the nav, sitemap and indexable).
// Hidden pages still build, but carry noindex and are left out of the sitemap.
const PAGES = [
  { file: 'index.html', url: '/', public: true },
  { file: 'about/index.html', url: '/about/', public: true },
  { file: 'news/index.html', url: '/news/', public: true },
  { file: 'contact/index.html', url: '/contact/', public: true },
  { file: 'privacy-policy/index.html', url: '/privacy-policy/', public: true },
  { file: 'conference/index.html', url: '/conference/', public: false },
  { file: 'learn-more/resources/index.html', url: '/learn-more/resources/', public: false },
  { file: 'learn-more/taxonomy/index.html', url: '/learn-more/taxonomy/', public: false },
  { file: '404.html', url: null, public: false },
];

// Card types: label shown on the card and the icon file in assets/img/icons/.
// Add a new type here, plus an icon, and it becomes available to every data file.
const CARD_TYPES = {
  'media-release': { label: 'Media Release', icon: 'type-media-release' },
  'press-release': { label: 'Press Release', icon: 'type-press-release' },
  'news-article': { label: 'News Article', icon: 'type-news-article' },
  'research': { label: 'Research', icon: 'type-research' },
  'case-study': { label: 'Case Study', icon: 'type-case-study' },
  'report': { label: 'Report', icon: 'type-report' },
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function icon(name, attrs = '') {
  const file = path.join(ROOT, 'assets/img/icons', name + '.svg');
  if (!fs.existsSync(file)) throw new Error(`Missing icon: assets/img/icons/${name}.svg`);
  const svg = fs.readFileSync(file, 'utf8').trim();
  return svg.replace(/^<svg\b/, `<svg data-icon="${name}"${attrs ? ' ' + attrs.trim() : ''} aria-hidden="true" focusable="false"`);
}

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  if (isNaN(d)) throw new Error(`Bad date "${iso}" (use YYYY-MM-DD)`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function renderCard(item, file) {
  for (const k of ['title', 'date', 'type', 'summary', 'url']) {
    if (!item[k]) throw new Error(`${file}: an entry is missing "${k}" (${item.title || 'untitled'})`);
  }
  const type = CARD_TYPES[item.type];
  if (!type) throw new Error(`${file}: unknown type "${item.type}" in "${item.title}". Use one of: ${Object.keys(CARD_TYPES).join(', ')}`);
  const isPdf = /\.pdf($|\?)/i.test(item.url);
  const media = item.image
    ? `<img class="card__image" src="${esc(item.image)}" alt="" loading="lazy">`
    : '';
  return `
      <li class="card-grid__item">
        <a class="card${item.image ? ' card--has-image' : ''}" href="${esc(item.url)}" target="_blank" rel="noopener">
          ${media}
          <div class="card__body">
            <div class="card__type">
              <span class="card__type-icon">${icon(type.icon)}</span>
              <span>${esc(type.label)}</span>
            </div>
            <h3 class="card__title">${esc(item.title)}</h3>
            <p class="card__meta"><time datetime="${esc(item.date)}">${formatDate(item.date)}</time>${item.source ? ` <span aria-hidden="true">·</span> ${esc(item.source)}` : ''}</p>
            <p class="card__summary">${esc(item.summary)}</p>
            <span class="card__cta">${esc(item.cta || (isPdf ? 'Open PDF' : 'Read more'))} ${icon('external', 'class="card__cta-icon"')}</span>
          </div>
        </a>
      </li>`;
}

function renderCards(name) {
  const file = `data/${name}.json`;
  const items = JSON.parse(read(file));
  if (!Array.isArray(items)) throw new Error(`${file} must be a JSON array`);
  items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!items.length) return '\n      <li class="card-grid__empty">Nothing here yet.</li>\n      ';
  return items.map(i => renderCard(i, file)).join('') + '\n      ';
}

function replaceRegion(html, open, close, content) {
  const re = new RegExp(`(<!-- ${open} -->)[\\s\\S]*?(<!-- ${close} -->)`, 'g');
  return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}

function build() {
  const header = read('partials/header.html');
  const footer = read('partials/footer.html');

  for (const page of PAGES) {
    if (!fs.existsSync(path.join(ROOT, page.file))) { console.warn('Skipping missing page', page.file); continue; }
    let html = read(page.file);
    const key = (html.match(/<body[^>]*data-page="([^"]+)"/) || [])[1] || '';
    const h = header.replace(/(<a [^>]*data-nav="([^"]+)"[^>]*)>/g, (m, a, nav) =>
      nav === key ? `${a} aria-current="page">` : `${a}>`);
    html = replaceRegion(html, '@header', '/@header', '\n' + h.trim() + '\n');
    html = replaceRegion(html, '@footer', '/@footer', '\n' + footer.trim() + '\n');
    html = html.replace(/<!-- @cards ([\w-]+) -->[\s\S]*?<!-- \/@cards -->/g,
      (_, name) => `<!-- @cards ${name} -->${renderCards(name)}<!-- /@cards -->`);
    // Inline icons (idempotent: the data-icon attribute is kept on the output).
    html = html.replace(/<svg data-icon="([\w-]+)"([^>]*)>[\s\S]*?<\/svg>/g, (_, name, attrs) =>
      icon(name, attrs.replace(/\s(aria-hidden|focusable|viewBox|xmlns|fill)="[^"]*"/g, '')));
    write(page.file, html);
  }

  // Sitemap: public pages only.
  const urls = PAGES.filter(p => p.public).map(p =>
    `  <url><loc>${SITE_URL}${p.url}</loc></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

  // CSS reset (modern-normalize) – copied so the deployed site needs no node_modules.
  const reset = path.join(ROOT, 'node_modules/modern-normalize/modern-normalize.css');
  if (fs.existsSync(reset)) fs.copyFileSync(reset, path.join(ROOT, 'assets/css/modern-normalize.css'));
  else if (!fs.existsSync(path.join(ROOT, 'assets/css/modern-normalize.css'))) throw new Error('Run "npm install" first (modern-normalize missing).');

  console.log('Built', PAGES.length, 'pages.');
}

try { build(); } catch (e) { console.error('Build failed:', e.message); process.exit(1); }
