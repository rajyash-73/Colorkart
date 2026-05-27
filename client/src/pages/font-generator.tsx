import React, { useState, useRef } from 'react';
import SEOHead from '@/components/SEOHead';
import { Copy, Check, Download, RefreshCw, ChevronLeft, Type } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GOOGLE_FONTS = [
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

const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly',
  'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
  '0 1 2 3 4 5 6 7 8 9 ! @ # $ % ^ & * ( )',
];

const FONT_CATEGORIES = ['All', 'sans-serif', 'serif', 'monospace', 'display', 'handwriting'];

const WEIGHTS = [
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

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {label || 'Copy'}
    </button>
  );
}

export default function FontGeneratorPage() {
  const [selectedFont, setSelectedFont] = useState('Playfair Display');
  const [category, setCategory] = useState('All');
  const [weight, setWeight] = useState('400');
  const [size, setSize] = useState(40);
  const [color, setColor] = useState('#1a1a2e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [customText, setCustomText] = useState('');
  const [sampleIndex, setSampleIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const sampleText = customText || SAMPLE_TEXTS[sampleIndex];

  const filteredFonts = GOOGLE_FONTS.filter(f => {
    const matchesCategory = category === 'All' || f.category === category;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Load Google Font dynamically
  const loadedFonts = useRef<Set<string>>(new Set());
  const loadFont = (fontName: string) => {
    if (loadedFonts.current.has(fontName)) return;
    loadedFonts.current.add(fontName);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  };

  const handleFontSelect = (fontName: string) => {
    loadFont(fontName);
    setSelectedFont(fontName);
  };

  // Pre-load selected font
  React.useEffect(() => { loadFont(selectedFont); }, []);

  const cssCode = `font-family: '${selectedFont}', ${GOOGLE_FONTS.find(f => f.name === selectedFont)?.category ?? 'sans-serif'};
font-size: ${size}px;
font-weight: ${weight};
color: ${color};${italic ? '\nfont-style: italic;' : ''}${underline ? '\ntext-decoration: underline;' : ''}${letterSpacing !== 0 ? `\nletter-spacing: ${letterSpacing}px;` : ''}${lineHeight !== 1.4 ? `\nline-height: ${lineHeight};` : ''}`;

  const googleFontLink = `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFont)}:wght@${weight}&display=swap');`;

  const exportSVG = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
  <rect width="800" height="200" fill="${bgColor}"/>
  <text x="20" y="130" font-family="${selectedFont}" font-size="${Math.min(size, 80)}" font-weight="${weight}" fill="${color}" ${italic ? 'font-style="italic"' : ''} letter-spacing="${letterSpacing}">${sampleText.slice(0, 50)}</text>
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `font-${selectedFont.replace(/\s+/g, '-').toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="Font Generator — Google Fonts Preview & Typography Tool"
        description="Preview and customize 30+ Google Fonts instantly. Adjust size, weight, spacing and color. Export CSS import code and font stack for your next web design project. Free."
        keywords="font generator online, Google Fonts preview, typography tool, font pairing tool, web font generator, CSS font import, Google Fonts CSS, font preview tool, font size preview, font weight preview, typography generator, font style maker, free font generator"
        canonicalPath="/font-generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Google Fonts Preview & Generator",
          "url": "https://coolors.in/font-generator",
          "applicationCategory": "DesignApplication",
          "description": "Preview and customize Google Fonts with adjustable size, weight and spacing. Export CSS code instantly.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Font Generator</h1>
          <p className="text-gray-500 dark:text-gray-400">Preview, customize, and export typography with Google Fonts</p>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Left: Font list */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="p-2 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-1">
                {FONT_CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${category === c ? 'bg-blue-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >{c}</button>
                ))}
              </div>
              <div className="overflow-y-auto max-h-[480px]">
                {filteredFonts.map(font => (
                  <button
                    key={font.name}
                    onClick={() => handleFontSelect(font.name)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${selectedFont === font.name ? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-500' : ''}`}
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">{font.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">{font.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview + controls */}
          <div className="flex-1 min-w-0">
            {/* Preview */}
            <div
              ref={previewRef}
              className="rounded-2xl shadow-sm border border-gray-200 p-8 mb-4 min-h-40 flex items-center justify-center transition-all"
              style={{ backgroundColor: bgColor }}
            >
              <p
                style={{
                  fontFamily: `'${selectedFont}', ${GOOGLE_FONTS.find(f => f.name === selectedFont)?.category ?? 'sans-serif'}`,
                  fontSize: `${size}px`,
                  fontWeight: weight,
                  color,
                  fontStyle: italic ? 'italic' : 'normal',
                  textDecoration: underline ? 'underline' : 'none',
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight,
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {sampleText}
              </p>
            </div>

            {/* Sample text options */}
            <div className="flex gap-2 flex-wrap mb-4">
              {SAMPLE_TEXTS.map((t, i) => (
                <button key={i} onClick={() => { setSampleIndex(i); setCustomText(''); }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${sampleIndex === i && !customText ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-400'}`}
                >
                  {i === 0 ? 'Pangram' : i === 4 ? 'Alphabet' : i === 5 ? 'Numbers' : `Sample ${i + 1}`}
                </button>
              ))}
              <input
                type="text"
                placeholder="Custom text..."
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                className="flex-1 min-w-32 px-3 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Size */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Size: {size}px</label>
                  <input type="range" min="10" max="120" value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-blue-500" />
                </div>

                {/* Weight */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Weight</label>
                  <select value={weight} onChange={e => setWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    {WEIGHTS.map(w => <option key={w.value} value={w.value}>{w.value} – {w.label}</option>)}
                  </select>
                </div>

                {/* Letter spacing */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Letter Spacing: {letterSpacing}px</label>
                  <input type="range" min="-5" max="20" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} className="w-full accent-blue-500" />
                </div>

                {/* Line height */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Line Height: {lineHeight}</label>
                  <input type="range" min="0.8" max="3" step="0.1" value={lineHeight} onChange={e => setLineHeight(+e.target.value)} className="w-full accent-blue-500" />
                </div>

                {/* Text color */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-9 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-0.5" />
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="flex-1 px-2 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono focus:outline-none uppercase bg-white dark:bg-gray-700 dark:text-white" maxLength={7} />
                  </div>
                </div>

                {/* BG color */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-9 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-0.5" />
                    <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 px-2 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono focus:outline-none uppercase bg-white dark:bg-gray-700 dark:text-white" maxLength={7} />
                  </div>
                </div>
              </div>

              {/* Style toggles */}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setItalic(!italic)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 italic transition-colors ${italic ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}
                >I</button>
                <button onClick={() => setUnderline(!underline)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 underline transition-colors ${underline ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}
                >U</button>
                <button onClick={() => { setSize(40); setWeight('400'); setItalic(false); setUnderline(false); setLetterSpacing(0); setLineHeight(1.4); setColor('#1a1a2e'); setBgColor('#ffffff'); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors ml-auto"
                >
                  <RefreshCw size={14} />Reset
                </button>
              </div>
            </div>

            {/* Code export */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Google Fonts Import</span>
                  <CopyBtn text={googleFontLink} label="Copy" />
                </div>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">{googleFontLink}</pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">CSS</span>
                  <div className="flex gap-2">
                    <CopyBtn text={cssCode} label="Copy CSS" />
                    <button onClick={exportSVG} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
                      <Download size={12} />SVG
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">{cssCode}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
