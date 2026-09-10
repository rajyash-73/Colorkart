import React from 'react';

/**
 * Without this, any uncaught render error unmounts the whole tree and the
 * visitor gets a blank white page with nothing to act on and nothing reported.
 * This turns that into a readable message plus the two things that actually
 * recover it.
 */

/** App-owned storage. Supabase keeps the auth session in localStorage under
 *  its own "sb-" keys, so clearing everything would silently sign the visitor
 *  out — only the keys this app wrote are cleared. */
function clearAppStorage(): void {
  try {
    const legacy = ['currentPalette', 'pendingPalette', 'hasSeenWelcomeModal'];
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (/^(coolors|colorkart)/i.test(k) || legacy.includes(k)) doomed.push(k);
    }
    doomed.forEach(k => localStorage.removeItem(k));
  } catch { /* nothing we can do */ }
  try { sessionStorage.clear(); } catch { /* nothing we can do */ }
}

interface State { error: Error | null }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Kept in the console so a report can carry the real cause rather than
    // "the page was blank".
    console.error('Coolors crashed:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something broke</h1>
          <p className="text-sm text-gray-500 mb-5">
            Sorry — this page failed to load. Reloading usually fixes it. If it keeps
            happening, clearing this site's saved data almost always does.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
            >
              Reload the page
            </button>
            <button
              onClick={() => { clearAppStorage(); window.location.reload(); }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              Clear saved data &amp; reload
            </button>
          </div>

          <details className="mt-5 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
              Technical details
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-600 whitespace-pre-wrap break-words">
              {error.message || String(error)}
            </pre>
          </details>

          <p className="mt-4 text-[11px] text-gray-400">
            Still stuck? Send this to{' '}
            <a href="mailto:coolors.in@gmail.com" className="text-violet-600 hover:underline">
              coolors.in@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}
