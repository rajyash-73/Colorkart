// Zero-dependency palette PNG renderer for social share images.
// Files prefixed with "_" in /api are shared modules, not deployed as functions.
import zlib from 'zlib';
import { getColorName } from './_color-names.js';

// ─── Minimal PNG encoder (color type 2 = RGB, bit depth 8) ───────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = ~0;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (~c) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(width, height, rgb) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  const stride = 1 + width * 3;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: none
    rgb.copy(raw, y * stride + 1, y * width * 3, (y + 1) * width * 3);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── 5×7 pixel font for hex labels (#, 0-9, A-F) ─────────────────────────────
const FONT = {
  '#': ['01010','01010','11111','01010','11111','01010','01010'],
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['00110','01000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00010','01100'],
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'],
  'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'],
  'F': ['11111','10000','10000','11110','10000','10000','10000'],
  'G': ['01110','10001','10000','10110','10001','10001','01111'],
  'H': ['10001','10001','10001','11111','10001','10001','10001'],
  'I': ['01110','00100','00100','00100','00100','00100','01110'],
  'J': ['00111','00001','00001','00001','10001','10001','01110'],
  'K': ['10001','10010','10100','11000','10100','10010','10001'],
  'L': ['10000','10000','10000','10000','10000','10000','11111'],
  'M': ['10001','11011','10101','10101','10101','10001','10001'],
  'N': ['10001','11001','10101','10101','10011','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'Q': ['01110','10001','10001','10001','10101','10010','01101'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01111','10000','10000','01110','00001','00001','11110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'V': ['10001','10001','10001','10001','10001','01010','00100'],
  'W': ['10001','10001','10001','10101','10101','10101','01010'],
  'X': ['10001','10001','01010','00100','01010','10001','10001'],
  'Y': ['10001','10001','01010','00100','00100','00100','00100'],
  'Z': ['11111','00001','00010','00100','01000','10000','11111'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
};

const GLYPH_W = 6; // 5px glyph + 1px gap, in font units

function drawText(rgb, W, text, x0, y0, scale, [r, g, b]) {
  let x = x0;
  for (const ch of text) {
    const glyph = FONT[ch];
    if (glyph) {
      for (let gy = 0; gy < 7; gy++) {
        for (let gx = 0; gx < 5; gx++) {
          if (glyph[gy][gx] !== '1') continue;
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              const i = ((y0 + gy * scale + sy) * W + x + gx * scale + sx) * 3;
              rgb[i] = r; rgb[i + 1] = g; rgb[i + 2] = b;
            }
          }
        }
      }
    }
    x += GLYPH_W * scale;
  }
}

const textWidth = (text, scale) => text.length * GLYPH_W * scale - scale;

// Largest scale (within [minScale, maxScale]) at which every label fits maxWidth.
function fitScale(labels, maxWidth, maxScale = 5, minScale = 2) {
  for (let s = maxScale; s >= minScale; s--) {
    if (labels.every(l => textWidth(l, s) <= maxWidth)) return s;
  }
  return minScale;
}

function parseHex(hex) {
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

const isLight = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b > 150;

/**
 * Render a palette as a PNG buffer.
 * @param {string[]} colors - hex strings without '#', e.g. ['69D2E7', ...]
 * @param {'tall'|'wide'} layout - tall 1000×1500 (Pinterest), wide 1200×630 (OG/X)
 */
export function palettePng(colors, layout = 'wide') {
  const W = layout === 'tall' ? 1000 : 1200;
  const H = layout === 'tall' ? 1500 : 630;
  const rgb = Buffer.alloc(W * H * 3);
  const n = colors.length;
  const scale = 5; // glyph pixel scale → ~30px char width, 35px height

  colors.forEach((hex, i) => {
    const [r, g, b] = parseHex(hex);
    const hexLabel = `#${hex.toUpperCase()}`;
    const nameLabel = getColorName(hex).toUpperCase();
    const ink = isLight([r, g, b]) ? [20, 24, 31] : [255, 255, 255];

    if (layout === 'tall') {
      const y0 = Math.floor((i * H) / n);
      const y1 = Math.floor(((i + 1) * H) / n);
      for (let y = y0; y < y1; y++) {
        for (let x = 0; x < W; x++) {
          const p = (y * W + x) * 3;
          rgb[p] = r; rgb[p + 1] = g; rgb[p + 2] = b;
        }
      }
      const hexY = y1 - 7 * scale - 36;
      drawText(rgb, W, nameLabel, 48, hexY - 7 * scale - 10, scale, ink);
      drawText(rgb, W, hexLabel, 48, hexY, scale, ink);
    } else {
      const x0 = Math.floor((i * W) / n);
      const x1 = Math.floor(((i + 1) * W) / n);
      for (let y = 0; y < H; y++) {
        for (let x = x0; x < x1; x++) {
          const p = (y * W + x) * 3;
          rgb[p] = r; rgb[p + 1] = g; rgb[p + 2] = b;
        }
      }
      const segW = x1 - x0;
      const avail = segW - 16;
      let s = fitScale([hexLabel, nameLabel], avail, 5, 2);
      const showName = textWidth(nameLabel, s) <= avail;
      if (!showName) s = fitScale([hexLabel], avail, 5, 2);

      const hexY = H - 7 * s - 44;
      const hexX = x0 + Math.max(8, Math.floor((segW - textWidth(hexLabel, s)) / 2));
      drawText(rgb, W, hexLabel, hexX, hexY, s, ink);
      if (showName) {
        const nameX = x0 + Math.max(8, Math.floor((segW - textWidth(nameLabel, s)) / 2));
        drawText(rgb, W, nameLabel, nameX, hexY - 7 * s - 8, s, ink);
      }
    }
  });

  return encodePng(W, H, rgb);
}

export const COLORS_RE = /^[0-9a-fA-F]{6}(-[0-9a-fA-F]{6}){0,9}$/;
