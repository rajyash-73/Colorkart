/**
 * Carrying an unfinished action across the sign-in trip.
 *
 * Signing in is a full page load, and for Google it leaves the origin
 * entirely, so anything held in React state is gone by the time the visitor
 * comes back. sessionStorage survives both and is scoped to the tab, so a
 * stale intent cannot resurface in a later visit.
 */

/** Where to send the visitor once they are signed in. */
export const RETURN_PATH_KEY = 'coolors_post_auth_return';

/** The palette they were trying to save, as Color[] JSON. */
export const PENDING_SAVE_KEY = 'coolors_pending_save';

/** Remember the current page so sign-in returns here instead of the homepage. */
export function rememberReturnPath(path?: string): void {
  try {
    const target = path ?? window.location.pathname + window.location.search;
    // Bouncing back to /auth after signing in would be a loop.
    if (target.startsWith('/auth')) return;
    sessionStorage.setItem(RETURN_PATH_KEY, target);
  } catch {
    /* private mode — the visitor just lands on the homepage as before */
  }
}

/** Read the return path without clearing it — safe to call during render. */
export function peekReturnPath(): string | null {
  try {
    return safePath(sessionStorage.getItem(RETURN_PATH_KEY));
  } catch {
    return null;
  }
}

/** Only same-origin paths, never a full URL an attacker could have planted. */
function safePath(path: string | null): string | null {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : null;
}

/**
 * Read and clear the return path. Consuming it means whichever handler runs
 * first wins: auth-page's redirect for email sign-in, or the Header for
 * Google, which comes back to "/" without auth-page ever rendering.
 */
export function takeReturnPath(): string | null {
  try {
    const path = sessionStorage.getItem(RETURN_PATH_KEY);
    if (path) sessionStorage.removeItem(RETURN_PATH_KEY);
    return safePath(path);
  } catch {
    return null;
  }
}
