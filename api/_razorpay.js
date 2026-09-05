// Razorpay configuration shared by the payment endpoints.
// Files prefixed with "_" in /api are shared modules, not deployed as functions.
import Razorpay from 'razorpay';

/** Lifetime Pro, in paise. Fixed here so the amount can never come from the client. */
export const PRO_AMOUNT_PAISE = 10000; // ₹100
export const PRO_CURRENCY = 'INR';

export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error('Razorpay keys are not configured');
  return new Razorpay({ key_id, key_secret });
}

export const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET;
