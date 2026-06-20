import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  structuredData?: any;
  children?: React.ReactNode;
}

const defaultDescription = "Create and explore beautiful color combinations with Coolors.in, the free color palette generator. Design with confidence using our intuitive color tools.";
const defaultKeywords = "color palette generator, color scheme, color combinations, design tools, color palette, color inspiration";
const defaultOgImage = "/og-default.jpg"; // Default social sharing image

export default function SEO({
  title = "Coolors.in - Free Color Palette Generator",
  description = defaultDescription,
  canonical,
  ogImage = defaultOgImage,
  ogType = "website",
  keywords = defaultKeywords,
  structuredData,
  children,
}: SEOProps) {
  const router = useRouter();
  const siteUrl = "https://www.coolors.in";
  const currentUrl = canonical || `${siteUrl}${router.asPath}`;
  const fullTitle = title.includes("Coolors.in") ? title : `${title} | Coolors.in`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />
      
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Coolors.in" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      {children}
    </Head>
  );
}