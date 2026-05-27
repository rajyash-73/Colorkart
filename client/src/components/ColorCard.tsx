import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Color } from "../types/Color";
import { usePalette } from "@/contexts/PaletteContext";
import { hexToHsl, isLightColor } from "@/lib/colorUtils";

interface ColorCardProps {
  color: Color;
  index: number;
  onAdjustColor: () => void;
}

type DisplayFormat = 'hex' | 'rgb' | 'hsl';

export default function ColorCard({ color, index, onAdjustColor }: ColorCardProps) {
  const { toggleLock, removeColor } = usePalette();
  const { toast } = useToast();
  const [mobileFormat, setMobileFormat] = useState<DisplayFormat>('hex');
  const [justCopied, setJustCopied] = useState<string | null>(null);

  const light = isLightColor(color.hex);
  const textColor = light ? "text-black" : "text-white";
  const buttonBg = light
    ? "bg-white bg-opacity-30 hover:bg-opacity-50"
    : "bg-black bg-opacity-30 hover:bg-opacity-50";

  const hsl = hexToHsl(color.hex);
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';
  const rgbStr = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

  const formatValues: Record<DisplayFormat, string> = {
    hex: color.hex,
    rgb: rgbStr,
    hsl: hslStr,
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setJustCopied(key);
    setTimeout(() => setJustCopied(null), 1500);
  };

  const handleCopyColorCode = () => {
    copyText(color.hex, 'click');
    toast({ title: "Copied!", description: `${color.hex} copied to clipboard`, duration: 2000 });
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLock(index);
    toast({
      title: color.locked ? "Color unlocked" : "Color locked",
      description: color.locked ? "This color will change when generating" : "This color will be preserved when generating",
      duration: 2000,
    });
  };

  const handleRemoveColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeColor(index);
    toast({ title: "Color removed", description: "Color has been removed from palette", duration: 2000 });
  };

  const handleAdjustColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdjustColor();
  };

  const cycleMobileFormat = () => {
    setMobileFormat(f => f === 'hex' ? 'rgb' : f === 'rgb' ? 'hsl' : 'hex');
  };

  return (
    <div
      className="flex-1 relative flex flex-col justify-between transition-all cursor-pointer group min-h-[150px] xs:min-h-[170px] sm:min-h-[190px] md:min-h-0 w-full h-full border-2 border-white/20 rounded-md shadow-md"
      style={{ backgroundColor: color.hex }}
      data-color-index={index}
    >
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-2 md:p-4 flex justify-between items-center">
        <div className="flex space-x-1">
          <button
            className={`${textColor} ${buttonBg} rounded-full p-1.5 md:p-2 transition-all transform hover:scale-110 opacity-90`}
            onClick={handleToggleLock}
            aria-label={color.locked ? "Unlock color" : "Lock color"}
            title={color.locked ? "Unlock color" : "Lock color"}
          >
            <i className={`fas ${color.locked ? 'fa-lock' : 'fa-unlock'} text-xs md:text-base`}></i>
          </button>
          <button
            className={`${textColor} bg-black/30 dark:bg-white/30 rounded-full p-1.5 md:p-2 transition-all transform hover:scale-110 opacity-90 ml-1`}
            onClick={(e) => { e.stopPropagation(); handleCopyColorCode(); }}
            aria-label="Copy color code"
            title="Copy color code"
          >
            <i className="fas fa-copy text-xs md:text-base"></i>
          </button>
        </div>

        <div className="flex space-x-1 md:space-x-2">
          <button
            className={`${textColor} ${buttonBg} rounded-full p-1.5 md:p-2 transition-all transform hover:scale-110 opacity-90`}
            onClick={handleAdjustColor}
            aria-label="Adjust color"
            title="Adjust color"
          >
            <i className="fas fa-sliders-h text-xs md:text-base"></i>
          </button>
          <button
            className={`${textColor} ${buttonBg} rounded-full p-1.5 md:p-2 transition-all transform hover:scale-110 opacity-90`}
            onClick={handleRemoveColor}
            aria-label="Remove color"
            title="Remove color"
          >
            <i className="fas fa-times text-xs md:text-base"></i>
          </button>
        </div>
      </div>

      {/* Center Content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center ${textColor} py-10 xs:py-12 sm:py-14 px-1 xs:px-2 md:p-4 group-hover:scale-105 md:group-hover:scale-110 transition-transform`}
        onClick={handleCopyColorCode}
      >
        {/* Mobile: cycle format on tap */}
        <div className="block md:hidden w-full" onClick={(e) => { e.stopPropagation(); cycleMobileFormat(); }}>
          <div className="text-center">
            <div className="bg-black/20 py-2 px-3 mx-auto inline-block rounded-md">
              <span className="text-xs xs:text-sm font-bold">{formatValues[mobileFormat]}</span>
              <span className="text-[9px] opacity-60 ml-1.5">{mobileFormat.toUpperCase()} ↻</span>
            </div>
            {color.name && <p className="text-[10px] xs:text-xs opacity-80 mt-1">{color.name}</p>}
          </div>
        </div>

        {/* Desktop: all three formats stacked */}
        <div className="hidden md:flex flex-col items-center gap-1 w-full px-2">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wider text-center">
            {color.hex}
          </h2>
          {color.name && <p className="text-sm opacity-90 font-medium">{color.name}</p>}

          {/* Format rows with individual copy buttons */}
          <div className={`mt-2 w-full space-y-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
            {([
              { key: 'hex-copy', label: 'HEX', value: color.hex },
              { key: 'rgb-copy', label: 'RGB', value: rgbStr },
              { key: 'hsl-copy', label: 'HSL', value: hslStr },
            ] as const).map(({ key, label, value }) => (
              <button
                key={key}
                className={`flex items-center justify-between w-full px-2 py-0.5 rounded text-xs ${light ? 'bg-black/10 hover:bg-black/20' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
                onClick={(e) => { e.stopPropagation(); copyText(value, key); }}
              >
                <span className="font-semibold opacity-60 w-7">{label}</span>
                <span className="font-mono flex-1 text-left truncate">{value}</span>
                {justCopied === key
                  ? <Check size={11} className="text-green-400 flex-shrink-0" />
                  : <Copy size={11} className="opacity-60 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
