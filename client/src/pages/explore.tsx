import React, { useState, useEffect, useCallback } from 'react';
import { Search, Heart, Share2, Download, Copy, ArrowRight, Plus, X, Palette, Filter } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { supabase, SupabasePalette } from '@/lib/supabase';
import { usePalette } from '@/contexts/PaletteContext';
import { getColorName, isLightColor } from '@/lib/colorUtils';
import { POPULAR_PALETTES } from '@/lib/palettesData';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

// Build fallback palettes — assign staggered dates so "Newest" sort works
const BASE_DATE = Date.now();
const STATIC_PALETTES: SupabasePalette[] = POPULAR_PALETTES.map((p, i) => ({
  id: p.id,
  user_id: null,
  name: p.name,
  colors: p.colors,
  is_public: true,
  likes: p.likes,
  // Each palette is 1 day older than the previous so newest order = array order
  created_at: new Date(BASE_DATE - i * 86_400_000).toISOString(),
}));

const COLOR_TAGS = ['Red','Orange','Yellow','Green','Blue','Violet','Pink','Brown','Black','White','Gray','Turquoise'];
const STYLE_TAGS = ['Warm','Cold','Bright','Dark','Pastel','Vintage','Monochromatic','Gradient','Rainbow'];
const TOPIC_TAGS = ['Christmas','Halloween','Pride','Sunset','Spring','Winter','Summer','Autumn','Gold','Wedding','Party','Space','Nature','City','Food','Happy'];

function PaletteCard({
  palette,
  onApply,
  onLike,
  likedIds,
}: {
  palette: SupabasePalette;
  onApply: (p: SupabasePalette) => void;
  onLike: (id: string) => void;
  likedIds: Set<string>;
}) {
  const { toast } = useToast();
  const liked = likedIds.has(palette.id);

  const copyCSS = () => {
    const vars = palette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
    navigator.clipboard.writeText(`:root {\n${vars}\n}`).catch(() => {});
    toast({ title: 'CSS copied!' });
  };

  const share = async () => {
    const url = `${window.location.origin}/explore?palette=${palette.id}`;
    if (navigator.share) {
      await navigator.share({ title: palette.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      toast({ title: 'Link copied!' });
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200">
      <div className="flex h-24 relative">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 relative group/swatch cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
            onClick={() => { navigator.clipboard.writeText(color).catch(() => {}); toast({ title: `Copied ${color}` }); }}
          >
            <span className={`absolute inset-0 flex items-end justify-center pb-1 text-[9px] font-mono opacity-0 group-hover/swatch:opacity-100 transition-opacity ${isLightColor(color) ? 'text-black/70' : 'text-white/80'}`}>
              {color.slice(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{palette.name}</h3>
          {palette.user_name && <span className="text-xs text-gray-400 truncate ml-2">by {palette.user_name}</span>}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onLike(palette.id)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
          >
            <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
            <span>{palette.likes}</span>
          </button>
          <button onClick={copyCSS} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Copy size={12} />CSS
          </button>
          <button onClick={share} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <Share2 size={12} />Share
          </button>
          <button
            onClick={() => onApply(palette)}
            className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium"
          >
            <ArrowRight size={12} />Use
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const { user } = useAuth();
  const { setPalette } = usePalette();
  const { toast } = useToast();
  const [palettes, setPalettes] = useState<SupabasePalette[]>(STATIC_PALETTES);
  const [filtered, setFiltered] = useState<SupabasePalette[]>(STATIC_PALETTES);
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');

  useEffect(() => {
    const loadPalettes = async () => {
      try {
        const { data, error } = await supabase
          .from('public_palettes')
          .select('*')
          .eq('is_public', true)
          .order(sortBy === 'popular' ? 'likes' : 'created_at', { ascending: false })
          .limit(100);
        if (!error && data && data.length > 0) {
          setPalettes([...data, ...STATIC_PALETTES]);
        }
      } catch {
        // use static palettes
      } finally {
        setLoading(false);
      }
    };
    loadPalettes();
  }, [sortBy]);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedPalettes') || '[]');
    setLikedIds(new Set(liked));
    // Restore persisted like counts for static palettes
    const staticLikes: Record<string, number> = JSON.parse(localStorage.getItem('staticLikes') || '{}');
    if (Object.keys(staticLikes).length > 0) {
      setPalettes(prev => prev.map(p =>
        staticLikes[p.id] !== undefined ? { ...p, likes: staticLikes[p.id] } : p
      ));
    }
  }, []);

  useEffect(() => {
    let result = [...palettes];

    // Sort by selected mode
    if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.colors.some(c => c.toLowerCase().includes(q))
      );
    }
    if (activeTags.length > 0) {
      const tagMap = new Map(POPULAR_PALETTES.map(p => [p.id, p.tags]));
      result = result.filter(p => {
        const tags = tagMap.get(p.id) ?? [];
        return activeTags.some(tag => tags.includes(tag));
      });
    }
    setFiltered(result);
  }, [search, activeTags, palettes, sortBy]);

  const handleApply = (palette: SupabasePalette) => {
    const colors = palette.colors.map(hex => ({
      hex,
      rgb: { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) },
      locked: false,
      name: getColorName(hex),
    }));
    // Persist palette to localStorage so the generator picks it up after the page reload
    localStorage.setItem('pendingPalette', JSON.stringify(colors));
    setPalette(colors);
    window.location.href = '/generator';
  };

  const handleLike = async (id: string) => {
    const newLiked = new Set(likedIds);
    const wasLiked = newLiked.has(id);
    if (wasLiked) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedIds(newLiked);
    localStorage.setItem('likedPalettes', JSON.stringify(Array.from(newLiked)));

    const delta = wasLiked ? -1 : 1;

    // Update local like count immediately (optimistic) — never go below 0
    setPalettes(prev => prev.map(p =>
      p.id === id ? { ...p, likes: Math.max(0, p.likes + delta) } : p
    ));

    // Persist in localStorage for static palettes so counts survive reload
    const staticLikes: Record<string, number> = JSON.parse(localStorage.getItem('staticLikes') || '{}');
    const current = staticLikes[id] ?? STATIC_PALETTES.find(p => p.id === id)?.likes ?? 0;
    staticLikes[id] = Math.max(0, current + delta);
    localStorage.setItem('staticLikes', JSON.stringify(staticLikes));

    // Attempt DB update for user-submitted palettes (silently skip static ones)
    try {
      const target = palettes.find(p => p.id === id);
      if (target && !id.startsWith('static-')) {
        await supabase.from('public_palettes')
          .update({ likes: Math.max(0, target.likes + delta) })
          .eq('id', id);
      }
    } catch {}
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Explore Color Palettes | Coolors"
        description="Browse thousands of curated color palettes. Discover trending combinations, save favorites and get inspired. Free palette library."
        keywords="color palette ideas, explore color palettes, colour palette ideas, color scheme examples, color inspiration, popular color combinations, color scheme library, colour combinations, design color inspiration, palette collection"
        canonicalPath="/explore"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Explore Color Palettes",
          "url": "https://www.coolors.in/explore",
          "description": "Browse curated color palettes for your next design project.",
          "provider": { "@type": "Organization", "name": "Coolors", "url": "https://www.coolors.in" },
          "numberOfItems": POPULAR_PALETTES.length,
          "itemListElement": POPULAR_PALETTES.slice(0, 10).map((p: { name: string }, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": p.name,
            "url": "https://www.coolors.in/explore"
          }))
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Hero */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Palettes</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-3">Discover, save, and share beautiful color combinations</p>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-sm leading-relaxed mb-6">
            Browse hand-curated color palettes — from warm earth tones to cool modern monochromes.
            Click any palette to apply it to the generator instantly. Filter by color, style or mood.
            Free to use, sign-up to save unlimited color palettes.
          </p>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search with colors, topics, styles or hex values..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors font-medium text-sm ${showFilter ? 'bg-violet-500 text-white border-violet-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-violet-300'}`}
            >
              <Filter size={16} />Filter
            </button>
          </div>

          {/* Filter panel */}
          {showFilter && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Colors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_TAGS.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${activeTags.includes(tag) ? 'bg-violet-500 text-white border-violet-500' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-violet-300'}`}
                      >{tag}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Styles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_TAGS.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${activeTags.includes(tag) ? 'bg-violet-500 text-white border-violet-500' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-violet-300'}`}
                      >{tag}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPIC_TAGS.slice(0, 8).map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${activeTags.includes(tag) ? 'bg-violet-500 text-white border-violet-500' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-violet-300'}`}
                      >{tag}</button>
                    ))}
                  </div>
                </div>
              </div>
              {activeTags.length > 0 && (
                <button onClick={() => setActiveTags([])} className="mt-3 text-xs text-red-500 hover:underline flex items-center gap-1">
                  <X size={12} />Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Active tags */}
          {activeTags.length > 0 && !showFilter && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeTags.map(tag => (
                <span key={tag} onClick={() => toggleTag(tag)} className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium cursor-pointer hover:bg-violet-200">
                  {tag}<X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort + count */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} palettes</p>
        <div className="flex items-center gap-2">
          <a href="/generator" className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium">
            <Plus size={14} />Generate a palette
          </a>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button onClick={() => setSortBy('popular')} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === 'popular' ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Popular</button>
            <button onClick={() => setSortBy('newest')} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === 'newest' ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Newest</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Palette size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No palettes found</p>
            <p className="text-sm mt-1">Try different search terms or clear filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(palette => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                onApply={handleApply}
                onLike={handleLike}
                likedIds={likedIds}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
