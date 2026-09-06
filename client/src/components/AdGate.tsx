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
    if (!isPro) loadAdScripts();
  }, [isPro, loading, waitedLongEnough]);

  return null;
}
