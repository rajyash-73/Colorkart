// Mediavine / grow.me loader.
//
// These used to be hardcoded <script> tags in client/index.html, which meant
// every visitor got ads with no way to withhold them. They are injected from
// here instead so Pro users can be served a page without them.

const MEDIAVINE_SRC = '//scripts.scriptwrapper.com/tags/0f9cea06-925c-4a9c-b164-2ff2c7e1422f.js';
const GROW_SITE_ID = 'U2l0ZTowZjljZWEwNi05MjVjLTRhOWMtYjE2NC0yZmYyYzdlMTQyMmY=';

/** Pages served without ads. Pricing is where visitors decide whether to pay,
 *  and ads there compete with the one thing the page is for. */
const AD_FREE_PATHS = new Set(['/pricing']);

export const isAdFreePath = (path: string): boolean =>
  AD_FREE_PATHS.has(path.replace(/\/+$/, '') || '/');

let injected = false;

/** Inject the ad stack. Idempotent — safe to call from an effect that re-runs. */
export function loadAdScripts(): void {
  if (injected || typeof document === 'undefined') return;
  if (document.querySelector('script[data-grow-initializer]')) { injected = true; return; }
  injected = true;

  const wrapper = document.createElement('script');
  wrapper.type = 'text/javascript';
  wrapper.async = true;
  wrapper.setAttribute('data-noptimize', '1');
  wrapper.setAttribute('data-cfasync', 'false');
  wrapper.src = MEDIAVINE_SRC;
  document.head.appendChild(wrapper);

  // grow.me's own initialiser, kept byte-for-byte equivalent to the snippet
  // that previously lived in index.html.
  const grow = document.createElement('script');
  grow.setAttribute('data-grow-initializer', '');
  grow.text = `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","${GROW_SITE_ID}");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`;
  document.head.appendChild(grow);
}

/** True once the scripts have been added this page load. */
export const adScriptsLoaded = () => injected;
