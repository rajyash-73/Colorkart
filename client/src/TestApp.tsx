import React, { useState, useRef, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { Color } from './types/Color';
import { isLightColor, simulateColorBlindness, ColorBlindnessType } from '@/lib/colorUtils';
import {
  LockIcon, UnlockIcon, RefreshCw, Copy, Download, Plus, Trash, Info, Sliders,
  GripVertical, Image as ImageIcon, Eye, BookOpen, Keyboard, Move, Lock, ChevronLeft,
  ChevronDown, Save, LogIn, Undo2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import ColorAdjustmentModal from '@/components/ColorAdjustmentModal';
import BrowsePalettes from '@/components/BrowsePalettes';
import WelcomeModal from '@/components/modals/WelcomeModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { usePalette, colorTheoryOptions, ColorTheory } from '@/contexts/PaletteContext';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

const CB_MODES: { key: ColorBlindnessType; label: string }[] = [
  { key: 'normal',        label: 'Normal' },
  { key: 'protanopia',    label: 'Protanopia' },
  { key: 'deuteranopia',  label: 'Deuteranopia' },
  { key: 'tritanopia',    label: 'Tritanopia' },
  { key: 'achromatopsia', label: 'Achromatopsia' },
];

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 max-w-md">
      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
        <Info size={18} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// Main component that uses the context
function PaletteApp() {
  const {
    palette,
    colorTheory,
    setColorTheory,
    generatePalette,
    generatePaletteWithTheory,
    toggleLock,
    addColor,
    removeColor,
    resetPalette,
    updateColor,
    setPalette: setPaletteColors,
    reorderColors,
    enrichColorPool,
    enrichPaletteLibrary,
  } = usePalette();
  
  const { user } = useAuth();

  // Load palette passed from Explore page (survives full page reload via localStorage)
  useEffect(() => {
    const pending = localStorage.getItem('pendingPalette');
    if (pending) {
      try {
        const colors = JSON.parse(pending);
        if (Array.isArray(colors) && colors.length > 0) {
          setPaletteColors(colors);
        }
      } catch {}
      localStorage.removeItem('pendingPalette');
    }
  }, [setPaletteColors]);

  // Effect A — Community pool: fetch all public palettes on mount (no login needed), cached 1 hour
  const COMMUNITY_POOL_KEY = 'colorkart_community_pool';
  useEffect(() => {
    const cached = localStorage.getItem(COMMUNITY_POOL_KEY);
    if (cached) {
      try {
        const { colors, palettes, ts } = JSON.parse(cached);
        if (Date.now() - ts < 3_600_000) {
          enrichColorPool(colors);
          enrichPaletteLibrary(palettes);
          return;
        }
      } catch {}
    }
    (async () => {
      try {
        const { data } = await supabase
          .from('public_palettes')
          .select('colors')
          .eq('is_public', true)
          .limit(500);
        if (data && data.length > 0) {
          const palettes = data
            .map((r: any) => (Array.isArray(r.colors) ? r.colors as string[] : []))
            .filter((p: string[]) => p.length >= 2);
          const colors = Array.from(new Set(palettes.flat()));
          enrichColorPool(colors);
          enrichPaletteLibrary(palettes);
          localStorage.setItem(COMMUNITY_POOL_KEY, JSON.stringify({ colors, palettes, ts: Date.now() }));
        }
      } catch {}
    })();
  }, [enrichColorPool, enrichPaletteLibrary]);

  // Effect B — Private user palettes: add only when logged in (public ones already in Effect A)
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('public_palettes')
          .select('colors')
          .eq('user_id', user.id)
          .eq('is_public', false);
        if (data && data.length > 0) {
          const userPalettes = data
            .map((r: any) => (Array.isArray(r.colors) ? r.colors as string[] : []))
            .filter((p: string[]) => p.length >= 2);
          enrichPaletteLibrary(userPalettes);
          enrichColorPool(userPalettes.flat());
        }
      } catch {}
    })();
  }, [user, enrichColorPool, enrichPaletteLibrary]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteHistory, setPaletteHistory] = useState<Color[][]>([]);
  const [generateCount, setGenerateCount] = useState(0);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState<number | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [simulationMode, setSimulationMode] = useState<ColorBlindnessType>('normal');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleSavePalette = async () => {
    if (!user) { window.location.href = '/auth'; return; }
    if (!saveName.trim()) { setToast('Please enter a palette name'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('public_palettes').insert({
        user_id: user.id,
        name: saveName.trim(),
        colors: palette.map(c => c.hex),
        is_public: true,
        likes: 0,
        user_email: user.email,
        user_name: user.name,
      });
      if (error) throw new Error(error.message);
      localStorage.removeItem(COMMUNITY_POOL_KEY); // invalidate cache so next load picks up new palette
      setToast(`Saved "${saveName}"`);
      setShowSaveModal(false);
      setSaveName('');
    } catch (err: any) {
      setToast('Failed to save: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Text file download helper
  const downloadText = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSSVariables = () => {
    const lines = palette.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name ?? ''} */`);
    downloadText(`:root {\n${lines.join('\n')}\n}`, 'palette.css', 'text/css');
    setShowExportMenu(false);
  };

  const exportAsSCSS = () => {
    const lines = palette.map((c, i) => `$color-${i + 1}: ${c.hex}; // ${c.name ?? ''}`);
    downloadText(lines.join('\n'), 'palette.scss', 'text/plain');
    setShowExportMenu(false);
  };

  const exportAsTailwind = () => {
    const entries = palette.map((c, i) => `      "palette-${i + 1}": "${c.hex}",`);
    downloadText(`// tailwind.config.js — extend.colors\ncolors: {\n${entries.join('\n')}\n}`, 'tailwind-palette.js', 'text/javascript');
    setShowExportMenu(false);
  };
  
  const handleGenerate = () => {
    setPaletteHistory(prev => [...prev.slice(-2), [...palette]]);
    generatePalette();
    setGenerateCount(n => {
      const next = n + 1;
      if (next === 2 && !user && !sessionStorage.getItem('save_prompt_dismissed')) {
        setTimeout(() => setShowSavePrompt(true), 600);
      }
      return next;
    });
  };

  const handleUndo = () => {
    if (paletteHistory.length === 0) return;
    const prev = paletteHistory[paletteHistory.length - 1];
    setPaletteHistory(h => h.slice(0, -1));
    setPaletteColors(prev);
  };

  // Handle spacebar for generating new palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA" &&
          !showAdjustModal) {
        e.preventDefault();
        handleGenerate();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleGenerate, showAdjustModal]);

  // Handle scrolling to trending section when hash is present
  useEffect(() => {
    if (window.location.hash === '#trending') {
      // Use a timeout to ensure the component is fully rendered
      setTimeout(() => {
        const element = document.getElementById('trending');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setToast(`Copied ${text} to clipboard`);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  const exportPalette = async () => {
    if (paletteRef.current) {
      try {
        const canvas = await html2canvas(paletteRef.current);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "palette.png";
        link.click();
      } catch (err) {
        console.error("Error exporting palette:", err);
        setToast("Failed to export palette");
      }
    }
  };
  
  const exportPaletteAsJSON = () => {
    const data = JSON.stringify(palette.map(color => color.hex));
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "palette.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const handleAdjustColor = (index: number) => {
    setActiveColorIndex(index);
    setShowAdjustModal(true);
  };
  
  const handleApplyColorAdjustment = (color: Color) => {
    if (activeColorIndex !== null) {
      updateColor(activeColorIndex, color);
      setShowAdjustModal(false);
      setActiveColorIndex(null);
    }
  };
  
  const handleTrendingPaletteSelect = (colors: Color[]) => {
    setPaletteColors(colors);
    setToast("Trending palette applied!");
  };
  
  const handleVisualize = () => {
    // Save current palette to localStorage for the visualizer to use
    console.log('Saving palette to localStorage before visualization:', palette);
    localStorage.setItem('currentPalette', JSON.stringify(palette));
    
    // Navigate to visualizer page
    window.location.href = '/visualize';
  };
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };
  
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    reorderColors(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setToast("Color order updated");
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col">
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />
      <SEOHead
        title="Color Palette Generator — Random & Theory-Based Color Schemes"
        description="Create perfect color palettes using color theory. Generate complementary, analogous, triadic & monochromatic schemes. Free palette maker trusted by designers in US, UK, India & worldwide."
        keywords="color palette generator, random color generator, colour palette generator, color scheme maker, complementary colors, analogous colors, triadic colors, CSS color variables, hex color generator, palette maker online, color theory tool, design color picker, color harmony generator"
        canonicalPath="/generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Generate a Color Palette",
          "description": "Create beautiful color palettes using color theory with Coolors",
          "step": [
            { "@type": "HowToStep", "name": "Press spacebar or click Generate", "text": "Press the spacebar or click the Generate button to create a new random color palette." },
            { "@type": "HowToStep", "name": "Lock colors you like", "text": "Click the lock icon on any color to keep it while regenerating the rest." },
            { "@type": "HowToStep", "name": "Choose a color theory mode", "text": "Select a color harmony like Complementary, Analogous or Triadic from the dropdown." },
            { "@type": "HowToStep", "name": "Export your palette", "text": "Export as PNG, CSS variables, SCSS, Tailwind config or JSON." }
          ]
        }}
      />
      {/* Compact top bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pt-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mr-1">Palette Generator</h1>
        <span className="hidden sm:flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><RefreshCw size={11} /> <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-semibold border border-gray-200 dark:border-gray-600">space</kbd> generate</span>
          <span className="flex items-center gap-1"><LockIcon size={11} /> lock to keep</span>
          <span className="flex items-center gap-1"><GripVertical size={11} /> drag to reorder</span>
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="color-theory" className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:block">Color Theory:</label>
          <select
            id="color-theory"
            value={colorTheory}
            onChange={(e) => setColorTheory(e.target.value as ColorTheory)}
            className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {colorTheoryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={resetPalette}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset palette"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          className="h-10 w-28 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
          onClick={handleGenerate}
        >
          <RefreshCw size={15} /><span>Generate</span>
        </button>

        <button
          className="relative h-10 w-28 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleUndo}
          disabled={paletteHistory.length === 0}
          title="Undo last generation"
        >
          <Undo2 size={15} /><span>Undo</span>
          {paletteHistory.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {paletteHistory.length}
            </span>
          )}
        </button>

        <button
          className="h-10 w-28 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-40"
          onClick={addColor}
          disabled={palette.length >= 10}
        >
          <Plus size={15} /><span>Add Color</span>
        </button>

        <button
          className="h-10 w-28 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
          onClick={() => window.location.href = '/image-palette'}
        >
          <ImageIcon size={15} /><span>Extract</span>
        </button>

        <button
          className="h-10 w-28 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
          onClick={handleVisualize}
        >
          <Eye size={15} /><span>Visualize</span>
        </button>

        <button
          className="h-10 w-28 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
          onClick={() => user ? setShowSaveModal(true) : window.location.href = '/auth'}
        >
          <Save size={15} /><span>Save</span>
        </button>

        <div className="relative">
          <button
            className="h-10 w-28 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
            onClick={() => setShowExportMenu(v => !v)}
          >
            <Download size={15} /><span>Export</span><ChevronDown size={13} />
          </button>
          {showExportMenu && (
            <div className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 min-w-[160px] py-1 overflow-hidden">
              {[
                { label: 'PNG',             action: () => { exportPalette(); setShowExportMenu(false); } },
                { label: 'JSON',            action: () => { exportPaletteAsJSON(); setShowExportMenu(false); } },
                { label: 'CSS Variables',   action: exportAsCSSVariables },
                { label: 'SCSS Variables',  action: exportAsSCSS },
                { label: 'Tailwind Config', action: exportAsTailwind },
              ].map(({ label, action }) => (
                <button key={label} onClick={action} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Simulate bar inline */}
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Simulate:</span>
          {CB_MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSimulationMode(key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${simulationMode === key ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1">
        <div 
          ref={paletteRef} 
          className="flex flex-col md:flex-row h-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        >
          {palette.map((color, index) => {
            const displayHex = simulateColorBlindness(color.hex, simulationMode);
            const textColor = isLightColor(displayHex) ? 'text-gray-800' : 'text-white';
            return (
              <div
                key={index}
                className={`flex-1 relative transition-all group ${draggedIndex === index ? 'opacity-50' : ''} min-h-[200px] md:min-h-0`}
                style={{ backgroundColor: displayHex }}
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 ${textColor}`}>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <div 
                      className="p-1.5 sm:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all cursor-move"
                      title="Drag to reorder"
                    >
                      <GripVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  </div>
                  
                  {/* Mobile-friendly action buttons */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex space-x-1 sm:space-x-2">
                    <button 
                      className="p-1.5 sm:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                      onClick={() => toggleLock(index)}
                      title={color.locked ? "Unlock color" : "Lock color"}
                    >
                      {color.locked ? 
                        <LockIcon size={16} className="sm:w-[18px] sm:h-[18px]" /> : 
                        <UnlockIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      }
                    </button>
                    
                    <button 
                      className="p-1.5 sm:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all hidden sm:block"
                      onClick={() => handleAdjustColor(index)}
                      title="Adjust color"
                    >
                      <Sliders size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    
                    <button 
                      className="p-1.5 sm:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                      onClick={() => removeColor(index)}
                      disabled={palette.length <= 2}
                      title="Remove color"
                    >
                      <Trash size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    
                    <button 
                      className="p-1.5 sm:p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                      onClick={() => setShowInfoTooltip(showInfoTooltip === index ? null : index)}
                      title="Color information"
                    >
                      <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                  
                  {/* Mobile-friendly popup for sliders on small screens */}
                  <button 
                    className="absolute bottom-16 right-2 p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all sm:hidden"
                    onClick={() => handleAdjustColor(index)}
                    title="Adjust color"
                  >
                    <Sliders size={16} />
                  </button>
                  
                  {showInfoTooltip === index && (
                    <div className="absolute top-12 sm:top-14 right-2 sm:right-3 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-10 w-[140px] sm:w-48">
                      {color.name && (
                        <p className="text-sm font-semibold mb-2">{color.name}</p>
                      )}
                      <div className="grid grid-cols-3 gap-1">
                        <p className="text-xs font-medium">R: {color.rgb.r}</p>
                        <p className="text-xs font-medium">G: {color.rgb.g}</p>
                        <p className="text-xs font-medium">B: {color.rgb.b}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto mb-3 sm:mb-5 text-center w-full px-2">
                    <div className="mb-2">
                      <h3 className="text-lg sm:text-2xl font-bold tracking-wide truncate">{color.hex}</h3>
                      {color.name && (
                        <p className="text-xs sm:text-sm opacity-90 font-medium mt-0.5 truncate">{color.name}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button 
                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium"
                        onClick={() => copyToClipboard(color.hex)}
                      >
                        <Copy size={14} className="sm:w-4 sm:h-4" />
                        <span>Copy</span>
                      </button>
                      
                      {colorTheory !== 'auto' && (
                        <button 
                          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium"
                          onClick={() => {
                            generatePaletteWithTheory(color);
                            setToast(`Generated palette using ${colorTheory} theory with ${color.hex} as base`);
                          }}
                        >
                          <RefreshCw size={14} className="sm:w-4 sm:h-4" />
                          <span>Use as Base</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Browse Palettes — static + community + saved */}
      <div id="trending">
        <BrowsePalettes onSelectPalette={handleTrendingPaletteSelect} userId={user?.id} />
      </div>
      
      <div className="mt-10 sm:mt-14 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Start creating beautiful designs today</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Use our palette generator to create harmonious color combinations for your next project.
          Experiment with different color theories, save your favorite palettes, and visualize them in real-world designs.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium cursor-pointer"
            onClick={() => window.location.href = '/designers-guide'}
          >
            Read the Designer's Guide
          </div>
          <div
            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-5 py-3 rounded-lg shadow hover:shadow-md transition-all font-medium cursor-pointer"
            onClick={() => window.location.href = '/visualize'}
          >
            Try Visualizer
          </div>
        </div>
      </div>
      
      {/* Save palette prompt */}
      {showSavePrompt && !user && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3 bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-2xl shadow-2xl border border-white/10 max-w-xs">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 flex-shrink-0 mt-0.5">
              <Save size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Like this palette?</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">Sign in to save it and access your palettes from anywhere.</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <LogIn size={12} /> Sign In
                </button>
                <button
                  onClick={() => { setShowSavePrompt(false); sessionStorage.setItem('save_prompt_dismissed', '1'); }}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer className="mt-8" />
      
      {/* Modals */}
      {showAdjustModal && activeColorIndex !== null && (
        <ColorAdjustmentModal 
          color={palette[activeColorIndex]}
          onClose={() => setShowAdjustModal(false)}
          onApply={handleApplyColorAdjustment}
        />
      )}
      
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Save Palette Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Save Palette</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Give your palette a memorable name</p>
            <div className="flex gap-2 mb-4">
              {palette.map((c, i) => (
                <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <input
              type="text"
              placeholder="e.g. Summer Vibes, Brand Colors..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSavePalette()}
              autoFocus
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm mb-4 bg-white dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSavePalette} disabled={saving} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Palette'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component export
export default function TestApp() {
  return (
    <>
      <PaletteApp />
      <WelcomeModal />
    </>
  );
}