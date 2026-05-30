import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, ChevronLeft, RefreshCw, Download, Copy, Check, Crosshair } from 'lucide-react';
import { Color } from '@/types/Color';
import { usePalette } from '@/contexts/PaletteContext';
import { hexToRgb, getColorName, rgbToHex, isLightColor } from '@/lib/colorUtils';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';

type ExtractionPoint = { x: number; y: number; color: string };

function quantizeColor(hex: string, levels = 24): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 255 / (levels - 1);
  return rgbToHex(Math.round(Math.round(r / f) * f), Math.round(Math.round(g / f) * f), Math.round(Math.round(b / f) * f));
}

function extractTopColors(imageData: Uint8ClampedArray, w: number, h: number, count = 5, startX = 0, startY = 0, areaW?: number, areaH?: number): { colors: string[]; points: ExtractionPoint[] } {
  const aw = areaW ?? w;
  const ah = areaH ?? h;
  const colorMap: Record<string, { count: number; sumX: number; sumY: number }> = {};
  const sampleRate = Math.max(1, Math.floor((aw * ah) / 8000));

  for (let y = startY; y < startY + ah; y += sampleRate) {
    for (let x = startX; x < startX + aw; x += sampleRate) {
      const idx = (y * w + x) * 4;
      const a = imageData[idx + 3];
      if (a < 128) continue;
      const hex = quantizeColor(rgbToHex(imageData[idx], imageData[idx + 1], imageData[idx + 2]));
      if (!colorMap[hex]) colorMap[hex] = { count: 0, sumX: 0, sumY: 0 };
      colorMap[hex].count++;
      colorMap[hex].sumX += x;
      colorMap[hex].sumY += y;
    }
  }

  const sorted = Object.entries(colorMap).sort((a, b) => b[1].count - a[1].count);
  const top = sorted.slice(0, count);
  return {
    colors: top.map(([c]) => c),
    points: top.map(([c, v]) => ({ color: c, x: v.sumX / v.count, y: v.sumY / v.count })),
  };
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

export default function ImagePalette() {
  usePalette();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [palette, setPaletteState] = useState<Color[]>([]);
  const [points, setPoints] = useState<ExtractionPoint[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selStart, setSelStart] = useState<{ x: number; y: number } | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const doExtract = useCallback((cropX = 0, cropY = 0, cropW?: number, cropH?: number) => {
    if (!uploadedImage || !canvasRef.current || !naturalSize) return;
    setIsExtracting(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const { colors, points: pts } = extractTopColors(data, canvas.width, canvas.height, 5, cropX, cropY, cropW, cropH);

      const colorObjs: Color[] = colors.map(hex => ({
        hex,
        rgb: hexToRgb(hex) ?? { r: 0, g: 0, b: 0 },
        locked: false,
        name: getColorName(hex),
      }));
      setPaletteState(colorObjs);
      setPoints(pts);
      setIsExtracting(false);
    };
    img.onerror = () => { setError('Failed to load image.'); setIsExtracting(false); };
    img.src = uploadedImage;
  }, [uploadedImage, naturalSize]);

  useEffect(() => {
    if (uploadedImage && naturalSize) doExtract();
  }, [uploadedImage, naturalSize]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    const reader = new FileReader();
    reader.onload = ev => { setUploadedImage(ev.target?.result as string); setPaletteState([]); setPoints([]); setSelectionRect(null); };
    reader.readAsDataURL(file);
  };

  const getScaleFactors = () => {
    if (!imgRef.current || !naturalSize) return { sx: 1, sy: 1 };
    const rect = imgRef.current.getBoundingClientRect();
    return { sx: naturalSize.w / rect.width, sy: naturalSize.h / rect.height };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selecting || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    setSelStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelectionRect(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selStart || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setSelectionRect({
      x: Math.min(cx, selStart.x), y: Math.min(cy, selStart.y),
      w: Math.abs(cx - selStart.x), h: Math.abs(cy - selStart.y),
    });
  };

  const handleMouseUp = () => {
    if (!selectionRect || !imgRef.current || !naturalSize) return;
    const imgRect = imgRef.current.getBoundingClientRect();
    const overlayRect = overlayRef.current!.getBoundingClientRect();
    const offX = imgRect.left - overlayRect.left;
    const offY = imgRect.top - overlayRect.top;
    const { sx, sy } = getScaleFactors();
    const nx = Math.round((selectionRect.x - offX) * sx);
    const ny = Math.round((selectionRect.y - offY) * sy);
    const nw = Math.round(selectionRect.w * sx);
    const nh = Math.round(selectionRect.h * sy);
    if (nw > 10 && nh > 10) {
      doExtract(Math.max(0, nx), Math.max(0, ny), Math.min(nw, naturalSize.w), Math.min(nh, naturalSize.h));
    }
    setSelStart(null);
    setSelecting(false);
  };

  const useThisPalette = () => {
    localStorage.setItem('pendingPalette', JSON.stringify(palette));
    window.location.href = '/generator';
  };

  const exportCSS = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css).catch(() => {});
    toast({ title: 'CSS variables copied!' });
  };

  const exportPNG = () => {
    const c = document.createElement('canvas');
    c.width = 500; c.height = 100;
    const ctx = c.getContext('2d')!;
    palette.forEach((col, i) => {
      ctx.fillStyle = col.hex;
      ctx.fillRect(i * 100, 0, 100, 100);
    });
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = 'palette.png';
    a.click();
  };

  const getPointsInDisplayCoords = () => {
    if (!imgRef.current || !naturalSize || !points.length) return [];
    const imgRect = imgRef.current.getBoundingClientRect();
    const overlayRect = overlayRef.current?.getBoundingClientRect();
    if (!overlayRect) return [];
    const sx = imgRect.width / naturalSize.w;
    const sy = imgRect.height / naturalSize.h;
    const offX = imgRect.left - overlayRect.left;
    const offY = imgRect.top - overlayRect.top;
    return points.map(p => ({ ...p, dx: p.x * sx + offX, dy: p.y * sy + offY }));
  };

  const [displayPoints, setDisplayPoints] = useState<Array<ExtractionPoint & { dx: number; dy: number }>>([]);
  useEffect(() => {
    const update = () => setDisplayPoints(getPointsInDisplayCoords());
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, [points, imgSize]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEOHead
        title="Extract Color Palette from Image — Photo Color Picker"
        description="Upload any photo to extract its dominant colors instantly. Get the perfect color palette from any image. Download as CSS, PNG or use directly in the generator. Free."
        keywords="color palette from image, extract colors from image, image color picker, photo color extractor, image to palette, dominant colors from image, colour palette from photo, image color palette generator, extract color code from image, photo colour picker, image color scheme"
        canonicalPath="/image-palette"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Image Color Palette Extractor",
          "url": "https://coolors.in/image-palette",
          "applicationCategory": "DesignApplication",
          "description": "Extract dominant colors from any image to create beautiful color palettes instantly.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Image to Palette</h2>
          <p className="text-gray-500 dark:text-gray-400">Upload an image, extract dominant colors, or click to select a region</p>
        </div>

        {/* Upload button */}
        <div className="flex justify-center mb-6 gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <Upload size={18} />{uploadedImage ? 'Change Image' : 'Upload Image'}
          </button>
          {uploadedImage && (
            <>
              <button
                onClick={() => setSelecting(!selecting)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${selecting ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-400'}`}
                title="Click and drag to select a region"
              >
                <Crosshair size={18} />{selecting ? 'Cancel Select' : 'Select Region'}
              </button>
              <button onClick={() => doExtract()} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-violet-400 font-medium transition-colors">
                <RefreshCw size={18} />Re-extract
              </button>
            </>
          )}
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">{error}</div>}

        {/* Image display with overlay */}
        {uploadedImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div
              ref={overlayRef}
              className={`relative inline-flex w-full justify-center ${selecting ? 'cursor-crosshair' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img
                ref={imgRef}
                src={uploadedImage}
                alt="Uploaded"
                className="max-h-96 max-w-full rounded-xl object-contain select-none"
                draggable={false}
                onLoad={e => {
                  const img = e.target as HTMLImageElement;
                  setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                  setImgSize({ w: img.offsetWidth, h: img.offsetHeight });
                }}
              />

              {/* Selection rectangle */}
              {selectionRect && (
                <div
                  className="absolute border-2 border-orange-400 bg-orange-100/30 pointer-events-none"
                  style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.w, height: selectionRect.h }}
                />
              )}

              {/* Extraction point indicators */}
              {!selecting && displayPoints.map((p, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ left: p.dx - 10, top: p.dy - 10 }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: p.color }}
                    title={p.color}
                  />
                </div>
              ))}

              {selecting && (
                <div className="absolute inset-0 rounded-xl flex items-start justify-center pt-3 pointer-events-none">
                  <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                    Click and drag to select a region
                  </div>
                </div>
              )}
            </div>

            {isExtracting && (
              <div className="text-center py-4 text-violet-600 font-medium">Extracting colors...</div>
            )}
          </div>
        )}

        {/* Extracted palette */}
        {palette.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">Extracted Palette</h3>
              <div className="flex gap-2">
                <button onClick={exportCSS} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:border-violet-300 text-gray-600 dark:text-gray-300 transition-colors">
                  <Copy size={14} />CSS
                </button>
                <button onClick={exportPNG} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:border-violet-300 text-gray-600 dark:text-gray-300 transition-colors">
                  <Download size={14} />PNG
                </button>
                <button
                  onClick={useThisPalette}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold transition-colors"
                >
                  Use This Palette →
                </button>
              </div>
            </div>

            {/* Palette strip */}
            <div className="flex rounded-xl overflow-hidden h-20 mb-4 shadow-sm">
              {palette.map((c, i) => (
                <div
                  key={i}
                  className="flex-1 group relative cursor-pointer"
                  style={{ backgroundColor: c.hex }}
                  onClick={() => { navigator.clipboard.writeText(c.hex).catch(() => {}); toast({ title: `Copied ${c.hex}` }); }}
                >
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isLightColor(c.hex) ? 'text-black/70' : 'text-white/80'}`}>
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>

            {/* Color details */}
            <div className="grid grid-cols-5 gap-3">
              {palette.map((c, i) => (
                <div key={i} className="text-center">
                  <div className="w-full aspect-square rounded-xl border-2 border-white shadow-md mb-2" style={{ backgroundColor: c.hex }} />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{c.name}</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{c.hex}</p>
                    <CopyBtn text={c.hex} />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">rgb({c.rgb.r},{c.rgb.g},{c.rgb.b})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload prompt */}
        {!uploadedImage && (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-16 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Click to upload an image</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">JPEG, PNG, WebP supported</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <Footer />
    </div>
  );
}
