import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, Heart, User, Star, Globe, Users, Sparkles, Share2 } from 'lucide-react';
import { Color } from '../types/Color';
import { getColorName } from '@/lib/colorUtils';
import { POPULAR_PALETTES } from '@/lib/palettesData';
import { supabase } from '@/lib/supabase';

interface BrowsePalettesProps {
  onSelectPalette: (colors: Color[]) => void;
  userId?: string;
}

interface PaletteItem {
  id: string;
  name: string;
  colors: string[];
  likes: number;
  source: 'static' | 'community' | 'saved';
  is_public?: boolean;
}

function hexToColor(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { hex, rgb: { r, g, b }, locked: false, name: getColorName(hex) };
}

const STATIC_PALETTES: PaletteItem[] = POPULAR_PALETTES.map(p => ({
  id: p.id,
  name: p.name,
  colors: p.colors,
  likes: p.likes,
  source: 'static',
}));

type Tab = 'all' | 'popular' | 'saved';

export default function BrowsePalettes({ onSelectPalette, userId }: BrowsePalettesProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const [communityPalettes, setCommunityPalettes] = useState<PaletteItem[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<PaletteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCount, setShowCount] = useState(16);

  // Fetch public community palettes on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('public_palettes')
          .select('id, name, colors, likes')
          .eq('is_public', true)
          .order('likes', { ascending: false })
          .limit(200);
        if (data) {
          setCommunityPalettes(
            data.map(p => ({
              id: String(p.id),
              name: p.name ?? 'Untitled',
              colors: Array.isArray(p.colors) ? p.colors : [],
              likes: p.likes ?? 0,
              source: 'community' as const,
            })).filter(p => p.colors.length >= 2)
          );
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  // Fetch user's own saved palettes when userId changes
  useEffect(() => {
    if (!userId) { setSavedPalettes([]); return; }
    (async () => {
      try {
        const { data } = await supabase
          .from('public_palettes')
          .select('id, name, colors, likes, is_public')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (data) {
          setSavedPalettes(
            data.map(p => ({
              id: String(p.id),
              name: p.name ?? 'Untitled',
              colors: Array.isArray(p.colors) ? p.colors : [],
              likes: p.likes ?? 0,
              source: 'saved' as const,
              is_public: p.is_public ?? false,
            })).filter(p => p.colors.length >= 2)
          );
        }
      } catch {}
    })();
  }, [userId]);

  const togglePublic = async (e: React.MouseEvent, palette: PaletteItem) => {
    e.stopPropagation();
    const newPublic = !palette.is_public;
    await supabase.from('public_palettes').update({ is_public: newPublic }).eq('id', palette.id);
    setSavedPalettes(prev => prev.map(p => p.id === palette.id ? { ...p, is_public: newPublic } : p));
  };

  // Merge community + static (deduplicate by id)
  const allPalettes = useMemo<PaletteItem[]>(() => {
    const communityIds = new Set(communityPalettes.map(p => p.id));
    return [
      ...communityPalettes,
      ...STATIC_PALETTES.filter(p => !communityIds.has(p.id)),
    ];
  }, [communityPalettes]);

  const displayPalettes = useMemo<PaletteItem[]>(() => {
    let list: PaletteItem[] =
      tab === 'saved'   ? savedPalettes :
      tab === 'popular' ? [...allPalettes].sort((a, b) => b.likes - a.likes) :
                          allPalettes;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [tab, allPalettes, savedPalettes, search]);

  const totalCount = allPalettes.length + (savedPalettes.length > 0 ? savedPalettes.length : 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'popular', label: 'Popular' },
    ...(userId ? [{ key: 'saved' as Tab, label: 'My Saved' }] : []),
  ];

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Browse Palettes</h2>
            <button
              onClick={() => window.location.href = '/explore'}
              className="p-1 rounded-full text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
              title="Explore all palettes"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {loading ? 'Loading…' : `${totalCount} palettes — click any to apply to generator`}
          </p>
        </div>
        <div className="sm:ml-auto relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search palettes…"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowCount(16); }}
            className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 px-6 gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setShowCount(16); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
            {t.key === 'saved' && savedPalettes.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300">
                {savedPalettes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-6">
        {tab === 'saved' && !userId && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 mb-3">Sign in to see your saved palettes.</p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-5 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        )}

        {tab === 'saved' && userId && !loading && savedPalettes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">
            You haven't saved any palettes yet. Generate a palette and click Save.
          </p>
        )}

        {/* Community nudge banner — My Saved tab only, when private palettes exist */}
        {tab === 'saved' && userId && savedPalettes.some(p => !p.is_public) && (
          <div className="mb-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-blue-600/10 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5">
                <Globe size={15} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-xs">Share your palettes with the community</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  Public palettes appear on the <span className="font-medium text-violet-600 dark:text-violet-400">Explore</span> page and improve color suggestions for everyone.
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><Users size={10} /> Discoverable by all</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><Sparkles size={10} /> Improves AI suggestions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {displayPalettes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {displayPalettes.slice(0, showCount).map(p => (
              <div
                key={p.id}
                onClick={() => onSelectPalette(p.colors.map(hexToColor))}
                className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
              >
                {/* Color strips */}
                <div className="flex h-14">
                  {p.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {/* Footer */}
                <div className="px-3 py-2 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{p.colors.length} colors</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                      {p.likes > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                          <Heart size={10} className="text-pink-400" />{p.likes}
                        </span>
                      )}
                      {p.source === 'saved' && <User size={11} className="text-violet-400" />}
                      {p.source === 'static' && p.likes >= 1500 && <Star size={11} className="text-amber-400" />}
                      <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                  {/* Make Public / Make Private — only in My Saved tab */}
                  {tab === 'saved' && p.source === 'saved' && (
                    <button
                      onClick={e => togglePublic(e, p)}
                      className={`mt-2 w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                        p.is_public
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400'
                      }`}
                    >
                      <Share2 size={9} />
                      {p.is_public ? 'Make Private' : 'Make Public'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {displayPalettes.length > showCount && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowCount(c => c + 16)}
              className="px-6 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
            >
              Show more ({displayPalettes.length - showCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
