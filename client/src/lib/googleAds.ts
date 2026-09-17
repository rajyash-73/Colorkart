declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

/** Google Ads "Page view" conversion. Public tag IDs, not credentials: they
 *  ship in every page's HTML by design. */
const PAGE_VIEW_CONVERSION = 'AW-972436066/SWSjCPSW0fkcEOLk2M8D';

/**
 * Records a page-view conversion. Call it from the pages that count, not from
 * index.html: that head is served for every route of the SPA, so a snippet
 * there would fire on all of them.
 *
 * gtag is defined inline in index.html before the app loads and queues calls
 * until gtag.js arrives, so this is safe to call on first render. It does
 * nothing if a blocker has removed gtag.
 */
export function trackPageViewConversion() {
  window.gtag?.('event', 'conversion', { send_to: PAGE_VIEW_CONVERSION });
}
