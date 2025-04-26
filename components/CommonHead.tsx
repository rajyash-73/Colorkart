import React from 'react';
import Head from 'next/head';

interface CommonHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

/**
 * A reusable head component for consistent SEO across pages
 */
const CommonHead = ({
  title,
  description,
  keywords = '',
  ogImage = 'https://coolors.in/og-image.jpg',
  canonicalUrl,
  structuredData
}: CommonHeadProps) => {
  // Set default canonical URL if not provided
  const canonical = canonicalUrl || `https://coolors.in${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Social Media Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
};

export default CommonHead;