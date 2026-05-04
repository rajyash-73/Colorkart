import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../client/src/lib/queryClient';
import { PaletteProvider } from '../client/src/contexts/PaletteContext';
import { AuthProvider } from '../client/src/hooks/use-auth';
import { Toaster } from '../client/src/components/ui/toaster';
import '../styles/globals.css';

// Import optimized script loading and Head component
import Script from 'next/script';
import Head from 'next/head';
import { AdSenseSetup } from '../components/AdSense';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Add preconnect for critical domains to improve load times */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Preload critical fonts for better performance */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        
        {/* Font Awesome */}
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" />
        
        {/* Default viewport setting for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Performance optimizations */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Security */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>

      {/* Google Analytics - optimized loading strategy */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-XB40PTGVD4`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XB40PTGVD4', {
            'anonymize_ip': true,
            'page_path': window.location.pathname
          });
        `}
      </Script>

      {/* Mediavine ad setup component - loaded with lazyOnload strategy */}
      <AdSenseSetup />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PaletteProvider>
            <Component {...pageProps} />
            <Toaster />
          </PaletteProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;