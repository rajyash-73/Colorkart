import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { PRO_PRICE_LABEL } from '@/hooks/use-pro';

const BENEFITS = [
  'Every palette on Explore, not just the first rows',
  'No ads, anywhere on the site',
  'Palette Visualizer: see your colors in real UI mockups',
  'Image to Palette: extract colors from any photo',
  'Font and color pairing simulator with exports',
  'Unlimited saved palettes',
];

const [PRICE_INR, ...rest] = PRO_PRICE_LABEL.split(' ');
const PRICE_USD = rest.join(' ');

/**
 * Explains Pro where a free account runs into a limit, such as the
 * five-palette save cap. Like every Get Pro button, its button leads to the
 * Pricing page; the payment gateway itself only opens from there.
 */
export default function ProUpgradeModal({ open, onClose, reason }: {
  open: boolean;
  onClose: () => void;
  /** Optional line explaining what the user just tried to do. */
  reason?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-violet-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Coolors Pro</h2>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {reason && <p className="text-sm text-violet-600 dark:text-violet-400 mb-3">{reason}</p>}

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{PRICE_INR}</span>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">{PRICE_USD}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">once, lifetime access</span>
        </div>

        <ul className="space-y-2 mb-5">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Check size={15} className="text-green-500 mt-0.5 flex-shrink-0" />{b}
            </li>
          ))}
        </ul>

        {/* A full load, not in-app navigation: Pricing is ad-free, and ad
            scripts already running here cannot be removed. */}
        <button
          onClick={() => { window.location.href = '/pricing'; }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#db1a72] hover:bg-[#c2155f] active:scale-[0.98] px-5 py-3 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db1a72] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          Get Pro
        </button>

        <p className="mt-3 text-[11px] text-gray-400 text-center">
          One payment, no renewals.
        </p>
      </div>
    </div>
  );
}
