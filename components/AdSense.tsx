import React from 'react';
import Script from 'next/script';

export const AdSenseSetup = () => {
  return (
    <Script
      id="mediavine-setup"
      strategy="lazyOnload"
      src="//scripts.scriptwrapper.com/tags/0f9cea06-925c-4a9c-b164-2ff2c7e1422f.js"
      data-noptimize="1"
      data-cfasync="false"
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

  return (
    <div className="ad-container" style={{ overflow: 'hidden', ...style }}>
      <div
        data-ad-slot={adSlot}
        data-ad-format={format}
        style={{
          display: 'block',
          overflow: 'hidden',
          width: responsive ? '100%' : undefined,
        }}
      />
    </div>
  );
};

export const InArticleAd = ({ adSlot = '3825791378' }: { adSlot?: string }) => {
  return (
    <div className="my-8 text-center">
      <div className="text-xs text-gray-400 mb-1">Advertisement</div>
      <AdSense 
        adSlot={adSlot} 
        format="fluid" 
        style={{ minHeight: 250 }}
      />
    </div>
  );
};

export const SidebarAd = ({ adSlot = '6781254986' }: { adSlot?: string }) => {
  return (
    <div className="sticky top-4">
      <div className="text-xs text-gray-400 mb-1">Advertisement</div>
      <AdSense 
        adSlot={adSlot} 
        format="vertical" 
        style={{ minHeight: 600 }}
      />
    </div>
  );
};

export const BannerAd = ({ adSlot = '1234567890' }: { adSlot?: string }) => {
  return (
    <div className="py-4 w-full overflow-hidden">
      <div className="text-xs text-gray-400 mb-1">Advertisement</div>
      <AdSense 
        adSlot={adSlot} 
        format="rectangle" 
        responsive={true}
        style={{ minHeight: 90 }}
      />
    </div>
  );
};