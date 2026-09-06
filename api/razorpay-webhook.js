// POST /api/razorpay-webhook
//
// Razorpay calls this directly, server to server. It is the safety net for the
// browser-side verify step: if the customer's tab closes, their network drops,
// or Supabase blips between paying and /api/verify-payment running, they would
// otherwise be charged and never receive Pro. This grants it regardless.
//
// Unlike verify-payment there is no user session here, so the account is
// resolved from the order's notes.user_id, which create-order stamps on.
import crypto from 'crypto';
import { getServiceClient, fail } from './_supabase-admin.js';

// Razorpay signs the exact bytes it sent. Re-serialising a parsed object would
// change key order or spacing and the HMAC would never match, so the raw body
// has to be read off the stream before anything parses it.
async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  const chunks = [];
  try {
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
  } catch {
    return null;
  }
  return chunks.length ? Buffer.concat(chunks).toString('utf8') : null;
}

function signaturesMatch(expectedHex, receivedHex) {
  if (typeof receivedHex !== 'string') return false;
  const a = Buffer.from(expectedHex, 'utf8');
  const b = Buffer.from(receivedHex, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return fail(res, 500, 'Webhook secret is not configured');

  const raw = await readRawBody(req);
  if (!raw) return fail(res, 400, 'Empty body');

  const received = req.headers['x-razorpay-signature'];
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (!signaturesMatch(expected, received)) {
    // Anyone can POST here; only Razorpay can sign correctly.
    return fail(res, 400, 'Invalid webhook signature');
  }

  let event;
  try { event = JSON.parse(raw); } catch { return fail(res, 400, 'Malformed JSON'); }

  // Only a captured payment means money actually moved.
  if (event?.event !== 'payment.captured') {
    return res.status(200).json({ ignored: event?.event ?? 'unknown' });
  }

  const payment = event?.payload?.payment?.entity ?? {};
  const userId = payment?.notes?.user_id;
  if (!userId) {
    // Nothing to grant against. 200 so Razorpay stops retrying a payment we
    // can never attribute — retrying would not change the outcome.
    return res.status(200).json({ ignored: 'no user_id in notes' });
  }

  try {
    // Same upsert verify-payment uses, so whichever path arrives first wins and
    // the second is a harmless no-op rather than a duplicate or an error.
    const { error } = await getServiceClient()
      .from('pro_users')
      .upsert({
        user_id: userId,
        razorpay_order_id: payment.order_id ?? null,
        razorpay_payment_id: payment.id ?? null,
        amount: payment.amount ?? 10000,
        currency: payment.currency ?? 'INR',
      }, { onConflict: 'user_id' });
    if (error) throw new Error(error.message);
  } catch (err) {
    // 500 makes Razorpay retry, which is what we want for a transient failure.
    return fail(res, 500, `Could not grant Pro: ${err.message}`);
  }

  return res.status(200).json({ granted: true, user_id: userId });
}
