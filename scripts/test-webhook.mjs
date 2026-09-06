// Exercises /api/razorpay-webhook with mocked req/res.
// The endpoint is publicly reachable, so the signature check is the only thing
// standing between a stranger's POST and a free Pro grant. Test it hard.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

for (const line of fs.readFileSync(path.resolve('.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { default: webhook } = await import('../api/razorpay-webhook.js');
const SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

let pass = 0, fail = 0;
const ok = (c, l) => { c ? (pass++, console.log('PASS ' + l)) : (fail++, console.log('FAIL ' + l)); };

function mockRes() {
  const r = { statusCode: 0, body: null };
  r.status = c => { r.statusCode = c; return r; };
  r.json = b => { r.body = b; return r; };
  r.setHeader = () => {};
  r.send = b => { r.body = b; return r; };
  return r;
}
// Body arrives as a stream, exactly as Vercel delivers it.
function mockReq(method, rawBody, signature) {
  const req = Readable.from([Buffer.from(rawBody, 'utf8')]);
  req.method = method;
  req.headers = signature === undefined ? {} : { 'x-razorpay-signature': signature };
  return req;
}
const sign = raw => crypto.createHmac('sha256', SECRET).update(raw).digest('hex');

const captured = (userId = 'test-user-uuid') => JSON.stringify({
  event: 'payment.captured',
  payload: { payment: { entity: {
    id: 'pay_TEST', order_id: 'order_TEST', amount: 10000, currency: 'INR',
    notes: { user_id: userId, product: 'coolors_pro_lifetime' },
  } } },
});

ok(!!SECRET, 'RAZORPAY_WEBHOOK_SECRET is loaded');

// ── Method guard ────────────────────────────────────────────────────────────
let res = mockRes();
await webhook(mockReq('GET', '', sign('')), res);
ok(res.statusCode === 405, 'rejects GET (405)');

// ── Signature is mandatory ──────────────────────────────────────────────────
const body = captured();

res = mockRes();
await webhook(mockReq('POST', body, undefined), res);
ok(res.statusCode === 400, 'rejects a request with no signature header (400)');

res = mockRes();
await webhook(mockReq('POST', body, 'deadbeef'), res);
ok(res.statusCode === 400, 'rejects a garbage signature (400)');

res = mockRes();
await webhook(mockReq('POST', body, crypto.createHmac('sha256', 'attacker-secret').update(body).digest('hex')), res);
ok(res.statusCode === 400, 'rejects a signature made with the wrong secret (400)');

// Correct signature, but for different bytes — catches body tampering.
const tampered = captured('attacker-controlled-uuid');
res = mockRes();
await webhook(mockReq('POST', tampered, sign(body)), res);
ok(res.statusCode === 400, 'rejects a tampered body reusing a valid signature (400)');

// ── Events we do not act on ─────────────────────────────────────────────────
const failedEvent = JSON.stringify({ event: 'payment.failed', payload: { payment: { entity: {} } } });
res = mockRes();
await webhook(mockReq('POST', failedEvent, sign(failedEvent)), res);
ok(res.statusCode === 200 && res.body?.ignored === 'payment.failed', 'ignores payment.failed without granting');

const noNotes = JSON.stringify({
  event: 'payment.captured',
  payload: { payment: { entity: { id: 'pay_X', amount: 10000, notes: {} } } },
});
res = mockRes();
await webhook(mockReq('POST', noNotes, sign(noNotes)), res);
ok(res.statusCode === 200 && /no user_id/.test(res.body?.ignored ?? ''), 'ignores a captured payment with no user_id');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
