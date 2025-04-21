import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Color } from '@/types/Color';
import { Upload, Image as ImageIcon, ArrowLeft, RefreshCw, X, Info } from 'lucide-react';
import { usePalette } from '@/contexts/PaletteContext';
import { hexToRgb, getColorName, rgbToHex } from '@/lib/colorUtils';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function ImagePalette() {
  const { setPalette } = usePalette();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<Color[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Show instructions popup when component loads
  useEffect(() => {
    // Check if this is the first visit to this page
    const hasSeenInstructions = localStorage.getItem('hasSeenImagePaletteInstructions');
    
    if (!hasSeenInstructions) {
      setShowInstructions(true);
      localStorage.setItem('hasSeenImagePaletteInstructions', 'true');
    } else {
      // Show a toast notification anyway as a brief reminder
      toast({
        title: "Image to Palette Generator",
        description: "Upload an image to extract a color palette from its dominant colors!",
        action: (
          <div className="flex items-center gap-2">
            <Info size={16} />
          </div>
        )
      });
    }
  }, [toast]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setExtractedPalette([]);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };
  
  const extractColors = useCallback(() => {
    if (!uploadedImage || !canvasRef.current) return;
    
    setIsExtracting(true);
    setError(null);
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setError('Canvas context not supported in your browser.');
        setIsExtracting(false);
        return;
      }
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      try {
        // Get pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // Sample pixels and create color map
        const colorMap: { [key: string]: number } = {};
        const pixelCount = imageData.length / 4;
        const sampleRate = Math.max(1, Math.floor(pixelCount / 10000)); // Sample at most 10,000 pixels
        
        for (let i = 0; i < pixelCount; i += sampleRate) {
          const offset = i * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];
          
          // Skip transparent pixels
          if (imageData[offset + 3] < 128) continue;
          
          // Convert to hex
          const hex = rgbToHex(r, g, b);
          
          // Quantize colors to reduce variations
          const quantizedHex = quantizeColor(hex, 24); // Group similar colors together
          
          if (colorMap[quantizedHex]) {
            colorMap[quantizedHex]++;
          } else {
            colorMap[quantizedHex] = 1;
          }
        }
        
        // Sort colors by frequency and take the top 5
        const sortedColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .map(([hex]) => hex)
          .slice(0, 5);
        
        // Create Color objects
        const palette: Color[] = sortedColors.map(hex => {
          const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
          const name = getColorName(hex);
          return {
            hex,
            rgb,
            locked: false,
            name
          };
        });
        
        setExtractedPalette(palette);
      } catch (err) {
        console.error('Error extracting colors:', err);
        setError('Failed to extract colors from the image.');
      }
      
      setIsExtracting(false);
    };
    
    img.onerror = () => {
      setError('Failed to load the image. Please try another one.');
      setIsExtracting(false);
    };
    
    img.src = uploadedImage;
  }, [uploadedImage]);
  
  const useExtractedPalette = () => {
    if (extractedPalette.length > 0) {
      setPalette(extractedPalette);
      
      // Show success toast
      toast({
        title: "Palette Applied!",
        description: "The extracted colors have been applied to your palette",
        variant: "default"
      });
      
      // Use wouter navigation instead of window.location
      setLocation('/');
    }
  };
  
  // Using imported rgbToHex function from colorUtils.ts
  
  // Helper function to quantize colors (reduce color space)
  const quantizeColor = (hex: string, levels: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const factor = 255 / (levels - 1);
    
    const qr = Math.round(Math.round(r / factor) * factor);
    const qg = Math.round(Math.round(g / factor) * factor);
    const qb = Math.round(Math.round(b / factor) * factor);
    
    return rgbToHex(qr, qg, qb);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <Helmet>
        <title>Image to Palette Generator | Coolors.in</title>
        <meta name="description" content="Extract color palettes from your images. Upload any image and automatically generate a harmonious color palette based on the dominant colors." />
        <link rel="canonical" href="https://coolors.in/image-palette" />
        {/* Structured data for tool page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Image to Palette Generator",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "description": "Extract color palettes from your images. Upload any image and automatically generate a harmonious color palette based on the dominant colors.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Extract color palettes from images",
              "Identify dominant colors",
              "Transfer extracted colors to palette generator",
              "Export color palettes in various formats"
            ]
          })}
        </script>
      </Helmet>
      <header className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
            Image to Palette
          </h1>
          <div
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="mr-1" size={18} />
            Back to Generator
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
          Upload an image to extract a color palette from its dominant colors.
        </p>
      </header>
      
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          <button
            onClick={triggerFileInput}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <Upload size={16} className="sm:w-[20px] sm:h-[20px]" />
            {uploadedImage ? 'Upload Different Image' : 'Upload Image'}
          </button>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 w-full text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          {uploadedImage && (
            <div className="w-full max-w-2xl mx-auto mb-6">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-full object-contain max-h-[400px]" 
                />
              </div>
              
              <button
                onClick={extractColors}
                disabled={isExtracting}
                className="bg-white text-gray-800 border border-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-1 sm:gap-2 mx-auto text-sm sm:text-base"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Extract Colors</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {extractedPalette.length > 0 && (
            <div className="w-full">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Extracted Palette</h2>
              
              <div className="flex h-16 sm:h-24 mb-4 sm:mb-6 rounded-lg overflow-hidden shadow-md">
                {extractedPalette.map((color, index) => (
                  <div 
                    key={index} 
                    className="flex-1" 
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="h-full flex items-end justify-center p-1 sm:p-2">
                      <div className="text-center">
                        <span 
                          className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white bg-opacity-30 ${
                            parseInt(color.hex.slice(1), 16) > 0xFFFFFF / 2 ? 'text-gray-800' : 'text-white'
                          }`}
                        >
                          {color.hex}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={useExtractedPalette}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2 mx-auto text-sm sm:text-base"
              >
                Use This Palette
              </button>
            </div>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 relative">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} className="sm:w-[20px] sm:h-[20px]" />
            </button>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">How to Use Image to Palette</h2>
            
            <div className="space-y-3 sm:space-y-4 text-gray-600 text-xs sm:text-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <Upload size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">1. Upload an Image</h3>
                  <p>Click the upload button and select any image from your device.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <ImageIcon size={16} className="text-indigo-600 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">2. Extract Colors</h3>
                  <p>Click "Extract Colors" to analyze your image and find its dominant colors.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">3. Review Your Palette</h3>
                  <p>The tool will extract up to 5 dominant colors from your image.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <ArrowLeft size={16} className="text-emerald-600 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base">4. Use Your Palette</h3>
                  <p>Click "Use This Palette" to apply these colors to the main generator.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}