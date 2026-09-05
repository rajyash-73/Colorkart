// POST /api/create-order
// Creates a Razorpay order for the lifetime Pro purchase.
// Requires a Supabase bearer token: the order is receipted against that account.
import { getRazorpay, PRO_AMOUNT_PAISE, PRO_CURRENCY } from './_razorpay.js';
import { getUserFromRequest, getServiceClient, fail } from './_supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');

  let user;
  try {
    user = await getUserFromRequest(req);
  } catch (err) {
    return fail(res, 401, err.message || 'Not signed in');
  }

  // Already paid — don't let someone buy twice.
  try {
    const { data } = await getServiceClient()
      .from('pro_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (data) return res.status(200).json({ alreadyPro: true });
  } catch {
    // If the lookup fails, fall through and create the order; verify-payment
    // upserts, so a duplicate purchase still converges on one row.
  }

  // The amount is a server-side constant. It is never read from the request,
  // so a tampered client cannot buy lifetime access for 1 paisa.
  const amount = PRO_AMOUNT_PAISE;
  if (!Number.isInteger(amount) || amount < 100) {
    return fail(res, 500, 'Configured amount is invalid');
  }

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: PRO_CURRENCY,
      // Razorpay caps receipt at 40 chars.
      receipt: `pro_${user.id.replace(/-/g, '').slice(0, 24)}_${Date.now().toString(36)}`,
      notes: { user_id: user.id, product: 'coolors_pro_lifetime' },
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const msg = err?.error?.description || err?.message || 'Razorpay order creation failed';
    // 401 from Razorpay means our own keys are wrong — surface it as a server
    // fault, not as the caller's problem.
    return fail(res, 500, msg);
  }
}
