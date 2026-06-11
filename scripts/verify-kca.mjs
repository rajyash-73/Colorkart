// Verify the Korean Color Analysis flow: upload a synthetic face photo,
// wait for analysis, exercise drape studio / compare / gold-silver test.
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

// Block ad/analytics third parties — they keep loading fonts and stall screenshots
const allowed = ['localhost', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];
await page.route('**/*', route => {
  const host = new URL(route.request().url()).hostname;
  return allowed.some(a => host === a || host.endsWith(`.${a}`)) ? route.continue() : route.abort();
});

// Synthetic warm-skin portrait drawn in-browser, returned as base64
await page.goto('http://localhost:5000/korean-color-analysis', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Capture Your Face', { timeout: 20000 });

const dataUrl = await page.evaluate(() => {
  // Wide shot with the subject small in frame — the layout must hold for
  // non-selfie photos too, not just tight face crops.
  const c = document.createElement('canvas');
  c.width = 480; c.height = 480;
  const x = c.getContext('2d');
  x.fillStyle = '#cfd8dc'; x.fillRect(0, 0, 480, 480);            // bg
  x.fillStyle = '#3e2723';                                          // hair
  x.beginPath(); x.ellipse(240, 190, 78, 72, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#e8b48b';                                          // face (warm skin)
  x.beginPath(); x.ellipse(240, 220, 63, 78, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#e8b48b';                                          // neck
  x.fillRect(219, 280, 42, 55);
  x.fillStyle = '#37474f';                                          // shoulders/shirt
  x.beginPath(); x.ellipse(240, 420, 150, 80, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#5d4037';                                          // eyes
  x.beginPath(); x.arc(216, 210, 6, 0, Math.PI * 2); x.arc(264, 210, 6, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#c98a6b';                                          // lips
  x.beginPath(); x.ellipse(240, 256, 17, 6, 0, 0, Math.PI * 2); x.fill();
  return c.toDataURL('image/png');
});

await page.setInputFiles('input[type="file"]', {
  name: 'face.png', mimeType: 'image/png',
  buffer: Buffer.from(dataUrl.split(',')[1], 'base64'),
});

// Wait out the 1.3s analysis animation
await page.waitForSelector('text=Color Try-On Studio', { timeout: 15000 });
await page.waitForTimeout(800);

const season = await page.locator('span.inline-flex.items-center.px-3').first().textContent();
const skinTone = await page.locator('.font-mono.text-sm').first().textContent();
console.log(`Detected: season=${season?.trim()} skin=${skinTone?.trim()}`);
await page.screenshot({ path: 'kca-1-studio.png', fullPage: false });

// Compare mode
await page.click('button:has-text("Compare")');
await page.waitForTimeout(400);
const panels = await page.locator('text=Your color').count();
console.log(`Compare mode panels label found: ${panels}`);
await page.screenshot({ path: 'kca-2-compare.png' });

// Avoid tab + pick an avoid color
await page.click('button:has-text("Colors to avoid")');
await page.waitForTimeout(300);

// Gold vs Silver section
await page.locator('text=Gold vs Silver Test').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: 'kca-3-goldsilver.png' });

// Original toggle works
await page.click('button:has-text("Original")');
await page.waitForTimeout(200);
const colorHidden = await page.locator('button:has-text("Show color")').count();
console.log(`Original toggle works: ${colorHidden === 1}`);

console.log(errors.length ? `ERRORS:\n${errors.slice(0, 8).join('\n')}` : 'No page errors.');
await browser.close();
