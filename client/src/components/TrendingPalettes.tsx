import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Color } from '../types/Color';
import { isLightColor, getColorName } from '@/lib/colorUtils';

interface TrendingPaletteProps {
  name: string;
  colors: string[];
  onSelect: (colors: Color[]) => void;
}

// Sample trending palettes data
export const TRENDING_PALETTES = [
  {
    name: "Summer Sunset",
    colors: ["#FF9671", "#FFC75F", "#F9F871", "#D65DB1", "#845EC2"]
  },
  {
    name: "Ocean Breeze",
    colors: ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"]
  },
  {
    name: "Forest Vibes",
    colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"]
  },
  {
    name: "Retro Wave",
    colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"]
  },
  {
    name: "Pastel Dream",
    colors: ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF"]
  }
];

function TrendingPalette({ name, colors, onSelect }: TrendingPaletteProps) {
  const handleClick = () => {
    // Convert hex strings to Color objects
    const colorObjects = colors.map(hex => {
      const colorName = getColorName(hex);
      return {
        hex,
        rgb: {
          r: parseInt(hex.slice(1, 3), 16),
          g: parseInt(hex.slice(3, 5), 16),
          b: parseInt(hex.slice(5, 7), 16)
        },
        locked: false,
        name: colorName
      };
    });
    
    onSelect(colorObjects);
  };
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg border border-gray-100 transition-all cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex h-14 sm:h-20 relative">
        {colors.map((color, index) => (
          <div 
            key={index}
            className="flex-1 group-hover:flex-[1.1] transition-all duration-300 relative"
            style={{ backgroundColor: color }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-medium transition-opacity duration-300"
              style={{ color: isLightColor(color) ? '#333' : '#fff', backgroundColor: color + '99' }}
            >
              <span className="px-2 py-1 backdrop-blur-sm rounded bg-white bg-opacity-20">
                {color}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 sm:p-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-800">{name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{colors.length} colors</p>
        </div>
        <span className="p-1.5 bg-gray-100 rounded-full text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
          <ArrowRight size={16} className="sm:h-[18px] sm:w-[18px]" />
        </span>
      </div>
    </div>
  );
}

interface TrendingPalettesProps {
  onSelectPalette: (colors: Color[]) => void;
}

export default function TrendingPalettes({ onSelectPalette }: TrendingPalettesProps) {
  return (
    <div className="mt-8 sm:mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Trending Palettes</h2>
          <p className="text-sm text-gray-600 mt-1">Try these popular color combinations</p>
        </div>
        <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
          <ArrowRight size={20} className="text-blue-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {TRENDING_PALETTES.map((palette, index) => (
          <TrendingPalette
            key={index}
            name={palette.name}
            colors={palette.colors}
            onSelect={onSelectPalette}
          />
        ))}
      </div>
    </div>
  );
}