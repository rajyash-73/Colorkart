import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Globe, CheckCircle } from 'lucide-react';
import { PRO_PRICE_LABEL } from '@/hooks/use-pro';
import { CONTACT_EMAIL } from '@/components/LegalPage';

/**
 * Step-by-step slideshow for paying from outside India, where checkout runs
 * through PayPal. Manual rather than auto-advancing: this is a set of
 * instructions people read and act on, and a timer would move the slide on
 * mid-sentence.
 *
 * Sized to sit as the third of three equal tiles on the Pricing page, so the
 * whole row fits the first screen: a short 5:3 frame, and fixed room for
 * each step's text so the tile does not change height between steps.
 */

const [PRICE_INR] = PRO_PRICE_LABEL.split(' ');

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
        Get Pro for {PRICE_INR}
      </span>
    ),
    body: (
      <>
        Click <strong>Get Pro for {PRICE_INR}</strong>. If you're asked to sign in, do that first; checkout
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

export default function PaypalGuide() {
  const [index, setIndex] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);
  const touchX = useRef<number | null>(null);

  const last = STEPS.length - 1;
  const go = (n: number) => setIndex(Math.max(0, Math.min(last, n)));
  const step = STEPS[index];
  const shot = imageMissing ? undefined : step.shot;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="How to pay from outside India"
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

      <div className="mt-3" aria-live="polite">
        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {shot ? (
            // Image and spotlight move together, so the window slides from the
            // login form down to the card button between the two PayPal steps.
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-500 ease-out"
              style={{ transform: `translateY(-${shot.scroll}%)` }}
            >
              <img
                src={SCREENSHOT}
                alt="PayPal checkout window with a Log In form, and below it a Pay with Credit or Debit Card button"
                className="block w-full"
                onError={() => setImageMissing(true)}
              />
              <span
                aria-hidden="true"
                className="absolute rounded-lg ring-4 ring-[#db1a72] shadow-[0_0_0_9999px_rgba(0,0,0,0.28)] transition-all duration-500 ease-out"
                style={{
                  left: `${shot.box.left}%`,
                  top: `${shot.box.top}%`,
                  width: `${shot.box.width}%`,
                  height: `${shot.box.height}%`,
                }}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center gap-4 px-6">
              <span className="text-4xl font-bold text-gray-200 dark:text-gray-700">{index + 1}</span>
              <span className="flex items-center text-[#db1a72]">{step.visual ?? <Globe size={28} />}</span>
            </div>
          )}
        </div>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#db1a72]">
          Step {index + 1} of {STEPS.length}
        </p>
        <h3 className="mt-0.5 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
        <p className="mt-1 min-h-[4.5rem] text-sm leading-relaxed text-gray-600 dark:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_a]:text-violet-600 dark:[&_a]:text-violet-400 [&_a]:underline [&_a]:break-all">
          {step.body}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous step"
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
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
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Next step"
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
