// Maps an arbitrary Coolors.in palette onto the semantic tokens a mockup needs.
// Palettes carry no role information — just an ordered list of hexes — so roles
// are inferred from luminance and saturation, then the user can reassign them
// by dragging the role swatches.
import { getLuminance, getContrastRatio, hexToHsl, WCAG_AA_NORMAL } from './colorUtils';

export const THEME_ROLES = ['background', 'surface', 'text', 'primary', 'accent', 'border'] as const;
export type ThemeRole = typeof THEME_ROLES[number];
export type Theme = Record<ThemeRole, string>;

export const ROLE_LABELS: Record<ThemeRole, string> = {
  background: 'Background',
  surface: 'Surface',
  text: 'Text',
  primary: 'Primary',
  accent: 'Accent',
  border: 'Border',
};

const saturationOf = (hex: string) => hexToHsl(hex)?.s ?? 0;

/** Pick whichever candidate is most readable on `bg`. */
export function bestTextOn(bg: string, candidates: string[]): string {
  const pool = candidates.length ? candidates : ['#111111', '#ffffff'];
  let best = pool[0];
  let bestRatio = getContrastRatio(best, bg);
  for (const c of pool.slice(1)) {
    const r = getContrastRatio(c, bg);
    if (r > bestRatio) { bestRatio = r; best = c; }
  }
  // Nothing in the palette is legible on this background — fall back to plain
  // black or white so preview copy is never unreadable.
  if (bestRatio < WCAG_AA_NORMAL) {
    const bw = getContrastRatio('#111111', bg) >= getContrastRatio('#ffffff', bg) ? '#111111' : '#ffffff';
    if (getContrastRatio(bw, bg) > bestRatio) return bw;
  }
  return best;
}

/**
 * Derive an initial role assignment from a palette.
 * Lightest becomes the page background, the most saturated colours become the
 * brand accents, and text is whatever reads best on the chosen background.
 */
export function deriveTheme(colors: string[]): Theme {
  const hexes = colors.filter(Boolean);
  if (hexes.length === 0) {
    return { background: '#ffffff', surface: '#f8fafc', text: '#111111', primary: '#4b3fe4', accent: '#0f7a72', border: '#e2e8f0' };
  }

  const byLight = [...hexes].sort((a, b) => getLuminance(b) - getLuminance(a));
  const bySat = [...hexes].sort((a, b) => saturationOf(b) - saturationOf(a));

  const background = byLight[0];
  const surface = byLight[1] ?? background;
  const border = byLight[Math.min(2, byLight.length - 1)];
  // Prefer a palette colour for text, but only one that is actually readable.
  const text = bestTextOn(background, byLight.filter(c => c !== background));
  // Primary drives buttons and links, so avoid landing on the body-text colour
  // when the palette offers anything else — otherwise CTAs disappear into the copy.
  const primary = bySat.find(c => c !== background && c !== text) ?? bySat[0];
  const accent = bySat.find(c => c !== primary && c !== background && c !== text)
    ?? bySat.find(c => c !== primary)
    ?? primary;

  return { background, surface, text, primary, accent, border };
}

/** Swap two roles' colours — the drag-to-reorder operation. */
export function swapRoles(theme: Theme, from: ThemeRole, to: ThemeRole): Theme {
  if (from === to) return theme;
  return { ...theme, [from]: theme[to], [to]: theme[from] };
}

/** Readable foreground for any surface, for button labels and cards. */
export const onColor = (bg: string): string =>
  getContrastRatio('#ffffff', bg) >= getContrastRatio('#111111', bg) ? '#ffffff' : '#111111';
