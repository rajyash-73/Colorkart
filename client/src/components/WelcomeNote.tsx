import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePro, PRO_PRICE_LABEL } from '@/hooks/use-pro';

/**
 * A one-time note from the site's creator, shown to free accounts once per
 * session.
 *
 * sessionStorage rather than localStorage: "once per session" is the brief,
 * and it means the note comes back for a returning visitor without ever
 * nagging someone twice in the same sitting.
 */
const SEEN_KEY = 'coolors_intro_seen';

/** The landing page runs its own Pro prompt on a 2s timer. Two upsells inside
 *  five seconds is nagging, so showing this note stands the other one down for
 *  the session. */
const LANDING_PROMPT_KEY = 'signin_prompt_dismissed';

export default function WelcomeNote() {
  const { isPro, loading } = usePro();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Wait for entitlement: a paying customer should never be pitched.
    if (loading || isPro) return;
    // Never interrupt someone mid-sign-in.
    if (window.location.pathname.startsWith('/auth')) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      // Marked on show, not on dismiss, so navigating away does not bring it back.
      sessionStorage.setItem(SEEN_KEY, '1');
      sessionStorage.setItem(LANDING_PROMPT_KEY, '1');
    } catch {
      return; // private mode — skip rather than show it on every navigation
    }
    setOpen(true);
  }, [isPro, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="A note from the creator"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hey there!</h2>

        <div className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p>
            I'm Yash, the creator of coolors.in. I built this site to democratize
            color palette generation.
          </p>
          <p>
            You can generate palettes using several color theory modes, or start from
            one the community has shared. The Explore page holds an ever-growing
            library — curated palettes alongside ones shared by other users — and
            every one of them is free to use in your own projects.
          </p>
          <p>
            To cover what the infrastructure costs to run, I've had to introduce a
            one-time fee of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{PRO_PRICE_LABEL}</span>.
            One payment, no subscription: it removes ads for good and unlocks
            unlimited saves, the visualizer, image-to-palette and font pairing.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              Generating palettes stays free for everyone.
            </span>
          </p>
          <p>
            Any questions, reach me at{' '}
            <a
              href="mailto:coolors.in@gmail.com"
              className="text-violet-600 dark:text-violet-400 hover:underline"
            >
              coolors.in@gmail.com
            </a>
            .
          </p>
          <p className="text-gray-900 dark:text-white font-medium">Happy generating!</p>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold transition-colors"
        >
          Let's Go
        </button>
      </div>
    </div>
  );
}
