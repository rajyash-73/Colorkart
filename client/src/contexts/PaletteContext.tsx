import React, { useState, useCallback, useMemo, useContext } from 'react';
import { Color } from '@/types/Color';
import { getRandomColor, hexToRgb, getColorName, rgbToHex, hexToHsl, hslToHex } from '@/lib/colorUtils';
import { POPULAR_PALETTES } from '@/lib/palettesData';

// Flat pool of all curated colors from the static library (deduplicated)
const STATIC_COLOR_POOL: string[] = Array.from(
  new Set(POPULAR_PALETTES.flatMap(p => p.colors))
);
// All complete palettes from the static library
const STATIC_PALETTE_LIBRARY: string[][] = POPULAR_PALETTES.map(p => p.colors);

function pickFromPool(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

// Define the color theory types
export type ColorTheory =
  | 'auto'
  | 'from-library'
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'neutral';

export const colorTheoryOptions = [
  { value: 'auto',              label: 'Auto (Random)' },
  { value: 'from-library',      label: 'From Library' },
  { value: 'monochromatic',     label: 'Monochromatic' },
  { value: 'analogous',         label: 'Analogous' },
  { value: 'complementary',     label: 'Complementary' },
  { value: 'split-complementary', label: 'Split-Complementary' },
  { value: 'triadic',           label: 'Triadic' },
  { value: 'tetradic',          label: 'Tetradic' },
  { value: 'neutral',           label: 'Neutral' },
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
  enrichColorPool: (colors: string[]) => void;
  enrichPaletteLibrary: (palettes: string[][]) => void;
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

// Helper functions for color theory — thin wrappers around colorUtils
function hueShift(hex: string, shift: number): string {
  // shift in [0,1] (fraction of full circle)
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const newH = ((hsl.h + shift * 360) % 360 + 360) % 360;
  return hslToHex(newH, hsl.s, hsl.l);
}

function adjustSaturation(hex: string, factor: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  return hslToHex(hsl.h, Math.max(0, Math.min(100, hsl.s * factor)), hsl.l);
}

function adjustLightness(hex: string, amount: number): string {
  // amount in [0,1] fraction (e.g. 0.15 = +15%)
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  return hslToHex(hsl.h, hsl.s, Math.max(0, Math.min(100, hsl.l + amount * 100)));
}

// Provider component
export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Color[]>(() => {
    const pool = [...STATIC_COLOR_POOL];
    const result: Color[] = [];
    for (let i = 0; i < 5 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const [hex] = pool.splice(idx, 1);
      const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
      result.push({ hex, rgb, locked: false, name: getColorName(hex) });
    }
    return result;
  });
  const [colorTheory, setColorTheory] = useState<ColorTheory>('auto');
  // Mutable refs for the enrichable pools (avoids stale-closure issues)
  const colorPoolRef = React.useRef<string[]>([...STATIC_COLOR_POOL]);
  const paletteLibraryRef = React.useRef<string[][]>([...STATIC_PALETTE_LIBRARY]);

  const enrichColorPool = useCallback((colors: string[]) => {
    const existing = new Set(colorPoolRef.current);
    const novel = colors.filter(c => !existing.has(c));
    if (novel.length > 0) colorPoolRef.current = [...colorPoolRef.current, ...novel];
  }, []);

  const enrichPaletteLibrary = useCallback((palettes: string[][]) => {
    paletteLibraryRef.current = [...paletteLibraryRef.current, ...palettes];
  }, []);

  const generatePalette = useCallback(() => {
    // From-library mode: pick a random complete palette from the combined library
    if (colorTheory === 'from-library') {
      const lib = paletteLibraryRef.current;
      const chosen = lib[Math.floor(Math.random() * lib.length)];
      setPaletteState(prev => {
        // Respect locked colors; fill unlocked slots with chosen palette's colors (cycling)
        const unlocked = prev.filter(c => !c.locked);
        let ci = 0;
        return prev.map(color => {
          if (color.locked) return color;
          const hex = chosen[ci % chosen.length];
          ci++;
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          return { hex, rgb, locked: false, name: getColorName(hex) };
        });
      });
      return;
    }

    // Auto mode: draw from the enriched color pool (70%) or true random (30%) for diversity
    if (colorTheory === 'auto') {
      const pool = colorPoolRef.current;
      setPaletteState(prevPalette =>
        prevPalette.map(color => {
          if (color.locked) return color;
          const hex = pool.length > 0 && Math.random() < 0.7
            ? pickFromPool(pool)
            : getRandomColor();
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          return { hex, rgb, locked: false, name: getColorName(hex) };
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
    reorderColors,
    enrichColorPool,
    enrichPaletteLibrary,
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
    reorderColors,
    enrichColorPool,
    enrichPaletteLibrary,
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