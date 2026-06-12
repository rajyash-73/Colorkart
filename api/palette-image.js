// GET /api/palette-image?c=69D2E7-A7DBD8-E0E4CC&layout=tall|wide
// Renders the palette as a PNG for Pinterest pins and OG/X cards.
import { palettePng, COLORS_RE } from './_palette-png.js';

export default function handler(req, res) {
  const { c = '', layout = 'wide' } = req.query;

  if (!COLORS_RE.test(c)) {
    res.status(400).json({ error: 'c must be 1-10 hex colors joined by "-", e.g. c=69D2E7-A7DBD8' });
    return;
  }

  const png = palettePng(c.split('-'), layout === 'tall' ? 'tall' : 'wide');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable');
  res.status(200).send(png);
}
