import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Any additional meta tags that should be present on all pages */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Coolors.in Color Palette Generator',
              url: 'https://coolors.in/',
              description: 'Create beautiful color combinations with our intuitive color generator',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Any',
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* No-JavaScript fallback content */}
        <noscript>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '40px auto',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
          }}>
            <h1>JavaScript is Required</h1>
            <p>
              Coolors.in requires JavaScript to generate color palettes and provide an interactive experience.
              Please enable JavaScript in your browser settings to use all features of this application.
            </p>
            <p>
              While waiting for JavaScript to be enabled, here are some pre-generated color palettes you might like:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <div style={{ display: 'flex', height: '50px' }}>
                <div style={{ flex: 1, backgroundColor: '#E63946' }}></div>
                <div style={{ flex: 1, backgroundColor: '#F1FAEE' }}></div>
                <div style={{ flex: 1, backgroundColor: '#A8DADC' }}></div>
                <div style={{ flex: 1, backgroundColor: '#457B9D' }}></div>
                <div style={{ flex: 1, backgroundColor: '#1D3557' }}></div>
              </div>
              <div style={{ display: 'flex', height: '50px' }}>
                <div style={{ flex: 1, backgroundColor: '#264653' }}></div>
                <div style={{ flex: 1, backgroundColor: '#2A9D8F' }}></div>
                <div style={{ flex: 1, backgroundColor: '#E9C46A' }}></div>
                <div style={{ flex: 1, backgroundColor: '#F4A261' }}></div>
                <div style={{ flex: 1, backgroundColor: '#E76F51' }}></div>
              </div>
              <div style={{ display: 'flex', height: '50px' }}>
                <div style={{ flex: 1, backgroundColor: '#606C38' }}></div>
                <div style={{ flex: 1, backgroundColor: '#283618' }}></div>
                <div style={{ flex: 1, backgroundColor: '#FEFAE0' }}></div>
                <div style={{ flex: 1, backgroundColor: '#DDA15E' }}></div>
                <div style={{ flex: 1, backgroundColor: '#BC6C25' }}></div>
              </div>
            </div>
          </div>
        </noscript>
      </body>
    </Html>
  );
}