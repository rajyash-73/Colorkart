import React, { useState, useEffect, useRef } from 'react';
import { Layout, Monitor, PieChart, MessageSquare, Calendar, Check, GripVertical, Download } from 'lucide-react';
import { usePalette } from '@/contexts/PaletteContext';
import { Color } from '@/types/Color';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { isLightColor } from '@/lib/colorUtils';
import SEOHead from '@/components/SEOHead';
import html2canvas from 'html2canvas';

type TemplateType = 'dashboard' | 'landing' | 'analytics' | 'chat' | 'calendar';

const TEMPLATES: { key: TemplateType; icon: React.ReactNode; label: string }[] = [
  { key: 'dashboard', icon: <Layout size={14} />, label: 'Dashboard' },
  { key: 'landing',   icon: <Monitor size={14} />, label: 'Landing' },
  { key: 'analytics', icon: <PieChart size={14} />, label: 'Analytics' },
  { key: 'chat',      icon: <MessageSquare size={14} />, label: 'Chat' },
  { key: 'calendar',  icon: <Calendar size={14} />, label: 'Calendar' },
];

export default function PaletteVisualizer() {
  const { palette: contextPalette, setPalette } = usePalette();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('dashboard');
  const [showExportToast, setShowExportToast] = useState(false);
  const [colorIndicators, setColorIndicators] = useState(false);
  const [localPalette, setLocalPalette] = useState<Color[]>(contextPalette);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('currentPalette');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalPalette(parsed);
          setPalette(parsed);
        }
      }
    } catch {}
  }, [setPalette]);

  const getTextColor = (bg: string) => isLightColor(bg) ? '#1f2937' : '#ffffff';

  const exportAsPNG = async () => {
    const el = document.getElementById('template-visualizer');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${activeTemplate}-palette-${Date.now()}.png`;
      link.click();
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 3000);
    } catch {}
  };

  const updateColor = (idx: number, hex: string) => {
    const updated = localPalette.map((c, i) =>
      i === idx ? { ...c, hex, rgb: { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) } } : c
    );
    setLocalPalette(updated);
    setPalette(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />
      <SEOHead
        title="Color Palette Visualizer — Preview Colors in Real UI Templates"
        description="Visualize your color palette in real dashboard, landing page, analytics and chat UI templates. See exactly how your colors work before you ship. Free preview tool."
        keywords="color palette visualizer, UI color preview, palette mockup generator, colour palette visualizer, color scheme in UI, color combinations preview, UI template colors, design color preview, color in real UI, palette visualizer online, UI color scheme"
        canonicalPath="/visualize"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Color Palette Visualizer",
          "url": "https://coolors.in/visualize",
          "applicationCategory": "DesignApplication",
          "description": "Preview your color palette in real UI templates including dashboards, landing pages and chat apps.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-5">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Palette Visualizer
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Preview your colors across real UI templates
            </p>
          </div>
          {/* Palette strip */}
          <div className="sm:ml-auto flex rounded-xl overflow-hidden h-11 min-w-[200px] sm:min-w-[280px] ring-1 ring-gray-200 dark:ring-gray-700 shadow-md flex-shrink-0">
            {localPalette.map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>

        {/* Controls bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-3 flex flex-wrap items-center gap-3">
          {/* Segmented template tabs */}
          <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {TEMPLATES.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTemplate(t.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTemplate === t.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={colorIndicators}
                onChange={() => setColorIndicators(v => !v)}
                className="rounded accent-violet-600"
              />
              <span className="hidden sm:inline">Show labels</span>
            </label>
            <button
              onClick={exportAsPNG}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Download size={14} />
              Export PNG
            </button>
          </div>
        </div>

        {/* Template preview + palette editor sidebar */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Template preview */}
          <div
            id="template-visualizer"
            className="flex-1 rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg w-full"
            style={{ minHeight: 560 }}
          >
            {activeTemplate === 'dashboard' && <DashboardTemplate palette={localPalette} getTextColor={getTextColor} showIndicators={colorIndicators} />}
            {activeTemplate === 'landing'   && <LandingTemplate   palette={localPalette} getTextColor={getTextColor} showIndicators={colorIndicators} />}
            {activeTemplate === 'analytics' && <AnalyticsTemplate palette={localPalette} getTextColor={getTextColor} showIndicators={colorIndicators} />}
            {activeTemplate === 'chat'      && <ChatTemplate      palette={localPalette} getTextColor={getTextColor} showIndicators={colorIndicators} />}
            {activeTemplate === 'calendar'  && <CalendarTemplate  palette={localPalette} getTextColor={getTextColor} showIndicators={colorIndicators} />}
          </div>

          {/* Palette editor sidebar */}
          <div className="w-full lg:w-64 lg:flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Edit Palette</h3>
                <p className="text-xs text-gray-400 mt-0.5">Drag to reorder · click to change</p>
              </div>
              <a href="/generator" className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium shrink-0 ml-2">
                Open generator →
              </a>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-4">
              {localPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={() => { dragIdx.current = idx; }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx.current === null || dragIdx.current === idx) return;
                    const updated = [...localPalette];
                    const [moved] = updated.splice(dragIdx.current, 1);
                    updated.splice(idx, 0, moved);
                    dragIdx.current = null;
                    setLocalPalette(updated);
                    setPalette(updated);
                  }}
                >
                  <div className="relative mt-4 w-full flex justify-center">
                    <GripVertical
                      size={14}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors"
                    />
                    <input
                      type="color"
                      value={color.hex}
                      onChange={e => updateColor(idx, e.target.value.toUpperCase())}
                      className="w-14 h-14 rounded-2xl cursor-pointer border-0 p-0 appearance-none shadow-md ring-2 ring-white dark:ring-gray-800 hover:ring-violet-300 dark:hover:ring-violet-600 transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={`Color ${idx + 1}: ${color.hex}`}
                    />
                  </div>
                  <input
                    type="text"
                    value={color.hex}
                    maxLength={7}
                    onChange={e => {
                      const v = e.target.value.toUpperCase();
                      if (/^#[0-9A-F]{6}$/.test(v)) updateColor(idx, v);
                    }}
                    className="w-full text-center text-[10px] font-mono text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-1 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 uppercase bg-gray-50 dark:bg-gray-800"
                  />
                </div>
            ))}
            </div>
          </div>

        </div>{/* end flex row */}

      </div>

      {/* Export success toast */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50">
          <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
            <Check size={14} />
          </div>
          <span className="text-sm font-medium">Exported successfully!</span>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Color indicator badge
function ColorIndicator({ color, index, showIndicators }: { color: string; index: number; showIndicators: boolean }) {
  if (!showIndicators) return null;
  return (
    <div
      className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold rounded-bl-lg z-10"
      style={{ backgroundColor: color, color: isLightColor(color) ? '#000' : '#fff' }}
    >
      C{index + 1}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function DashboardTemplate({ palette, getTextColor, showIndicators }: {
  palette: Color[]; getTextColor: (c: string) => string; showIndicators: boolean;
}) {
  const c = (i: number, fallback: string) => palette[i]?.hex || fallback;
  return (
    <div className="flex min-h-[560px]" style={{ backgroundColor: c(4, '#f8fafc') }}>
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 flex flex-col relative p-4"
        style={{ backgroundColor: c(0, '#1e293b'), color: getTextColor(c(0, '#1e293b')) }}>
        <ColorIndicator color={c(0, '#1e293b')} index={0} showIndicators={showIndicators} />
        <div className="font-bold text-lg mb-6">App Name</div>
        <div className="space-y-1 text-sm">
          <div className="p-2.5 rounded-lg flex items-center gap-2 font-medium relative"
            style={{ backgroundColor: c(1, '#334155'), color: getTextColor(c(1, '#334155')) }}>
            <ColorIndicator color={c(1, '#334155')} index={1} showIndicators={showIndicators} />
            <Layout size={15} /> Dashboard
          </div>
          {['Analytics', 'Messages', 'Calendar'].map((item, i) => (
            <div key={i} className="p-2.5 rounded-lg flex items-center gap-2 opacity-70 hover:opacity-100 cursor-default">
              {[<PieChart size={15}/>, <MessageSquare size={15}/>, <Calendar size={15}/>][i]} {item}
            </div>
          ))}
        </div>
        <div className="mt-auto text-sm space-y-1 opacity-70">
          <div className="p-2">Settings</div>
          <div className="p-2">Help</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold" style={{ color: getTextColor(c(4, '#f8fafc')) }}>Dashboard</h1>
          <div className="px-4 py-2 rounded-lg text-sm font-medium relative"
            style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
            <ColorIndicator color={c(2, '#3b82f6')} index={2} showIndicators={showIndicators} />
            + New Item
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[['Total Users', '4,927', '↑ 12%'], ['Revenue', '$24,438', '↑ 8%'], ['Projects', '23', '↓ 2']].map(([label, val, change], i) => (
            <div key={i} className="p-4 rounded-xl shadow-sm relative"
              style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
              {i === 0 && <ColorIndicator color={c(3, '#ffffff')} index={3} showIndicators={showIndicators} />}
              <div className="text-xs opacity-70 mb-1">{label}</div>
              <div className="text-2xl font-bold">{val}</div>
              <div className={`text-xs mt-1.5 ${change.startsWith('↑') ? 'text-green-500' : 'text-red-400'}`}>{change} this month</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl shadow-sm p-4"
          style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm">Recent Activity</h2>
            <span className="text-xs opacity-60">View all</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="py-2 border-b last:border-0 flex justify-between text-sm opacity-80">
                <span>User #{i} completed Task #{i}</span>
                <span className="opacity-60 text-xs">Just now</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────────
function LandingTemplate({ palette, getTextColor, showIndicators }: {
  palette: Color[]; getTextColor: (c: string) => string; showIndicators: boolean;
}) {
  const c = (i: number, fallback: string) => palette[i]?.hex || fallback;
  return (
    <div className="min-h-[560px] overflow-auto" style={{ backgroundColor: c(4, '#f8fafc'), color: getTextColor(c(4, '#f8fafc')) }}>
      <header className="px-8 py-4 flex justify-between items-center relative"
        style={{ backgroundColor: c(0, '#1e293b'), color: getTextColor(c(0, '#1e293b')) }}>
        <ColorIndicator color={c(0, '#1e293b')} index={0} showIndicators={showIndicators} />
        <div className="font-bold text-lg">Brand</div>
        <nav className="flex items-center gap-6 text-sm">
          <span>Features</span><span>Pricing</span><span>About</span>
          <span className="px-4 py-1.5 rounded-lg font-medium relative"
            style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
            <ColorIndicator color={c(2, '#3b82f6')} index={2} showIndicators={showIndicators} />
            Get Started
          </span>
        </nav>
      </header>
      <div className="px-8 py-14 flex flex-col sm:flex-row gap-8 items-center relative"
        style={{ backgroundColor: c(1, '#334155'), color: getTextColor(c(1, '#334155')) }}>
        <ColorIndicator color={c(1, '#334155')} index={1} showIndicators={showIndicators} />
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Build something remarkable</h1>
          <p className="mb-6 opacity-80 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi vel consectetur interdum.</p>
          <div className="flex gap-3">
            <span className="px-5 py-2.5 rounded-lg font-semibold text-sm relative"
              style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
              Get Started
            </span>
            <span className="px-5 py-2.5 rounded-lg font-semibold text-sm border"
              style={{ borderColor: `${getTextColor(c(1, '#334155'))}40` }}>
              Learn More
            </span>
          </div>
        </div>
        <div className="w-72 h-44 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
          style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
          <ColorIndicator color={c(3, '#ffffff')} index={3} showIndicators={showIndicators} />
          <span className="text-sm opacity-50">Hero image</span>
        </div>
      </div>
      <div className="px-8 py-12">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: getTextColor(c(4, '#f8fafc')) }}>Features</h2>
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 rounded-2xl text-center"
              style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
              <div className="w-11 h-11 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
                {i}
              </div>
              <h3 className="font-semibold mb-2 text-sm">Feature {i}</h3>
              <p className="text-xs opacity-70 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Analytics ──────────────────────────────────────────────────────────────────
const BAR_HEIGHTS = [55, 80, 40, 90, 65, 70, 45];
const SOURCE_WIDTHS = [72, 48, 61, 35, 54];

function AnalyticsTemplate({ palette, getTextColor, showIndicators }: {
  palette: Color[]; getTextColor: (c: string) => string; showIndicators: boolean;
}) {
  const c = (i: number, fallback: string) => palette[i]?.hex || fallback;
  return (
    <div className="min-h-[560px] overflow-auto" style={{ backgroundColor: c(4, '#f8fafc'), color: getTextColor(c(4, '#f8fafc')) }}>
      <header className="px-5 py-3.5 flex justify-between items-center border-b border-black/5">
        <h1 className="font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-60">Last 7 days ▾</span>
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium relative"
            style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
            <ColorIndicator color={c(2, '#3b82f6')} index={2} showIndicators={showIndicators} />
            Export
          </span>
        </div>
      </header>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { color: c(0, '#1e293b'), label: 'Page Views', val: '42,856' },
            { color: c(1, '#334155'), label: 'Conversion Rate', val: '8.42%' },
          ].map(({ color, label, val }, idx) => (
            <div key={idx} className="p-4 rounded-xl relative"
              style={{ backgroundColor: color, color: getTextColor(color) }}>
              <ColorIndicator color={color} index={idx} showIndicators={showIndicators} />
              <div className="font-medium text-sm mb-1 opacity-80">{label}</div>
              <div className="text-3xl font-bold">{val}</div>
              <div className="relative h-28 mt-3">
                {idx === 0 ? (
                  <div className="flex items-end justify-between h-full gap-1">
                    {BAR_HEIGHTS.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm opacity-80"
                        style={{ height: `${h}%`, backgroundColor: c(2, '#3b82f6') }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-24 h-24 rounded-full border-8 flex items-center justify-center font-bold text-lg"
                      style={{ borderColor: c(2, '#3b82f6') }}>8.4%</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl relative"
          style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
          <ColorIndicator color={c(3, '#ffffff')} index={3} showIndicators={showIndicators} />
          <h3 className="font-semibold text-sm mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral'].map((src, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-24 text-xs shrink-0">{src}</div>
                <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: `${SOURCE_WIDTHS[i]}%`, backgroundColor: i % 2 === 0 ? c(0, '#1e293b') : c(2, '#3b82f6') }} />
                </div>
                <div className="w-10 text-right text-xs opacity-70">{SOURCE_WIDTHS[i]}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chat ───────────────────────────────────────────────────────────────────────
function ChatTemplate({ palette, getTextColor, showIndicators }: {
  palette: Color[]; getTextColor: (c: string) => string; showIndicators: boolean;
}) {
  const c = (i: number, fallback: string) => palette[i]?.hex || fallback;
  return (
    <div className="min-h-[560px] flex"
      style={{ backgroundColor: c(3, '#ffffff'), color: getTextColor(c(3, '#ffffff')) }}>
      <div className="w-60 flex-shrink-0 flex flex-col border-r border-black/5 relative"
        style={{ backgroundColor: c(0, '#1e293b'), color: getTextColor(c(0, '#1e293b')) }}>
        <ColorIndicator color={c(0, '#1e293b')} index={0} showIndicators={showIndicators} />
        <div className="px-4 py-4 border-b border-white/10 font-bold">Messages</div>
        <div className="p-3 space-y-1 overflow-auto flex-1">
          {[['Alice Smith', 'Hey there!', true], ['Bob Johnson', 'Last message…', false],
            ['Catherine Lee', 'Sounds good!', false], ['David Miller', 'Thanks!', false]].map(([name, msg, active], i) => (
            <div key={i} className="p-2.5 rounded-xl flex items-center gap-3 cursor-default relative"
              style={active ? { backgroundColor: c(1, '#334155'), color: getTextColor(c(1, '#334155')) } : {}}>
              {active && <ColorIndicator color={c(1, '#334155')} index={1} showIndicators={showIndicators} />}
              <div className="w-9 h-9 rounded-full bg-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{name as string}</div>
                <div className="text-xs opacity-60 truncate">{msg as string}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3.5 border-b border-black/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-300" />
          <div>
            <div className="text-sm font-semibold">Alice Smith</div>
            <div className="text-xs opacity-50">Online</div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="flex justify-start">
            <div className="max-w-xs rounded-2xl rounded-tl-sm p-3 text-sm relative"
              style={{ backgroundColor: c(4, '#f1f5f9'), color: getTextColor(c(4, '#f1f5f9')) }}>
              <ColorIndicator color={c(4, '#f1f5f9')} index={4} showIndicators={showIndicators} />
              <p>Hey there! How are you doing today?</p>
              <div className="text-[10px] mt-1 opacity-50">10:32 AM</div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-xs rounded-2xl rounded-tr-sm p-3 text-sm relative"
              style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
              <ColorIndicator color={c(2, '#3b82f6')} index={2} showIndicators={showIndicators} />
              <p>I'm doing great! Just finished working on that project we discussed.</p>
              <div className="text-[10px] mt-1 opacity-60">10:34 AM</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-xs rounded-2xl rounded-tl-sm p-3 text-sm"
              style={{ backgroundColor: c(4, '#f1f5f9'), color: getTextColor(c(4, '#f1f5f9')) }}>
              <p>That's awesome! Can you share the details?</p>
              <div className="text-[10px] mt-1 opacity-50">10:36 AM</div>
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-black/5 flex gap-2">
          <input type="text" placeholder="Type a message…" readOnly
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: c(4, '#f1f5f9'), color: getTextColor(c(4, '#f1f5f9')) }} />
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar ───────────────────────────────────────────────────────────────────
const CALENDAR_EVENTS: Record<number, string> = { 3: 'Meeting', 8: 'Review', 12: 'Call', 15: 'Stand-up', 20: 'Demo', 24: 'Sprint', 28: 'Retro' };

function CalendarTemplate({ palette, getTextColor, showIndicators }: {
  palette: Color[]; getTextColor: (c: string) => string; showIndicators: boolean;
}) {
  const c = (i: number, fallback: string) => palette[i]?.hex || fallback;
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="min-h-[560px] flex flex-col"
      style={{ backgroundColor: c(4, '#f8fafc'), color: getTextColor(c(4, '#f8fafc')) }}>
      <div className="px-5 py-4 flex justify-between items-center relative"
        style={{ backgroundColor: c(0, '#1e293b'), color: getTextColor(c(0, '#1e293b')) }}>
        <ColorIndicator color={c(0, '#1e293b')} index={0} showIndicators={showIndicators} />
        <div className="font-bold">May 2026</div>
        <div className="flex gap-1 text-sm">
          <button className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100">◀</button>
          <button className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100">Today</button>
          <button className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100">▶</button>
        </div>
        <div className="flex gap-1 text-sm">
          {['Month', 'Week', 'Day'].map(v => (
            <button key={v} className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100">{v}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 text-center py-2 text-sm font-medium relative"
        style={{ backgroundColor: c(1, '#334155'), color: getTextColor(c(1, '#334155')) }}>
        <ColorIndicator color={c(1, '#334155')} index={1} showIndicators={showIndicators} />
        {weekdays.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-5">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 3;
          const inMonth = day > 0 && day <= 31;
          const isToday = day === 15;
          const displayDay = inMonth ? day : day <= 0 ? 31 + day : day - 31;
          const event = inMonth ? CALENDAR_EVENTS[day] : undefined;
          return (
            <div key={i}
              className={`border-r border-b border-black/5 p-1.5 flex flex-col ${!inMonth ? 'opacity-30' : ''}`}
              style={{ backgroundColor: isToday ? c(3, '#ffffff') : 'transparent',
                       color: isToday ? getTextColor(c(3, '#ffffff')) : getTextColor(c(4, '#f8fafc')) }}>
              {isToday && showIndicators && <ColorIndicator color={c(3, '#ffffff')} index={3} showIndicators={showIndicators} />}
              <div className={`text-right text-xs mb-1 ${isToday ? 'font-bold' : ''}`}>{displayDay}</div>
              {event && (
                <div className="text-[10px] px-1.5 py-0.5 rounded font-medium truncate"
                  style={{ backgroundColor: c(2, '#3b82f6'), color: getTextColor(c(2, '#3b82f6')) }}>
                  {event}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
