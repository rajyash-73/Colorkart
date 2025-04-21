import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Color } from '../types/Color';
import { hexToRgb, rgbToHex, getColorName } from '@/lib/colorUtils';

interface ColorAdjustmentModalProps {
  color: Color;
  onClose: () => void;
  onApply: (color: Color) => void;
}

export default function ColorAdjustmentModal({ color, onClose, onApply }: ColorAdjustmentModalProps) {
  const [red, setRed] = useState(color.rgb.r);
  const [green, setGreen] = useState(color.rgb.g);
  const [blue, setBlue] = useState(color.rgb.b);
  const [currentHex, setCurrentHex] = useState(color.hex);
  const [colorName, setColorName] = useState(color.name || getColorName(color.hex));
  
  const handleRGBChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newValue = Math.min(255, Math.max(0, value));
    
    if (component === 'r') setRed(newValue);
    if (component === 'g') setGreen(newValue);
    if (component === 'b') setBlue(newValue);
    
    // Update hex when RGB changes
    const newHex = rgbToHex(
      component === 'r' ? newValue : red,
      component === 'g' ? newValue : green,
      component === 'b' ? newValue : blue
    );
    
    setCurrentHex(newHex);
    setColorName(getColorName(newHex));
  };
  
  const handleHexChange = (hex: string) => {
    // Validate hex format
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setCurrentHex(hex);
      
      // Update RGB values
      const rgb = hexToRgb(hex);
      if (rgb) {
        setRed(rgb.r);
        setGreen(rgb.g);
        setBlue(rgb.b);
        
        // Update color name
        setColorName(getColorName(hex));
      }
    } else {
      // Just update the input without changing RGB values
      setCurrentHex(hex);
    }
  };
  
  const handleApply = () => {
    const colorName = getColorName(currentHex);
    onApply({
      hex: currentHex,
      rgb: { r: red, g: green, b: blue },
      locked: color.locked,
      name: colorName
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Adjust Color</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        <div 
          className="w-full h-16 sm:h-24 rounded-lg mb-2"
          style={{ backgroundColor: currentHex }}
        ></div>
        
        <div className="text-center mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-medium">{colorName}</span>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium mb-1">Hex</label>
          <input 
            type="text" 
            className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={currentHex}
            onChange={(e) => handleHexChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-medium">Red</label>
              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{red}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={red}
              onChange={(e) => handleRGBChange('r', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-medium">Green</label>
              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{green}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={green}
              onChange={(e) => handleRGBChange('g', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs sm:text-sm font-medium">Blue</label>
              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{blue}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={blue}
              onChange={(e) => handleRGBChange('b', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}