import React, { useState } from 'react';
import { X, Check, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePro } from '@/hooks/use-pro';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window { Razorpay?: any }
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Load Razorpay Checkout on demand — no reason to ship it to every visitor. */
function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay Checkout')));
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Razorpay Checkout'));
    document.body.appendChild(s);
  });
}

const BENEFITS = [
  'Every palette on Explore, not just the first rows',
  'No advertisements, anywhere on the site',
  'Palette Visualizer — see colours in real UI mockups',
  'Image to Palette — extract colours from any photo',
  'Font & colour pairing simulator with exports',
  'Unlimited saved palettes',
];

export default function ProUpgradeModal({ open, onClose, reason }: {
  open: boolean;
  onClose: () => void;
  /** Optional line explaining what the user just tried to do. */
  reason?: string;
}) {
  const { user, session } = useAuth();
  const { refresh } = usePro();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const post = async (path: string, body?: unknown) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token ?? ''}`,
      },
      body: JSON.stringify(body ?? {}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
    return json;
  };

  const startCheckout = async () => {
    if (!user) { window.location.href = '/auth'; return; }
    setBusy(true);
    try {
      await loadCheckout();
      const order = await post('/api/create-order');

      if (order.alreadyPro) {
        await refresh();
        toast({ title: 'You already have Pro', description: 'Everything is unlocked.' });
        onClose();
        return;
      }

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Coolors',
        description: 'Pro — lifetime access',
        prefill: { email: user.email, name: user.name },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: () => {
            setBusy(false);
            toast({ title: 'Payment cancelled', description: 'Nothing was charged.' });
          },
        },
        handler: async (resp: any) => {
          try {
            await post('/api/verify-payment', {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            await refresh();
            toast({ title: 'Welcome to Pro', description: 'Every feature is now unlocked.' });
            onClose();
          } catch (err: any) {
            toast({
              title: 'Could not activate Pro',
              description: err?.message ?? 'Please contact support with your payment id.',
              variant: 'destructive',
            });
          } finally {
            setBusy(false);
          }
        },
      });

      rzp.on('payment.failed', (e: any) => {
        setBusy(false);
        toast({
          title: 'Payment failed',
          description: e?.error?.description ?? 'Your bank declined the payment.',
          variant: 'destructive',
        });
      });

      rzp.open();
    } catch (err: any) {
      setBusy(false);
      toast({ title: 'Checkout failed', description: err?.message ?? 'Please try again.', variant: 'destructive' });
    }
  };

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
          <span className="text-3xl font-bold text-gray-900 dark:text-white">₹100</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">once — lifetime access</span>
        </div>

        <ul className="space-y-2 mb-5">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Check size={15} className="text-green-500 mt-0.5 flex-shrink-0" />{b}
            </li>
          ))}
        </ul>

        <button
          onClick={startCheckout}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          {busy ? <><Loader2 size={16} className="animate-spin" />Opening checkout…</>
                : user ? 'Get lifetime access' : 'Sign in to continue'}
        </button>

        <p className="mt-3 text-[11px] text-gray-400 text-center">
          One payment, no renewals. Secured by Razorpay.
        </p>
      </div>
    </div>
  );
}
