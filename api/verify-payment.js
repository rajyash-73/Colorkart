// POST /api/verify-payment
// Verifies a Razorpay payment signature and, only on a match, grants Pro.
import crypto from 'crypto';
import { getKeySecret, PRO_AMOUNT_PAISE, PRO_CURRENCY } from './_razorpay.js';
import { getUserFromRequest, getServiceClient, fail } from './_supabase-admin.js';

/** Constant-time compare of two hex digests. */
function signaturesMatch(expectedHex, receivedHex) {
  if (typeof receivedHex !== 'string') return false;
  const a = Buffer.from(expectedHex, 'utf8');
  const b = Buffer.from(receivedHex, 'utf8');
  // timingSafeEqual throws on length mismatch, so check that first — the length
  // itself is not a secret.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');

  let user;
  try {
    user = await getUserFromRequest(req);
  } catch (err) {
    return fail(res, 401, err.message || 'Not signed in');
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return fail(res, 400, 'Missing payment fields');
  }

  const secret = getKeySecret();
  if (!secret) return fail(res, 500, 'Razorpay is not configured');

  // Razorpay signs "<order_id>|<payment_id>" with the key secret.
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (!signaturesMatch(expected, razorpay_signature)) {
    // Do NOT grant anything. A forged or replayed signature stops here.
    return fail(res, 400, 'Payment signature verification failed');
  }

  // Signature is good — this is the only path that writes an entitlement.
  try {
    const { error } = await getServiceClient()
      .from('pro_users')
      .upsert({
        user_id: user.id,
        razorpay_order_id,
        razorpay_payment_id,
        amount: PRO_AMOUNT_PAISE,
        currency: PRO_CURRENCY,
      }, { onConflict: 'user_id' });
    if (error) throw new Error(error.message);
  } catch (err) {
    // The payment is real but we failed to record it. Say so plainly rather
    // than reporting success — the user needs to know to contact support.
    return fail(res, 500, `Payment verified but activation failed: ${err.message}`);
  }

  return res.status(200).json({ success: true, pro: true });
}
