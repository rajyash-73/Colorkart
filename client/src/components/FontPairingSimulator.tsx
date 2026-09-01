import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X, Download, Type, Palette as PaletteIcon, FileText, Upload, Trash2, Image as ImageIcon,
  Star, Heart, Zap, Award, Bell, Camera, Clock, Cloud, Coffee, Compass, Feather, Flag,
  Gift, Globe, Home, Key, Leaf, Lock, Mail, MapPin, Moon, Music, Phone, Send, Shield,
  Smile, Sun, Tag, Target, Truck, Umbrella, User, Video, Wallet, Watch, Wifi, Anchor,
  Aperture, Battery, Bookmark, Box, Briefcase, Calendar, ChevronRight, Circle, Code,
  Command, Cpu, Database, Droplet, Edit, Eye, Filter, Folder, Grid, Headphones, Layers,
  Link2, Monitor, Package, Printer, Scissors, Search, Settings, Share2, ShoppingBag,
  Sparkles, Terminal, Trophy, Users, Volume2, GripVertical, ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import BrowsePalettes from '@/components/BrowsePalettes';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Color } from '@/types/Color';
import { GOOGLE_FONTS, FONT_CATEGORIES, loadFont, fontStack, TEXT_WEIGHTS } from '@/lib/fonts';
import {
  deriveTheme, swapRoles, onColor, THEME_ROLES, ROLE_LABELS, type Theme, type ThemeRole,
} from '@/lib/theme';

type Mockup = 'card' | 'website' | 'article' | 'styleguide';

const MOCKUPS: { key: Mockup; label: string }[] = [
  { key: 'card', label: 'Name card' },
  { key: 'website', label: 'Website' },
  { key: 'article', label: 'Article' },
  { key: 'styleguide', label: 'Style guide' },
];

// A curated set — importing all ~1,500 lucide icons would bloat the bundle for
// a picker where a representative grid is what's actually useful.
const ICON_SET: Record<string, LucideIcon> = {
  Star, Heart, Zap, Award, Bell, Camera, Clock, Cloud, Coffee, Compass, Feather, Flag,
  Gift, Globe, Home, Key, Leaf, Lock, Mail, MapPin, Moon, Music, Phone, Send, Shield,
  Smile, Sun, Tag, Target, Truck, Umbrella, User, Video, Wallet, Watch, Wifi, Anchor,
  Aperture, Battery, Bookmark, Box, Briefcase, Calendar, Circle, Code, Command, Cpu,
  Database, Droplet, Edit, Eye, Filter, Folder, Grid, Headphones, Layers, Link2, Monitor,
  Package, Printer, Scissors, Search, Settings, Share2, ShoppingBag, Sparkles, Terminal,
  Trophy, Users, Volume2,
};

export interface PairingContent {
  brand: string; tagline: string; headline: string; subhead: string; body: string;
  personName: string; jobTitle: string; email: string; phone: string; website: string;
  cta: string;
}

const DEFAULT_CONTENT: PairingContent = {
  brand: 'Northwind Studio',
  tagline: 'Design & Brand Systems',
  headline: 'Build something people remember',
  subhead: 'A design partner for teams who care about the details.',
  body: 'We help product teams turn rough ideas into clear, considered interfaces. From first sketch to shipped release, we work in the open and design with real content — never placeholder text that hides the hard problems.',
  personName: 'Ava Mitchell',
  jobTitle: 'Creative Director',
  email: 'ava@northwind.studio',
  phone: '+1 (555) 012-8890',
  website: 'northwind.studio',
  cta: 'Start a project',
};

const fontList = (cat: string) => cat === 'All' ? GOOGLE_FONTS : GOOGLE_FONTS.filter(f => f.category === cat);

// Module scope on purpose: defining this inside the component makes React treat
// it as a new type each render, remounting the inputs and dropping focus.
function FontPicker({ label, value, onChange, cat, onCat }: {
  label: string; value: string; onChange: (v: string) => void; cat: string; onCat: (c: string) => void;
}) {
  return (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      <select value={cat} onChange={e => onCat(e.target.value)}
        className="text-[11px] bg-transparent text-gray-500 dark:text-gray-400 focus:outline-none cursor-pointer">
        {FONT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400">
      {fontList(cat).map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
    </select>
    <p className="mt-1.5 truncate text-lg text-gray-800 dark:text-gray-200" style={{ fontFamily: fontStack(value) }}>
      {value}
    </p>
  </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialHeadingFont?: string;
  initialBaseSize?: number;
}

export default function FontPairingSimulator({ open, onClose, initialHeadingFont, initialBaseSize }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [headingFont, setHeadingFont] = useState(initialHeadingFont || 'Playfair Display');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [baseSize, setBaseSize] = useState(initialBaseSize && initialBaseSize >= 12 ? Math.min(initialBaseSize, 24) : 16);
  const [headingCat, setHeadingCat] = useState('All');
  const [bodyCat, setBodyCat] = useState('All');

  const [theme, setTheme] = useState<Theme>(() => deriveTheme(['#FFFFFF', '#00221A', '#14B8A6', '#005345', '#E2E8F0']));
  const [mockup, setMockup] = useState<Mockup>('card');
  const [content, setContent] = useState<PairingContent>(DEFAULT_CONTENT);
  const [iconName, setIconName] = useState<string>('Feather');
  const [customSvg, setCustomSvg] = useState<string | null>(null);
  const [showPalettes, setShowPalettes] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dragRole, setDragRole] = useState<ThemeRole | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgUrlRef = useRef<string | null>(null);
  // Mirror of dragRole. The drop handler must not depend on a re-render having
  // happened since dragstart, or it reads a stale role and the swap silently no-ops.
  const dragRoleRef = useRef<ThemeRole | null>(null);

  // Load both families whenever either changes.
  useEffect(() => { if (open) loadFont(headingFont, TEXT_WEIGHTS); }, [headingFont, open]);
  useEffect(() => { if (open) loadFont(bodyFont, TEXT_WEIGHTS); }, [bodyFont, open]);

  // Escape closes, and the page behind shouldn't scroll while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Release the blob URL so an imported SVG doesn't leak.
  useEffect(() => () => { if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current); }, []);

  const applyPalette = (colors: Color[]) => {
    setTheme(deriveTheme(colors.map(c => c.hex)));
    setShowPalettes(false);
    toast({ title: 'Palette applied', description: 'Drag the role swatches to reassign colours.' });
  };

  const handleSvg = (file: File | undefined) => {
    if (!file) return;
    if (!/svg/i.test(file.type) && !/\.svg$/i.test(file.name)) {
      toast({ title: 'Not an SVG', description: 'Choose an .svg file.', variant: 'destructive' });
      return;
    }
    if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    // Rendered via <img>, never inlined: an <img> cannot execute scripts or
    // event handlers embedded in a user-supplied SVG.
    const url = URL.createObjectURL(file);
    svgUrlRef.current = url;
    setCustomSvg(url);
  };

  const clearSvg = () => {
    if (svgUrlRef.current) { URL.revokeObjectURL(svgUrlRef.current); svgUrlRef.current = null; }
    setCustomSvg(null);
  };

  // ── Drag to reassign theme roles ───────────────────────────────────────────
  const startRoleDrag = (role: ThemeRole) => { dragRoleRef.current = role; setDragRole(role); };
  const endRoleDrag = () => { dragRoleRef.current = null; setDragRole(null); };
  const onRoleDrop = (target: ThemeRole) => {
    const from = dragRoleRef.current;
    if (from && from !== target) setTheme(t => swapRoles(t, from, target));
    endRoleDrag();
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const shoot = async (opaque: boolean) => {
    // getElementById as a fallback: the ref is the normal path, but a null ref
    // must not silently no-op an export the user explicitly asked for.
    const el = canvasRef.current ?? document.getElementById('pairing-canvas');
    if (!el) throw new Error('Nothing to export');
    return html2canvas(el as HTMLElement, {
      backgroundColor: opaque ? theme.background : null,
      scale: 2,
      useCORS: true,
      logging: false,
      imageTimeout: 4000,
    });
  };

  const download = (href: string, ext: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = `${mockup}-${headingFont.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${ext}`;
    a.click();
  };

  const exportImage = async (fmt: 'png' | 'jpg') => {
    setExporting(true);
    toast({ title: `Rendering ${fmt.toUpperCase()}…`, description: 'This can take a few seconds.' });
    try {
      const canvas = await shoot(fmt === 'jpg');
      download(fmt === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95), fmt);
      toast({ title: `Exported ${fmt.toUpperCase()}` });
    } catch (err) {
      toast({ title: 'Export failed', description: String((err as Error)?.message ?? err).slice(0, 120), variant: 'destructive' });
    } finally { setExporting(false); }
  };

  const exportPdf = async () => {
    setExporting(true);
    toast({ title: 'Rendering PDF…', description: 'This can take a few seconds.' });
    try {
      const canvas = await shoot(true);
      // Loaded on demand so jsPDF stays out of the initial bundle.
      const { jsPDF } = await import('jspdf');
      const landscape = canvas.width >= canvas.height;
      const pdf = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const scale = Math.min((pw - margin * 2) / canvas.width, (ph - margin * 2) / canvas.height);
      const w = canvas.width * scale;
      const h = canvas.height * scale;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', (pw - w) / 2, (ph - h) / 2, w, h);
      pdf.save(`${mockup}-${Date.now()}.pdf`);
      toast({ title: 'Exported PDF' });
    } catch (err) {
      toast({ title: 'PDF export failed', description: String((err as Error)?.message ?? err).slice(0, 120), variant: 'destructive' });
    } finally { setExporting(false); }
  };

  const headingStack = useMemo(() => fontStack(headingFont), [headingFont]);
  const bodyStack = useMemo(() => fontStack(bodyFont), [bodyFont]);
  const Icon = ICON_SET[iconName] ?? Feather;

  if (!open) return null;

  const set = (k: keyof PairingContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent(c => ({ ...c, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[60] bg-gray-950/70 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Type size={18} className="text-violet-600" />
        <h2 className="font-bold text-gray-900 dark:text-white">Pairing Simulator</h2>
        <div className="hidden sm:flex items-center gap-1 ml-4">
          {MOCKUPS.map(m => (
            <button key={m.key} onClick={() => setMockup(m.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mockup === m.key ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>{m.label}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => exportImage('png')} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition-colors">
            <Download size={13} />PNG
          </button>
          <button onClick={() => exportImage('jpg')} disabled={exporting}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-violet-400 disabled:opacity-50 transition-colors">JPG</button>
          <button onClick={exportPdf} disabled={exporting}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-violet-400 disabled:opacity-50 transition-colors">PDF</button>
          <button onClick={onClose} aria-label="Close simulator"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mockup tabs — mobile */}
      <div className="sm:hidden flex gap-1 px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-x-auto flex-shrink-0">
        {MOCKUPS.map(m => (
          <button key={m.key} onClick={() => setMockup(m.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              mockup === m.key ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300'
            }`}>{m.label}</button>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── Rail ─────────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4 space-y-5 max-h-[38vh] lg:max-h-none">
          <FontPicker label="Heading font" value={headingFont} onChange={setHeadingFont} cat={headingCat} onCat={setHeadingCat} />
          <FontPicker label="Body font" value={bodyFont} onChange={setBodyFont} cat={bodyCat} onCat={setBodyCat} />

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Base size <span className="text-gray-400 font-normal">{baseSize}px</span>
            </label>
            <input type="range" min={12} max={24} value={baseSize} onChange={e => setBaseSize(+e.target.value)}
              className="w-full mt-1.5 accent-violet-600" />
            <p className="text-[11px] text-gray-400">Everything in the mockup scales from this.</p>
          </div>

          {/* Theme roles — drag to reassign */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Theme roles</label>
              <button onClick={() => setShowPalettes(v => !v)}
                className="flex items-center gap-1 text-[11px] font-medium text-violet-600 hover:text-violet-700">
                <PaletteIcon size={11} />Change palette
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mb-2">Drag a swatch onto another to swap roles.</p>
            <div className="space-y-1.5">
              {THEME_ROLES.map(role => (
                <div key={role}
                  draggable
                  onDragStart={() => startRoleDrag(role)}
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                  onDrop={e => { e.preventDefault(); onRoleDrop(role); }}
                  onDragEnd={endRoleDrag}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-grab active:cursor-grabbing transition-colors ${
                    dragRole === role ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  title={`${ROLE_LABELS[role]} — drag to swap`}
                >
                  <GripVertical size={12} className="text-gray-300 flex-shrink-0" />
                  <span className="w-7 h-7 rounded-md border border-black/10 flex-shrink-0" style={{ backgroundColor: theme[role] }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1">{ROLE_LABELS[role]}</span>
                  <input type="color" value={theme[role]} onChange={e => setTheme(t => ({ ...t, [role]: e.target.value }))}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0 flex-shrink-0" aria-label={`${ROLE_LABELS[role]} colour`} />
                  <span className="font-mono text-[10px] text-gray-400 w-14 text-right">{theme[role].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Icon + vector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Logo mark</label>
            <div className="mt-1.5 grid grid-cols-9 gap-1 max-h-28 overflow-y-auto p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
              {Object.entries(ICON_SET).map(([name, Cmp]) => (
                <button key={name} onClick={() => setIconName(name)} title={name}
                  className={`aspect-square flex items-center justify-center rounded transition-colors ${
                    iconName === name ? 'bg-violet-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                  <Cmp size={13} />
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-violet-400 cursor-pointer transition-colors">
                <Upload size={11} />Import SVG
                <input type="file" accept=".svg,image/svg+xml" className="hidden"
                  onChange={e => handleSvg(e.target.files?.[0])} />
              </label>
              {customSvg && (
                <button onClick={clearSvg} className="flex items-center gap-1 px-2 py-1.5 text-[11px] rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={11} />Remove
                </button>
              )}
            </div>
            {customSvg && <p className="mt-1 text-[11px] text-green-600 flex items-center gap-1"><ImageIcon size={10} />Custom vector in use</p>}
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <FileText size={12} />Your content
            </label>
            <div className="mt-1.5 space-y-1.5">
              {([
                ['brand', 'Brand name'], ['tagline', 'Tagline'], ['headline', 'Headline'],
                ['subhead', 'Subheading'], ['personName', 'Person name'], ['jobTitle', 'Job title'],
                ['email', 'Email'], ['phone', 'Phone'], ['website', 'Website'], ['cta', 'Button label'],
              ] as [keyof PairingContent, string][]).map(([k, label]) => (
                <input key={k} value={content[k]} onChange={set(k)} placeholder={label} aria-label={label}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-400" />
              ))}
              <textarea value={content.body} onChange={set('body')} rows={3} placeholder="Body copy" aria-label="Body copy"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-400 resize-y" />
            </div>
          </div>
        </aside>

        {/* ── Canvas ───────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto" style={{ maxWidth: mockup === 'card' ? 640 : 900 }}>
            <div ref={canvasRef} id="pairing-canvas">
              <Mockups
                mockup={mockup} theme={theme} content={content}
                headingStack={headingStack} bodyStack={bodyStack} baseSize={baseSize}
                Icon={Icon} customSvg={customSvg}
                headingFont={headingFont} bodyFont={bodyFont}
              />
            </div>
          </div>

          <div className="mx-auto mt-6" style={{ maxWidth: 900 }}>
            <button onClick={() => setShowPalettes(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-violet-400 transition-colors">
              <PaletteIcon size={14} />
              {showPalettes ? 'Hide palettes' : 'Browse palettes to theme this design'}
              <ChevronDown size={14} className={`transition-transform ${showPalettes ? 'rotate-180' : ''}`} />
            </button>
            {showPalettes && (
              <div className="mt-2">
                <BrowsePalettes onSelectPalette={applyPalette} userId={user?.id}
                  subtitle="click any palette to theme this design" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Mockups ─────────────────────────────────────────────────────────────────

interface MockProps {
  mockup: Mockup; theme: Theme; content: PairingContent;
  headingStack: string; bodyStack: string; baseSize: number;
  Icon: LucideIcon;
  customSvg: string | null;
  headingFont: string; bodyFont: string;
}

function Brandmark({ Icon, customSvg, size, color }: { Icon: LucideIcon; customSvg: string | null; size: number; color: string }) {
  if (customSvg) return <img src={customSvg} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />;
  return <Icon size={size} color={color} strokeWidth={1.75} />;
}

function Mockups({ mockup, theme, content, headingStack, bodyStack, baseSize, Icon, customSvg, headingFont, bodyFont }: MockProps) {
  const s = (mult: number) => `${Math.round(baseSize * mult)}px`;

  if (mockup === 'card') {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Front */}
        <div className="rounded-xl p-6 flex flex-col justify-between shadow-lg"
          style={{ background: theme.background, border: `1px solid ${theme.border}`, aspectRatio: '1.75 / 1' }}>
          <Brandmark Icon={Icon} customSvg={customSvg} size={Math.round(baseSize * 1.9)} color={theme.primary} />
          <div>
            <div style={{ fontFamily: headingStack, color: theme.text, fontSize: s(1.35), fontWeight: 700, lineHeight: 1.15 }}>{content.brand}</div>
            <div style={{ fontFamily: bodyStack, color: theme.primary, fontSize: s(0.62), letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{content.tagline}</div>
          </div>
        </div>
        {/* Back */}
        <div className="rounded-xl p-6 flex flex-col justify-between shadow-lg"
          style={{ background: theme.primary, aspectRatio: '1.75 / 1' }}>
          <div>
            <div style={{ fontFamily: headingStack, color: onColor(theme.primary), fontSize: s(1.05), fontWeight: 700 }}>{content.personName}</div>
            <div style={{ fontFamily: bodyStack, color: onColor(theme.primary), opacity: 0.75, fontSize: s(0.68), marginTop: 2 }}>{content.jobTitle}</div>
          </div>
          <div style={{ fontFamily: bodyStack, color: onColor(theme.primary), opacity: 0.9, fontSize: s(0.62), lineHeight: 1.7 }}>
            <div>{content.email}</div><div>{content.phone}</div><div>{content.website}</div>
          </div>
        </div>
      </div>
    );
  }

  if (mockup === 'website') {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
        <nav className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <Brandmark Icon={Icon} customSvg={customSvg} size={Math.round(baseSize * 1.2)} color={theme.primary} />
          <span style={{ fontFamily: headingStack, color: theme.text, fontSize: s(0.95), fontWeight: 700 }}>{content.brand}</span>
          <div className="ml-auto hidden sm:flex gap-5">
            {['Work', 'Studio', 'Journal'].map(l => (
              <span key={l} style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.65, fontSize: s(0.8) }}>{l}</span>
            ))}
          </div>
        </nav>
        <div className="px-6 sm:px-10 py-12" style={{ background: theme.surface }}>
          <div style={{ fontFamily: bodyStack, color: theme.accent, fontSize: s(0.7), letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{content.tagline}</div>
          <h2 style={{ fontFamily: headingStack, color: theme.text, fontSize: s(2.9), fontWeight: 700, lineHeight: 1.08, margin: '10px 0 0', maxWidth: '18ch' }}>{content.headline}</h2>
          <p style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.72, fontSize: s(1.02), lineHeight: 1.6, marginTop: 14, maxWidth: '46ch' }}>{content.subhead}</p>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 22 }}>
            <span style={{ fontFamily: bodyStack, background: theme.primary, color: onColor(theme.primary), fontSize: s(0.82), fontWeight: 600, padding: '10px 20px', borderRadius: 8 }}>{content.cta}</span>
            <span style={{ fontFamily: bodyStack, color: theme.text, border: `1px solid ${theme.border}`, fontSize: s(0.82), fontWeight: 600, padding: '10px 20px', borderRadius: 8 }}>See our work</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 px-6 sm:px-10 py-8">
          {['Strategy', 'Identity', 'Interface'].map(t => (
            <div key={t}>
              <Icon size={Math.round(baseSize * 1.1)} color={theme.accent} strokeWidth={1.75} />
              <div style={{ fontFamily: headingStack, color: theme.text, fontSize: s(1), fontWeight: 700, marginTop: 8 }}>{t}</div>
              <p style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.65, fontSize: s(0.8), lineHeight: 1.55, marginTop: 4 }}>
                {content.body.split('. ')[0]}.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mockup === 'article') {
    return (
      <div className="rounded-xl shadow-lg px-6 sm:px-12 py-10" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
        <div style={{ fontFamily: bodyStack, color: theme.accent, fontSize: s(0.72), letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{content.tagline}</div>
        <h2 style={{ fontFamily: headingStack, color: theme.text, fontSize: s(2.5), fontWeight: 700, lineHeight: 1.12, margin: '10px 0 0' }}>{content.headline}</h2>
        <p style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.6, fontSize: s(0.85), marginTop: 12 }}>
          By {content.personName} · {content.jobTitle}
        </p>
        <div style={{ height: 1, background: theme.border, margin: '20px 0' }} />
        <p style={{ fontFamily: bodyStack, color: theme.text, fontSize: s(1.06), lineHeight: 1.75, maxWidth: '68ch' }}>{content.body}</p>
        <blockquote style={{ fontFamily: headingStack, color: theme.primary, fontSize: s(1.5), lineHeight: 1.35, fontStyle: 'italic', borderLeft: `3px solid ${theme.primary}`, paddingLeft: 20, margin: '24px 0' }}>
          {content.subhead}
        </blockquote>
        <p style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.85, fontSize: s(1.06), lineHeight: 1.75, maxWidth: '68ch' }}>{content.body}</p>
      </div>
    );
  }

  // Style guide
  return (
    <div className="rounded-xl shadow-lg p-6 sm:p-10" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
        <Brandmark Icon={Icon} customSvg={customSvg} size={Math.round(baseSize * 1.6)} color={theme.primary} />
        <div>
          <div style={{ fontFamily: headingStack, color: theme.text, fontSize: s(1.3), fontWeight: 700 }}>{content.brand}</div>
          <div style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.6, fontSize: s(0.72) }}>Brand style guide</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4" style={{ marginBottom: 24 }}>
        {[{ label: 'Heading', font: headingFont, stack: headingStack }, { label: 'Body', font: bodyFont, stack: bodyStack }].map(f => (
          <div key={f.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.55, fontSize: s(0.62), letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.label}</div>
            <div style={{ fontFamily: f.stack, color: theme.text, fontSize: s(1.9), fontWeight: 700, lineHeight: 1.2, marginTop: 6 }}>{f.font}</div>
            <div style={{ fontFamily: f.stack, color: theme.text, opacity: 0.6, fontSize: s(0.78), marginTop: 6 }}>ABCDEFGHIJKLM · abcdefghijklm · 0123456789</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: bodyStack, color: theme.text, opacity: 0.55, fontSize: s(0.62), letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Colour roles</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEME_ROLES.map(role => (
          <div key={role} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: theme[role], height: Math.round(baseSize * 3) }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontFamily: bodyStack, color: theme.text, fontSize: s(0.75), fontWeight: 600 }}>{ROLE_LABELS[role]}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', color: theme.text, opacity: 0.6, fontSize: s(0.66) }}>{theme[role].toUpperCase()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
