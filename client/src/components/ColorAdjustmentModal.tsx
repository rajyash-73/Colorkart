import React, { useState, useCallback } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Color } from '../types/Color';
import { hexToRgb, rgbToHex, getColorName, hexToHsl, hslToHex, rgbToHsl } from '@/lib/colorUtils';

interface ColorAdjustmentModalProps {
  color: Color;
  onClose: () => void;
  onApply: (color: Color) => void;
}

type ActiveTab = 'rgb' | 'hsl';

export default function ColorAdjustmentModal({ color, onClose, onApply }: ColorAdjustmentModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rgb');
  const [red, setRed] = useState(color.rgb.r);
  const [green, setGreen] = useState(color.rgb.g);
  const [blue, setBlue] = useState(color.rgb.b);
  const initialHsl = hexToHsl(color.hex) ?? { h: 0, s: 0, l: 50 };
  const [hue, setHue] = useState(initialHsl.h);
  const [saturation, setSaturation] = useState(initialHsl.s);
  const [lightness, setLightness] = useState(initialHsl.l);
  const [currentHex, setCurrentHex] = useState(color.hex);
  const [colorName, setColorName] = useState(color.name || getColorName(color.hex));
  const [copied, setCopied] = useState<string | null>(null);

  const syncFromHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    setRed(rgb.r); setGreen(rgb.g); setBlue(rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h); setSaturation(hsl.s); setLightness(hsl.l);
    setColorName(getColorName(hex));
  };

  const handleRGBChange = (component: 'r' | 'g' | 'b', value: number) => {
    const v = Math.min(255, Math.max(0, value));
    const nr = component === 'r' ? v : red;
    const ng = component === 'g' ? v : green;
    const nb = component === 'b' ? v : blue;
    if (component === 'r') setRed(v);
    if (component === 'g') setGreen(v);
    if (component === 'b') setBlue(v);
    const newHex = rgbToHex(nr, ng, nb);
    setCurrentHex(newHex);
    const hsl = rgbToHsl(nr, ng, nb);
    setHue(hsl.h); setSaturation(hsl.s); setLightness(hsl.l);
    setColorName(getColorName(newHex));
  };

  const handleHSLChange = (component: 'h' | 's' | 'l', value: number) => {
    const nh = component === 'h' ? value : hue;
    const ns = component === 's' ? value : saturation;
    const nl = component === 'l' ? value : lightness;
    if (component === 'h') setHue(value);
    if (component === 's') setSaturation(value);
    if (component === 'l') setLightness(value);
    const newHex = hslToHex(nh, ns, nl);
    setCurrentHex(newHex);
    const rgb = hexToRgb(newHex);
    if (rgb) { setRed(rgb.r); setGreen(rgb.g); setBlue(rgb.b); }
    setColorName(getColorName(newHex));
  };

  const handleHexChange = (hex: string) => {
    setCurrentHex(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) syncFromHex(hex);
  };

  const handleApply = () => {
    onApply({
      hex: currentHex,
      rgb: { r: red, g: green, b: blue },
      locked: color.locked,
      name: getColorName(currentHex),
    });
  };

  const copyFormat = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const rgbStr = `rgb(${red}, ${green}, ${blue})`;
  const hslStr = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Adjust Color</h2>
          <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="w-full h-16 sm:h-24 rounded-lg mb-2" style={{ backgroundColor: currentHex }} />

        <div className="text-center mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-medium">{colorName}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hex</label>
          <input
            type="text"
            className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            value={currentHex}
            onChange={(e) => handleHexChange(e.target.value)}
          />
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-md border border-gray-200 mb-4 overflow-hidden">
          {(['rgb', 'hsl'] as const).map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-1.5 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'rgb' ? (
          <div className="space-y-3 sm:space-y-4 mb-4">
            {([
              { label: 'Red',   key: 'r' as const, value: red,   accent: 'accent-red-500' },
              { label: 'Green', key: 'g' as const, value: green, accent: 'accent-green-500' },
              { label: 'Blue',  key: 'b' as const, value: blue,  accent: 'accent-blue-500' },
            ]).map(({ label, key, value, accent }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-medium">{label}</label>
                  <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{value}</span>
                </div>
                <input
                  type="range" min="0" max="255" value={value}
                  onChange={(e) => handleRGBChange(key, parseInt(e.target.value))}
                  className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${accent}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs sm:text-sm font-medium">Hue</label>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{hue}°</span>
              </div>
              <input
                type="range" min="0" max="360" value={hue}
                onChange={(e) => handleHSLChange('h', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))' }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs sm:text-sm font-medium">Saturation</label>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{saturation}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={saturation}
                onChange={(e) => handleHSLChange('s', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, hsl(${hue},0%,${lightness}%), hsl(${hue},100%,${lightness}%))` }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs sm:text-sm font-medium">Lightness</label>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{lightness}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={lightness}
                onChange={(e) => handleHSLChange('l', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #000, hsl(${hue},${saturation}%,50%), #fff)` }}
              />
            </div>
          </div>
        )}

        {/* Format strip */}
        <div className="border border-gray-100 rounded-lg p-3 mb-4 bg-gray-50 space-y-1.5">
          {[
            { label: 'HEX', value: currentHex, key: 'hex' },
            { label: 'RGB', value: rgbStr, key: 'rgb' },
            { label: 'HSL', value: hslStr, key: 'hsl' },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-400 w-8">{label}</span>
              <span className="text-xs font-mono text-gray-700 flex-1 truncate">{value}</span>
              <button
                className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
                onClick={() => copyFormat(value, key)}
                aria-label={`Copy ${label}`}
              >
                {copied === key ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base" onClick={onClose}>
            Cancel
          </button>
          <button className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
