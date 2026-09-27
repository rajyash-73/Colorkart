import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera, Upload, Sun, Moon, Zap, Lightbulb,
  RefreshCw, Check, X, Sparkles, Info, AlertCircle, ChevronDown,
  SplitSquareHorizontal, Eye, EyeOff, Download, ArrowRight, Palette,
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
  avoidColors: ColorSwatch[];
  makeup: string[];
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
    // True spring = warm + bright. No cool pastels here — those are in avoidColors,
    // and overlapping look-alikes (sky blue vs icy blue) confuse the best/avoid tabs.
    colors: [
      { hex: '#FF7F50', name: 'Coral' },
      { hex: '#FFB347', name: 'Peach' },
      { hex: '#F4C542', name: 'Warm Yellow' },
      { hex: '#90EE90', name: 'Mint' },
      { hex: '#40E0D0', name: 'Turquoise' },
      { hex: '#F08080', name: 'Light Coral' },
      { hex: '#DEB887', name: 'Camel' },
      { hex: '#FFDAB9', name: 'Peach Puff' },
      { hex: '#8DB600', name: 'Apple Green' },
      { hex: '#FF5349', name: 'Poppy Red' },
      { hex: '#FFA07A', name: 'Salmon' },
      { hex: '#FFFACD', name: 'Ivory' },
    ],
    avoidColors: [
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#1F2A44', name: 'Dark Navy' },
      { hex: '#A9AFB3', name: 'Ash Gray' },
      { hex: '#CDE0EA', name: 'Icy Blue' },
    ],
    makeup: ['Coral or peach lips', 'Peachy-pink blush', 'Golden-brown eye tones', 'Honey / golden-brown hair'],
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
    avoidColors: [
      { hex: '#FF7F2A', name: 'Orange' },
      { hex: '#F4C542', name: 'Warm Yellow' },
      { hex: '#808000', name: 'Olive' },
      { hex: '#E2552C', name: 'Orange Red' },
    ],
    makeup: ['Rose-pink or berry lips', 'Soft mauve blush', 'Taupe / gray-brown eye tones', 'Ash-brown or ash-blonde hair'],
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
    avoidColors: [
      { hex: '#FF5FA2', name: 'Bright Pink' },
      { hex: '#2E6CF6', name: 'Electric Blue' },
      { hex: '#FAFAFA', name: 'Pure White' },
      { hex: '#BFE3F2', name: 'Icy Pastel' },
    ],
    makeup: ['Brick or MLBB lips', 'Terracotta blush', 'Bronze / khaki eye tones', 'Chocolate or copper hair'],
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
    avoidColors: [
      { hex: '#CD853F', name: 'Camel' },
      { hex: '#8B6F47', name: 'Warm Brown' },
      { hex: '#808000', name: 'Olive' },
      { hex: '#C8B89A', name: 'Beige' },
    ],
    makeup: ['True red or fuchsia lips', 'Cool pink blush', 'Charcoal / plum eye tones', 'Blue-black or cool dark hair'],
  },
};

// ─── Lighting options ─────────────────────────────────────────────────────────
const LIGHTING: { key: Lighting; label: string; icon: React.FC<any>; filter: string; desc: string }[] = [
  { key: 'natural', label: 'Daylight',    icon: Lightbulb, filter: 'none',                                                         desc: 'Natural light' },
  { key: 'warm',    label: 'Golden Hour', icon: Sun,       filter: 'sepia(0.22) saturate(1.3) brightness(1.1) hue-rotate(-8deg)', desc: 'Warm sunset' },
  { key: 'cool',    label: 'Office',      icon: Zap,       filter: 'brightness(0.95) saturate(0.82) hue-rotate(12deg)',            desc: 'Cool fluorescent' },
  { key: 'evening', label: 'Evening',     icon: Moon,      filter: 'brightness(0.62) sepia(0.18) saturate(1.1)',                   desc: 'Dim indoor' },
];

const METALLIC_STOPS: Record<'gold' | 'silver', { stops: [string, string, string]; cast: string }> = {
  gold:   { stops: ['#F9E79F', '#D4AF37', '#9A7B1E'], cast: '#D4AF37' },
  silver: { stops: ['#F4F6F7', '#BDC3C7', '#7F8C8D'], cast: '#C0C6CC' },
};

/** Photo set inside a solid color frame (like holding it against colored fabric),
 *  with a soft reflected color cast on the face. Framing-independent — works for
 *  selfies and wide shots alike. */
function TryOnPhoto({
  src, color, metallic, hideColor, filter, className,
}: {
  src: string;
  color?: string;
  metallic?: 'gold' | 'silver';
  hideColor?: boolean;
  filter?: string;
  className?: string;
}) {
  const frame = metallic
    ? `linear-gradient(135deg, ${METALLIC_STOPS[metallic].stops.join(', ')})`
    : color;
  const cast = metallic ? METALLIC_STOPS[metallic].cast : color;
  return (
    <div className={`overflow-hidden ${className ?? ''}`} style={{ filter }}>
      <div className="p-3 sm:p-4 transition-colors" style={{ background: hideColor ? 'transparent' : frame }}>
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={src}
            alt="Your photo against the selected color"
            className="w-full h-full object-cover object-top"
            style={{ aspectRatio: '1', display: 'block' }}
          />
          {!hideColor && (
            // Reflected color cast — how the surrounding color "throws" onto the face
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 45% at 50% 55%, ${cast}, transparent 75%)`,
                mixBlendMode: 'soft-light',
                opacity: 0.5,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [compareColor, setCompareColor] = useState<ColorSwatch | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [paletteTab, setPaletteTab] = useState<'best' | 'avoid'>('best');
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

  // Pre-select drape colors so the simulator is alive the moment results appear
  const applySeasonDefaults = (s: Season) => {
    setSelectedColor(SEASON_DATA[s].colors[0]);
    setCompareColor(SEASON_DATA[s].avoidColors[0]);
  };

  const runAnalysis = (canvas: HTMLCanvasElement, imgSrc: string) => {
    setCapturedImage(imgSrc);
    stopCamera();
    setManualSeason(null);
    setSelectedColor(null);
    setCompareColor(null);
    setCompareMode(false);
    setShowOriginal(false);
    setPaletteTab('best');
    setAnalyzing(true);
    setStep('result');
    setTimeout(() => {
      const result = analyzeSkin(canvas);
      setAnalysis(result);
      if (result) applySeasonDefaults(result.season);
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
    setCompareColor(null);
    setCompareMode(false);
    setStep('capture');
    setCameraError(null);
    stopCamera();
  };

  const activeSeason: Season | null = manualSeason ?? analysis?.season ?? null;
  const seasonData = activeSeason ? SEASON_DATA[activeSeason] : null;
  const lightingFilter = LIGHTING.find(l => l.key === lighting)?.filter ?? 'none';

  const pickSwatch = (c: ColorSwatch) => {
    if (compareMode) setCompareColor(c);
    else setSelectedColor(c);
  };

  // ─── Downloadable result card (1000×1300 PNG) ───────────────────────────────
  const downloadResultCard = async () => {
    if (!capturedImage || !activeSeason || !seasonData || !selectedColor) return;
    const img = new Image();
    img.src = capturedImage;
    await img.decode();

    const W = 1000, H = 1300;
    const card = document.createElement('canvas');
    card.width = W; card.height = H;
    const ctx = card.getContext('2d')!;

    // Photo set inside a frame of the selected color (matches on-screen try-on)
    const s = Math.min(img.width, img.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = selectedColor.hex;
    ctx.fillRect(0, 0, W, W);
    const inset = 40;
    ctx.drawImage(img, (img.width - s) / 2, 0, s, s, inset, inset, W - inset * 2, W - inset * 2);

    // Season text
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 56px system-ui, sans-serif';
    ctx.fillText(`${seasonData.emoji} ${seasonData.name}`, 48, 1090);
    ctx.font = '34px system-ui, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(`${seasonData.nameKo} · My personal color season`, 48, 1140);
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'right';
    ctx.fillText('coolors.in/korean-color-analysis', W - 48, 1090);
    ctx.textAlign = 'left';

    // Palette strip
    const swW = W / seasonData.colors.length;
    seasonData.colors.forEach((c, i) => {
      ctx.fillStyle = c.hex;
      ctx.fillRect(i * swW, 1180, swW, 120);
    });

    const a = document.createElement('a');
    a.href = card.toDataURL('image/png');
    a.download = `my-personal-color-${activeSeason}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEOHead
        title="Korean Color Analysis — Free Personal Color Test | Coolors"
        description="Find your Korean personal color season (퍼스널 컬러) online. Upload a selfie, try 48 colors against your photo, compare gold vs silver, and download your result card. Free."
        keywords="Korean color analysis, personal color analysis, 퍼스널 컬러, personal color test online free, color season analysis, skin tone color test, spring summer autumn winter color, warm cool undertone test"
        canonicalPath="/korean-color-analysis"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Korean Personal Color Analysis — Color Try-On Studio",
          "url": "https://www.coolors.in/korean-color-analysis",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Any",
          "browserRequirements": "Requires JavaScript and a camera or photo upload",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": "Free online Korean personal color (퍼스널 컬러) test. Detects your color season from a selfie, lets you try every season color against your photo, compares gold vs silver undertones, and generates a shareable result card.",
          "featureList": [
            "Automatic skin-tone and season detection from a selfie",
            "Live color try-on with your photo",
            "Best color vs avoid color side-by-side comparison",
            "Gold vs silver undertone test",
            "Lighting simulation: daylight, golden hour, office, evening",
            "Season makeup and hair recommendations",
            "Downloadable, shareable result card"
          ]
        }}
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
            Upload a selfie, discover your personal color season, and try every color against your own photo — just like a real 퍼스널 컬러 studio session.
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
                          onClick={() => { setManualSeason(s); applySeasonDefaults(s); setPaletteTab('best'); }}
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

            {/* ── Virtual Drape Studio ── */}
            {capturedImage && !analyzing && seasonData && selectedColor && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Palette size={16} className="text-purple-500" /> Color Try-On Studio
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Your photo is set against each color, like a real consultation — watch how your face brightens or dulls
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCompareMode(v => !v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        compareMode
                          ? 'bg-purple-600 text-white border-purple-600 shadow'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                      }`}>
                      <SplitSquareHorizontal size={12} /> Compare
                    </button>
                    <button onClick={() => setShowOriginal(v => !v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        showOriginal
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                      }`}>
                      {showOriginal ? <EyeOff size={12} /> : <Eye size={12} />} {showOriginal ? 'Show color' : 'Original'}
                    </button>
                    <button onClick={downloadResultCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity border border-transparent">
                      <Download size={12} /> Result card
                    </button>
                  </div>
                </div>

                {/* Lighting toggle */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {LIGHTING.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.key}
                        onClick={() => setLighting(opt.key)}
                        title={opt.desc}
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

                {/* Draped preview — single or A/B compare */}
                {!compareMode ? (
                  <div className="max-w-sm mx-auto">
                    <TryOnPhoto
                      src={capturedImage}
                      color={selectedColor.hex}
                      hideColor={showOriginal}
                      filter={lightingFilter}
                      className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                    />
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                      <span className="font-medium">{selectedColor.name}</span>
                      <span className="font-mono text-xs text-gray-400">{selectedColor.hex.toUpperCase()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      { swatch: selectedColor, tag: '✓ Your color', tagCls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                      (() => {
                        const swatch = compareColor ?? seasonData.avoidColors[0];
                        const isAvoid = seasonData.avoidColors.some(c => c.hex === swatch.hex);
                        return isAvoid
                          ? { swatch, tag: '✗ Avoid this', tagCls: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' }
                          : { swatch, tag: '✓ Also suits you', tagCls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
                      })(),
                    ].map(({ swatch, tag, tagCls }, i) => (
                      <div key={i}>
                        <TryOnPhoto
                          src={capturedImage}
                          color={swatch.hex}
                          hideColor={showOriginal}
                          filter={lightingFilter}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                        />
                        <div className="mt-2 flex flex-col items-center gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tagCls}`}>{tag}</span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <span className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" style={{ backgroundColor: swatch.hex }} />
                            <span className="font-medium">{swatch.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Swatch picker with Best / Avoid tabs */}
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setPaletteTab('best')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        paletteTab === 'best'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                      }`}>
                      <span className="inline-flex items-center gap-1"><Check size={11} /> Best for you</span>
                    </button>
                    <button onClick={() => setPaletteTab('avoid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        paletteTab === 'avoid'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                      }`}>
                      <span className="inline-flex items-center gap-1"><X size={11} /> Colors to avoid</span>
                    </button>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 ml-auto">
                      {compareMode ? 'Tap a color to change the right photo' : 'Tap a color to try it'}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                    Best and avoid colors are specific to your season — a shade that flatters one season often washes out another.
                  </p>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {(paletteTab === 'best' ? seasonData.colors : seasonData.avoidColors).map(c => {
                      const isActive = (compareMode ? compareColor?.hex : selectedColor.hex) === c.hex;
                      return (
                        <button key={c.hex}
                          title={c.name}
                          onClick={() => pickSwatch(c)}
                          className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                            isActive
                              ? 'border-gray-900 dark:border-white scale-110 shadow-lg ring-2 ring-purple-400'
                              : 'border-white dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Gold vs Silver undertone test ── */}
            {capturedImage && !analyzing && seasonData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-amber-500" /> Gold vs Silver Test
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  The classic undertone check — which metal makes your skin glow? Gold flatters warm tones (Spring/Autumn), silver flatters cool tones (Summer/Winter).
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {(['gold', 'silver'] as const).map(metal => (
                    <div key={metal}>
                      <TryOnPhoto
                        src={capturedImage}
                        metallic={metal}
                        filter={lightingFilter}
                        className="rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <p className="mt-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize">
                        {metal === 'gold' ? '🥇 Gold — warm undertone' : '🥈 Silver — cool undertone'}
                      </p>
                    </div>
                  ))}
                </div>
                {analysis && (
                  <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    Based on your skin tone, <strong className="text-gray-700 dark:text-gray-200">{analysis.isWarm ? 'gold' : 'silver'}</strong> should suit you better.
                  </p>
                )}
              </div>
            )}

            {/* ── Good / Avoid + Makeup ── */}
            {!analyzing && seasonData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                  <div>
                    <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1.5 mb-2">
                      <Sparkles size={13} /> Makeup & hair
                    </h4>
                    <ul className="space-y-1">
                      {seasonData.makeup.map(m => (
                        <li key={m} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5">•</span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ── Learn more CTA ── */}
            {!analyzing && seasonData && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    What does {seasonData.name} ({seasonData.nameKo}) mean?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Read the full guide to Korean personal color analysis — seasons, undertones and wardrobe tips.
                  </p>
                </div>
                <a href="/korean-color-analysis-guide"
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors shrink-0">
                  Read the guide <ArrowRight size={14} />
                </a>
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
