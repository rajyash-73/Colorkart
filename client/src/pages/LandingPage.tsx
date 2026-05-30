import React, { useState, useEffect, useRef, useCallback } from "react";
import SEOHead from '@/components/SEOHead';
import { ArrowRight, Palette, Smartphone, Monitor, Download, Users, SplitSquareHorizontal, Layers, Pipette, Compass, Type, Heart, BookMarked, Sparkles, Copy, Check, X, BookmarkCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { POPULAR_PALETTES } from "@/lib/palettesData";
import { useAuth } from "@/hooks/use-auth";
import { isLightColor } from "@/lib/colorUtils";

const TRENDING = POPULAR_PALETTES.slice().sort((a, b) => b.likes - a.likes).slice(0, 6);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem('signin_prompt_dismissed')) return;
    const t = setTimeout(() => setShowSignInPrompt(true), 2000);
    return () => clearTimeout(t);
  }, [user]);

  const dismissPrompt = () => {
    setShowSignInPrompt(false);
    sessionStorage.setItem('signin_prompt_dismissed', '1');
  };
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

  const SHOWCASE_STYLE = `
@keyframes showcase-slide-in-right {
  from { transform: translateX(108%); }
  to   { transform: translateX(0%); }
}
@keyframes showcase-slide-in-left {
  from { transform: translateX(-108%); }
  to   { transform: translateX(0%); }
}
@keyframes showcase-slide-out-left {
  from { transform: translateX(0%); }
  to   { transform: translateX(-108%); }
}
@keyframes showcase-slide-out-right {
  from { transform: translateX(0%); }
  to   { transform: translateX(108%); }
}
`;

  // Interactive hero palette showcase
  const HeroPaletteShowcase = () => {
    const [active, setActive] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');
    const [paused, setPaused] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const palettes = TRENDING.slice(0, 5);
    const n = palettes.length;

    const goTo = useCallback((next: number, dir: 'forward' | 'back' = 'forward') => {
      if (prev !== null || next === active) return;
      setDirection(dir);
      setPrev(active);
      setActive(next);
      setTimeout(() => setPrev(null), 500);
    }, [active, prev]);

    useEffect(() => {
      if (paused) return;
      const t = setInterval(() => goTo((active + 1) % n, 'forward'), 2800);
      return () => clearInterval(t);
    }, [paused, active, goTo, n]);

    const copyHex = (hex: string) => {
      navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    };

    const current = palettes[active];
    const inAnim = direction === 'forward' ? 'showcase-slide-in-right' : 'showcase-slide-in-left';
    const outAnim = direction === 'forward' ? 'showcase-slide-out-left' : 'showcase-slide-out-right';
    const slideStyle = { animationDuration: '0.46s', animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationFillMode: 'both' as const };

    const CardContent = ({ p, interactive }: { p: typeof palettes[0]; interactive: boolean }) => (
      <>
        <div className="flex h-48">
          {p.colors.map((c, ci) => (
            <div
              key={ci}
              className="flex-1 relative group/swatch"
              style={{ backgroundColor: c }}
              onClick={e => { e.stopPropagation(); if (interactive) copyHex(c); }}
            >
              {interactive && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 gap-1 opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200">
                  <span className={`text-[10px] font-mono font-semibold px-1 py-0.5 rounded ${isLightColor(c) ? 'text-black/70' : 'text-white/90'}`}>
                    {c.slice(1).toUpperCase()}
                  </span>
                  <span className={isLightColor(c) ? 'text-black/60' : 'text-white/70'}>
                    {copied === c ? <Check size={12} /> : <Copy size={12} />}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-gray-900/95 dark:bg-gray-950/95 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{p.name}</p>
            <p className="text-gray-400 text-xs">{p.colors.length} colors</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Heart size={12} className="text-pink-400" />{p.likes}
            </span>
            {interactive && (
              <button
                onClick={e => { e.stopPropagation(); window.location.href = '/explore'; }}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Use →
              </button>
            )}
          </div>
        </div>
      </>
    );

    return (
      <div
        className="relative w-full h-full flex flex-col justify-between select-none py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <style dangerouslySetInnerHTML={{ __html: SHOWCASE_STYLE }} />

        {/* Card area */}
        <div className="relative h-[260px]">

          {/* Slide viewport — clips outgoing/incoming cards */}
          <div className="absolute inset-x-0 overflow-hidden rounded-2xl" style={{ zIndex: 20, height: '100%' }}>
            {/* Exiting card */}
            {prev !== null && (
              <div
                key={`prev-${prev}`}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ ...slideStyle, animationName: outAnim, boxShadow: '0 20px 56px rgba(0,0,0,0.3)' }}
              >
                <CardContent p={palettes[prev]} interactive={false} />
              </div>
            )}
            {/* Entering card */}
            <div
              key={`active-${active}`}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 dark:border-white/8"
              style={{
                ...slideStyle,
                animationName: prev !== null ? inAnim : 'none',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <CardContent p={current} interactive={true} />
            </div>
          </div>
        </div>

        {/* Bottom: dots + hex strip */}
        <div>
          <div className="flex justify-center lg:justify-start gap-2 mb-4">
            {palettes.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i >= active ? 'forward' : 'back')}
                className={`rounded-full transition-all duration-300 ${i === active ? 'w-6 h-2 bg-violet-500' : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'}`}
              />
            ))}
          </div>

          <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
            {current?.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => copyHex(c)}
                title={`Copy ${c}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 shadow-md border border-white/15"
                style={{ backgroundColor: c, color: isLightColor(c) ? '#111' : '#fff' }}
              >
                {copied === c ? <Check size={11} /> : <Copy size={11} className="opacity-60" />}
                {c.slice(1).toUpperCase()}
              </button>
            ))}
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

      {/* Sign-in prompt */}
      {!user && (
        <div className={`fixed top-16 right-4 z-40 transition-all duration-500 ${showSignInPrompt ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="flex items-center gap-3 bg-gray-900 dark:bg-gray-800 text-white pl-4 pr-3 py-3 rounded-2xl shadow-2xl border border-white/10 max-w-sm sm:max-w-md">
            <BookmarkCheck size={20} className="text-violet-400 flex-shrink-0" />
            <p className="text-sm leading-snug">
              <span className="font-semibold">Sign in</span> to save unlimited palettes and access them anywhere.
            </p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Sign In
            </button>
            <button onClick={dismissPrompt} className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-stretch gap-10 mb-12">
          {/* Left: text + CTA */}
          <div className="flex-1 flex flex-col justify-between text-center lg:text-left py-2">
          <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
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

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Create the perfect palette or get inspired by thousands of beautiful color schemes.
          </p>
          </div>
          
          {/* CTA Buttons — sits at bottom of left col, mirrors hex strip on right */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start">
            {/* Primary CTA — deep indigo glass */}
            <button
              onClick={handleGetStarted}
              className="group relative overflow-hidden flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg text-white transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.15) inset, 0 8px 32px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.3) inset, 0 12px 48px rgba(139,92,246,0.65), 0 4px 16px rgba(0,0,0,0.3), 0 0 80px rgba(99,102,241,0.3)';
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #3b82f6 80%, #06b6d4 100%)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.15) inset, 0 8px 32px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.25)';
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)';
              }}
            >
              {/* glass sheen overlay */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              Start the generator!
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </button>

            {/* Secondary — dark charcoal, works in both light & dark mode */}
            <button
              onClick={handleExplorePalettes}
              className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]"
              style={{
                background: 'rgba(18, 20, 38, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.92)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 20px rgba(0,0,0,0.28)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(120deg, rgba(99,102,241,0.75) 0%, rgba(139,92,246,0.7) 35%, rgba(168,85,247,0.65) 65%, rgba(99,102,241,0.7) 100%)';
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(167,139,250,0.5)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.15) inset, 0 0 24px rgba(139,92,246,0.6), 0 0 48px rgba(99,102,241,0.35), 0 8px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(18, 20, 38, 0.88)';
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 20px rgba(0,0,0,0.28)';
              }}
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              Explore trending palettes
            </button>

            {user && (
              <button
                onClick={() => window.location.href = '/saved-palettes'}
                className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]"
                style={{
                  background: 'rgba(18, 20, 38, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(167,139,250,0.35)',
                  color: 'rgba(255,255,255,0.92)',
                  boxShadow: '0 4px 24px rgba(139,92,246,0.3), 0 1px 0 rgba(255,255,255,0.08) inset',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'linear-gradient(135deg, rgba(167,139,250,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(99,102,241,0.3) 100%)';
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(216,180,254,0.6)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 8px 40px rgba(167,139,250,0.4), 0 1px 0 rgba(255,255,255,0.15) inset';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(18, 20, 38, 0.88)';
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(167,139,250,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 4px 24px rgba(139,92,246,0.3), 0 1px 0 rgba(255,255,255,0.08) inset';
                }}
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                <BookMarked size={18} />
                My Saved Palettes
              </button>
            )}
          </div>

          </div>{/* end left col */}

          {/* Right: interactive palette showcase — mirrors left col structure */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <HeroPaletteShowcase />
          </div>
        </div>{/* end hero flex */}

        {/* Apps & Tools Showcase */}
        <section className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Color Palette Generator */}
            <div onClick={() => window.location.href = '/generator'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Palette Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Create beautiful color palettes with advanced algorithms and color theory.
              </p>
              <span className="text-blue-600 font-medium text-sm">Start creating →</span>
            </div>

            {/* Explore Palettes */}
            <div onClick={() => window.location.href = '/explore'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Explore Palettes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Discover, like, and share thousands of trending color palettes from the community.
              </p>
              <span className="text-violet-600 font-medium text-sm">Explore trending palettes →</span>
            </div>

            {/* Visualizer */}
            <div onClick={() => window.location.href = '/visualize'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Visualizer</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                See your color palettes in action with real-time mockups and previews.
              </p>
              <span className="text-green-600 font-medium text-sm">Visualize →</span>
            </div>

            {/* Image to Palette */}
            <div onClick={() => window.location.href = '/image-palette'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image to Palette</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Extract beautiful color palettes from any image you upload.
              </p>
              <span className="text-orange-600 font-medium text-sm">Extract colors →</span>
            </div>

            {/* Contrast Checker */}
            <div onClick={() => window.location.href = '/contrast-checker'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <SplitSquareHorizontal className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contrast Checker</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Check WCAG AA/AAA contrast ratios for accessible, readable design.
              </p>
              <span className="text-sky-600 font-medium text-sm">Check contrast →</span>
            </div>

            {/* Gradient Generator */}
            <div onClick={() => window.location.href = '/gradient-generator'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Gradient Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Build CSS gradients visually with precise stop controls and instant export.
              </p>
              <span className="text-pink-600 font-medium text-sm">Make gradient →</span>
            </div>

            {/* Color Picker */}
            <div onClick={() => window.location.href = '/color-picker'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Pipette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Color Picker</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Inspect any color and explore its shades, tints, tones, and formats.
              </p>
              <span className="text-teal-600 font-medium text-sm">Pick a color →</span>
            </div>

            {/* Korean Color Analysis */}
            <div onClick={() => window.location.href = '/korean-color-analysis'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Korean Color Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Discover your personal color season — Spring, Summer, Autumn or Winter — and find the colors that make you glow.
              </p>
              <span className="text-purple-600 font-medium text-sm">Try now →</span>
            </div>

            {/* Font Generator */}
            <div onClick={() => window.location.href = '/font-generator'} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Type className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Font Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Preview Google Fonts with custom sizes, weights, and colors. Export as CSS or SVG.
              </p>
              <span className="text-rose-600 font-medium text-sm">Generate fonts →</span>
            </div>

            {/* Saved Palettes — shown to logged-in users */}
            {user && (
              <div onClick={() => window.location.href = '/saved-palettes'} className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 p-6 rounded-2xl shadow-md hover:shadow-2xl border border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">My Saved Palettes</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View and manage all the palettes you've saved to your account.
                </p>
                <span className="text-violet-600 font-medium text-sm">View saved →</span>
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