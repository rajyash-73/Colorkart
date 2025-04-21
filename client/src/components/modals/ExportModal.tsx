import React, { useState, useRef } from "react";
import { Color } from "../../types/Color";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface ExportModalProps {
  palette: Color[];
  onClose: () => void;
}

export default function ExportModal({ palette, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<"png" | "json" | "txt">("png");
  const [showHex, setShowHex] = useState(true);
  const [showRGB, setShowRGB] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleDownload = async () => {
    try {
      if (exportFormat === "png") {
        // Create a PNG using html2canvas
        if (paletteRef.current) {
          const canvas = await html2canvas(paletteRef.current);
          const dataUrl = canvas.toDataURL("image/png");
          
          // Create a download link
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `palette-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else if (exportFormat === "json") {
        // Export as JSON
        const data = JSON.stringify(palette.map(color => ({
          hex: color.hex,
          rgb: color.rgb
        })), null, 2);
        
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = `palette-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (exportFormat === "txt") {
        // Export as TXT
        let content = "";
        palette.forEach((color, index) => {
          content += `Color ${index + 1}:\n`;
          content += `Hex: ${color.hex}\n`;
          content += `RGB: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}\n\n`;
        });
        
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = `palette-${new Date().getTime()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Downloaded successfully!",
        description: `Palette exported as ${exportFormat.toUpperCase()}`,
        duration: 2000,
      });
      
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your palette",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Export Palette</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <div 
            ref={paletteRef}
            className="flex space-x-1 h-14 sm:h-16 mb-3 sm:mb-4 rounded overflow-hidden"
          >
            {palette.map((color, index) => (
              <div 
                key={index}
                className="flex-1 relative"
                style={{ backgroundColor: color.hex }}
              >
                {showHex && (
                  <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] sm:text-xs" style={{ color: isLightColor(color.hex) ? '#000' : '#fff' }}>
                    {color.hex}
                  </div>
                )}
                {showRGB && (
                  <div className="absolute top-1 left-0 right-0 text-center text-[10px] sm:text-xs" style={{ color: isLightColor(color.hex) ? '#000' : '#fff' }}>
                    {color.rgb.r},{color.rgb.g},{color.rgb.b}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1 sm:mb-2">Export Format</label>
              {/* Mobile view */}
              <div className="flex flex-wrap sm:hidden gap-3">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatPNGMobile" 
                    name="exportFormat" 
                    checked={exportFormat === "png"}
                    onChange={() => setExportFormat("png")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatPNGMobile" className="ml-2 text-xs text-gray-700">PNG Image</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatJSONMobile" 
                    name="exportFormat" 
                    checked={exportFormat === "json"}
                    onChange={() => setExportFormat("json")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatJSONMobile" className="ml-2 text-xs text-gray-700">JSON</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatTXTMobile" 
                    name="exportFormat" 
                    checked={exportFormat === "txt"}
                    onChange={() => setExportFormat("txt")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatTXTMobile" className="ml-2 text-xs text-gray-700">Text</label>
                </div>
              </div>
              
              {/* Desktop view */}
              <div className="hidden sm:flex space-x-3">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatPNG" 
                    name="exportFormat" 
                    checked={exportFormat === "png"}
                    onChange={() => setExportFormat("png")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatPNG" className="ml-2 text-sm text-gray-700">PNG Image</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatJSON" 
                    name="exportFormat" 
                    checked={exportFormat === "json"}
                    onChange={() => setExportFormat("json")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatJSON" className="ml-2 text-sm text-gray-700">JSON</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatTXT" 
                    name="exportFormat" 
                    checked={exportFormat === "txt"}
                    onChange={() => setExportFormat("txt")}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor="formatTXT" className="ml-2 text-sm text-gray-700">Text</label>
                </div>
              </div>
            </div>
            
            {exportFormat === "png" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1 sm:mb-2">Image Options</label>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:space-x-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="showHex" 
                      checked={showHex}
                      onChange={() => setShowHex(!showHex)}
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="showHex" className="ml-2 text-xs sm:text-sm text-gray-700">Show Hex Codes</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="showRGB" 
                      checked={showRGB}
                      onChange={() => setShowRGB(!showRGB)}
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="showRGB" className="ml-2 text-xs sm:text-sm text-gray-700">Show RGB Values</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="bg-primary hover:bg-blue-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md flex items-center space-x-1.5 sm:space-x-2 text-sm sm:text-base"
            onClick={handleDownload}
          >
            <i className="fas fa-download"></i>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine if a color is light or dark
function isLightColor(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate perceived brightness (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
}
