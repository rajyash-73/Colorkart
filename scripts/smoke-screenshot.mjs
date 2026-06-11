// Local smoke test: load key routes in headless Chrome, screenshot, report errors.
import { chromium } from 'playwright';

const routes = ['/', '/generator', '/explore'];
const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const errors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

for (const route of routes) {
  await page.goto(`http://localhost:5000${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);
  const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
  await page.screenshot({ path: `smoke-${name}.png` });
  const title = await page.title();
  const canonical = await page.getAttribute('link[rel="canonical"]', 'href').catch(() => null);
  const canonicalCount = await page.locator('link[rel="canonical"]').count();
  const h1 = await page.locator('h1').first().textContent().catch(() => null);
  console.log(`${route} | title: ${title} | canonical(${canonicalCount}): ${canonical} | h1: ${h1?.trim()}`);
}

console.log(errors.length ? `ERRORS:\n${errors.slice(0, 10).join('\n')}` : 'No page errors.');
await browser.close();
