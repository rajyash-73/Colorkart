import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

/** Free accounts may save this many palettes. Pro is unlimited. */
export const FREE_SAVE_LIMIT = 5;

/** Cached so a returning Pro user doesn't get a flash of ads or locked panels
 *  while the pro_users lookup is in flight. Advisory only — the database is
 *  what actually decides, this just avoids a visible flicker. */
const PRO_HINT_KEY = 'coolors_pro_hint';

const readHint = (userId?: string): boolean => {
  if (!userId) return false;
  try { return localStorage.getItem(PRO_HINT_KEY) === userId; } catch { return false; }
};
const writeHint = (userId: string | undefined, isPro: boolean) => {
  try {
    if (isPro && userId) localStorage.setItem(PRO_HINT_KEY, userId);
    else localStorage.removeItem(PRO_HINT_KEY);
  } catch { /* private mode */ }
};

type ProContextType = {
  isPro: boolean;
  /** True until the first real lookup resolves. */
  loading: boolean;
  /** Re-read entitlement — call after a successful purchase. */
  refresh: () => Promise<void>;
  /** How many palettes this user has saved, for the free-tier cap. */
  savedCount: number;
  refreshSavedCount: () => Promise<void>;
  /** False once a free user is at the cap. Pro is always true. */
  canSaveMore: boolean;
};

const ProContext = createContext<ProContextType | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) { setIsPro(false); setLoading(false); writeHint(undefined, false); return; }
    // Show the cached answer immediately, then confirm against the database.
    setIsPro(readHint(user.id));
    try {
      // RLS limits this to the caller's own row, so no filter can leak another
      // account's entitlement.
      const { data, error } = await supabase
        .from('pro_users').select('user_id').eq('user_id', user.id).maybeSingle();
      const pro = !error && !!data;
      setIsPro(pro);
      writeHint(user.id, pro);
    } catch {
      setIsPro(readHint(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshSavedCount = useCallback(async () => {
    if (!user) { setSavedCount(0); return; }
    try {
      const { count } = await supabase
        .from('public_palettes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setSavedCount(count ?? 0);
    } catch { /* leave the last known count */ }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { refreshSavedCount(); }, [refreshSavedCount]);

  const canSaveMore = isPro || savedCount < FREE_SAVE_LIMIT;

  return (
    <ProContext.Provider value={{ isPro, loading, refresh, savedCount, refreshSavedCount, canSaveMore }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within a ProProvider');
  return ctx;
}
