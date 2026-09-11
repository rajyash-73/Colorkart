import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Globe, CheckCircle, Pause, Play } from 'lucide-react';
import { CONTACT_EMAIL } from '@/components/LegalPage';

/**
 * Step-by-step slideshow for paying from outside India, where checkout runs
 * through PayPal. Advances on its own in a loop, and pauses while the pointer
 * is over it, while it has keyboard focus, or via its pause button, so the
 * steps can actually be read. Starts paused for visitors who ask their system
 * to reduce motion.
 *
 * Sized to sit as the third of three equal tiles on the Pricing page, so the
 * whole row fits the first screen, and it keeps one height across every step.
 */

/** How long the move into each slide takes: the fade, and the screenshot
 *  window and spotlight gliding between the two PayPal steps. */
const TRANSITION_MS = 1000;

/** How long each slide then stays fully settled before the next begins. The
 *  two are separate so a slide is never cut off while still moving; together
 *  they give a new slide every two seconds. */
const SHOW_MS = 1000;

/** The PayPal screenshot, cropped to the checkout form (no address bar). */
const SCREENSHOT = '/paypal-checkout.png';

/** A control's position in the full screenshot, in percent. The 5:3 frame
 *  shows about 54% of the image's height; `scroll` is where that window
 *  starts, in percent of the image height, so each step shows its part. */
type Box = { left: number; top: number; width: number; height: number };
type Shot = { box: Box; scroll: number };
const LOGIN: Shot = { box: { left: 8.5, top: 0.3, width: 83, height: 51.5 }, scroll: 0 };
const CARD: Shot = { box: { left: 8.5, top: 63, width: 83, height: 11.2 }, scroll: 42 };

type Step = { title: string; body: React.ReactNode; shot?: Shot; visual?: React.ReactNode };

const STEPS: Step[] = [
  {
    title: 'Start checkout',
    visual: (
      <span className="rounded-xl bg-[#db1a72] px-4 py-2 text-sm font-semibold text-white shadow-md">
        Get Pro
      </span>
    ),
    body: (
      <>
        Click <strong>Get Pro</strong> on the Pro plan. If you're asked to sign in, do that first; checkout
        opens by itself afterwards.
      </>
    ),
  },
  {
    title: 'Choose PayPal',
    visual: <Globe size={28} />,
    body: (
      <>
        In the checkout window, pick <strong>PayPal</strong>. Payments from outside India go through PayPal
        for now.
      </>
    ),
  },
  {
    title: 'Have a PayPal account? Log in',
    shot: LOGIN,
    body: (
      <>
        Enter your PayPal email or mobile number and password, click <strong>Log In</strong>, then confirm
        the payment.
      </>
    ),
  },
  {
    title: 'No PayPal account? Pay by card',
    shot: CARD,
    body: (
      <>
        Click <strong>Pay with Credit or Debit Card</strong> and enter your card details. No PayPal account
        needed.
      </>
    ),
  },
  {
    title: "You're all set",
    visual: <CheckCircle size={28} />,
    body: (
      <>
        You're taken back to Coolors and Pro is active straight away. Not active after 10 minutes? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </>
    ),
  },
];

// break-words, not break-all: the email moves to the next line whole rather
// than splitting mid-address, and only breaks if it cannot fit a line at all.
const BODY_TEXT =
  'text-sm leading-relaxed text-gray-600 dark:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_a]:text-violet-600 dark:[&_a]:text-violet-400 [&_a]:underline [&_a]:break-words';
const STEP_LABEL = 'text-[11px] font-semibold uppercase tracking-wider text-[#db1a72]';
const BOX = 'rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
// Shared by the text-only slide and its measuring copy, so both wrap alike.
const TEXT_SLIDE = 'flex flex-col items-center gap-2 px-5 py-5 text-center';

/** Each slide's content fades and slides in as it arrives. */
const ENTER = 'animate-in fade-in-0 slide-in-from-right-3 motion-reduce:animate-none';
const enterStyle = { animationDuration: `${TRANSITION_MS}ms` };
const moveStyle = { transitionDuration: `${TRANSITION_MS}ms` };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function PaypalGuide() {
  const [index, setIndex] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = STEPS.length;
  // Wraps both ways, since the slideshow loops.
  const go = (n: number) => setIndex(((n % count) + count) % count);
  const shotFor = (s: Step) => (imageMissing ? undefined : s.shot);
  const step = STEPS[index];
  const shot = shotFor(step);
  const playing = !paused && !hovering && !keyboardFocus;

  // A timeout per step rather than an interval, so a manual move restarts
  // the countdown instead of jumping again a moment later. Each step gets
  // its transition plus SHOW_MS fully settled.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setIndex(i => (i + 1) % count), TRANSITION_MS + SHOW_MS);
    return () => clearTimeout(t);
  }, [playing, index, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="How to pay from outside India"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // Only keyboard focus pauses it; a mouse click on a control should not
      // leave the slideshow stuck until focus happens to move elsewhere.
      onFocus={e => { if ((e.target as HTMLElement).matches(':focus-visible')) setKeyboardFocus(true); }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeyboardFocus(false); }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      className="flex h-full flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
    >
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Paying from outside India?</h2>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">International payments go through PayPal.</p>

      {/* Announced only while paused: a live region rotating this often would
          talk over a screen reader user without pause. */}
      <div className="relative mt-3" aria-live={playing ? 'off' : 'polite'}>
        {/* Measuring layer: every step's layout stacked invisibly in one grid
            cell. The stage is as tall as its tallest step however the text
            wraps (fonts, zoom, width), so the tile never changes height as the
            slides turn. The visible slide is laid over it. */}
        <div className="invisible grid" aria-hidden="true">
          {STEPS.map((s, n) =>
            shotFor(s) ? (
              <div key={s.title} className="col-start-1 row-start-1">
                <div className="aspect-[5/3] w-full" />
                <p className={`mt-3 ${STEP_LABEL}`}>Step {n + 1} of {count}</p>
                <h3 className="mt-0.5 font-semibold">{s.title}</h3>
                <p className={`mt-1 ${BODY_TEXT}`}>{s.body}</p>
              </div>
            ) : (
              <div key={s.title} className={`col-start-1 row-start-1 ${TEXT_SLIDE}`}>
                <span className="mb-2 flex items-center">{s.visual ?? <Globe size={28} />}</span>
                <p className={STEP_LABEL}>Step {n + 1} of {count}</p>
                <h3 className="font-semibold">{s.title}</h3>
                <p className={BODY_TEXT}>{s.body}</p>
              </div>
            ),
          )}
        </div>

        <div className="absolute inset-0">
          {/* Screenshot steps: the frame, then the step's text beneath it. */}
          <div className={shot ? undefined : 'invisible'} aria-hidden={shot ? undefined : true}>
            <div className={`relative aspect-[5/3] w-full overflow-hidden ${BOX}`}>
              {shot && (
                // Not keyed on the step, so between the two PayPal steps the
                // same image and spotlight glide from the login form to the
                // card button. It only fades in when arriving from a text step.
                <div
                  className={`absolute inset-x-0 top-0 transition-transform ease-out motion-reduce:transition-none ${ENTER}`}
                  style={{ transform: `translateY(-${shot.scroll}%)`, ...moveStyle, ...enterStyle }}
                >
                  <img
                    src={SCREENSHOT}
                    alt="PayPal checkout window with a Log In form, and below it a Pay with Credit or Debit Card button"
                    className="block w-full"
                    onError={() => setImageMissing(true)}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute rounded-lg ring-4 ring-[#db1a72] shadow-[0_0_0_9999px_rgba(0,0,0,0.28)] transition-all ease-out motion-reduce:transition-none"
                    style={{
                      left: `${shot.box.left}%`,
                      top: `${shot.box.top}%`,
                      width: `${shot.box.width}%`,
                      height: `${shot.box.height}%`,
                      ...moveStyle,
                    }}
                  />
                </div>
              )}
            </div>
            {shot && (
              <div key={index} className={ENTER} style={enterStyle}>
                <p className={`mt-3 ${STEP_LABEL}`}>Step {index + 1} of {count}</p>
                <h3 className="mt-0.5 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className={`mt-1 ${BODY_TEXT}`}>{step.body}</p>
              </div>
            )}
          </div>

          {/* Text-only steps: the whole stage is one box with the text inside. */}
          {!shot && (
            <div className={`absolute inset-0 flex items-center justify-center overflow-hidden ${BOX}`}>
              <div key={index} className={`${TEXT_SLIDE} ${ENTER}`} style={enterStyle}>
                <span className="mb-2 flex items-center text-[#db1a72]">{step.visual ?? <Globe size={28} />}</span>
                <p className={STEP_LABEL}>Step {index + 1} of {count}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className={BODY_TEXT}>{step.body}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous step"
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, n) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(n)}
                aria-label={`Step ${n + 1}: ${s.title}`}
                aria-current={n === index ? 'step' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  n === index ? 'w-5 bg-[#db1a72]' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            className="rounded-md p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next step"
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
