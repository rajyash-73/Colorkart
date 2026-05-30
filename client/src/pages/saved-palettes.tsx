import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2, ChevronLeft, Plus, Share2, Copy, Check, Globe, Users, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getColorName } from "@/lib/colorUtils";
import SEOHead from '@/components/SEOHead';
import Footer from "@/components/Footer";

type SavedPalette = {
  id: string;
  name: string;
  colors: string[];
  created_at: string;
  is_public: boolean;
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

export default function SavedPalettes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadPalettes = async () => {
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from('public_palettes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch error:', error);
        toast({ title: 'Could not load palettes', description: error.message, variant: 'destructive' });
      } else {
        setPalettes(data ?? []);
      }
      setLoading(false);
    };
    loadPalettes();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this palette?')) return;
    setDeletingId(id);
    try {
      await supabase.from('public_palettes').delete().eq('id', id);
      setPalettes(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Palette deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleApply = (palette: SavedPalette) => {
    const colors = palette.colors.map(hex => ({
      hex,
      rgb: { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) },
      locked: false,
      name: getColorName(hex),
    }));
    localStorage.setItem('pendingPalette', JSON.stringify(colors));
    window.location.href = '/generator';
  };

  const togglePublic = async (palette: SavedPalette) => {
    const newPublic = !palette.is_public;
    await supabase.from('public_palettes').update({ is_public: newPublic }).eq('id', palette.id);
    setPalettes(prev => prev.map(p => p.id === palette.id ? { ...p, is_public: newPublic } : p));
    toast({ title: newPublic ? 'Shared publicly on Explore!' : 'Set to private' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Sign in to view your palettes</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create an account to save and manage your color palettes</p>
          <a href="/auth" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEOHead
        title="My Saved Palettes — Manage Your Color Collections"
        description="View and manage your saved color palettes. Share palettes publicly, use them in the generator, or keep them private. Sign in to access your palette library."
        keywords="saved color palettes, my palettes, color palette library, saved color schemes, palette management"
        canonicalPath="/saved-palettes"
        noIndex={true}
      />

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 text-sm">
          <ChevronLeft size={16} />Coolors
        </a>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <h1 className="font-bold text-gray-800 dark:text-white">My Palettes</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Palettes</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Signed in as {user.email}</p>
          </div>
          <a href="/generator" className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors text-sm">
            <Plus size={16} />New Palette
          </a>
        </div>

        {/* Community nudge banner */}
        {palettes.some(p => !p.is_public) && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-blue-600/10 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5">
                <Globe size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">Share your palettes with the community</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  Making a palette public adds it to the <span className="font-medium text-violet-600 dark:text-violet-400">Explore</span> page and enriches the color pool for every user's generator — your taste shapes what the world creates.
                </p>
                <div className="flex items-center gap-4 mt-2.5">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500"><Users size={11} /> Discoverable by all users</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500"><Sparkles size={11} /> Improves AI color suggestions</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-right shrink-0">Use <span className="font-medium text-gray-600 dark:text-gray-300">Make Public</span> on any palette below ↓</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-violet-500" size={32} /></div>
        ) : palettes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 dark:text-gray-500 mb-4">No saved palettes yet</p>
            <a href="/generator" className="text-violet-600 hover:underline text-sm font-medium">Create your first palette →</a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {palettes.map(palette => (
              <div key={palette.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex h-20">
                  {palette.colors.map((c, i) => (
                    <div key={i} className="flex-1 cursor-pointer group relative" style={{ backgroundColor: c }}
                      onClick={() => { navigator.clipboard.writeText(c).catch(() => {}); toast({ title: `Copied ${c}` }); }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                        {c.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{palette.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(palette.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${palette.is_public ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      {palette.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleApply(palette)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-violet-500 text-white rounded-lg hover:bg-violet-600 font-medium transition-colors">
                      Use in Generator
                    </button>
                    <button onClick={() => togglePublic(palette)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-green-400 transition-colors">
                      <Share2 size={11} />{palette.is_public ? 'Make Private' : 'Make Public'}
                    </button>
                    <button
                      onClick={() => handleDelete(palette.id)}
                      disabled={deletingId === palette.id}
                      className="ml-auto p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                    >
                      {deletingId === palette.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
