import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import KeyboardShortcutsBar from "@/components/KeyboardShortcutsBar";
import ActionButtons from "@/components/ActionButtons";
import ColorCard from "@/components/ColorCard";
import OnboardingTour from "@/components/modals/OnboardingTour";
import ExportModal from "@/components/modals/ExportModal";
import AdjustColorModal from "@/components/modals/AdjustColorModal";
import { usePalette } from "@/contexts/PaletteContext";
import { type Color } from "../types/Color";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const { palette, generatePalette, addColor, resetPalette, updateColor, reorderColors } = usePalette();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  console.log('Home component rendered with palette:', palette);

  useEffect(() => {
    // Check if first visit
    const hasVisited = localStorage.getItem("hasVisitedPalettePro");
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem("hasVisitedPalettePro", "true");
    }
    
    // Setup space key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && 
          document.activeElement?.tagName !== "INPUT" && 
          document.activeElement?.tagName !== "TEXTAREA" &&
          !showOnboarding && 
          !showExportModal && 
          !showAdjustModal) {
        e.preventDefault();
        handleGeneratePalette();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showOnboarding, showExportModal, showAdjustModal, generatePalette]);

  const handleGeneratePalette = () => {
    // Call the generate palette function from context
    generatePalette();
    
    toast({
      title: "New palette generated!",
      description: "Press spacebar for another one.",
      duration: 2000,
    });
  };

  const handleSavePalette = () => {
    // Save to localStorage
    const savedPalettes = JSON.parse(localStorage.getItem("savedPalettes") || "[]");
    const newPalette = {
      id: Date.now(),
      colors: palette,
      createdAt: new Date().toISOString(),
    };
    
    savedPalettes.push(newPalette);
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
    
    toast({
      title: "Palette saved!",
      description: "Your palette has been saved to local storage.",
      duration: 2000,
    });
  };

  const handleHelp = () => {
    setShowOnboarding(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };
  
  const handleVisualize = () => {
    // Save current palette to localStorage for the visualizer to use
    localStorage.setItem('currentPalette', JSON.stringify(palette));
    
    // Navigate to visualizer page
    navigate('/visualize');
  };

  const handleAdjustColor = (index: number) => {
    setActiveColorIndex(index);
    setShowAdjustModal(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Drag and drop handlers for mobile and desktop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderColors(draggedIndex, targetIndex);
      
      toast({
        title: "Colors reordered",
        description: "Palette order has been updated",
        duration: 2000,
      });
    }
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  // Touch events for mobile drag and drop
  const handleTouchStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Preview of movement handled by CSS
  };
  
  const handleTouchEnd = (e: React.TouchEvent, targetIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderColors(draggedIndex, targetIndex);
      
      toast({
        title: "Colors reordered",
        description: "Palette order has been updated",
        duration: 2000,
      });
    }
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Helmet>
        <title>Coolors - Free Color Palette Generator | Create Beautiful Color Schemes</title>
        <meta name="description" content="Create and explore beautiful color combinations with Coolors, the free color palette generator. Design with confidence using our intuitive color tools." />
        <meta name="keywords" content="color palette generator, color scheme, color combinations, design tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="canonical" href="https://www.coolors.in/" />
        {/* Dynamic structured data for the home page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Coolors Color Palette Generator",
            "url": "https://www.coolors.in/",
            "description": "Create beautiful color combinations with our intuitive color generator",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Any"
          })}
        </script>
      </Helmet>
      <Header 
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      
      <KeyboardShortcutsBar />
      
      {/* Mobile View: Stack colors vertically with drag support */}
      <div className="flex-1 flex flex-col overflow-auto md:hidden" id="mobilePaletteContainer">
        {palette.map((color, index) => (
          <div 
            key={index}
            className={`relative mb-10 ${draggedIndex === index ? 'opacity-60 border-2 border-dashed border-gray-400' : ''}`}
            draggable={true}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={() => handleTouchStart(index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => handleTouchEnd(e, index)}
          >
            {/* Clear separation between palettes */}
            <div className="w-full flex flex-col">
              <div className="bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded-t-md text-xs opacity-80 text-center shadow-sm">
                Color {index+1} 
                <span className="ml-2 inline-flex items-center text-gray-500">
                  <i className="fas fa-grip-lines text-xs mr-1"></i>
                  drag to reorder
                </span>
              </div>
              <div className="absolute top-10 left-2 z-10 p-3 rounded-full bg-black bg-opacity-50 touch-manipulation cursor-grab active:cursor-grabbing">
                <i className="fas fa-grip-lines text-sm text-white"></i>
              </div>
              <ColorCard 
                color={color}
                index={index}
                onAdjustColor={() => handleAdjustColor(index)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop View: Colors side by side with drag support */}
      <div className="hidden md:flex flex-1 flex-row overflow-hidden" id="desktopPaletteContainer">
        {palette.map((color, index) => (
          <div 
            key={index}
            className={`relative flex-1 ${draggedIndex === index ? 'opacity-60 border-2 border-dashed border-gray-400' : ''}`}
            draggable={true}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={() => handleTouchStart(index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => handleTouchEnd(e, index)}
          >
            <div className="absolute top-3 left-3 z-20 p-3 rounded-full bg-black bg-opacity-40 cursor-grab active:cursor-grabbing transition-opacity opacity-70 hover:opacity-100">
              <i className="fas fa-grip-lines text-white"></i>
            </div>
            <ColorCard 
              color={color}
              index={index}
              onAdjustColor={() => handleAdjustColor(index)}
            />
          </div>
        ))}
        
        <div className="flex items-center justify-center w-16 bg-gray-100 border-l border-gray-300 hover:bg-gray-200 cursor-pointer transition-colors"
            onClick={() => addColor()}>
          <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
            <i className="fas fa-plus text-xl"></i>
            <span className="text-xs font-medium">Add</span>
          </div>
        </div>
      </div>
      
      <ActionButtons 
        onGenerate={handleGeneratePalette}
        onAddColor={addColor}
        onClearAll={resetPalette}
      />
      
      {showOnboarding && <OnboardingTour onClose={() => setShowOnboarding(false)} />}
      
      {showExportModal && 
        <ExportModal 
          palette={palette} 
          onClose={() => setShowExportModal(false)} 
        />
      }
      
      {showAdjustModal && activeColorIndex !== null &&
        <AdjustColorModal 
          color={palette[activeColorIndex]} 
          onClose={() => setShowAdjustModal(false)}
          onApply={(updatedColor: Color) => {
            updateColor(activeColorIndex, updatedColor);
            setShowAdjustModal(false);
          }}
        />
      }
    </div>
  );
}
