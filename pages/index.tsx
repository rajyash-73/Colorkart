import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useToast } from '../client/src/hooks/use-toast';
import Header from '../client/src/components/Header';
import KeyboardShortcutsBar from '../client/src/components/KeyboardShortcutsBar';
import ActionButtons from '../client/src/components/ActionButtons';
import ColorCard from '../client/src/components/ColorCard';
import OnboardingTour from '../client/src/components/modals/OnboardingTour';
import ExportModal from '../client/src/components/modals/ExportModal';
import AdjustColorModal from '../client/src/components/modals/AdjustColorModal';
import { usePalette } from '../client/src/contexts/PaletteContext';
import { type Color } from '../client/src/types/Color';
import dynamic from 'next/dynamic';

// Define any components that must be client-side only
const ClientSideShortcutsBar = dynamic(
  () => import('../client/src/components/KeyboardShortcutsBar'),
  { ssr: false }
);

const HomePage: NextPage = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const { palette, generatePalette, addColor, resetPalette, updateColor, reorderColors } = usePalette();
  const { toast } = useToast();

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
    
    // Check if first visit
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem("hasVisitedPalettePro");
      if (!hasVisited) {
        setShowOnboarding(true);
        localStorage.setItem("hasVisitedPalettePro", "true");
      }
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
  }, [showOnboarding, showExportModal, showAdjustModal]);

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
    if (typeof window !== 'undefined') {
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
    }
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

  // Server-side rendering fallback content
  if (!isClient) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        <Head>
          <title>Coolors.in - Free Color Palette Generator | Create Beautiful Color Schemes</title>
          <meta name="description" content="Create and explore beautiful color combinations with Coolors.in, the free color palette generator. Design with confidence using our intuitive color tools." />
          <meta name="keywords" content="color palette generator, color scheme, color combinations, design tools" />
          <link rel="canonical" href="https://coolors.in/" />
        </Head>
        
        <Header 
          onHelp={() => {}} 
          onExport={() => {}} 
          onSave={() => {}}
          mobileMenuOpen={false}
          toggleMobileMenu={() => {}}
        />
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Loading Color Palette Generator...</div>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Head>
        <title>Coolors.in - Free Color Palette Generator | Create Beautiful Color Schemes</title>
        <meta name="description" content="Create and explore beautiful color combinations with Coolors.in, the free color palette generator. Design with confidence using our intuitive color tools." />
        <meta name="keywords" content="color palette generator, color scheme, color combinations, design tools" />
        <link rel="canonical" href="https://coolors.in/" />
        {/* Dynamic structured data for the home page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'Coolors.in Color Palette Generator',
              'url': 'https://coolors.in/',
              'description': 'Create beautiful color combinations with our intuitive color generator',
              'applicationCategory': 'DesignApplication',
              'operatingSystem': 'Any'
            })
          }}
        />
      </Head>
      
      <Header 
        onHelp={handleHelp} 
        onExport={handleExport} 
        onSave={handleSavePalette}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      
      <ClientSideShortcutsBar />
      
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
};

export default HomePage;