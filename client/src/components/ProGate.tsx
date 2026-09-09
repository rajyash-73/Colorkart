import React, { useEffect, useRef, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { usePro, PRO_PRICE_LABEL, PRO_INTENT_KEY } from '@/hooks/use-pro';
import { rememberReturnPath } from '@/lib/postAuth';
import { useAuth } from '@/hooks/use-auth';
import ProUpgradeModal from '@/components/ProUpgradeModal';

/**
 * Wraps a Pro-only feature. Renders `children` for Pro users, otherwise a
 * locked panel with an upgrade prompt.
 *
 * With `preview`, the feature is still rendered behind the panel -- blurred,
 * inert and cropped -- so the visitor can see what they would be buying
 * instead of an empty box. Only worth it where the page renders something
 * recognisable unprompted; a gate over an empty file-picker shows nothing.
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
  preview = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  /** Show the feature blurred behind the panel rather than hiding it. */
  preview?: boolean;
}) {
  const { isPro, loading } = usePro();
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // The button offers Pro, so signing in cannot be where it ends. Flagging
  // intent means checkout reopens once they land back signed in.
  const startUpgrade = () => {
    if (user) { setShowUpgrade(true); return; }
    sessionStorage.setItem(PRO_INTENT_KEY, '1');
    rememberReturnPath();
    window.location.href = '/auth';
  };

  // pointer-events-none stops the mouse but not the keyboard, and a blurred
  // teaser full of tab stops is a trap for anyone navigating that way. `inert`
  // takes the whole subtree out of the tab order and the accessibility tree.
  // Set imperatively because React 18 does not type it as a JSX prop.
  useEffect(() => {
    const el = previewRef.current;
    if (el) el.setAttribute('inert', '');
  });

  // Don't flash the paywall while entitlement is still resolving.
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (isPro) return <>{children}</>;

  const panel = (
    <>
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <Lock size={20} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>

        <button
          onClick={startUpgrade}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700 active:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          <Sparkles size={15} />
          {user ? `Unlock with Pro — ${PRO_PRICE_LABEL}` : 'Get Pro to unlock'}
        </button>
        <p className="mt-3 text-[11px] text-gray-400">One payment, lifetime access.</p>
      </div>

      <ProUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} reason={title} />
    </>
  );

  if (!preview) {
    return <div className="flex-1 flex items-center justify-center px-4 py-16">{panel}</div>;
  }

  return (
    <div className="relative flex-1">
      {/* Cropped so the page is not followed by screenfuls of blurred
          scrolling, and so the panel stays in view without hunting for it. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none select-none max-h-[78vh] overflow-hidden blur-[5px] opacity-60"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        {panel}
      </div>
    </div>
  );
}
