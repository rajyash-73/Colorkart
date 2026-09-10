import { useEffect, useState } from 'react';
import { usePro } from '@/hooks/use-pro';
import { loadAdScripts } from '@/lib/adScripts';

/**
 * Renderless. Loads the ad stack for everyone except Pro users.
 *
 * Waits for entitlement to resolve before injecting. usePro seeds itself from a
 * localStorage hint, so a returning Pro user resolves on the first tick and
 * never sees ads flash in. Once the third-party script is on the page it cannot
 * meaningfully be removed, so the decision has to be made before injecting
 * rather than by hiding slots afterwards.
 */
export default function AdGate() {
  const { isPro, loading } = usePro();
  const [waitedLongEnough, setWaitedLongEnough] = useState(false);

  // Safety net: if auth or the entitlement lookup ever hangs, free users would
  // otherwise never see an ad. Cap the wait rather than block revenue forever.
  // Returning Pro users resolve from the localStorage hint well inside this.
  useEffect(() => {
    const t = setTimeout(() => setWaitedLongEnough(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading && !waitedLongEnough) return;
    if (isPro) return;

    // The ad stack runs for roughly three seconds and holds the main thread
    // while it does. Injected before the browser has painted, it pushes first
    // paint out by that whole amount -- measured at 6.9s on /generator, with
    // the site's own assets finished at 2.8s. Waiting for a committed frame,
    // then for idle time, lets the page paint first and costs the ads only a
    // few hundred milliseconds.
    let cancelled = false;
    let started = false;

    const inject = () => { if (!cancelled) loadAdScripts(); };

    const whenIdle = () => {
      if (started) return;
      started = true;
      const ric = (window as any).requestIdleCallback;
      // The timeout matters: on a busy main thread idle may never arrive, and
      // free users must still get ads.
      if (typeof ric === 'function') ric(inject, { timeout: 2000 });
      else setTimeout(inject, 200);
    };

    // Keyed off the real paint entry rather than animation frames: frames tick
    // whether or not anything has been committed, so a double-rAF can still
    // land before first contentful paint. buffered:true fires immediately if
    // the paint already happened.
    let observing = false;
    let observer: PerformanceObserver | undefined;
    try {
      const supported = (PerformanceObserver as any).supportedEntryTypes as string[] | undefined;
      if (supported?.includes('paint')) {
        observer = new PerformanceObserver(list => {
          if (list.getEntries().some(e => e.name === 'first-contentful-paint')) {
            observer?.disconnect();
            whenIdle();
          }
        });
        observer.observe({ type: 'paint', buffered: true } as PerformanceObserverInit);
        observing = true;
      }
    } catch { /* fall through to the timer */ }

    // A safety valve, not a schedule. It was 1.5s, which on a slow load fired
    // before paint and reintroduced the very blocking this exists to avoid --
    // worst on exactly the pages that need the fix. Where paint timing works
    // the observer always wins; this only covers it never arriving at all.
    const fallback = setTimeout(whenIdle, observing ? 8000 : 300);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      observer?.disconnect();
    };
  }, [isPro, loading, waitedLongEnough]);

  return null;
}
