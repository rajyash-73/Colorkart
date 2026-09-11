import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Mediavine's script appends its Advertising Privacy Notice to the privacy
 * page as ~35 loose elements (h2, p, h3, ul...) directly on <body>, after our
 * content and with no wrapper. This adopts those elements into a collapsible
 * section, so the notice stays on the page as Mediavine requires, but behind a
 * "Read" toggle instead of trailing the policy as an unstyled wall of text.
 *
 * Renders nothing until the notice actually arrives. Pro members are not
 * served Mediavine at all, and ad blockers stop the script, so for them there
 * is no notice to show.
 */

const HEADING = /^\s*Mediavine Advertising Privacy Notice/i;

// The notice is plain text markup. Their iframes, scripts, and our own #root
// are none of these, so the first non-text element ends the block.
const NOTICE_TAGS = new Set(['H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'TABLE']);

/** Finds the notice among <body>'s direct children, heading first. */
function findNoticeBlock(): Element[] {
  const start = Array.from(document.body.children).find(
    el => el.tagName === 'H2' && HEADING.test(el.textContent || ''),
  );
  if (!start) return [];
  const block: Element[] = [start];
  for (let n = start.nextElementSibling; n && NOTICE_TAGS.has(n.tagName); n = n.nextElementSibling) {
    block.push(n);
  }
  return block;
}

// The script injects once per page load. Kept here so returning to this page
// by in-app navigation shows the notice again rather than an empty toggle.
let adopted: Element[] = [];

export default function MediavineNotice() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [captured, setCaptured] = useState(adopted.length > 0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (adopted.length) box.replaceChildren(...adopted);

    // Debounced so a notice inserted piece by piece is adopted whole, not cut
    // off after its first few paragraphs.
    let settle: ReturnType<typeof setTimeout> | undefined;
    const adopt = () => {
      const block = findNoticeBlock();
      if (!block.length) return;
      // replaceChildren, not append: if the script ever re-injects, the newest
      // copy replaces the old one and the page never shows the notice twice.
      box.replaceChildren(...block);
      adopted = block;
      setCaptured(true);
    };
    const schedule = () => {
      clearTimeout(settle);
      settle = setTimeout(adopt, 250);
    };

    schedule(); // it may already be on the page
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true });
    return () => {
      observer.disconnect();
      clearTimeout(settle);
    };
  }, []);

  // One stable tree whatever the state: the box keeps the same DOM node, so the
  // elements moved into it survive re-renders. React owns no children in it.
  return (
    <div className="mb-4" hidden={!captured}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mv-privacy-notice"
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
      >
        Read Mediavine Advertising Privacy Notice
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id="mv-privacy-notice"
        ref={boxRef}
        hidden={!open}
        className="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 text-sm
          [&>h2:first-child]:mt-0
          [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white
          [&_h4]:mt-4 [&_h4]:mb-1.5 [&_h4]:font-medium [&_h4]:text-gray-800 dark:[&_h4]:text-gray-200
          [&_a]:break-words"
      />
    </div>
  );
}
