import React, { useState, useCallback, useMemo, useContext } from 'react';
import { Color } from '@/types/Color';
import { getRandomColor, hexToRgb, getColorName, rgbToHex } from '@/lib/colorUtils';

// Define the color theory types
export type ColorTheory = 
  | 'auto' 
  | 'monochromatic' 
  | 'analogous' 
  | 'complementary' 
  | 'split-complementary' 
  | 'triadic' 
  | 'tetradic' 
  | 'neutral';

export const colorTheoryOptions = [
  { value: 'auto', label: 'Auto (Random)' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'split-complementary', label: 'Split-Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'neutral', label: 'Neutral' }
];

// Define context shape
interface PaletteContextType {
  palette: Color[];
  colorTheory: ColorTheory;
  setColorTheory: (theory: ColorTheory) => void;
  generatePalette: () => void;
  generatePaletteWithTheory: (baseColor: Color) => void;
  toggleLock: (index: number) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  resetPalette: () => void;
  updateColor: (index: number, color: Color) => void;
  setPalette: (colors: Color[]) => void;
  reorderColors: (sourceIndex: number, targetIndex: number) => void;
}

// Create the context
const PaletteContext = React.createContext<PaletteContextType | null>(null);

const DEFAULT_COLORS = [
  { hex: "#7A4ED9", rgb: { r: 122, g: 78, b: 217 }, locked: false, name: "Blue Violet" },
  { hex: "#ED584E", rgb: { r: 237, g: 88, b: 78 }, locked: false, name: "Tomato" },
  { hex: "#51CED9", rgb: { r: 81, g: 206, b: 217 }, locked: false, name: "Turquoise" },
  { hex: "#F7DB58", rgb: { r: 247, g: 219, b: 88 }, locked: false, name: "Yellow" },
  { hex: "#5AE881", rgb: { r: 90, g: 232, b: 129 }, locked: false, name: "Spring Green" },
];

// Helper functions for color theory
function hueShift(hex: string, shift: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }

  // Apply hue shift (0-1 range)
  h = (h + shift) % 1;
  if (h < 0) h += 1;
  
  // Convert back to RGB
  let r1, g1, b1;
  
  if (s === 0) {
    r1 = g1 = b1 = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r1 = hue2rgb(p, q, h + 1/3);
    g1 = hue2rgb(p, q, h);
    b1 = hue2rgb(p, q, h - 1/3);
  }
  
  const newR = Math.round(r1 * 255);
  const newG = Math.round(g1 * 255);
  const newB = Math.round(b1 * 255);
  
  return rgbToHex(newR, newG, newB);
}

function adjustSaturation(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = 0; // achromatic
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }

  // Adjust saturation
  s = Math.max(0, Math.min(1, s * factor));
  
  // Convert back to RGB
  let r1, g1, b1;
  
  if (s === 0) {
    r1 = g1 = b1 = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r1 = hue2rgb(p, q, h + 1/3);
    g1 = hue2rgb(p, q, h);
    b1 = hue2rgb(p, q, h - 1/3);
  }
  
  const newR = Math.round(r1 * 255);
  const newG = Math.round(g1 * 255);
  const newB = Math.round(b1 * 255);
  
  return rgbToHex(newR, newG, newB);
}

function adjustLightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }

  // Adjust lightness
  l = Math.max(0, Math.min(1, l + amount));
  
  // Convert back to RGB
  let r1, g1, b1;
  
  if (s === 0) {
    r1 = g1 = b1 = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r1 = hue2rgb(p, q, h + 1/3);
    g1 = hue2rgb(p, q, h);
    b1 = hue2rgb(p, q, h - 1/3);
  }
  
  const newR = Math.round(r1 * 255);
  const newG = Math.round(g1 * 255);
  const newB = Math.round(b1 * 255);
  
  return rgbToHex(newR, newG, newB);
}

// Provider component
export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Color[]>(DEFAULT_COLORS);
  const [colorTheory, setColorTheory] = useState<ColorTheory>('auto');
  
  const generatePalette = useCallback(() => {
    console.log("Generating new palette...");
    
    // If using auto mode, just do random generation
    if (colorTheory === 'auto') {
      setPaletteState(prevPalette => 
        prevPalette.map(color => {
          if (color.locked) return color;
          
          const hex = getRandomColor();
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          const name = getColorName(hex);
          
          return {
            hex,
            rgb,
            locked: false,
            name
          };
        })
      );
      return;
    }
    
    // If using color theory, find a base color
    setPaletteState(prevPalette => {
      // Create a copy of the palette
      const newPalette = [...prevPalette];
      
      // Find the first unlocked color to use as base, or generate a new base color
      const baseIndex = newPalette.findIndex(c => !c.locked);
      if (baseIndex === -1) {
        // All colors are locked, just return the palette as-is
        return newPalette;
      }
      
      // Generate a new base color if the existing one is not locked
      if (!newPalette[baseIndex].locked) {
        const hex = getRandomColor();
        const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
        const name = getColorName(hex);
        
        newPalette[baseIndex] = {
          hex,
          rgb,
          locked: false,
          name
        };
      }
      
      // Get the base color
      const baseColor = newPalette[baseIndex];
      
      // Generate colors based on color theory using the base color
      for (let i = 0; i < newPalette.length; i++) {
        if (newPalette[i].locked || i === baseIndex) continue;
        
        let newHex: string;
        const baseHex = baseColor.hex;
        
        switch (colorTheory) {
          case 'monochromatic':
            // Vary lightness and saturation while keeping the same hue
            if (i < baseIndex) {
              // Darker variations
              const darkenAmount = -0.15 * (baseIndex - i);
              newHex = adjustLightness(baseHex, darkenAmount);
            } else {
              // Lighter variations
              const lightenAmount = 0.15 * (i - baseIndex);
              newHex = adjustLightness(baseHex, lightenAmount);
            }
            break;
            
          case 'analogous':
            // Colors next to each other on the color wheel
            const analogousShift = (i - baseIndex) * 0.08; // Small hue shift
            newHex = hueShift(baseHex, analogousShift);
            break;
            
          case 'complementary':
            // Opposite colors
            if (i === baseIndex + 1 || (baseIndex === newPalette.length - 1 && i === 0)) {
              // Complementary color (opposite on color wheel)
              newHex = hueShift(baseHex, 0.5);
            } else {
              // Variations of the base and complement
              const isBaseVariation = i < baseIndex || i > baseIndex + 1;
              const referenceColor = isBaseVariation ? baseHex : hueShift(baseHex, 0.5);
              const variationIndex = isBaseVariation ? i : i - baseIndex - 1;
              
              // Adjust saturation and lightness for variations
              newHex = adjustSaturation(
                adjustLightness(referenceColor, variationIndex * 0.1),
                1 - variationIndex * 0.1
              );
            }
            break;
            
          case 'split-complementary':
            // Base color + two adjacent to its complement
            if (i === baseIndex + 1 || (baseIndex === newPalette.length - 1 && i === 0)) {
              // First split complement
              newHex = hueShift(baseHex, 0.5 - 0.05);
            } else if (i === baseIndex + 2 || (baseIndex >= newPalette.length - 2 && i === baseIndex + 2 - newPalette.length)) {
              // Second split complement
              newHex = hueShift(baseHex, 0.5 + 0.05);
            } else {
              // Variations
              const shift = (i - baseIndex) * 0.07;
              newHex = hueShift(baseHex, shift);
            }
            break;
            
          case 'triadic':
            // Three evenly spaced colors
            const triadicShift = Math.floor((i - baseIndex) / Math.ceil(newPalette.length / 3)) * (1/3);
            newHex = hueShift(baseHex, triadicShift);
            break;
            
          case 'tetradic':
            // Four evenly spaced colors
            const tetradicShift = Math.floor((i - baseIndex) / Math.ceil(newPalette.length / 4)) * 0.25;
            newHex = hueShift(baseHex, tetradicShift);
            break;
            
          case 'neutral':
            // Desaturated colors
            // Create a slight hue shift and heavily desaturate
            const slightShift = (i - baseIndex) * 0.02;
            newHex = adjustSaturation(hueShift(baseHex, slightShift), 0.3);
            break;
            
          default:
            // Default to random colors
            const hex = getRandomColor();
            const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
            const name = getColorName(hex);
            
            newPalette[i] = {
              hex,
              rgb,
              locked: false,
              name
            };
            continue;
        }
        
        // Convert the new color to RGB and get its name
        const rgb = hexToRgb(newHex) || { r: 0, g: 0, b: 0 };
        const name = getColorName(newHex);
        
        // Update the palette with the new color
        newPalette[i] = {
          hex: newHex,
          rgb,
          locked: false,
          name
        };
      }
      
      return newPalette;
    });
  }, [colorTheory]);
  
  const toggleLock = useCallback((index: number) => {
    setPaletteState(prevPalette => 
      prevPalette.map((color, i) => 
        i === index ? { ...color, locked: !color.locked } : color
      )
    );
  }, []);
  
  const addColor = useCallback(() => {
    if (palette.length >= 10) {
      console.log("Maximum palette size reached");
      return;
    }
    
    // In auto mode, just add a random color
    if (colorTheory === 'auto') {
      const hex = getRandomColor();
      const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
      const name = getColorName(hex);
      
      setPaletteState(prevPalette => [
        ...prevPalette,
        { hex, rgb, locked: false, name }
      ]);
      return;
    }
    
    // In color theory mode, add a color that follows the pattern
    setPaletteState(prevPalette => {
      const newPalette = [...prevPalette];
      
      // Find a good base color (preferably the first unlocked color)
      const baseIndex = newPalette.findIndex(c => !c.locked);
      const baseColor = baseIndex !== -1 ? 
        newPalette[baseIndex] : 
        newPalette[0]; // Use first color if all are locked
      
      let newHex: string;
      const baseHex = baseColor.hex;
      const newIndex = newPalette.length;
      
      // Calculate position relative to the base color
      const relativePosition = baseIndex !== -1 ? newIndex - baseIndex : newIndex;
      
      switch (colorTheory) {
        case 'monochromatic':
          // Add a lighter variation
          const lightenAmount = 0.15 * relativePosition;
          newHex = adjustLightness(baseHex, lightenAmount);
          break;
          
        case 'analogous':
          // Add a color with hue further along the wheel
          const analogousShift = relativePosition * 0.08;
          newHex = hueShift(baseHex, analogousShift);
          break;
          
        case 'complementary':
          // If we have odd number of colors, add a complement
          // Otherwise add a variation
          if (newPalette.length % 2 === 0) {
            newHex = hueShift(baseHex, 0.5); // Complement
          } else {
            // Variation of either base or complement
            const isBaseVariation = Math.random() > 0.5;
            const referenceColor = isBaseVariation ? baseHex : hueShift(baseHex, 0.5);
            
            // Adjust saturation and lightness for variations
            newHex = adjustSaturation(
              adjustLightness(referenceColor, 0.1),
              0.9
            );
          }
          break;
          
        case 'split-complementary':
          // Try to complete the split-complementary triad
          if (newPalette.length % 3 === 0) {
            newHex = hueShift(baseHex, 0.5 - 0.05); // First split complement
          } else if (newPalette.length % 3 === 1) {
            newHex = hueShift(baseHex, 0.5 + 0.05); // Second split complement
          } else {
            // Add a variation
            const shift = relativePosition * 0.07;
            newHex = hueShift(baseHex, shift);
          }
          break;
          
        case 'triadic':
          // Add the next color in the triad
          const triadicShift = Math.floor(relativePosition / Math.ceil((newPalette.length + 1) / 3)) * (1/3);
          newHex = hueShift(baseHex, triadicShift);
          break;
          
        case 'tetradic':
          // Add the next color in the tetrad
          const tetradicShift = Math.floor(relativePosition / Math.ceil((newPalette.length + 1) / 4)) * 0.25;
          newHex = hueShift(baseHex, tetradicShift);
          break;
          
        case 'neutral':
          // Add another desaturated color
          const slightShift = relativePosition * 0.02;
          newHex = adjustSaturation(hueShift(baseHex, slightShift), 0.3);
          break;
          
        default:
          // Default to random colors
          const hex = getRandomColor();
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          const name = getColorName(hex);
          
          return [...newPalette, { hex, rgb, locked: false, name }];
      }
      
      // Convert the new color to RGB and get its name
      const rgb = hexToRgb(newHex) || { r: 0, g: 0, b: 0 };
      const name = getColorName(newHex);
      
      // Add the new color to the palette
      return [...newPalette, { hex: newHex, rgb, locked: false, name }];
    });
  }, [palette, colorTheory]);
  
  const removeColor = useCallback((index: number) => {
    if (palette.length <= 2) {
      console.log("Minimum palette size reached");
      return;
    }
    
    setPaletteState(prevPalette => 
      prevPalette.filter((_, i) => i !== index)
    );
  }, [palette.length]);
  
  const resetPalette = useCallback(() => {
    setPaletteState(DEFAULT_COLORS);
  }, []);
  
  const updateColor = useCallback((index: number, updatedColor: Color) => {
    setPaletteState(prevPalette => 
      prevPalette.map((color, i) => i === index ? updatedColor : color)
    );
  }, []);
  
  const setPalette = useCallback((colors: Color[]) => {
    setPaletteState(colors);
  }, []);
  
  const reorderColors = useCallback((sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    
    setPaletteState(prevPalette => {
      const newPalette = [...prevPalette];
      const [movedColor] = newPalette.splice(sourceIndex, 1);
      newPalette.splice(targetIndex, 0, movedColor);
      return newPalette;
    });
  }, []);
  
  const generatePaletteWithTheory = useCallback((baseColor: Color) => {
    if (colorTheory === 'auto') {
      // Just use the regular random generation
      generatePalette();
      return;
    }
    
    // Start with the base color, which should be kept
    const newPalette: Color[] = [...palette];
    const baseIndex = newPalette.findIndex(c => !c.locked);
    
    if (baseIndex === -1) {
      // All colors are locked, can't generate
      return;
    }
    
    // Update the base color if it's not locked
    if (!newPalette[baseIndex].locked) {
      newPalette[baseIndex] = { ...baseColor, locked: true };
    }
    
    // Generate colors based on color theory
    for (let i = 0; i < newPalette.length; i++) {
      if (newPalette[i].locked && i !== baseIndex) continue;
      
      let newHex: string;
      const baseHex = baseColor.hex;
      
      switch (colorTheory) {
        case 'monochromatic':
          // Vary lightness and saturation while keeping the same hue
          if (i === baseIndex) continue; // Skip the base color
          
          if (i < baseIndex) {
            // Darker variations
            const darkenAmount = -0.15 * (baseIndex - i);
            newHex = adjustLightness(baseHex, darkenAmount);
          } else {
            // Lighter variations
            const lightenAmount = 0.15 * (i - baseIndex);
            newHex = adjustLightness(baseHex, lightenAmount);
          }
          break;
          
        case 'analogous':
          // Colors next to each other on the color wheel
          if (i === baseIndex) continue;
          
          const analogousShift = (i - baseIndex) * 0.08; // Small hue shift
          newHex = hueShift(baseHex, analogousShift);
          break;
          
        case 'complementary':
          // Opposite colors
          if (i === baseIndex) continue;
          
          if (i === baseIndex + 1 || (baseIndex === newPalette.length - 1 && i === 0)) {
            // Complementary color (opposite on color wheel)
            newHex = hueShift(baseHex, 0.5);
          } else {
            // Variations of the base and complement
            const isBaseVariation = i < baseIndex || i > baseIndex + 1;
            const referenceColor = isBaseVariation ? baseHex : hueShift(baseHex, 0.5);
            const variationIndex = isBaseVariation ? i : i - baseIndex - 1;
            
            // Adjust saturation and lightness for variations
            newHex = adjustSaturation(
              adjustLightness(referenceColor, variationIndex * 0.1),
              1 - variationIndex * 0.1
            );
          }
          break;
          
        case 'split-complementary':
          // Base color + two adjacent to its complement
          if (i === baseIndex) continue;
          
          if (i === baseIndex + 1 || (baseIndex === newPalette.length - 1 && i === 0)) {
            // First split complement
            newHex = hueShift(baseHex, 0.5 - 0.05);
          } else if (i === baseIndex + 2 || (baseIndex >= newPalette.length - 2 && i === baseIndex + 2 - newPalette.length)) {
            // Second split complement
            newHex = hueShift(baseHex, 0.5 + 0.05);
          } else {
            // Variations
            const shift = (i - baseIndex) * 0.07;
            newHex = hueShift(baseHex, shift);
          }
          break;
          
        case 'triadic':
          // Three evenly spaced colors
          if (i === baseIndex) continue;
          
          const triadicShift = Math.floor((i - baseIndex) / Math.ceil(newPalette.length / 3)) * (1/3);
          newHex = hueShift(baseHex, triadicShift);
          break;
          
        case 'tetradic':
          // Four evenly spaced colors
          if (i === baseIndex) continue;
          
          const tetradicShift = Math.floor((i - baseIndex) / Math.ceil(newPalette.length / 4)) * 0.25;
          newHex = hueShift(baseHex, tetradicShift);
          break;
          
        case 'neutral':
          // Desaturated colors
          if (i === baseIndex) continue;
          
          // Create a slight hue shift and heavily desaturate
          const slightShift = (i - baseIndex) * 0.02;
          newHex = adjustSaturation(hueShift(baseHex, slightShift), 0.3);
          break;
          
        default:
          // Default to random colors
          const hex = getRandomColor();
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          const name = getColorName(hex);
          
          newPalette[i] = {
            hex,
            rgb,
            locked: false,
            name
          };
          continue;
      }
      
      // Convert the new color to RGB and get its name
      const rgb = hexToRgb(newHex) || { r: 0, g: 0, b: 0 };
      const name = getColorName(newHex);
      
      // Update the palette with the new color
      newPalette[i] = {
        hex: newHex,
        rgb,
        locked: false,
        name
      };
    }
    
    setPaletteState(newPalette);
  }, [palette, colorTheory, generatePalette]);
  
  const value = useMemo(() => ({
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
    setPalette,
    reorderColors
  }), [
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
    setPalette, 
    reorderColors
  ]);
  
  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  );
}

// Hook for using the context
export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}