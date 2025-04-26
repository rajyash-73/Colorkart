import { NextApiRequest, NextApiResponse } from 'next';

// This is a dynamic API route that generates a sitemap.xml
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set cache headers
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  );
  
  // Set the content type to XML
  res.setHeader('Content-Type', 'text/xml');
  
  // Base URL for the site
  const baseUrl = 'https://coolors.in';
  
  // Current date in ISO format for lastmod
  const today = new Date().toISOString();
  
  // Define all the static pages of the site
  const pages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/designers-guide', changefreq: 'weekly', priority: '0.8' },
    { url: '/faq', changefreq: 'weekly', priority: '0.8' },
    { url: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
    { url: '/visualizer', changefreq: 'daily', priority: '0.9' },
    { url: '/image-palette', changefreq: 'daily', priority: '0.9' }
  ];
  
  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`;
  
  // Return the sitemap
  res.status(200).send(sitemap);
}