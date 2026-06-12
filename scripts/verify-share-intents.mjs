// Verify explore-page share buttons emit palette-image / palette-share URLs.
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Block ad/analytics hosts only — Supabase must stay reachable for explore.
const blocked = ['scriptwrapper.com', 'grow.me', 'adsrvr.org', 'rlcdn.com', 'googletagmanager.com', 'google-analytics.com', 'doubleclick.net', 'googlesyndication.com'];
await page.route('**/*', route => {
  const host = new URL(route.request().url()).hostname;
  return blocked.some(b => host === b || host.endsWith(`.${b}`)) ? route.abort() : route.continue();
});

await page.addInitScript(() => {
  window.__opened = [];
  window.open = (url) => { window.__opened.push(url); return null; };
});

await page.goto('http://localhost:5000/explore', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button:has-text("Share")', { timeout: 30000 });

const shareBtn = page.locator('button:has-text("Share")').first();
await shareBtn.click();
await page.click('button:has-text("Pin to Pinterest")');
await shareBtn.click();
await page.click('button:has-text("Post on X")');

const opened = await page.evaluate(() => window.__opened);
for (const u of opened) console.log(decodeURIComponent(u), '\n');

const pin = opened.find(u => u.includes('pinterest.com'));
const tweet = opened.find(u => u.includes('twitter.com'));
const ok =
  pin && /media=.*palette-image.*layout%3Dtall/.test(pin) && !pin.includes('og-image.png') &&
  tweet && /url=.*palette-share/.test(tweet);
console.log(ok ? 'OK: both intents carry palette-specific image URLs' : 'FAIL: intent URLs wrong');
await browser.close();
process.exit(ok ? 0 : 1);
