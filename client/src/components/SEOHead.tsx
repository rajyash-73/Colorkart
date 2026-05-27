import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = (import.meta.env.VITE_BASE_URL as string | undefined) || 'https://coolors.in';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  /** URL path only, e.g. '/generator' */
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  /** Full absolute URL to a 1200×630 OG image */
  ogImage?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
}

// All language/locale variants we target — same URL, multiple hreflang entries
const HREFLANG = [
  'x-default', 'en', 'en-US', 'en-GB', 'en-IN', 'en-AU', 'en-CA',
  'zh-CN', 'zh-TW', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'ko', 'ja',
];

const OG_LOCALES_ALT = ['en_GB', 'en_IN', 'zh_CN', 'de_DE', 'fr_FR', 'es_ES', 'pt_BR'];

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  structuredData,
  noIndex = false,
}: SEOHeadProps) {
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const fullTitle = title.includes('Coolors') ? title : `${title} | Coolors`;
  const robotsContent = noIndex
    ? 'noindex, follow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  return (
    <Helmet>
      {/* ── Core ──────────────────────────────────────────── */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="author" content="Coolors" />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── hreflang — US · UK · Europe · India · China ───── */}
      {HREFLANG.map(hl => (
        <link key={hl} rel="alternate" hrefLang={hl} href={canonicalUrl} />
      ))}

      {/* ── Open Graph ───────────────────────────────────── */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Coolors" />
      <meta property="og:locale" content="en_US" />
      {OG_LOCALES_ALT.map(loc => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}

      {/* ── Twitter / X Card ─────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@coolors_in" />
      <meta name="twitter:creator" content="@coolors_in" />

      {/* ── Structured Data (JSON-LD) ─────────────────────── */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
    </Helmet>
  );
}
