import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );
  res.setHeader('Content-Type', 'text/xml');

  const baseUrl = 'https://www.coolors.in';

  // lastmod is set to the deploy/build date and should be updated on meaningful content changes.
  // priority and changefreq are omitted — Google ignores both tags.
  const pages = [
    '/',
    '/generator',
    '/explore',
    '/visualize',
    '/image-palette',
    '/contrast-checker',
    '/gradient-generator',
    '/color-picker',
    '/font-generator',
    '/korean-color-analysis',
    '/korean-color-analysis-guide',
    '/designers-guide',
    '/generator-guide',
    '/visualizer-guide',
    '/image-palette-guide',
    '/faq',
    '/privacy-policy',
  ];

  const lastmod = '2026-06-02';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url === '/' ? '/' : url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.status(200).send(sitemap);
}
