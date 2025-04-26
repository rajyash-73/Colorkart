import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Color } from "../types/Color";
import { usePalette } from "@/contexts/PaletteContext";

interface ColorCardProps {
  color: Color;
  index: number;
  onAdjustColor: () => void;
}

export default function ColorCard({ color, index, onAdjustColor }: ColorCardProps) {
  const { toggleLock, removeColor } = usePalette();
  const { toast } = useToast();
  
  // Determine if we need white or black text based on color brightness
  const textColor = isLightColor(color.hex) ? "text-black" : "text-white";
  const buttonBg = isLightColor(color.hex) 
    ? "bg-white bg-opacity-30 hover:bg-opacity-50" 
    : "bg-black bg-opacity-30 hover:bg-opacity-50";
  
  const handleCopyColorCode = () => {
    navigator.clipboard.writeText(color.hex).then(() => {
      toast({
        title: "Copied!",
        description: `${color.hex} copied to clipboard`,
        duration: 2000,
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    });
  };
  
  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLock(index);
    
    toast({
      title: color.locked ? "Color unlocked" : "Color locked",
      description: color.locked 
        ? "This color will change when generating" 
        : "This color will be preserved when generating",
      duration: 2000,
    });
  };
  
  const handleRemoveColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeColor(index);
    
    toast({
      title: "Color removed",
      description: "Color has been removed from palette",
      duration: 2000,
    });
  };
  
  const handleAdjustColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdjustColor();
  };
  
  // Helper function to determine if a color is light or dark
  function isLightColor(hexColor: string) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate perceived brightness (YIQ formula)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128;
  }
  
  return (
    <div 
      className="flex-1 relative flex flex-col justify-between transition-all cursor-pointer group min-h-[150px] xs:min-h-[170px] sm:min-h-[190px] md:min-h-0 w-full h-full border-2 border-white/20 rounded-md shadow-md"
      style={{ backgroundColor: color.hex }}
      data-color-index={index}
    >
      {/* Color Controls - Top */}
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
            className={`${textColor} bg-black/30 dark:bg-white/30 rounded-full p-1.5 md:p-2 transition-all transform hover:scale-110 opacity-90 ml-1 md:opacity-90`}
            onClick={(e) => {
              e.stopPropagation();
              handleCopyColorCode();
            }}
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
      
      {/* Color Code Display - Center */}
      <div 
        className={`flex-1 flex flex-col items-center justify-center ${textColor} py-10 xs:py-12 sm:py-14 px-1 xs:px-2 md:p-4 group-hover:scale-105 md:group-hover:scale-110 transition-transform`}
        onClick={handleCopyColorCode}
      >
        {/* Mobile Display - Simplified with no copy buttons */}
        <div className="block md:hidden w-full">
          <div className="text-center">
            <div className="bg-black/20 dark:bg-white/20 py-2 px-3 mx-auto inline-block rounded-md">
              <div className="flex items-center justify-center">
                <span className="text-xs xs:text-sm sm:text-base font-bold mr-1">
                  {color.hex}
                </span>
                {color.name && (
                  <>
                    <span className="opacity-80 text-[9px] xs:text-[10px] mx-0.5">•</span>
                    <span className="text-[10px] xs:text-xs sm:text-sm opacity-90 truncate max-w-[80px]">
                      {color.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Display */}
        <div className="hidden md:block">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-2 text-center">
            {color.hex}
          </h2>
          <div className="flex flex-col gap-1 items-center">
            {color.name && (
              <p className="text-base opacity-90 font-medium">{color.name}</p>
            )}
            <p className="text-sm opacity-70">
              RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
            </p>
          </div>
        </div>
        
        {/* Desktop "Click to copy" tooltip */}
        <div className="hidden md:block mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`${isLightColor(color.hex) ? 'bg-black bg-opacity-10' : 'bg-white bg-opacity-20'} rounded-full px-3 py-1 text-sm`}>
            Click to copy
          </div>
        </div>
        
        {/* We don't need the mobile hover indicator anymore since we have a dedicated Copy button */}
      </div>
    </div>
  );
}
