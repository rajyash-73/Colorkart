// Prerender per-route <head> metadata into client/dist.
//
// The SPA serves one index.html for every URL, and that file carries a stale
// snapshot of the homepage's Helmet output (title + canonical pointing at "/").
// Crawlers that don't run JS therefore see 18 URLs all self-canonicalising to
// the homepage. This loads each sitemap route in a browser, waits for Helmet to
// write the real head, and bakes those tags into a per-route HTML file.
//
// Head only — the <body> stays the empty SPA root, so nothing dynamic (palette
// grids, counts) can go stale between deploys.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'client', 'dist');
const INDEX = path.join(DIST, 'index.html');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
};

// ── Routes come from the sitemap, so adding a URL there prerenders it too ────
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => new URL(m[1].trim()).pathname)
  .map(p => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p));

if (!routes.length) {
  console.error('prerender: no <loc> entries found in sitemap.xml');
  process.exit(1);
}

// ── Static server over the built output, with SPA fallback ──────────────────
const template = fs.readFileSync(INDEX, 'utf8');
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filePath = path.join(DIST, urlPath);
  // Serve a real file when one exists, otherwise fall back to the SPA shell.
  if (filePath.startsWith(DIST) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] ?? 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME['.html'] });
  res.end(template);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// ── Strip the stale Helmet snapshot once, to get a clean template ───────────
// Every tag Helmet manages is stamped data-rh="true". Removing them (and the
// <title>) prevents each prerendered page shipping two titles / two canonicals.
const RH_SCRIPT = /[ \t]*<script[^>]*\bdata-rh="true"[^>]*>[\s\S]*?<\/script>\s*\n?/gi;
const RH_TAG = /[ \t]*<(?:meta|link)[^>]*\bdata-rh="true"[^>]*\/?>\s*\n?/gi;
const TITLE = /[ \t]*<title>[\s\S]*?<\/title>\s*\n?/i;
const baseTemplate = template.replace(RH_SCRIPT, '').replace(RH_TAG, '').replace(TITLE, '');

const browser = await chromium
  .launch({ channel: 'chrome', headless: true })
  .catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Keep ad/analytics third parties out so they can't inject into the captured
// head. Supabase stays reachable — /explore needs it to finish rendering.
const allowed = ['127.0.0.1', 'localhost', 'supabase.co', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];
await page.route('**/*', route => {
  const host = new URL(route.request().url()).hostname;
  return allowed.some(a => host === a || host.endsWith(`.${a}`)) ? route.continue() : route.abort();
});

const written = [];
const failed = [];

for (const route of routes) {
  try {
    await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });

    // React must mount before anything is read. This matters most for "/",
    // where the template's stale canonical already points at "/" and would
    // satisfy the check below pre-hydration, capturing the old title.
    await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 30000 });

    // Assert on the expected value rather than sleeping — SEOHead renders deep
    // inside big components on /generator and /korean-color-analysis, so a
    // fixed timeout would be flaky. state:'attached' is required: the default
    // waits for visibility, which a <link> in <head> can never satisfy.
    await page.waitForSelector(`link[rel="canonical"][href$="${route}"]`, { state: 'attached', timeout: 30000 });
    await page.waitForTimeout(100); // let Helmet flush the rest of the head

    const { title, tags } = await page.evaluate(() => ({
      title: document.title,
      tags: [...document.head.querySelectorAll('[data-rh="true"]')].map(el => el.outerHTML),
    }));

    const head = `    <title>${title}</title>\n` + tags.map(t => `    ${t}`).join('\n') + '\n';
    const html = baseTemplate.replace('</head>', `${head}  </head>`);

    // Validate before writing. "/" overwrites the shell every non-prerendered
    // route falls back to, so a bad capture must never reach disk.
    const titles = (html.match(/<title>/gi) ?? []).length;
    const canonicals = [...html.matchAll(/rel="canonical"\s+href="([^"]+)"/gi)].map(m => m[1]);
    if (titles !== 1 || canonicals.length !== 1 || !canonicals[0].endsWith(route)) {
      failed.push(`${route} (titles=${titles} canonicals=${canonicals.length} href=${canonicals[0] ?? 'none'})`);
      continue;
    }

    const outFile = route === '/' ? INDEX : path.join(DIST, route, 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    written.push(`${route}  →  ${title}`);
  } catch (err) {
    failed.push(`${route} (${err.message.split('\n')[0]})`);
  }
}

await browser.close();
server.close();

console.log(`\nPrerendered ${written.length}/${routes.length} routes:`);
for (const w of written) console.log(`  ok    ${w}`);
for (const f of failed) console.log(`  FAIL  ${f}`);

// Any failure is a real problem worth surfacing, but build.sh treats this step
// as non-fatal so a bad prerender degrades SEO rather than breaking the deploy.
process.exit(failed.length ? 1 : 0);
