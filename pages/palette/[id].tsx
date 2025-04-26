import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PaletteProvider } from '../../client/src/contexts/PaletteContext';
import { AuthProvider } from '../../client/src/hooks/use-auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../client/src/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import ExportModal from '../../client/src/components/modals/ExportModal';
import { Color } from '../../client/src/types/Color';
import { hexToRgb, isLightColor } from '../../client/src/lib/colorUtils';

// Define the props for the page component
interface SharedPalettePageProps {
  colors: Color[];
  notFound: boolean;
}

// Define a color swatch component for the shared page
const ColorSwatch = ({ color }: { color: Color }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  const textColorClass = isLightColor(color.hex) ? 'text-gray-900' : 'text-white';
  
  return (
    <div 
      className="flex-1 h-full min-h-[150px] relative flex items-center justify-center flex-col transition-all"
      style={{ backgroundColor: color.hex }}
    >
      <div className={`text-lg font-medium ${textColorClass}`}>
        {color.hex.toUpperCase()}
      </div>
      
      <div className={`mt-2 flex space-x-2 opacity-80 hover:opacity-100 transition-opacity ${textColorClass}`}>
        <button 
          onClick={() => copyToClipboard(color.hex)}
          className="p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors"
        >
          {copied ? 'Copied!' : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      
      {color.name && (
        <div className={`mt-2 text-sm ${textColorClass}`}>
          {color.name}
        </div>
      )}
    </div>
  );
};

const SharedPalettePage: NextPage<SharedPalettePageProps> = ({ colors, notFound }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const router = useRouter();
  
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Head>
          <title>Palette Not Found - Coolors.in</title>
          <meta name="description" content="This color palette could not be found." />
          <link rel="canonical" href={`https://coolors.in/palette/${router.query.id}`} />
        </Head>
        
        <div className="text-3xl font-bold text-gray-800 mb-6">Palette Not Found</div>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The color palette you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create a New Palette
        </Link>
      </div>
    );
  }
  
  // Format colors as a string for sharing
  const colorString = colors.map(c => c.hex.replace('#', '')).join('-');
  const shareUrl = `https://coolors.in/palette/${colorString}`;
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaletteProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Head>
              <title>Shared Color Palette - Coolors.in</title>
              <meta name="description" content="View and explore this shared color palette from Coolors.in" />
              <meta name="keywords" content="shared palette, color scheme, coolors" />
              <link rel="canonical" href={`https://coolors.in/palette/${router.query.id}`} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content="Color Palette from Coolors.in" />
              <meta property="og:description" content="Check out this beautiful color palette I created with Coolors.in" />
              <meta property="og:image" content={`https://coolors.in/api/palette-og-image?colors=${colorString}`} />
              <meta property="og:url" content={shareUrl} />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="Color Palette from Coolors.in" />
              <meta name="twitter:description" content="Check out this beautiful color palette I created with Coolors.in" />
              <meta name="twitter:image" content={`https://coolors.in/api/palette-og-image?colors=${colorString}`} />
            </Head>
            
            <header className="bg-white border-b border-gray-200">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Coolors.in
                  </span>
                </Link>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Export
                  </button>
                  
                  <Link 
                    href="/"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Create New
                  </Link>
                </div>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col">
              {/* Desktop View: Colors side by side */}
              <div className="hidden md:flex flex-1">
                {colors.map((color, index) => (
                  <ColorSwatch key={index} color={color} />
                ))}
              </div>
              
              {/* Mobile View: Stack colors vertically */}
              <div className="md:hidden flex flex-col">
                {colors.map((color, index) => (
                  <div key={index} className="h-24">
                    <ColorSwatch color={color} />
                  </div>
                ))}
              </div>
              
              <div className="bg-white border-t border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4">About This Palette</h2>
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Share URL</div>
                  <div className="flex">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareUrl}
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 bg-gray-50"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        alert('URL copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href={`/visualizer?colors=${colorString}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Visualize
                  </Link>
                  
                  <Link 
                    href={`/?colors=${colorString}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Edit Palette
                  </Link>
                </div>
              </div>
            </main>
            
            <footer className="bg-gray-800 text-white py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <div className="text-xl font-bold">Coolors.in</div>
                    <div className="text-gray-400 text-sm">The super fast color palette generator</div>
                  </div>
                  
                  <div className="flex space-x-6">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                      Home
                    </Link>
                    <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                      FAQ
                    </Link>
                    <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                      Privacy
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
            
            {showExportModal && (
              <ExportModal 
                palette={colors} 
                onClose={() => setShowExportModal(false)} 
              />
            )}
            
            <Toaster />
          </div>
        </PaletteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id as string;
    
    if (!id) {
      return {
        props: {
          colors: [],
          notFound: true
        }
      };
    }
    
    // If ID is a hash of colors like FF5733-33FF57-5733FF
    if (id.includes('-') || (id.length >= 6 && !id.includes('-'))) {
      // Handle both formats: with dashes and without
      const colorArray = id.includes('-') 
        ? id.split('-') 
        : id.match(/.{1,6}/g) || []; // Split into 6-character chunks if no dashes
      
      const colors: Color[] = colorArray.map(hexCode => {
        // Ensure the hex code has a # prefix
        const formattedHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
        
        return {
          hex: formattedHex,
          rgb: hexToRgb(formattedHex) || { r: 0, g: 0, b: 0 },
          locked: false
        };
      });
      
      return {
        props: {
          colors,
          notFound: false
        }
      };
    }
    
    // If we can't parse the ID, return not found
    return {
      props: {
        colors: [],
        notFound: true
      }
    };
  } catch (error) {
    console.error('Error fetching palette:', error);
    
    return {
      props: {
        colors: [],
        notFound: true
      }
    };
  }
};

export default SharedPalettePage;