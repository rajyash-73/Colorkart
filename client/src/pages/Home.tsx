import { useEffect, useState } from "react";
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
  
  const { palette, generatePalette, addColor, resetPalette, updateColor } = usePalette();
  const { toast } = useToast();
  
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

  const handleAdjustColor = (index: number) => {
    setActiveColorIndex(index);
    setShowAdjustModal(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Helmet>
        <title>Coolors.in - Free Color Palette Generator | Create Beautiful Color Schemes</title>
        <meta name="description" content="Create and explore beautiful color combinations with Coolors.in, the free color palette generator. Design with confidence using our intuitive color tools." />
        <meta name="keywords" content="color palette generator, color scheme, color combinations, design tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="canonical" href="https://coolors.in/" />
        {/* Dynamic structured data for the home page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Coolors.in Color Palette Generator",
            "url": "https://coolors.in/",
            "description": "Create beautiful color combinations with our intuitive color generator",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Any"
          })}
        </script>
      </Helmet>
      <Header 
        onHelp={handleHelp} 
        onExport={handleExport} 
        onSave={handleSavePalette}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      
      <KeyboardShortcutsBar />
      
      {/* Mobile View: Stack colors vertically */}
      <div className="flex-1 flex flex-col overflow-auto md:hidden" id="mobilePaletteContainer">
        {palette.map((color, index) => (
          <ColorCard 
            key={index}
            color={color}
            index={index}
            onAdjustColor={() => handleAdjustColor(index)}
          />
        ))}
      </div>
      
      {/* Desktop View: Colors side by side */}
      <div className="hidden md:flex flex-1 flex-row overflow-hidden" id="desktopPaletteContainer">
        {palette.map((color, index) => (
          <ColorCard 
            key={index}
            color={color}
            index={index}
            onAdjustColor={() => handleAdjustColor(index)}
          />
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
