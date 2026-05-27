import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera, Upload, Sun, Moon, Zap, Lightbulb,
  RefreshCw, Check, X, Sparkles, Info, AlertCircle, ChevronDown,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

// ─── Types ────────────────────────────────────────────────────────────────────
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Lighting = 'warm' | 'natural' | 'cool' | 'evening';

interface SkinAnalysis {
  hex: string;
  isWarm: boolean;
  depth: 'light' | 'medium' | 'dark';
  season: Season;
}

interface ColorSwatch { hex: string; name: string; }

// ─── Season data ──────────────────────────────────────────────────────────────
const SEASON_DATA: Record<Season, {
  name: string; nameKo: string; emoji: string;
  badgeCls: string;
  description: string;
  tips: string[];
  good: string[];
  avoid: string[];
  colors: ColorSwatch[];
}> = {
  spring: {
    name: 'Spring', nameKo: '봄 웜 브라이트', emoji: '🌸',
    badgeCls: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    description: 'Warm, bright, and fresh undertones. Your skin glows with light peachy-golden hues.',
    tips: [
      'Choose warm, bright, and light shades',
      'Avoid heavy, dark, or cool-toned colors',
      'Best metals: gold and rose-gold',
    ],
    good: ['Coral', 'Peach', 'Warm Yellow', 'Mint', 'Camel', 'Salmon', 'Ivory'],
    avoid: ['Black', 'Dark Navy', 'Ash Gray', 'Cool Pastels'],
    colors: [
      { hex: '#FF7F50', name: 'Coral' },
      { hex: '#FFB347', name: 'Peach' },
      { hex: '#F4C542', name: 'Warm Yellow' },
      { hex: '#90EE90', name: 'Mint' },
      { hex: '#87CEEB', name: 'Sky Blue' },
      { hex: '#F08080', name: 'Light Coral' },
      { hex: '#DEB887', name: 'Camel' },
      { hex: '#FFDAB9', name: 'Peach Puff' },
      { hex: '#98FB98', name: 'Pale Green' },
      { hex: '#FFB6C1', name: 'Light Pink' },
      { hex: '#FFA07A', name: 'Salmon' },
      { hex: '#FFFACD', name: 'Ivory' },
    ],
  },
  summer: {
    name: 'Summer', nameKo: '여름 쿨 뮤트', emoji: '🌊',
    badgeCls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    description: 'Cool, soft, and muted undertones. Rosy-pink or blue-tinted hues complement you best.',
    tips: [
      'Choose cool, muted, and soft shades',
      'Avoid warm oranges, browns, and yellows',
      'Best metals: silver and white gold',
    ],
    good: ['Dusty Rose', 'Lavender', 'Sage', 'Powder Blue', 'Mauve', 'Soft White'],
    avoid: ['Orange', 'Warm Yellow', 'Olive', 'Bright Orange-Red'],
    colors: [
      { hex: '#C9A0B8', name: 'Dusty Rose' },
      { hex: '#B0C4DE', name: 'Powder Blue' },
      { hex: '#9A8FB5', name: 'Lavender' },
      { hex: '#7B9EA5', name: 'Teal Sage' },
      { hex: '#BC8F8F', name: 'Rosy Brown' },
      { hex: '#A8B8C0', name: 'Cool Gray' },
      { hex: '#8FA8B8', name: 'Slate Blue' },
      { hex: '#C8A8B8', name: 'Mauve' },
      { hex: '#A0B0A0', name: 'Sage Green' },
      { hex: '#D4A5B5', name: 'Blush Pink' },
      { hex: '#9098B8', name: 'Periwinkle' },
      { hex: '#B8A0C0', name: 'Soft Violet' },
    ],
  },
  autumn: {
    name: 'Autumn', nameKo: '가을 웜 뮤트', emoji: '🍂',
    badgeCls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    description: 'Rich, earthy, and muted warm undertones. Deep golden or olive hints define your warmth.',
    tips: [
      'Choose earthy, rich, and muted warm shades',
      'Avoid cool pinks, icy pastels, and bright neons',
      'Best metals: antique gold and bronze',
    ],
    good: ['Rust', 'Terracotta', 'Olive', 'Camel', 'Brick Red', 'Forest Green'],
    avoid: ['Bright Pink', 'Electric Blue', 'Pure White', 'Cool Pastels'],
    colors: [
      { hex: '#B7410E', name: 'Rust' },
      { hex: '#C04A20', name: 'Terracotta' },
      { hex: '#808000', name: 'Olive' },
      { hex: '#556B2F', name: 'Dark Olive' },
      { hex: '#CD853F', name: 'Camel' },
      { hex: '#A0522D', name: 'Sienna' },
      { hex: '#C68642', name: 'Caramel' },
      { hex: '#8B4513', name: 'Brown' },
      { hex: '#6B8E23', name: 'Moss Green' },
      { hex: '#9B4A2A', name: 'Brick Red' },
      { hex: '#8B7355', name: 'Warm Taupe' },
      { hex: '#704214', name: 'Chocolate' },
    ],
  },
  winter: {
    name: 'Winter', nameKo: '겨울 쿨 비비드', emoji: '❄️',
    badgeCls: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    description: 'Bold, clear, and high-contrast cool undertones. Vivid colors and stark contrasts make you shine.',
    tips: [
      'Choose bold, vivid, and high-contrast colors',
      'Avoid muted, warm, or earthy tones',
      'Best metals: silver and platinum',
    ],
    good: ['Navy', 'Crimson', 'Emerald', 'Royal Blue', 'Hot Pink', 'Pure White'],
    avoid: ['Camel', 'Warm Brown', 'Olive', 'Muted Earth Tones'],
    colors: [
      { hex: '#000080', name: 'Navy' },
      { hex: '#DC143C', name: 'Crimson' },
      { hex: '#228B22', name: 'Emerald' },
      { hex: '#4169E1', name: 'Royal Blue' },
      { hex: '#FF1493', name: 'Deep Pink' },
      { hex: '#9400D3', name: 'Violet' },
      { hex: '#006400', name: 'Dark Green' },
      { hex: '#8B0000', name: 'Dark Red' },
      { hex: '#191970', name: 'Midnight Blue' },
      { hex: '#F8F8FF', name: 'Pure White' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#C0C0C0', name: 'Silver' },
    ],
  },
};

// ─── Lighting options ─────────────────────────────────────────────────────────
const LIGHTING: { key: Lighting; label: string; icon: React.FC<any>; filter: string; desc: string }[] = [
  { key: 'warm',    label: 'Golden Hour', icon: Sun,       filter: 'sepia(0.22) saturate(1.3) brightness(1.1) hue-rotate(-8deg)', desc: 'Warm sunset' },
  { key: 'natural', label: 'Daylight',    icon: Lightbulb, filter: 'none',                                                         desc: 'Natural light' },
  { key: 'cool',    label: 'Office',      icon: Zap,       filter: 'brightness(0.95) saturate(0.82) hue-rotate(12deg)',            desc: 'Cool fluorescent' },
  { key: 'evening', label: 'Evening',     icon: Moon,      filter: 'brightness(0.62) sepia(0.18) saturate(1.1)',                   desc: 'Dim indoor' },
];

// ─── Skin tone analysis ───────────────────────────────────────────────────────
function analyzeSkin(canvas: HTMLCanvasElement): SkinAnalysis | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;

  const x0 = Math.floor(w * 0.2), x1 = Math.floor(w * 0.8);
  const y0 = Math.floor(h * 0.1), y1 = Math.floor(h * 0.72);

  let rS = 0, gS = 0, bS = 0, n = 0;
  for (let y = y0; y < y1; y += 3) {
    for (let x = x0; x < x1; x += 3) {
      const i = (y * w + x) * 4;
      const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]];
      if (a < 128) continue;
      // Loose skin pixel filter
      if (r > 60 && g > 30 && b > 15 && r > b * 1.05 && r > 80 && Math.abs(r - g) < 105) {
        rS += r; gS += g; bS += b; n++;
      }
    }
  }
  if (n < 40) return null;

  const [aR, aG, aB] = [Math.round(rS / n), Math.round(gS / n), Math.round(bS / n)];
  const warmScore = ((aR - aB) + (aG - aB)) / (aR + 1);
  const isWarm = warmScore > 0.28;
  const lightness = (Math.max(aR, aG, aB) + Math.min(aR, aG, aB)) / (2 * 255);
  const depth: 'light' | 'medium' | 'dark' = lightness > 0.60 ? 'light' : lightness > 0.38 ? 'medium' : 'dark';

  let season: Season;
  if (isWarm && depth !== 'dark') season = 'spring';
  else if (isWarm) season = 'autumn';
  else if (!isWarm && depth !== 'dark') season = 'summer';
  else season = 'winter';

  const toH = (v: number) => v.toString(16).padStart(2, '0');
  return { hex: `#${toH(aR)}${toH(aG)}${toH(aB)}`, isWarm, depth, season };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function KoreanColorAnalysis() {
  const [step, setStep] = useState<'capture' | 'result'>('capture');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualSeason, setManualSeason] = useState<Season | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);
  const [lighting, setLighting] = useState<Lighting>('natural');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Attach stream to video element after it mounts (cameraActive triggers the mount)
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      setCameraActive(true); // triggers mount of <video>, then useEffect attaches stream
    } catch (e: any) {
      setCameraError(
        e.name === 'NotAllowedError' ? 'Camera access denied. Please allow camera access or upload a photo instead.' :
        e.name === 'NotFoundError'   ? 'No camera detected. Please upload a photo instead.' :
        'Cannot access camera. Please upload a photo instead.',
      );
    }
  };

  const runAnalysis = (canvas: HTMLCanvasElement, imgSrc: string) => {
    setCapturedImage(imgSrc);
    stopCamera();
    setManualSeason(null);
    setSelectedColor(null);
    setAnalyzing(true);
    setStep('result');
    setTimeout(() => {
      const result = analyzeSkin(canvas);
      setAnalysis(result);
      setAnalyzing(false);
    }, 1300);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    runAnalysis(canvas, canvas.toDataURL('image/jpeg', 0.92));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        runAnalysis(canvas, src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setManualSeason(null);
    setSelectedColor(null);
    setStep('capture');
    setCameraError(null);
    stopCamera();
  };

  const activeSeason: Season | null = manualSeason ?? analysis?.season ?? null;
  const seasonData = activeSeason ? SEASON_DATA[activeSeason] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEOHead
        title="Korean Personal Color Analysis — Find Your Color Season"
        description="Discover your Korean personal color season (퍼스널 컬러). Take a selfie or upload a photo to find whether you're Spring, Summer, Autumn or Winter and get personalised color recommendations."
        keywords="Korean color analysis, personal color, 퍼스널 컬러, color season analysis, skin tone color, spring summer autumn winter color, personal color test online"
        canonicalPath="/korean-color-analysis"
      />
      <Header mobileMenuOpen={false} toggleMobileMenu={() => {}} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">

        {/* Page heading */}
        <div className="text-center mb-8">
          <p className="text-sm text-purple-500 dark:text-purple-400 font-medium tracking-widest uppercase mb-1">퍼스널 컬러 분석</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Korean Color Analysis
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-lg mx-auto">
            Capture your face, discover your personal color season, and see which colors truly complement your unique skin tone.
          </p>
        </div>

        {/* ── Step 1: Capture ── */}
        {step === 'capture' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Camera size={18} className="text-purple-500" />
              Capture Your Face
            </h2>

            {/* Camera / placeholder */}
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-[3px] border-white/70 rounded-[50%] w-36 h-48 shadow-lg" />
                  </div>
                  <p className="absolute bottom-2 left-0 right-0 text-center text-white text-[11px] bg-black/40 py-1">
                    Align your face with the oval
                  </p>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <Camera size={28} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center">
                    Take a selfie or upload a front-facing photo
                  </p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {cameraError && (
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5 mb-4 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {cameraError}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {!cameraActive ? (
                <>
                  <button onClick={startCamera}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    <Camera size={18} /> Open Camera
                  </button>
                  <label className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <Upload size={18} /> Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </>
              ) : (
                <div className="flex gap-2">
                  <button onClick={capture}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    <Camera size={18} /> Capture & Analyse
                  </button>
                  <button onClick={stopCamera}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1 mb-1.5">
                <Info size={12} /> Tips for accurate results
              </p>
              <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-0.5 list-disc pl-4">
                <li>Use soft, even natural lighting</li>
                <li>Remove heavy makeup if possible</li>
                <li>Face the camera directly, chin level</li>
                <li>Keep background simple and bright</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Step 2: Results ── */}
        {step === 'result' && (
          <div className="space-y-5">

            {/* Top bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Your Analysis</h2>
              <button onClick={reset}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">
                <RefreshCw size={14} /> Start over
              </button>
            </div>

            {/* Photo + season card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Captured photo */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Your Photo</p>
                {capturedImage && (
                  <div className="rounded-xl overflow-hidden mb-3 aspect-square w-full max-w-[220px] mx-auto">
                    <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover object-top" />
                  </div>
                )}
                {analysis && (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 shadow shrink-0"
                      style={{ backgroundColor: analysis.hex }} />
                    <div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">Detected skin tone</p>
                      <p className="font-mono text-sm font-bold text-gray-800 dark:text-white">{analysis.hex.toUpperCase()}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {analysis.isWarm ? '🔥 Warm' : '❄️ Cool'} · {analysis.depth} depth
                      </p>
                    </div>
                  </div>
                )}
                {!analysis && !analyzing && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                    Could not detect skin tone automatically. Please select your season manually below.
                  </p>
                )}
              </div>

              {/* Season result */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Color Season</p>
                {analyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">Analysing your complexion…</p>
                  </div>
                ) : activeSeason && seasonData ? (
                  <>
                    <div className="text-center flex-1">
                      <div className="text-5xl mb-2">{seasonData.emoji}</div>
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full border text-sm font-semibold mb-1 ${seasonData.badgeCls}`}>
                        {seasonData.name}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{seasonData.nameKo}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{seasonData.description}</p>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {seasonData.tips.map((t, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Check size={11} className="text-green-500 shrink-0 mt-0.5" /> {t}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                    Select your season below
                  </div>
                )}

                {/* Manual season picker */}
                {!analyzing && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
                      <ChevronDown size={11} /> Not accurate? Select manually:
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(Object.keys(SEASON_DATA) as Season[]).map(s => (
                        <button key={s}
                          onClick={() => { setManualSeason(s); setSelectedColor(null); }}
                          className={`text-[11px] py-1.5 rounded-lg border font-medium transition-all ${
                            activeSeason === s
                              ? SEASON_DATA[s].badgeCls + ' scale-105'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                          }`}>
                          {SEASON_DATA[s].emoji}<br />{SEASON_DATA[s].name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Color palette ── */}
            {!analyzing && seasonData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-purple-500" />
                  Your Best Colors
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Click a color to simulate how it looks with your face under different lighting
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-3">
                  {seasonData.colors.map(c => (
                    <button key={c.hex}
                      title={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                        selectedColor?.hex === c.hex
                          ? 'border-gray-900 dark:border-white scale-110 shadow-lg ring-2 ring-purple-400'
                          : 'border-white dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
                      style={{ backgroundColor: selectedColor.hex }} />
                    <span className="font-medium">{selectedColor.name}</span>
                    <span className="font-mono text-xs text-gray-400">{selectedColor.hex.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Try-on simulator ── */}
            {capturedImage && selectedColor && !analyzing && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Color Try-On Simulator</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      See how <strong className="text-gray-700 dark:text-gray-300">{selectedColor.name}</strong> looks next to your face across lighting conditions
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-600 shadow shrink-0"
                    style={{ backgroundColor: selectedColor.hex }} />
                </div>

                {/* Lighting toggle */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {LIGHTING.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.key}
                        onClick={() => setLighting(opt.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          lighting === opt.key
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                        }`}>
                        <Icon size={12} /> {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* 4-panel lighting grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {LIGHTING.map(opt => {
                    const Icon = opt.icon;
                    const isActive = lighting === opt.key;
                    return (
                      <div key={opt.key}
                        onClick={() => setLighting(opt.key)}
                        className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isActive
                            ? 'border-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/50'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}>
                        {/* Face + colour band with lighting filter */}
                        <div style={{ filter: opt.filter }}>
                          <img
                            src={capturedImage}
                            alt={opt.label}
                            className="w-full object-cover object-top"
                            style={{ aspectRatio: '1', display: 'block' }}
                          />
                          {/* Clothing colour strip */}
                          <div className="h-10 w-full" style={{ backgroundColor: selectedColor.hex }} />
                        </div>
                        <div className={`px-2 py-1.5 text-center ${isActive ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                            <Icon size={10} /> {opt.label}
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Colour info bar */}
                <div className="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg shadow border border-white dark:border-gray-600 shrink-0"
                    style={{ backgroundColor: selectedColor.hex }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{selectedColor.name}</p>
                    <p className="font-mono text-xs text-gray-400 dark:text-gray-500">{selectedColor.hex.toUpperCase()}</p>
                  </div>
                  {seasonData && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${seasonData.badgeCls}`}>
                      {seasonData.name} ✓
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Prompt to select a color ── */}
            {!selectedColor && !analyzing && seasonData && (
              <p className="text-center text-sm text-purple-500 dark:text-purple-400 animate-pulse">
                ↑ Select a color above to launch the try-on simulator
              </p>
            )}

            {/* ── Good / Avoid ── */}
            {!analyzing && seasonData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-2">
                      <Check size={13} /> Colors that suit you
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {seasonData.good.map(c => (
                        <span key={c} className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-2">
                      <X size={13} /> Colors to avoid
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {seasonData.avoid.map(c => (
                        <span key={c} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
