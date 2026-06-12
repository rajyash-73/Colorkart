// Exercise the /api share handlers with mocked Vercel req/res objects.
import imageHandler from '../api/palette-image.js';
import shareHandler from '../api/palette-share.js';

function mockRes() {
  const res = {
    headers: {}, statusCode: 0, body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = b; return this; },
    json(o) { this.body = JSON.stringify(o); return this; },
  };
  return res;
}

let pass = 0, fail = 0;
const check = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

// 1. valid image, wide
let r = mockRes();
imageHandler({ query: { c: '69D2E7-A7DBD8-E0E4CC' } }, r);
check('image wide 200', r.statusCode === 200);
check('image content-type', r.headers['Content-Type'] === 'image/png');
check('image cache header', /immutable/.test(r.headers['Cache-Control']));
check('image is PNG', Buffer.isBuffer(r.body) && r.body[1] === 0x50);

// 2. valid image, tall
r = mockRes();
imageHandler({ query: { c: 'FF5349-8DB600', layout: 'tall' } }, r);
check('image tall 200', r.statusCode === 200 && r.body.length > 1000);

// 3. invalid colors rejected
r = mockRes();
imageHandler({ query: { c: '<script>' } }, r);
check('image bad input 400', r.statusCode === 400);
r = mockRes();
imageHandler({ query: {} }, r);
check('image missing c 400', r.statusCode === 400);

// 4. share page happy path
r = mockRes();
shareHandler({ query: { id: 'abc-123', n: 'Sunset "Vibes" <3', c: '69D2E7-FA6900' } }, r);
check('share 200', r.statusCode === 200);
check('share content-type html', /text\/html/.test(r.headers['Content-Type']));
check('share og:image points at palette-image',
  r.body.includes('og:image" content="https://www.coolors.in/api/palette-image?c=69D2E7-FA6900"'));
check('share twitter card', r.body.includes('summary_large_image'));
check('share name escaped', r.body.includes('Sunset &quot;Vibes&quot; &lt;3') && !r.body.includes('"Vibes" <3'));
check('share redirects to explore', r.body.includes('https://www.coolors.in/explore?palette=abc-123'));
check('share canonical', r.body.includes('rel="canonical" href="https://www.coolors.in/explore?palette=abc-123"'));

// 5. share page invalid input
r = mockRes();
shareHandler({ query: { id: '../etc', n: 'x', c: '69D2E7' } }, r);
check('share bad id 400', r.statusCode === 400);
r = mockRes();
shareHandler({ query: { id: 'ok', n: 'x', c: 'nothex!' } }, r);
check('share bad colors 400', r.statusCode === 400);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
