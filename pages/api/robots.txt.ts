import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set cache headers
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );
  
  // Set the content type to plain text
  res.setHeader('Content-Type', 'text/plain');
  
  // Generate the robots.txt content
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://coolors.in/api/sitemap.xml
`;
  
  // Return the robots.txt
  res.status(200).send(robotsTxt);
}