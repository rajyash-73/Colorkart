import React, { useState, useCallback } from 'react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import { Copy, Check } from 'lucide-react';
import {
  hexToRgb, rgbToHex, rgbToHsl, hslToHex, hexToHsl,
  getColorName, isLightColor, generateShades, generateTints, generateTones,
  simulateColorBlindness, ColorBlindnessType,
} from '@/lib/colorUtils';

const CB_MODES: { key: ColorBlindnessType; label: string }[] = [
  { key: 'normal',       label: 'Normal' },
  { key: 'protanopia',   label: 'Protanopia' },
  { key: 'deuteranopia', label: 'Deuteranopia' },
  { key: 'tritanopia',   label: 'Tritanopia' },
  { key: 'achromatopsia',label: 'Achromato.' },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ml-2 flex-shrink-0">
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

interface SwatchRowProps {
  colors: string[];
  onSelect: (hex: string) => void;
  label: string;
}
function SwatchRow({ colors, onSelect, label }: SwatchRowProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{label}</h3>
      <div className="flex gap-1 flex-wrap">
        {colors.map((c, i) => (
          <button
            key={i}
            title={c}
            onClick={() => onSelect(c)}
            className="group relative flex-1 min-w-[32px] h-12 rounded-lg border-2 border-white dark:border-gray-700 shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            style={{ backgroundColor: c }}
          >
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
              {c}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ColorPickerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hex, setHexState] = useState('#7C3AED');
  const [cbMode, setCbMode] = useState<ColorBlindnessType>('normal');

  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const hsl = hexToHsl(hex) ?? { h: 0, s: 0, l: 50 };

  const setFromHex = useCallback((newHex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) setHexState(newHex.toUpperCase());
  }, []);

  const setFromRGB = useCallback((r: number, g: number, b: number) => {
    setHexState(rgbToHex(r, g, b));
  }, []);

  const setFromHSL = useCallback((h: number, s: number, l: number) => {
    setHexState(hslToHex(h, s, l));
  }, []);

  const displayHex = cbMode === 'normal' ? hex : simulateColorBlindness(hex, cbMode);
  const name = getColorName(hex);
  const light = isLightColor(hex);

  const shades = generateShades(hex, 10);
  const tints  = generateTints(hex, 10);
  const tones  = generateTones(hex, 10);

  const formats = [
    { label: 'HEX',  value: hex },
    { label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS',  value: `color: ${hex};` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Color Picker & HSL Converter | Coolors"
        description="Pick any color and get HEX, RGB, HSL codes instantly. Explore shades, tints and tones. Format converter with color blindness simulation."
        keywords="color picker online, hex color picker, colour picker online, RGB to hex converter, HSL color picker, color code finder, color shades generator, color tints tones, color inspector, hex code picker, color format converter, color blindness simulator, 颜色选择器"
        canonicalPath="/color-picker"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Color Picker & Inspector",
          "url": "https://coolors.in/color-picker",
          "applicationCategory": "DesignApplication",
          "description": "Online color picker with HEX, RGB, HSL converter, shades, tints, tones and color blindness simulation.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Color Picker & Inspector</h2>
          <p className="text-gray-500 dark:text-gray-400">Explore shades, tints, and tones. Get every color format instantly.</p>
        </div>

        {/* Main input card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Color swatch + native picker */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div
                className="w-36 h-36 rounded-2xl shadow-md border-4 border-white dark:border-gray-700 flex items-end justify-center pb-3 select-none"
                style={{ backgroundColor: displayHex }}
              >
                <span className={`text-xs font-semibold ${light ? 'text-black/60' : 'text-white/70'}`}>{name}</span>
              </div>
              <input
                type="color"
                value={hex}
                onChange={e => setFromHex(e.target.value)}
                className="w-20 h-10 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-600 appearance-none p-0"
              />
            </div>

            {/* Inputs */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1">Hex</label>
                <input
                  type="text"
                  value={hex}
                  onChange={e => setFromHex(e.target.value)}
                  maxLength={7}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['r', 'g', 'b'] as const).map(ch => (
                  <div key={ch}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1">{ch.toUpperCase()}</label>
                    <input
                      type="number"
                      min="0" max="255"
                      value={rgb[ch]}
                      onChange={e => {
                        const v = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                        setFromRGB(ch === 'r' ? v : rgb.r, ch === 'g' ? v : rgb.g, ch === 'b' ? v : rgb.b);
                      }}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {([
                  { ch: 'h', max: 360, suffix: '°', label: 'H' },
                  { ch: 's', max: 100, suffix: '%', label: 'S' },
                  { ch: 'l', max: 100, suffix: '%', label: 'L' },
                ] as const).map(({ ch, max, suffix, label }) => (
                  <div key={ch}>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1">{label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0" max={max}
                        value={hsl[ch]}
                        onChange={e => {
                          const v = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                          setFromHSL(ch === 'h' ? v : hsl.h, ch === 's' ? v : hsl.s, ch === 'l' ? v : hsl.l);
                        }}
                        className="w-full px-2 py-1.5 pr-5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Format strip */}
            <div className="flex-shrink-0 w-full md:w-56 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Formats</p>
              {formats.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-xs font-semibold text-gray-400 w-8">{label}</span>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300 flex-1 truncate">{value}</span>
                  <CopyBtn text={value} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shades / Tints / Tones */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <SwatchRow colors={shades} onSelect={setFromHex} label="Shades" />
          <SwatchRow colors={tints}  onSelect={setFromHex} label="Tints" />
          <SwatchRow colors={tones}  onSelect={setFromHex} label="Tones" />
        </div>

        {/* Color Blindness Simulation */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Color Blindness Simulation</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {CB_MODES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCbMode(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cbMode === key ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            {CB_MODES.map(({ key, label }) => {
              const simHex = simulateColorBlindness(hex, key);
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-16 h-16 rounded-xl shadow border-2 border-white dark:border-gray-700"
                    style={{ backgroundColor: simHex }}
                  />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">{label}</span>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">{simHex}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
