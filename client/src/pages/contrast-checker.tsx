import React, { useState, useCallback } from 'react';
import SEOHead from '@/components/SEOHead';
import { ArrowLeftRight, Check, X, Info } from 'lucide-react';
import { getContrastRatio, WCAG_AA_NORMAL, WCAG_AA_LARGE, WCAG_AAA_NORMAL, WCAG_AAA_LARGE } from '@/lib/colorUtils';
import { Link } from 'wouter';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  const [text, setText] = useState(value);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setText(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toUpperCase());
    onChange(e.target.value.toUpperCase());
  };

  React.useEffect(() => { setText(value); }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={handleNativeChange}
          className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-white dark:border-gray-700 shadow-lg appearance-none p-0"
          style={{ backgroundColor: value }}
        />
      </div>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        maxLength={7}
        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
        placeholder="#000000"
      />
    </div>
  );
}

interface WCAGBadgeProps {
  level: string;
  size: string;
  pass: boolean;
}

function WCAGBadge({ level, size, pass }: WCAGBadgeProps) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border-2 ${pass ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'}`}>
      <div className={`flex items-center gap-1 font-bold text-lg ${pass ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {pass ? <Check size={18} /> : <X size={18} />}
        <span>{pass ? 'Pass' : 'Fail'}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
        <span className="font-semibold text-gray-700 dark:text-gray-300">{level}</span>
        <br />{size}
      </div>
    </div>
  );
}

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#FFFFFF');

  const ratio = getContrastRatio(fg, bg);
  const ratioFormatted = ratio.toFixed(2) + ':1';

  const results = {
    aa_normal:  ratio >= WCAG_AA_NORMAL,
    aa_large:   ratio >= WCAG_AA_LARGE,
    aaa_normal: ratio >= WCAG_AAA_NORMAL,
    aaa_large:  ratio >= WCAG_AAA_LARGE,
  };

  const swapColors = useCallback(() => {
    setFg(bg);
    setBg(fg);
  }, [fg, bg]);

  const overallPass = results.aa_normal;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="WCAG Color Contrast Checker — Accessibility Compliance Tool"
        description="Check color contrast ratios against WCAG 2.1 AA & AAA standards. Ensure your text is readable and your designs meet accessibility requirements. Free online tool."
        keywords="WCAG contrast checker, color contrast ratio, accessibility color checker, colour contrast checker, AA contrast ratio, AAA contrast, web accessibility tool, WCAG 2.1, WCAG 2.2, text readability checker, accessible design tool, contrast ratio calculator, ADA compliance"
        canonicalPath="/contrast-checker"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "WCAG Color Contrast Checker",
          "url": "https://coolors.in/contrast-checker",
          "applicationCategory": "AccessibilityApplication",
          "description": "Check color contrast ratios for WCAG 2.1 AA and AAA accessibility compliance.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
        <Link href="/">
          <a className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium">← Coolors</a>
        </Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <h1 className="font-bold text-gray-800 dark:text-white">Contrast Checker</h1>
        <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-blue-500 hover:underline flex items-center gap-1">
          <Info size={12} /> WCAG 2.1
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Color Contrast Checker</h2>
          <p className="text-gray-500 dark:text-gray-400">Check if your text and background colors meet WCAG accessibility standards.</p>
        </div>

        {/* Live Preview Banner */}
        <div
          className="w-full rounded-2xl p-8 mb-8 transition-all"
          style={{ backgroundColor: bg, color: fg }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">Normal text sample — The quick brown fox</p>
            <p className="text-base mb-4">Regular body text at 16px. Can your readers see this clearly?</p>
            <button
              className="px-6 py-2 rounded-lg font-semibold border-2 transition-all"
              style={{ backgroundColor: fg, color: bg, borderColor: fg }}
            >
              Sample Button
            </button>
          </div>
        </div>

        {/* Color Inputs + Ratio */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <ColorInput label="Text Color" value={fg} onChange={setFg} />

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={swapColors}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Swap colors"
              >
                <ArrowLeftRight size={20} className="text-gray-600 dark:text-gray-400" />
              </button>

              {/* Contrast Ratio */}
              <div className="text-center">
                <div className={`text-5xl font-black ${overallPass ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {ratioFormatted}
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">Contrast Ratio</div>
              </div>
            </div>

            <ColorInput label="Background Color" value={bg} onChange={setBg} />
          </div>
        </div>

        {/* WCAG Results Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">WCAG 2.1 Compliance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <WCAGBadge level="AA"  size="Normal Text (4.5:1)" pass={results.aa_normal} />
            <WCAGBadge level="AA"  size="Large Text (3:1)"   pass={results.aa_large} />
            <WCAGBadge level="AAA" size="Normal Text (7:1)"  pass={results.aaa_normal} />
            <WCAGBadge level="AAA" size="Large Text (4.5:1)" pass={results.aaa_large} />
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">How does it work?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">WCAG Level AA</p>
              <p>The minimum standard for most web content. Requires a contrast ratio of at least <strong>4.5:1</strong> for normal text and <strong>3:1</strong> for large text (18pt or 14pt bold).</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">WCAG Level AAA</p>
              <p>The enhanced standard for maximum accessibility. Requires <strong>7:1</strong> for normal text and <strong>4.5:1</strong> for large text. Recommended for critical content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
