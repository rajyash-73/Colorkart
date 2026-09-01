// Shared Google Fonts catalogue and runtime loader.
// Used by the single-font generator page and the pairing simulator, so the
// list and the <link> dedupe live in one place rather than per component.

export type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';

export const GOOGLE_FONTS: { name: string; category: FontCategory }[] = [
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif' },
  { name: 'Ubuntu', category: 'sans-serif' },
  { name: 'Source Sans 3', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'PT Serif', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Bitter', category: 'serif' },
  { name: 'Crimson Text', category: 'serif' },
  { name: 'EB Garamond', category: 'serif' },
  { name: 'Space Mono', category: 'monospace' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', category: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
  { name: 'Pacifico', category: 'display' },
  { name: 'Lobster', category: 'display' },
  { name: 'Dancing Script', category: 'handwriting' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'Satisfy', category: 'handwriting' },
  { name: 'Comfortaa', category: 'display' },
  { name: 'Righteous', category: 'display' },
];

export const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly',
  'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
  '0 1 2 3 4 5 6 7 8 9 ! @ # $ % ^ & * ( )',
];

export const FONT_CATEGORIES = ['All', 'sans-serif', 'serif', 'monospace', 'display', 'handwriting'];

export const WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

/** Every weight — what the single-font generator needs, since it exposes all of them. */
export const ALL_WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
/** Enough for headings and body copy. The simulator loads two families at once, so
 *  requesting all nine weights for each would pull far more font CSS than it renders. */
export const TEXT_WEIGHTS = ['400', '500', '600', '700'];

export const categoryOf = (name: string): string =>
  GOOGLE_FONTS.find(f => f.name === name)?.category ?? 'sans-serif';

/** CSS font-family value, with the category as fallback. */
export const fontStack = (name: string): string => `'${name}', ${categoryOf(name)}`;

// Module-scoped so the page and the simulator share one dedupe set — a per-component
// ref would re-inject the same <link> for a font the other one already loaded.
const loaded = new Set<string>();

/** Inject the Google Fonts stylesheet for one family. Idempotent. */
export function loadFont(family: string, weights: string[] = TEXT_WEIGHTS): void {
  const key = `${family}:${weights.join(',')}`;
  if (loaded.has(key)) return;
  loaded.add(key);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}` +
    `:wght@${weights.join(';')}&display=swap`;
  document.head.appendChild(link);
}
