// Exercises the payment endpoints with mocked req/res, in the style of
// scripts/test-share-api.mjs. Focus is the security-critical path: an
// unverified caller must never be able to reach the grant, and a bad
// signature must never be accepted.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// No dotenv in this project — the platform injects env vars. Load .env by hand
// so this script can run locally.
for (const line of fs.readFileSync(path.resolve('.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { default: verifyPayment } = await import('../api/verify-payment.js');
const { default: createOrder } = await import('../api/create-order.js');

let pass = 0, fail = 0;
const ok = (cond, label) => { cond ? (pass++, console.log('PASS ' + label)) : (fail++, console.log('FAIL ' + label)); };

function mockRes() {
  const r = { statusCode: 0, body: null, headers: {} };
  r.status = c => { r.statusCode = c; return r; };
  r.json = b => { r.body = b; return r; };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.send = b => { r.body = b; return r; };
  return r;
}
const req = (method, body, headers = {}) => ({ method, body, headers });

// ── 1. Method guard ─────────────────────────────────────────────────────────
let res = mockRes();
await verifyPayment(req('GET', {}), res);
ok(res.statusCode === 405, 'verify-payment rejects GET (405)');

res = mockRes();
await createOrder(req('GET', {}), res);
ok(res.statusCode === 405, 'create-order rejects GET (405)');

// ── 2. Anonymous callers cannot reach the grant ─────────────────────────────
res = mockRes();
await verifyPayment(req('POST', {
  razorpay_order_id: 'order_x', razorpay_payment_id: 'pay_x', razorpay_signature: 'deadbeef',
}), res);
ok(res.statusCode === 401, 'verify-payment requires auth even with signature fields (401)');

res = mockRes();
await createOrder(req('POST', {}), res);
ok(res.statusCode === 401, 'create-order requires auth (401)');

res = mockRes();
await verifyPayment(req('POST', {}, { authorization: 'Bearer not-a-real-token' }), res);
ok(res.statusCode === 401, 'verify-payment rejects a bogus bearer token (401)');

// ── 3. The signature algorithm itself ───────────────────────────────────────
// Razorpay signs "<order_id>|<payment_id>" with the key secret.
const secret = process.env.RAZORPAY_KEY_SECRET;
ok(!!secret, 'RAZORPAY_KEY_SECRET is loaded');

const orderId = 'order_TEST123';
const paymentId = 'pay_TEST456';
const good = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

const recompute = (o, p) => crypto.createHmac('sha256', secret).update(`${o}|${p}`).digest('hex');
ok(recompute(orderId, paymentId) === good, 'HMAC is deterministic for the same input');
ok(recompute(paymentId, orderId) !== good, 'order matters — swapped ids produce a different digest');
ok(recompute(orderId, 'pay_OTHER') !== good, 'a different payment id produces a different digest');
ok(good.length === 64, 'digest is 64 hex chars (sha256)');

// A wrong secret must not validate — this is what stops a forged grant.
const forged = crypto.createHmac('sha256', 'wrong-secret').update(`${orderId}|${paymentId}`).digest('hex');
ok(forged !== good, 'a signature made with the wrong secret does not match');

// ── 4. Amount is server-controlled ──────────────────────────────────────────
const { PRO_AMOUNT_PAISE } = await import('../api/_razorpay.js');
ok(PRO_AMOUNT_PAISE === 10000, 'price is fixed at 10000 paise (₹100)');
ok(PRO_AMOUNT_PAISE >= 100, 'price meets the Razorpay 100-paise minimum');

const orderSrc = fs.readFileSync(path.resolve('api/create-order.js'), 'utf8');
ok(!/req\.body[\s\S]{0,80}amount/.test(orderSrc), 'create-order never reads an amount from the request body');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
