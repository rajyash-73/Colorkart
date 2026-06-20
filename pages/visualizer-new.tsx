import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Layout, Monitor, PieChart, MessageSquare, Calendar, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { isLightColor } from '../client/src/lib/colorUtils';
import { Color } from '../shared/schema';
import CommonHead from '../components/CommonHead';
import Footer from '../client/src/components/Footer';

// Template types
type TemplateType = 'dashboard' | 'landing' | 'analytics' | 'chat' | 'calendar';

// Server-side props to pass initial palette data
export async function getServerSideProps() {
  // Default palette for initial render
  const defaultPalette: Color[] = [
    { hex: '#1e293b', rgb: { r: 30, g: 41, b: 59 }, locked: false },
    { hex: '#334155', rgb: { r: 51, g: 65, b: 85 }, locked: false },
    { hex: '#3b82f6', rgb: { r: 59, g: 130, b: 246 }, locked: false },
    { hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 }, locked: false },
    { hex: '#f8fafc', rgb: { r: 248, g: 250, b: 252 }, locked: false }
  ];
  
  return {
    props: {
      initialPalette: defaultPalette
    }
  };
}

const VisualizerPage: NextPage<{ initialPalette: Color[] }> = ({ initialPalette }) => {
  const [palette, setPalette] = useState<Color[]>(initialPalette);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('dashboard');
  const [showExportToast, setShowExportToast] = useState(false);
  const [colorIndicators, setColorIndicators] = useState(false);
  
  // Check if we're in the browser to access localStorage
  useEffect(() => {
    try {
      const savedPaletteJson = localStorage.getItem('currentPalette');
      if (savedPaletteJson) {
        const savedPalette = JSON.parse(savedPaletteJson);
        if (Array.isArray(savedPalette) && savedPalette.length > 0) {
          console.log('Next.js: Loaded palette from localStorage:', savedPalette);
          setPalette(savedPalette);
        }
      }
    } catch (err) {
      console.error('Error loading palette from localStorage:', err);
    }
  }, [setPalette]);

  // Listen for palette updates from the generator page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentPalette') {
        try {
          const updatedPalette = JSON.parse(e.newValue || '[]');
          if (Array.isArray(updatedPalette) && updatedPalette.length > 0) {
            setPalette(updatedPalette);
          }
        } catch (err) {
          console.error('Error parsing palette from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper to get text color based on background for contrast
  const getTextColor = (bgColor: string): string => {
    return isLightColor(bgColor) ? '#1f2937' : '#ffffff';
  };

  // Export current template as image
  const exportAsImage = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Dynamically import html2canvas (client-side only)
        const html2canvas = (await import('html2canvas')).default;
        const visualizerEl = document.getElementById('template-visualizer');
        
        if (!visualizerEl) return;
        
        const canvas = await html2canvas(visualizerEl, {
          backgroundColor: null,
          scale: 2 // Higher resolution
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${activeTemplate}-template-${new Date().getTime()}.png`;
        link.click();
        
        // Show success toast
        setShowExportToast(true);
        setTimeout(() => setShowExportToast(false), 3000);
      } catch (err) {
        console.error('Error exporting template:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <CommonHead 
        title="Palette Visualizer | See Your Colors in Real UI Templates - Coolors.in"
        description="Visualize your color palette in real UI templates. See how your colors work together in dashboards, landing pages, and app interfaces."
        keywords="palette visualizer, color combinations, UI templates, color schemes in action"
        canonicalUrl="https://www.coolors.in/visualizer"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Palette Visualizer | Coolors.in",
          "url": "https://www.coolors.in/visualizer",
          "description": "Visualize your color palette in real UI templates with Coolors.in's Palette Visualizer",
          "isPartOf": {
            "@type": "WebApplication",
            "name": "Coolors.in"
          }
        }}
      />
      
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
            Palette Visualizer
          </h1>
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="mr-1" size={20} />
            Back to Generator
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          See how your color palette would look in different UI templates
        </p>
      </header>
      
      {/* Top action bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <TemplateButton 
              active={activeTemplate === 'dashboard'} 
              onClick={() => setActiveTemplate('dashboard')}
              icon={<Layout size={18} />}
              label="Dashboard"
            />
            <TemplateButton 
              active={activeTemplate === 'landing'} 
              onClick={() => setActiveTemplate('landing')}
              icon={<Monitor size={18} />}
              label="Landing Page"
            />
            <TemplateButton 
              active={activeTemplate === 'analytics'} 
              onClick={() => setActiveTemplate('analytics')}
              icon={<PieChart size={18} />}
              label="Analytics"
            />
            <TemplateButton 
              active={activeTemplate === 'chat'} 
              onClick={() => setActiveTemplate('chat')}
              icon={<MessageSquare size={18} />}
              label="Chat App"
            />
            <TemplateButton 
              active={activeTemplate === 'calendar'} 
              onClick={() => setActiveTemplate('calendar')}
              icon={<Calendar size={18} />}
              label="Calendar"
            />
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="color-indicators" 
                className="mr-2"
                checked={colorIndicators}
                onChange={() => setColorIndicators(!colorIndicators)} 
              />
              <label htmlFor="color-indicators" className="text-sm text-gray-600">Show color indicators</label>
            </div>
            <button 
              onClick={exportAsImage} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <ArrowRight size={16} />
              Export as PNG
            </button>
          </div>
        </div>
      </div>
      
      {/* Template visualization */}
      <div 
        id="template-visualizer" 
        className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 mb-6 relative"
      >
        {activeTemplate === 'dashboard' && (
          <DashboardTemplate palette={palette} getTextColor={getTextColor} showIndicators={colorIndicators} />
        )}
        {activeTemplate === 'landing' && (
          <LandingTemplate palette={palette} getTextColor={getTextColor} showIndicators={colorIndicators} />
        )}
        {activeTemplate === 'analytics' && (
          <AnalyticsTemplate palette={palette} getTextColor={getTextColor} showIndicators={colorIndicators} />
        )}
        {activeTemplate === 'chat' && (
          <ChatTemplate palette={palette} getTextColor={getTextColor} showIndicators={colorIndicators} />
        )}
        {activeTemplate === 'calendar' && (
          <CalendarTemplate palette={palette} getTextColor={getTextColor} showIndicators={colorIndicators} />
        )}
      </div>
      
      {/* Color palette reference */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-2">Your Palette</h3>
        <div className="flex h-12 rounded-md overflow-hidden">
          {palette.map((color, index) => (
            <div 
              key={index} 
              className="flex-1" 
              style={{ backgroundColor: color.hex }}
            >
              <div className="h-full flex items-center justify-center">
                <span className={`text-xs font-medium ${isLightColor(color.hex) ? 'text-gray-800' : 'text-white'}`}>
                  {color.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Export success toast */}
      {showExportToast && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
          <Check size={20} className="mr-2" />
          <span>Template exported successfully!</span>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Template button component
interface TemplateButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TemplateButton({ active, onClick, icon, label }: TemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
        active 
          ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Color indicator component
interface ColorIndicatorProps {
  color: string;
  index: number;
  showIndicators: boolean;
}

function ColorIndicator({ color, index, showIndicators }: ColorIndicatorProps) {
  if (!showIndicators) return null;
  
  return (
    <div 
      className="absolute top-0 right-0 px-2 py-1 text-xs font-bold rounded-bl-md z-10"
      style={{ 
        backgroundColor: color,
        color: isLightColor(color) ? '#000' : '#fff'
      }}
    >
      Color {index + 1}
    </div>
  );
}

// Dashboard Template
function DashboardTemplate({ 
  palette, 
  getTextColor, 
  showIndicators 
}: { 
  palette: Color[], 
  getTextColor: (color: string) => string,
  showIndicators: boolean
}) {
  return (
    <div className="h-[500px] flex flex-col" style={{ backgroundColor: palette[4]?.hex || '#f8fafc' }}>
      {/* Sidebar */}
      <div className="flex h-full">
        <div 
          className="w-56 h-full p-4 flex flex-col relative" 
          style={{ 
            backgroundColor: palette[0]?.hex || '#1e293b',
            color: getTextColor(palette[0]?.hex || '#1e293b')
          }}
        >
          {showIndicators && <ColorIndicator color={palette[0]?.hex || '#1e293b'} index={0} showIndicators={showIndicators} />}
          <div className="font-bold text-xl mb-6">App Name</div>
          
          <div className="space-y-1">
            <div className="p-2 rounded flex items-center gap-2 font-medium relative" style={{ 
              backgroundColor: palette[1]?.hex || '#334155',
              color: getTextColor(palette[1]?.hex || '#334155')
            }}>
              {showIndicators && <ColorIndicator color={palette[1]?.hex || '#334155'} index={1} showIndicators={showIndicators} />}
              <Layout size={16} /> Dashboard
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <PieChart size={16} /> Analytics
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <MessageSquare size={16} /> Messages
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <Calendar size={16} /> Calendar
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-2 rounded">Settings</div>
            <div className="p-2 rounded">Help</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: getTextColor(palette[4]?.hex || '#f8fafc') }}>Dashboard</h1>
            <div 
              className="px-4 py-2 rounded relative"  
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              {showIndicators && <ColorIndicator color={palette[2]?.hex || '#3b82f6'} index={2} showIndicators={showIndicators} />}
              + New Item
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className="p-4 rounded-lg shadow relative"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              {showIndicators && <ColorIndicator color={palette[3]?.hex || '#ffffff'} index={3} showIndicators={showIndicators} />}
              <div className="text-sm opacity-80">Total Users</div>
              <div className="text-2xl font-bold">4,927</div>
              <div className="text-xs mt-2 text-green-500">↑ 12% from last month</div>
            </div>
            <div 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="text-sm opacity-80">Revenue</div>
              <div className="text-2xl font-bold">$24,438</div>
              <div className="text-xs mt-2 text-green-500">↑ 8% from last month</div>
            </div>
            <div 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="text-sm opacity-80">Active Projects</div>
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs mt-2 text-red-500">↓ 2 from last month</div>
            </div>
          </div>

          {/* Main panel */}
          <div 
            className="rounded-lg shadow p-4 relative"
            style={{ 
              backgroundColor: palette[3]?.hex || '#ffffff',
              color: getTextColor(palette[3]?.hex || '#ffffff')
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Recent Activity</h2>
              <div className="text-sm">View All</div>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="py-2 border-b last:border-0 flex justify-between">
                  <div>User #{i} completed Task #{i}</div>
                  <div className="text-sm opacity-70">Just now</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showIndicators && <div className="absolute bottom-0 right-0 p-2 bg-opacity-75 rounded-tl-md text-sm" style={{ 
        backgroundColor: palette[4]?.hex || '#f8fafc',
        color: getTextColor(palette[4]?.hex || '#f8fafc')
      }}>
        Background: Color 5
      </div>}
    </div>
  );
}

// Landing Template
function LandingTemplate({ 
  palette, 
  getTextColor,
  showIndicators
}: { 
  palette: Color[], 
  getTextColor: (color: string) => string,
  showIndicators: boolean
}) {
  return (
    <div className="h-[500px] overflow-auto relative" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      {/* Navigation */}
      <header 
        className="px-6 py-4 flex justify-between items-center sticky top-0 relative"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        {showIndicators && <ColorIndicator color={palette[0]?.hex || '#1e293b'} index={0} showIndicators={showIndicators} />}
        <div className="font-bold text-xl">Landing Page</div>
        <nav className="flex items-center gap-6">
          <div>Features</div>
          <div>Pricing</div>
          <div>About</div>
          <div 
            className="px-4 py-2 rounded relative"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            {showIndicators && <ColorIndicator color={palette[2]?.hex || '#3b82f6'} index={2} showIndicators={showIndicators} />}
            Get Started
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div 
        className="px-6 py-16 flex gap-8 justify-between relative" 
        style={{ 
          backgroundColor: palette[1]?.hex || '#334155',
          color: getTextColor(palette[1]?.hex || '#334155')
        }}
      >
        {showIndicators && <ColorIndicator color={palette[1]?.hex || '#334155'} index={1} showIndicators={showIndicators} />}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="mb-6 opacity-90">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi vel consectetur interdum.</p>
          <div className="flex gap-4">
            <div 
              className="px-4 py-2 rounded font-medium relative"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              Get Started
            </div>
            <div 
              className="px-4 py-2 rounded font-medium border"
              style={{ 
                borderColor: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              Learn More
            </div>
          </div>
        </div>
        <div 
          className="w-80 h-48 rounded flex items-center justify-center relative"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          {showIndicators && <ColorIndicator color={palette[3]?.hex || '#ffffff'} index={3} showIndicators={showIndicators} />}
          <span className="text-center">Hero Image</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: getTextColor(palette[4]?.hex || '#f8fafc') }}>Features</h2>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="p-4 rounded-lg text-center relative"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center relative"
                style={{ 
                  backgroundColor: palette[2]?.hex || '#3b82f6',
                  color: getTextColor(palette[2]?.hex || '#3b82f6')
                }}
              >
                {i}
              </div>
              <h3 className="font-bold mb-2">Feature {i}</h3>
              <p className="text-sm opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.</p>
            </div>
          ))}
        </div>
      </div>
      
      {showIndicators && <div className="absolute bottom-0 right-0 p-2 bg-opacity-75 rounded-tl-md text-sm" style={{ 
        backgroundColor: palette[4]?.hex || '#f8fafc',
        color: getTextColor(palette[4]?.hex || '#f8fafc')
      }}>
        Background: Color 5
      </div>}
    </div>
  );
}

// Analytics Template
function AnalyticsTemplate({ 
  palette, 
  getTextColor,
  showIndicators
}: { 
  palette: Color[], 
  getTextColor: (color: string) => string,
  showIndicators: boolean
}) {
  // Placeholder for analytics charts
  return (
    <div className="h-[500px] overflow-auto relative" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <div>Last 7 Days ▼</div>
          <div 
            className="px-3 py-1 rounded text-sm relative"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            {showIndicators && <ColorIndicator color={palette[2]?.hex || '#3b82f6'} index={2} showIndicators={showIndicators} />}
            Export
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="p-4 rounded-lg relative"
            style={{ 
              backgroundColor: palette[0]?.hex || '#1e293b',
              color: getTextColor(palette[0]?.hex || '#1e293b')
            }}
          >
            {showIndicators && <ColorIndicator color={palette[0]?.hex || '#1e293b'} index={0} showIndicators={showIndicators} />}
            <h3 className="font-medium mb-2">Page Views</h3>
            <div className="text-3xl font-bold">42,856</div>
            <div className="relative h-40 mt-4">
              {/* Chart placeholders */}
              <div className="absolute bottom-0 left-0 w-full">
                <div className="flex justify-between h-40">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div 
                      key={i} 
                      className="w-8 mx-1 rounded-t"
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        backgroundColor: palette[2]?.hex || '#3b82f6' 
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div 
            className="p-4 rounded-lg relative"
            style={{ 
              backgroundColor: palette[1]?.hex || '#334155',
              color: getTextColor(palette[1]?.hex || '#334155')
            }}
          >
            {showIndicators && <ColorIndicator color={palette[1]?.hex || '#334155'} index={1} showIndicators={showIndicators} />}
            <h3 className="font-medium mb-2">Conversion Rate</h3>
            <div className="text-3xl font-bold">8.42%</div>
            <div className="relative h-40 mt-4">
              {/* Chart placeholders */}
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className="w-32 h-32 rounded-full border-8 flex items-center justify-center"
                  style={{ borderColor: palette[2]?.hex || '#3b82f6' }}
                >
                  <span className="text-2xl font-bold">8.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg mb-6 relative"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          {showIndicators && <ColorIndicator color={palette[3]?.hex || '#ffffff'} index={3} showIndicators={showIndicators} />}
          <h3 className="font-medium mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral'].map((source, i) => (
              <div key={i} className="flex items-center">
                <div className="w-24">{source}</div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${Math.floor(Math.random() * 70) + 10}%`,
                      backgroundColor: i % 2 === 0 ? palette[0]?.hex : palette[2]?.hex 
                    }}
                  ></div>
                </div>
                <div className="w-16 text-right">{`${Math.floor(Math.random() * 70) + 10}%`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showIndicators && <div className="absolute bottom-0 right-0 p-2 bg-opacity-75 rounded-tl-md text-sm" style={{ 
        backgroundColor: palette[4]?.hex || '#f8fafc',
        color: getTextColor(palette[4]?.hex || '#f8fafc')
      }}>
        Background: Color 5
      </div>}
    </div>
  );
}

// Chat Template
function ChatTemplate({ 
  palette, 
  getTextColor,
  showIndicators
}: { 
  palette: Color[], 
  getTextColor: (color: string) => string,
  showIndicators: boolean
}) {
  return (
    <div className="h-[500px] flex relative" style={{ backgroundColor: palette[3]?.hex || '#ffffff' }}>
      {/* Sidebar */}
      <div 
        className="w-64 h-full border-r flex flex-col relative"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b'),
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        {showIndicators && <ColorIndicator color={palette[0]?.hex || '#1e293b'} index={0} showIndicators={showIndicators} />}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="p-3">
          <div 
            className="mb-3 p-2 rounded flex items-center gap-2 relative"
            style={{ 
              backgroundColor: palette[1]?.hex || '#334155',
              color: getTextColor(palette[1]?.hex || '#334155') 
            }}
          >
            {showIndicators && <ColorIndicator color={palette[1]?.hex || '#334155'} index={1} showIndicators={showIndicators} />}
            <div className="w-10 h-10 rounded-full bg-gray-400"></div>
            <div>
              <div className="font-medium">Alice Smith</div>
              <div className="text-xs opacity-80">Hey there!</div>
            </div>
          </div>
          {['Bob Johnson', 'Catherine Lee', 'David Miller'].map((name, i) => (
            <div key={i} className="mb-3 p-2 rounded flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-400"></div>
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-xs opacity-80">Last message...</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative">
        {showIndicators && <ColorIndicator color={palette[3]?.hex || '#ffffff'} index={3} showIndicators={showIndicators} />}
        <div 
          className="p-4 border-b flex items-center gap-3 relative"
          style={{ 
            color: getTextColor(palette[3]?.hex || '#ffffff') 
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
          <div>
            <div className="font-medium">Alice Smith</div>
            <div className="text-xs">Online</div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="flex justify-start">
              <div 
                className="max-w-xs rounded-lg p-3 relative"
                style={{ 
                  backgroundColor: palette[4]?.hex || '#f1f5f9',
                  color: getTextColor(palette[4]?.hex || '#f1f5f9')
                }}
              >
                {showIndicators && <ColorIndicator color={palette[4]?.hex || '#f1f5f9'} index={4} showIndicators={showIndicators} />}
                <p>Hey there! How are you doing today?</p>
                <div className="text-xs mt-1 opacity-70">10:32 AM</div>
              </div>
            </div>
            <div className="flex justify-end">
              <div 
                className="max-w-xs rounded-lg p-3 relative"
                style={{ 
                  backgroundColor: palette[2]?.hex || '#3b82f6',
                  color: getTextColor(palette[2]?.hex || '#3b82f6')
                }}
              >
                {showIndicators && <ColorIndicator color={palette[2]?.hex || '#3b82f6'} index={2} showIndicators={showIndicators} />}
                <p>I'm doing great! Just finished working on that project we discussed.</p>
                <div className="text-xs mt-1 opacity-70">10:34 AM</div>
              </div>
            </div>
            <div className="flex justify-start">
              <div 
                className="max-w-xs rounded-lg p-3"
                style={{ 
                  backgroundColor: palette[4]?.hex || '#f1f5f9',
                  color: getTextColor(palette[4]?.hex || '#f1f5f9')
                }}
              >
                <p>That's awesome! Can you share the details?</p>
                <div className="text-xs mt-1 opacity-70">10:36 AM</div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="p-4 border-t flex items-center gap-2"
          style={{ 
            color: getTextColor(palette[3]?.hex || '#ffffff') 
          }}
        >
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 p-3 rounded-lg"
            style={{ 
              backgroundColor: palette[4]?.hex || '#f1f5f9',
              color: getTextColor(palette[4]?.hex || '#f1f5f9')
            }}
          />
          <button 
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Calendar Template
function CalendarTemplate({ 
  palette, 
  getTextColor,
  showIndicators
}: { 
  palette: Color[], 
  getTextColor: (color: string) => string,
  showIndicators: boolean
}) {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDay = 15; // Just for demonstration
  
  return (
    <div className="h-[500px] flex flex-col relative" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      {showIndicators && <ColorIndicator color={palette[4]?.hex || '#f8fafc'} index={4} showIndicators={showIndicators} />}
      {/* Header */}
      <div 
        className="p-4 flex justify-between items-center relative"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        {showIndicators && <ColorIndicator color={palette[0]?.hex || '#1e293b'} index={0} showIndicators={showIndicators} />}
        <div className="font-bold text-lg">May 2023</div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg">◀</button>
          <button className="p-2 rounded-lg">Today</button>
          <button className="p-2 rounded-lg">▶</button>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg">Month</button>
          <button className="p-2 rounded-lg">Week</button>
          <button className="p-2 rounded-lg">Day</button>
        </div>
      </div>

      {/* Weekdays header */}
      <div 
        className="grid grid-cols-7 text-center py-2 border-b relative"
        style={{ 
          backgroundColor: palette[1]?.hex || '#334155',
          color: getTextColor(palette[1]?.hex || '#334155')
        }}
      >
        {showIndicators && <ColorIndicator color={palette[1]?.hex || '#334155'} index={1} showIndicators={showIndicators} />}
        {weekdays.map(day => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 border-b">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 3; // Offset to start month from correct weekday
          const isCurrentMonth = day > 0 && day <= 31;
          const isToday = day === currentDay;
          
          return (
            <div 
              key={i} 
              className={`border-r border-b p-1 flex flex-col ${isCurrentMonth ? '' : 'opacity-40'}`}
              style={{ 
                backgroundColor: isToday ? palette[3]?.hex : 'transparent',
                color: isToday ? getTextColor(palette[3]?.hex || '#ffffff') : getTextColor(palette[4]?.hex || '#f8fafc')
              }}
            >
              {isToday && showIndicators && <ColorIndicator color={palette[3]?.hex || '#ffffff'} index={3} showIndicators={showIndicators} />}
              <div className="text-right mb-1">{isCurrentMonth ? day : (day <= 0 ? 31 + day : day - 31)}</div>
              
              {/* Calendar events */}
              {isCurrentMonth && Math.random() > 0.7 && (
                <div 
                  className="text-xs p-1 rounded mb-1 truncate relative"
                  style={{ 
                    backgroundColor: palette[2]?.hex || '#3b82f6',
                    color: getTextColor(palette[2]?.hex || '#3b82f6')
                  }}
                >
                  {day === 15 && showIndicators && <ColorIndicator color={palette[2]?.hex || '#3b82f6'} index={2} showIndicators={showIndicators} />}
                  Meeting
                </div>
              )}
              
              {isCurrentMonth && Math.random() > 0.8 && (
                <div 
                  className="text-xs p-1 rounded truncate"
                  style={{ 
                    backgroundColor: palette[0]?.hex || '#1e293b',
                    color: getTextColor(palette[0]?.hex || '#1e293b')
                  }}
                >
                  Call
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VisualizerPage;