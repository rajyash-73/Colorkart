// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  // Handle shorthand hex colors (e.g., #fff)
  let processedHex = hex;
  
  // If the hex code is incomplete (less than 7 chars), return the original color's RGB
  if (hex.length < 7) {
    return null;
  }
  
  // Extract r, g, b values
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(processedHex);
  
  if (!result) {
    return null;
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// Convert RGB to hex color
export function rgbToHex(r: number, g: number, b: number): string {
  // Ensure values are within range
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Generate a random hex color
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}

// Generate a random RGB color
export function getRandomRgb(): { r: number, g: number, b: number } {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

// Check if a color is light (for determining text color)
export function isLightColor(hexColor: string): boolean {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return false;
  }
  
  // Calculate perceived brightness (YIQ formula)
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128;
}

// Generate a complementary color
export function getComplementaryColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return '#000000';
  }
  
  // Get the complementary color by inverting RGB values
  const complementary = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  };
  
  return rgbToHex(complementary.r, complementary.g, complementary.b);
}

// Named color map with common colors and their hex values
export const namedColors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Maroon", hex: "#800000" },
  { name: "Tomato", hex: "#FF6347" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Indian Red", hex: "#CD5C5C" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Orange Red", hex: "#FF4500" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Dark Orange", hex: "#FF8C00" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Khaki", hex: "#F0E68C" },
  { name: "Olive", hex: "#808000" },
  { name: "Yellow Green", hex: "#9ACD32" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Green", hex: "#008000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Spring Green", hex: "#00FF7F" },
  { name: "Medium Spring Green", hex: "#00FA9A" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Light Cyan", hex: "#E0FFFF" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Medium Turquoise", hex: "#48D1CC" },
  { name: "Dark Turquoise", hex: "#00CED1" },
  { name: "Aquamarine", hex: "#7FFFD4" },
  { name: "Cadet Blue", hex: "#5F9EA0" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Corn Flower Blue", hex: "#6495ED" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Dodger Blue", hex: "#1E90FF" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Light Sky Blue", hex: "#87CEFA" },
  { name: "Midnight Blue", hex: "#191970" },
  { name: "Navy", hex: "#000080" },
  { name: "Dark Blue", hex: "#00008B" },
  { name: "Medium Blue", hex: "#0000CD" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Blue Violet", hex: "#8A2BE2" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Dark Slate Blue", hex: "#483D8B" },
  { name: "Slate Blue", hex: "#6A5ACD" },
  { name: "Medium Slate Blue", hex: "#7B68EE" },
  { name: "Medium Purple", hex: "#9370DB" },
  { name: "Dark Magenta", hex: "#8B008B" },
  { name: "Dark Violet", hex: "#9400D3" },
  { name: "Dark Orchid", hex: "#9932CC" },
  { name: "Medium Orchid", hex: "#BA55D3" },
  { name: "Purple", hex: "#800080" },
  { name: "Thistle", hex: "#D8BFD8" },
  { name: "Plum", hex: "#DDA0DD" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Orchid", hex: "#DA70D6" },
  { name: "Medium Violet Red", hex: "#C71585" },
  { name: "Pale Violet Red", hex: "#DB7093" },
  { name: "Deep Pink", hex: "#FF1493" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Antique White", hex: "#FAEBD7" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Bisque", hex: "#FFE4C4" },
  { name: "Blanched Almond", hex: "#FFEBCD" },
  { name: "Wheat", hex: "#F5DEB3" },
  { name: "Corn Silk", hex: "#FFF8DC" },
  { name: "Lemon Chiffon", hex: "#FFFACD" },
  { name: "Light Golden Rod Yellow", hex: "#FAFAD2" },
  { name: "Light Yellow", hex: "#FFFFE0" },
  { name: "Saddle Brown", hex: "#8B4513" },
  { name: "Sienna", hex: "#A0522D" },
  { name: "Chocolate", hex: "#D2691E" },
  { name: "Peru", hex: "#CD853F" },
  { name: "Sandy Brown", hex: "#F4A460" },
  { name: "Burly Wood", hex: "#DEB887" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Rosy Brown", hex: "#BC8F8F" },
  { name: "Moccasin", hex: "#FFE4B5" },
  { name: "Navajo White", hex: "#FFDEAD" },
  { name: "Peach Puff", hex: "#FFDAB9" },
  { name: "Misty Rose", hex: "#FFE4E1" },
  { name: "Lavender Blush", hex: "#FFF0F5" },
  { name: "Linen", hex: "#FAF0E6" },
  { name: "Old Lace", hex: "#FDF5E6" },
  { name: "Papaya Whip", hex: "#FFEFD5" },
  { name: "Sea Shell", hex: "#FFF5EE" },
  { name: "Mint Cream", hex: "#F5FFFA" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Light Slate Gray", hex: "#778899" },
  { name: "Light Steel Blue", hex: "#B0C4DE" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Floral White", hex: "#FFFAF0" },
  { name: "Alice Blue", hex: "#F0F8FF" },
  { name: "Ghost White", hex: "#F8F8FF" },
  { name: "Honeydew", hex: "#F0FFF0" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Azure", hex: "#F0FFFF" },
  { name: "Snow", hex: "#FFFAFA" },
  { name: "Black", hex: "#000000" },
  { name: "Dim Gray", hex: "#696969" },
  { name: "Gray", hex: "#808080" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Light Gray", hex: "#D3D3D3" },
  { name: "Gainsboro", hex: "#DCDCDC" },
  { name: "White Smoke", hex: "#F5F5F5" },
  { name: "White", hex: "#FFFFFF" }
];

// Calculates color distance based on RGB values (Euclidean distance in RGB space)
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) + 
    Math.pow(rgb1.g - rgb2.g, 2) + 
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

// Get the name of the closest matching color
export function getColorName(hexColor: string): string {
  // Normalize the hex color
  hexColor = hexColor.toUpperCase();

  // Add # if missing
  if (!hexColor.startsWith('#')) {
    hexColor = '#' + hexColor;
  }

  // If exact match exists
  const exactMatch = namedColors.find(c => c.hex.toUpperCase() === hexColor);
  if (exactMatch) return exactMatch.name;

  // Find closest match
  let closestMatch = namedColors[0];
  let closestDistance = colorDistance(hexColor, closestMatch.hex);

  for (let i = 1; i < namedColors.length; i++) {
    const distance = colorDistance(hexColor, namedColors[i].hex);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestMatch = namedColors[i];
    }
  }

  return closestMatch.name;
}

// ─── HSL Conversions ────────────────────────────────────────────────────────

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360, sn = s / 100, ln = l / 100;

  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ─── WCAG Contrast ──────────────────────────────────────────────────────────

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;
export const WCAG_AAA_NORMAL = 7.0;
export const WCAG_AAA_LARGE = 4.5;

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const linearise = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearise(rgb.r) + 0.7152 * linearise(rgb.g) + 0.0722 * linearise(rgb.b);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Color Blindness Simulation ─────────────────────────────────────────────

export type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const CB_MATRICES: Record<Exclude<ColorBlindnessType, 'normal' | 'achromatopsia'>, number[][]> = {
  protanopia:   [[0.56667, 0.43333, 0], [0.55833, 0.44167, 0], [0, 0.24167, 0.75833]],
  deuteranopia: [[0.625,   0.375,   0], [0.70,    0.30,    0], [0, 0.30,    0.70]],
  tritanopia:   [[0.95,    0.05,    0], [0,       0.43333, 0.56667], [0, 0.475, 0.525]],
};

export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  if (type === 'normal') return hex;
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;

  if (type === 'achromatopsia') {
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return rgbToHex(gray, gray, gray);
  }

  const m = CB_MATRICES[type];
  return rgbToHex(
    Math.round(Math.min(255, Math.max(0, m[0][0] * r + m[0][1] * g + m[0][2] * b))),
    Math.round(Math.min(255, Math.max(0, m[1][0] * r + m[1][1] * g + m[1][2] * b))),
    Math.round(Math.min(255, Math.max(0, m[2][0] * r + m[2][1] * g + m[2][2] * b))),
  );
}

// ─── Shades / Tints / Tones ──────────────────────────────────────────────────

export function generateShades(hex: string, count: number): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];
  const { h, s, l } = hsl;
  return Array.from({ length: count }, (_, i) => {
    const lightness = Math.round(10 + (i / (count - 1)) * (l - 10));
    return hslToHex(h, s, lightness);
  });
}

export function generateTints(hex: string, count: number): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];
  const { h, s, l } = hsl;
  return Array.from({ length: count }, (_, i) => {
    const lightness = Math.round(l + (i / (count - 1)) * (95 - l));
    return hslToHex(h, s, lightness);
  });
}

export function generateTones(hex: string, count: number): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];
  const { h, s, l } = hsl;
  return Array.from({ length: count }, (_, i) => {
    const saturation = Math.round(s - (i / (count - 1)) * s);
    return hslToHex(h, saturation, l);
  });
}

// ─── Palette Tag Detection ───────────────────────────────────────────────────

function getHueColorTag(h: number): string {
  if (h < 20 || h >= 345) return 'Red';
  if (h < 45) return 'Orange';
  if (h < 70) return 'Yellow';
  if (h < 170) return 'Green';
  if (h < 195) return 'Turquoise';
  if (h < 260) return 'Blue';
  if (h < 290) return 'Violet';
  if (h < 345) return 'Pink';
  return 'Red';
}

export function getPaletteTags(colors: string[]): string[] {
  const tags = new Set<string>();

  const hsls = colors.map(c => hexToHsl(c)).filter(Boolean) as { h: number; s: number; l: number }[];
  if (hsls.length === 0) return [];

  const avgS = hsls.reduce((a, c) => a + c.s, 0) / hsls.length;
  const avgL = hsls.reduce((a, c) => a + c.l, 0) / hsls.length;

  // Color tags from dominant hues
  hsls.forEach(hsl => {
    if (hsl.s > 15) tags.add(getHueColorTag(hsl.h));
  });

  // Grayscale check
  if (hsls.every(h => h.s < 15)) { tags.add('Gray'); tags.add('Black'); }
  if (hsls.some(h => h.l > 90 && h.s < 20)) tags.add('White');
  if (hsls.some(h => h.l < 15)) tags.add('Black');

  // Style tags
  const warmHues = hsls.filter(h => (h.h < 70 || h.h > 330) && h.s > 20).length;
  const coolHues = hsls.filter(h => h.h >= 170 && h.h <= 290 && h.s > 20).length;
  if (warmHues >= Math.ceil(hsls.length / 2)) tags.add('Warm');
  if (coolHues >= Math.ceil(hsls.length / 2)) tags.add('Cold');
  if (avgS > 65 && avgL > 40 && avgL < 70) tags.add('Bright');
  if (avgL < 30) tags.add('Dark');
  if (avgL > 65 && avgS > 10 && avgS < 60) tags.add('Pastel');
  if (avgS < 30 && avgS > 5) tags.add('Vintage');

  // Check if monochromatic (all hues within 30°)
  if (hsls.length > 1) {
    const minH = Math.min(...hsls.map(h => h.h));
    const maxH = Math.max(...hsls.map(h => h.h));
    if (maxH - minH < 30 || (360 - maxH + minH) < 30) tags.add('Monochromatic');
  }

  return Array.from(tags);
}
