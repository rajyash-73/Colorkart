// GET /api/palette-share?id=<palette-id>&n=<name>&c=69D2E7-A7DBD8
// Share-landing page: serves per-palette OG/Twitter meta for scrapers,
// then redirects humans to /explore?palette=<id>.
import { COLORS_RE } from './_palette-png.js';

const ORIGIN = 'https://www.coolors.in';

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export default function handler(req, res) {
  const { id = '', n = '', c = '' } = req.query;

  if (!/^[\w-]{1,64}$/.test(id) || !COLORS_RE.test(c)) {
    res.status(400).send('Invalid palette link');
    return;
  }

  const name = escapeHtml(String(n).slice(0, 80)) || 'Color Palette';
  const hexes = c.split('-').map((h) => `#${h.toUpperCase()}`).join(' · ');
  const target = `${ORIGIN}/explore?palette=${encodeURIComponent(id)}`;
  const image = `${ORIGIN}/api/palette-image?c=${encodeURIComponent(c)}`;
  const title = `${name} — Color Palette | Coolors`;
  const description = `${hexes} — explore and copy this free color palette on Coolors.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${target}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Coolors">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${target}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<meta http-equiv="refresh" content="0;url=${target}">
</head>
<body>
<p>Redirecting to <a href="${target}">the palette</a>…</p>
<script>window.location.replace(${JSON.stringify(target)});</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.status(200).send(html);
}
