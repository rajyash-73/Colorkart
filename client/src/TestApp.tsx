import React, { useState, useRef, useEffect } from 'react';
import { Color } from './types/Color';
import { isLightColor } from '@/lib/colorUtils';
import { 
  LockIcon, UnlockIcon, RefreshCw, Copy, Download, Plus, Trash, Info, Sliders, 
  GripVertical, Image as ImageIcon, Eye, BookOpen, Keyboard, Move, Lock 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import ColorAdjustmentModal from '@/components/ColorAdjustmentModal';
import TrendingPalettes from '@/components/TrendingPalettes';
import WelcomeModal from '@/components/modals/WelcomeModal';
import Footer from '@/components/Footer';
import { usePalette, colorTheoryOptions, ColorTheory } from '@/contexts/PaletteContext';
import { Link } from 'wouter';

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white text-gray-800 px-4 py-3 rounded-xl shadow-xl border border-gray-200 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 max-w-md">
      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
        <Info size={18} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
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
    reorderColors
  } = usePalette();
  
  const [toast, setToast] = useState<string | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState<number | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  
  // Handle spacebar for generating new palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && 
          document.activeElement?.tagName !== "INPUT" && 
          document.activeElement?.tagName !== "TEXTAREA" &&
          !showAdjustModal) {
        e.preventDefault();
        generatePalette();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [generatePalette, showAdjustModal]);
  
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      {/* Hero Section */}
      <header className="relative mb-8 sm:mb-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-sm">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full"></div>
          <div className="absolute top-20 -right-10 w-60 h-60 bg-purple-500 rounded-full"></div>
          <div className="absolute -bottom-20 left-40 w-80 h-80 bg-indigo-500 rounded-full"></div>
        </div>
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Palette Generator
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
                Create beautiful, harmonious color combinations with the power of color theory. Design like a pro in seconds.
              </p>
            </div>
            
            <div
              className="mt-3 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-full shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              onClick={() => window.location.href = '/designers-guide'}
            >
              <Eye size={16} />
              <span>Designer's Guide</span>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                <RefreshCw size={14} className="mr-1.5 text-gray-500" />
                <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-semibold border border-gray-200 shadow-sm">spacebar</kbd> to generate</span>
              </div>
              
              <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                <LockIcon size={14} className="mr-1.5 text-gray-500" />
                <span>Click lock to keep a color</span>
              </div>
              
              <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                <GripVertical size={14} className="mr-1.5 text-gray-500" />
                <span>Drag to reorder</span>
              </div>
            </div>
            
            <div className="flex flex-col bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2">
                <label htmlFor="color-theory" className="text-sm font-medium text-gray-700 whitespace-nowrap">Color Theory:</label>
                <select 
                  id="color-theory"
                  value={colorTheory}
                  onChange={(e) => setColorTheory(e.target.value as ColorTheory)}
                  className="text-sm border border-blue-200 rounded-lg px-2 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {colorTheoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {colorTheory !== 'auto' && (
                <p className="text-xs text-blue-700 mt-2 max-w-[220px] sm:max-w-xs">
                  {colorTheory === 'monochromatic' ? "Variations in lightness and saturation of one color" : 
                   colorTheory === 'analogous' ? "Colors that sit next to each other on the color wheel" :
                   colorTheory === 'complementary' ? "Opposite colors that create strong contrast" :
                   colorTheory === 'split-complementary' ? "A base color and two adjacent to its complement" :
                   colorTheory === 'triadic' ? "Three colors evenly spaced on the wheel for balance" :
                   colorTheory === 'tetradic' ? "Two complementary pairs for rich diversity" :
                   colorTheory === 'neutral' ? "Desaturated colors for clean aesthetics" : 
                   ""}
                  
                  {" - Select 'Use as Base' on any color"}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="bg-white rounded-xl p-4 mb-8 shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Actions</h2>
          <div className="flex gap-2">
            <button 
              onClick={resetPalette}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="Reset palette"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          <button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
            onClick={generatePalette}
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" />
            <span>Generate</span>
          </button>
          
          <button 
            className="bg-white text-gray-700 border border-gray-200 px-4 sm:px-6 py-3 rounded-xl shadow hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
            onClick={addColor}
            disabled={palette.length >= 10}
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span>Add Color</span>
          </button>
          
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-3 rounded-xl shadow hover:shadow-md hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium cursor-pointer"
            onClick={() => window.location.href = '/image-palette'}
          >
            <ImageIcon size={18} className="sm:w-5 sm:h-5" />
            <span>From Image</span>
          </div>
          
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-6 py-3 rounded-xl shadow hover:shadow-md hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium cursor-pointer"
            onClick={() => window.location.href = '/visualize'}
          >
            <Eye size={18} className="sm:w-5 sm:h-5" />
            <span>Visualize</span>
          </div>
          
          <button 
            className="bg-white text-gray-700 border border-gray-200 px-4 sm:px-6 py-3 rounded-xl shadow hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
            onClick={exportPalette}
          >
            <Download size={18} className="sm:w-5 sm:h-5" />
            <span>Export PNG</span>
          </button>
          
          <button 
            className="bg-white text-gray-700 border border-gray-200 px-4 sm:px-6 py-3 rounded-xl shadow hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
            onClick={exportPaletteAsJSON}
          >
            <Download size={18} className="sm:w-5 sm:h-5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <div 
          ref={paletteRef} 
          className="flex flex-col md:flex-row h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        >
          {palette.map((color, index) => {
            const textColor = isLightColor(color.hex) ? 'text-gray-800' : 'text-white';
            return (
              <div 
                key={index}
                className={`flex-1 relative transition-all group ${draggedIndex === index ? 'opacity-50' : ''}`}
                style={{ backgroundColor: color.hex }}
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
                      <h3 className="text-lg sm:text-2xl font-bold tracking-wide">{color.hex}</h3>
                      {color.name && (
                        <p className="text-xs sm:text-sm opacity-90 font-medium mt-0.5">{color.name}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button 
                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 mx-auto text-xs sm:text-sm font-medium"
                        onClick={() => copyToClipboard(color.hex)}
                      >
                        <Copy size={14} className="sm:w-4 sm:h-4" />
                        <span>Copy</span>
                      </button>
                      
                      {colorTheory !== 'auto' && (
                        <button 
                          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 mx-auto text-xs sm:text-sm font-medium"
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
      
      {/* Trending Palettes Section */}
      <TrendingPalettes onSelectPalette={handleTrendingPaletteSelect} />
      
      <div className="mt-10 sm:mt-14 p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Start creating beautiful designs today</h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
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
            className="bg-white text-gray-700 border border-gray-200 px-5 py-3 rounded-lg shadow hover:shadow-md transition-all font-medium cursor-pointer"
            onClick={() => window.location.href = '/visualize'}
          >
            Try Visualizer
          </div>
        </div>
      </div>
      
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