import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { usePro, PRO_PRICE_LABEL } from '@/hooks/use-pro';
import { useAuth } from '@/hooks/use-auth';
import ProUpgradeModal from '@/components/ProUpgradeModal';

/**
 * Wraps a Pro-only feature. Renders `children` for Pro users, otherwise a
 * locked panel with an upgrade prompt.
 *
 * This is a UX boundary, not a security one — the gated tools are client-side
 * code that ships in the bundle regardless. The things that genuinely must not
 * be forgeable (Pro status itself, and the free save cap) are enforced by
 * Postgres RLS, not here.
 */
export default function ProGate({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { isPro, loading } = usePro();
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Don't flash the paywall while entitlement is still resolving.
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (isPro) return <>{children}</>;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <Lock size={20} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>

        <button
          onClick={() => (user ? setShowUpgrade(true) : (window.location.href = '/auth'))}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700 active:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          <Sparkles size={15} />
          {user ? `Unlock with Pro — ${PRO_PRICE_LABEL}` : 'Sign in to unlock'}
        </button>
        <p className="mt-3 text-[11px] text-gray-400">One payment, lifetime access.</p>
      </div>

      <ProUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} reason={title} />
    </div>
  );
}
