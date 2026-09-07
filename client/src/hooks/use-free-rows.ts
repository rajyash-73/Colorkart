import { useEffect, useState } from 'react';

/** Free accounts see this many rows of any gated palette grid. */
export const FREE_ROWS = 3;

/**
 * How many cards make up FREE_ROWS in a responsive grid.
 *
 * A row is a column count times FREE_ROWS, and the column count depends on the
 * grid's own breakpoints — Explore and Browse Palettes do not use the same
 * ones. So the caller passes its own mapping rather than this hook guessing at
 * a layout it cannot see. Pass a module-level function: an inline one would be
 * a new reference every render and re-subscribe the listener each time.
 */
export function useFreeVisibleCount(columnsForWidth: (width: number) => number): number {
  const [cols, setCols] = useState(() =>
    columnsForWidth(typeof window === 'undefined' ? 1280 : window.innerWidth));

  useEffect(() => {
    const update = () => setCols(columnsForWidth(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [columnsForWidth]);

  return cols * FREE_ROWS;
}
