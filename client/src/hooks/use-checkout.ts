import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePro, PRO_INTENT_KEY } from '@/hooks/use-pro';
import { rememberReturnPath } from '@/lib/postAuth';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window { Razorpay?: any }
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Load Razorpay Checkout on demand; there is no reason to ship it to every visitor. */
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

/**
 * Opens Razorpay Checkout for Pro. The Pricing page is the one place this is
 * used: every other Get Pro button leads there, and Pricing's button opens
 * the payment gateway.
 *
 * Signed out, it sends the visitor through sign-in and back to Pricing, where
 * the pending intent opens checkout on arrival.
 */
export function useCheckout() {
  const { user, session } = useAuth();
  const { refresh } = usePro();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const startCheckout = useCallback(async () => {
    if (!user) {
      try { sessionStorage.setItem(PRO_INTENT_KEY, '1'); } catch { /* private mode */ }
      rememberReturnPath('/pricing');
      window.location.href = '/auth';
      return;
    }

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

    setBusy(true);
    try {
      await loadCheckout();
      const order = await post('/api/create-order');

      if (order.alreadyPro) {
        await refresh();
        toast({ title: 'You already have Pro', description: 'Everything is unlocked.' });
        setBusy(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Coolors.in',
        description: 'Pro, lifetime access',
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
  }, [user, session, refresh, toast]);

  return { startCheckout, busy };
}
