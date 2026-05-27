import React, { useState, useEffect, useRef, useCallback } from "react";
import SEOHead from '@/components/SEOHead';
import { ArrowRight, Palette, Smartphone, Monitor, Download, Users, SplitSquareHorizontal, Layers, Pipette, Compass, Type, Heart, BookMarked, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { POPULAR_PALETTES } from "@/lib/palettesData";
import { useAuth } from "@/hooks/use-auth";
import { isLightColor } from "@/lib/colorUtils";

const TRENDING = POPULAR_PALETTES.slice().sort((a, b) => b.likes - a.likes).slice(0, 6);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const heroRef = useRef<HTMLSpanElement>(null);

  const handleGetStarted = () => {
    window.location.href = '/generator';
  };

  const handleExplorePalettes = () => {
    window.location.href = '/explore';
  };

  // Mouse-reactive gradient on hero text
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroRef.current.style.backgroundImage = `linear-gradient(${Math.round(x + y)}deg, #6C63FF, #FF6584, #FDCB6E, #00B894, #74B9FF)`;
    heroRef.current.style.backgroundSize = '400% 400%';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Animated Color Palette Showcase Component
  const AnimatedPaletteShowcase = () => {
    const [currentSet, setCurrentSet] = useState(0);
    
    const paletteSets = [
      [
        ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
        ['#6C5CE7', '#A29BFE', '#FD79A8', '#E17055', '#00B894'],
        ['#2D3436', '#636E72', '#DDD', '#74B9FF', '#00CEC9'],
        ['#FF7675', '#FD79A8', '#FDCB6E', '#6C5CE7', '#74B9FF']
      ],
      [
        ['#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6', '#E74C3C'],
        ['#F39C12', '#E67E22', '#D35400', '#C0392B', '#8E44AD'],
        ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
        ['#E8F5E8', '#FFF3CD', '#D1ECF1', '#F8D7DA', '#E2E3E5']
      ],
      [
        ['#FF9FF3', '#F368E0', '#FF6B6B', '#4ECDC4', '#45B7D1'],
        ['#A8E6CF', '#FFD93D', '#6BCF7F', '#4D96FF', '#9B59B6'],
        ['#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'],
        ['#F8BBD9', '#E8F5E8', '#FFF8DC', '#E6E6FA', '#F0F8FF']
      ]
    ];
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSet((prev) => (prev + 1) % paletteSets.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Endless Palette Possibilities</h3>
            <p className="text-gray-600 dark:text-gray-300">Discover thousands of beautiful color combinations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paletteSets[currentSet].map((palette, paletteIndex) => (
              <div 
                key={`${currentSet}-${paletteIndex}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-500 transform hover:scale-105 animate-fade-in"
                style={{
                  animationDelay: `${paletteIndex * 0.1}s`
                }}
              >
                <div className="flex h-20">
                  {palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 transition-all duration-300 hover:scale-110 relative group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center">
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {paletteSets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSet(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSet 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/generator'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Creating Palettes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SEOHead
        title="Free Color Palette Generator — Create Beautiful Color Schemes"
        description="Generate stunning color palettes instantly. Free online color scheme generator for designers, developers & artists. Trusted by users in US, UK, Europe, India and worldwide."
        keywords="color palette generator, colour palette generator, free color palette, color scheme generator, colour scheme generator, color combinations, CSS color palette, hex color picker, web design colors, UI color tool, color theory, Korean color analysis, personal color season, skin tone color analysis, 配色方案生成器, रंग पैलेट, Farbpaletten-Generator, générateur de palette de couleurs"
        canonicalPath="/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Coolors Color Palette Generator",
            "url": "https://coolors.in",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Generate stunning color palettes instantly. Free online tool for designers and developers worldwide."
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is Coolors free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Coolors is completely free. Generate, save and export unlimited color palettes at no cost." } },
              { "@type": "Question", "name": "Can I use the palettes commercially?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all palettes generated on Coolors are free to use for personal and commercial projects." } },
              { "@type": "Question", "name": "What color formats can I export?", "acceptedAnswer": { "@type": "Answer", "text": "Export in CSS variables, SCSS, Tailwind config, JSON, and PNG formats." } }
            ]
          }
        ]}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            The super fast color
            <br />
            <span
              ref={heroRef}
              className="bg-clip-text text-transparent transition-all duration-300"
              style={{ backgroundImage: 'linear-gradient(90deg, #6C63FF, #FF6584, #FDCB6E)', backgroundSize: '400% 400%' }}
            >
              palette generator!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create the perfect palette or get inspired by thousands of beautiful color schemes.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
            >
              Start the generator!
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </button>

            <button
              onClick={handleExplorePalettes}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore trending palettes
            </button>

            {user && (
              <button
                onClick={() => window.location.href = '/saved-palettes'}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-violet-200 dark:border-violet-800 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <BookMarked size={20} />
                My Saved Palettes
              </button>
            )}
          </div>
          
        </div>

        {/* Animated Palette Showcase */}
        <section className="mb-20">
          <style>
            {`
              @keyframes fade-in {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in {
                animation: fade-in 0.8s ease-in-out both;
              }
            `}
          </style>
          <AnimatedPaletteShowcase />
        </section>

        {/* Trending Palettes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Palettes</h2>
            <a href="/explore" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-shadow cursor-pointer group"
                onClick={() => { window.location.href = '/explore'; }}>
                <div className="flex h-20">
                  {p.colors.map((c, i) => (
                    <div key={i} className="flex-1 relative" style={{ backgroundColor: c }}>
                      <span className={`absolute inset-0 flex items-end justify-center pb-1 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isLightColor(c) ? 'text-black/70' : 'text-white/80'}`}>
                        {c.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 ml-2 flex-shrink-0">
                    <Heart size={11} /> {p.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Apps & Tools Showcase */}
        <section className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Color Palette Generator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Palette Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Create beautiful color palettes with advanced algorithms and color theory.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
              >
                Start creating →
              </button>
            </div>

            {/* Korean Color Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Korean Color Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Discover your personal color season — Spring, Summer, Autumn or Winter — and find the colors that make you glow.
              </p>
              <button
                onClick={() => window.location.href = '/clothing-palette'}
                className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors"
              >
                Try now →
              </button>
            </div>

            {/* Visualizer */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Visualizer</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                See your color palettes in action with real-time mockups and previews.
              </p>
              <button 
                onClick={() => window.location.href = '/visualize'}
                className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors"
              >
                Visualize →
              </button>
            </div>

            {/* Image to Palette */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image to Palette</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Extract beautiful color palettes from any image you upload.
              </p>
              <button
                onClick={() => window.location.href = '/image-palette'}
                className="text-orange-600 font-medium text-sm hover:text-orange-700 transition-colors"
              >
                Extract colors →
              </button>
            </div>

            {/* Contrast Checker */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <SplitSquareHorizontal className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contrast Checker</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Check WCAG AA/AAA contrast ratios for accessible, readable design.
              </p>
              <button
                onClick={() => window.location.href = '/contrast-checker'}
                className="text-sky-600 font-medium text-sm hover:text-sky-700 transition-colors"
              >
                Check contrast →
              </button>
            </div>

            {/* Gradient Generator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Gradient Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Build CSS gradients visually with precise stop controls and instant export.
              </p>
              <button
                onClick={() => window.location.href = '/gradient-generator'}
                className="text-pink-600 font-medium text-sm hover:text-pink-700 transition-colors"
              >
                Make gradient →
              </button>
            </div>

            {/* Color Picker */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Pipette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Color Picker</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Inspect any color and explore its shades, tints, tones, and formats.
              </p>
              <button
                onClick={() => window.location.href = '/color-picker'}
                className="text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors"
              >
                Pick a color →
              </button>
            </div>

            {/* Explore Palettes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Explore Palettes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Discover, like, and share thousands of trending color palettes from the community.
              </p>
              <button
                onClick={() => window.location.href = '/explore'}
                className="text-violet-600 font-medium text-sm hover:text-violet-700 transition-colors"
              >
                Explore trending palettes →
              </button>
            </div>

            {/* Font Generator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Type className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Font Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Preview Google Fonts with custom sizes, weights, and colors. Export as CSS or SVG.
              </p>
              <button
                onClick={() => window.location.href = '/font-generator'}
                className="text-rose-600 font-medium text-sm hover:text-rose-700 transition-colors"
              >
                Generate fonts →
              </button>
            </div>

            {/* Saved Palettes — shown to logged-in users */}
            {user && (
              <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-violet-200 dark:border-violet-800">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">My Saved Palettes</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View and manage all the palettes you've saved to your account.
                </p>
                <button
                  onClick={() => window.location.href = '/saved-palettes'}
                  className="text-violet-600 font-medium text-sm hover:text-violet-700 transition-colors"
                >
                  View saved →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Social Proof */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Users className="w-6 h-6 text-gray-600 mr-2" />
            <p className="text-gray-600 font-medium">
              Used by thousands of designers and developers worldwide
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Generation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our advanced algorithms create harmonious color combinations that work perfectly together.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Live Preview</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See your colors in action with our real-time visualization tools and UI mockups.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Easy Export</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Export your palettes in any format you need for your design workflow.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create amazing palettes?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of designers who trust Coolors for their color needs.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Start Creating Now
          </button>
        </section>
      </main>

      <Footer className="mt-20" />
    </div>
  );
}