import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );
  res.setHeader('Content-Type', 'text/plain');

  const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /auth
Disallow: /saved-palettes

Sitemap: https://www.coolors.in/sitemap.xml
`;

  res.status(200).send(robotsTxt);
}
