import React, { useEffect } from 'react';
import Script from 'next/script';

export const AdSenseSetup = () => {
  return (
    <Script
      id="google-adsense"
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5617109574785382"
      crossOrigin="anonymous"
    />
  );
};

interface AdSenseProps {
  adSlot: string; // The ad slot ID
  style?: React.CSSProperties; // Optional custom styles
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical'; // Ad format
  responsive?: boolean; // Whether the ad should be responsive
}

export const AdSense = ({ adSlot, style, format = 'auto', responsive = true }: AdSenseProps) => {
  useEffect(() => {
    // Try to load ads when component mounts
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', width: '100%' }}
        data-ad-client="ca-pub-5617109574785382"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
};

// For in-article ads
export const InArticleAd = ({ adSlot = '3825791378' }: { adSlot?: string }) => {
  return <AdSense adSlot={adSlot} format="fluid" responsive={true} />;
};

// For sidebar rectangular ads
export const SidebarAd = ({ adSlot = '6781254986' }: { adSlot?: string }) => {
  return (
    <AdSense
      adSlot={adSlot}
      format="rectangle"
      responsive={false}
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
    />
  );
};

// For responsive ads at the top or bottom of a page
export const BannerAd = ({ adSlot = '1234567890' }: { adSlot?: string }) => {
  return <AdSense adSlot={adSlot} format="auto" responsive={true} />;
};