import React, { useState, useCallback, useRef } from 'react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import { Plus, Trash2, Copy, Check, RotateCcw } from 'lucide-react';

type GradientType = 'linear' | 'radial' | 'conic';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

const DEFAULT_STOPS: GradientStop[] = [
  { id: '1', color: '#6366F1', position: 0 },
  { id: '2', color: '#EC4899', position: 100 },
];

let idCounter = 3;

function buildCSS(stops: GradientStop[], type: GradientType, angle: number): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(', ');
  if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`;
  if (type === 'radial') return `radial-gradient(circle, ${stopsStr})`;
  return `conic-gradient(from ${angle}deg, ${stopsStr})`;
}

interface CopyButtonProps { text: string; label: string; }
function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-gray-600 dark:text-gray-300">
      {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> {label}</>}
    </button>
  );
}

export default function GradientGeneratorPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stops, setStops] = useState<GradientStop[]>(DEFAULT_STOPS);
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const previewRef = useRef<HTMLDivElement>(null);
  const draggingId = useRef<string | null>(null);

  const cssGradient = buildCSS(stops, type, angle);

  const updateStop = useCallback((id: string, changes: Partial<GradientStop>) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s));
  }, []);

  const addStop = () => {
    if (stops.length >= 8) return;
    setStops(prev => [...prev, { id: String(idCounter++), color: '#A855F7', position: 50 }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const reset = () => {
    setStops(DEFAULT_STOPS);
    setType('linear');
    setAngle(90);
  };

  const onStopMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    draggingId.current = id;
    const onMove = (me: MouseEvent) => {
      if (!previewRef.current || !draggingId.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, Math.round(((me.clientX - rect.left) / rect.width) * 100)));
      updateStop(draggingId.current, { position: pct });
    };
    const onUp = () => {
      draggingId.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const cssCode = `background: ${cssGradient};`;
  const tailwindCode = `bg-[${cssGradient.replace(/\s/g, '_')}]`;
  const scssCode = `background: ${cssGradient};`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="CSS Gradient Generator — Linear, Radial & Conic Gradients"
        description="Create beautiful CSS gradients with live preview. Generate linear, radial and conic gradients. Export ready-to-use CSS, Tailwind and SCSS code instantly. Free online tool."
        keywords="CSS gradient generator, linear gradient generator, colour gradient maker, gradient CSS code, radial gradient tool, conic gradient generator, gradient background generator, CSS background gradient, Tailwind gradient, SCSS gradient, gradient picker online, CSS gradient tool"
        canonicalPath="/gradient-generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "CSS Gradient Generator",
          "url": "https://coolors.in/gradient-generator",
          "applicationCategory": "DesignApplication",
          "description": "Generate linear, radial and conic CSS gradients with live preview and instant code export.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CSS Gradient Generator</h2>
          <p className="text-gray-500 dark:text-gray-400">Build beautiful gradients and export ready-to-use CSS, Tailwind, and SCSS code.</p>
        </div>

        {/* Gradient Preview */}
        <div
          ref={previewRef}
          className="w-full h-48 rounded-2xl mb-2 relative select-none shadow-md"
          style={{ background: cssGradient }}
        >
          {stops.map(stop => (
            <div
              key={stop.id}
              className="absolute top-full mt-1 w-4 h-4 rounded-full border-2 border-white shadow-md cursor-ew-resize -translate-x-1/2"
              style={{ left: `${stop.position}%`, backgroundColor: stop.color }}
              onMouseDown={(e) => onStopMouseDown(e, stop.id)}
              title={`${stop.color} at ${stop.position}%`}
            />
          ))}
        </div>
        <div className="h-6 mb-6" />

        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Type</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {(['linear', 'radial', 'conic'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${type === t ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {(type === 'linear' || type === 'conic') && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                  Angle: {angle}°
                </label>
                <input
                  type="range" min="0" max="360" value={angle}
                  onChange={e => setAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Color Stops ({stops.length}/8)</label>
              <button
                onClick={addStop}
                disabled={stops.length >= 8}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Plus size={12} /> Add Stop
              </button>
            </div>

            <div className="space-y-2">
              {[...stops].sort((a, b) => a.position - b.position).map(stop => (
                <div key={stop.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={e => updateStop(stop.id, { color: e.target.value.toUpperCase() })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white dark:border-gray-600 shadow-sm appearance-none p-0"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={e => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateStop(stop.id, { color: e.target.value.toUpperCase() }); }}
                    maxLength={7}
                    className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="range" min="0" max="100" value={stop.position}
                      onChange={e => updateStop(stop.id, { position: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-10 text-right">{stop.position}%</span>
                  </div>
                  <button
                    onClick={() => removeStop(stop.id)}
                    disabled={stops.length <= 2}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Export Code</h3>
          <div className="space-y-4">
            {[
              { label: 'CSS', code: cssCode, copyLabel: 'Copy CSS' },
              { label: 'Tailwind', code: `class="${tailwindCode}"`, copyLabel: 'Copy Tailwind' },
              { label: 'SCSS', code: scssCode, copyLabel: 'Copy SCSS' },
            ].map(({ label, code, copyLabel }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</span>
                  <CopyButton text={code} label={copyLabel} />
                </div>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                  {code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
