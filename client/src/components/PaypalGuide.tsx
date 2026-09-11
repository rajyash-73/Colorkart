import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Globe, CheckCircle } from 'lucide-react';
import { PRO_PRICE_LABEL } from '@/hooks/use-pro';
import { CONTACT_EMAIL } from '@/components/LegalPage';

/**
 * Step-by-step slideshow for paying from outside India, where checkout runs
 * through PayPal. Manual rather than auto-advancing: this is a set of
 * instructions people read and act on, and a timer would move the slide on
 * mid-sentence.
 */

const [PRICE_INR] = PRO_PRICE_LABEL.split(' ');

/** The PayPal screenshot, cropped to the checkout form (no address bar). */
const SCREENSHOT = '/paypal-checkout.png';

/** A control's position inside the cropped screenshot, in percent, so the
 *  highlight stays on it at whatever size the image is drawn. */
type Box = { left: number; top: number; width: number; height: number };
const LOGIN_BOX: Box = { left: 8.5, top: 0.3, width: 83, height: 51.5 };
const CARD_BOX: Box = { left: 8.5, top: 63, width: 83, height: 11.2 };

type Step = {
  title: string;
  body: React.ReactNode;
  /** Present on steps that happen inside PayPal's window. */
  highlight?: Box;
  visual?: React.ReactNode;
};

const STEPS: Step[] = [
  {
    title: 'Start checkout',
    visual: (
      <span className="rounded-xl bg-[#db1a72] px-5 py-2.5 text-sm font-semibold text-white shadow-md">
        Get Pro for {PRICE_INR}
      </span>
    ),
    body: (
      <>
        Click <strong>Get Pro for {PRICE_INR}</strong>. If you're asked to sign in, do that first; checkout
        opens by itself when you're back.
      </>
    ),
  },
  {
    title: 'Choose PayPal',
    visual: <Globe size={30} />,
    body: (
      <>
        In the checkout window, pick <strong>PayPal</strong>. Payments from outside India are processed
        through PayPal for now.
      </>
    ),
  },
  {
    title: 'Have a PayPal account? Log in',
    highlight: LOGIN_BOX,
    body: (
      <>
        Enter your PayPal email or mobile number and password, click <strong>Log In</strong>, then confirm
        the payment.
      </>
    ),
  },
  {
    title: 'No PayPal account? Pay by card',
    highlight: CARD_BOX,
    body: (
      <>
        Click <strong>Pay with Credit or Debit Card</strong> and enter your card details. You don't need to
        create a PayPal account.
      </>
    ),
  },
  {
    title: "You're all set",
    visual: <CheckCircle size={30} />,
    body: (
      <>
        Once the payment goes through you're taken back to Coolors, and Pro is active straight away. Not
        active within 10 minutes? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your
        payment ID.
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
  const showScreenshot = !!step.highlight && !imageMissing;

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
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
    >
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Paying from outside India?</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        International payments go through PayPal. Here's how, step by step.
      </p>

      <div className="mt-4" aria-live="polite">
        {/* One fixed-ratio frame for every step, so the controls below never jump. */}
        <div className="relative aspect-[572/631] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {showScreenshot ? (
            <>
              <img
                src={SCREENSHOT}
                alt="PayPal checkout window with a Log In form, and below it a Pay with Credit or Debit Card button"
                className="absolute inset-0 h-full w-full object-cover object-top"
                onError={() => setImageMissing(true)}
              />
              {/* Same element on both PayPal steps, so the spotlight glides from
                  the login form down to the card button. */}
              <span
                aria-hidden="true"
                className="absolute rounded-lg ring-4 ring-[#db1a72] shadow-[0_0_0_9999px_rgba(0,0,0,0.28)] transition-all duration-500 ease-out"
                style={{
                  left: `${step.highlight!.left}%`,
                  top: `${step.highlight!.top}%`,
                  width: `${step.highlight!.width}%`,
                  height: `${step.highlight!.height}%`,
                }}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <span className="text-5xl font-bold text-gray-200 dark:text-gray-700">{index + 1}</span>
              <span className="flex items-center justify-center text-[#db1a72]">
                {step.visual ?? <Globe size={30} />}
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#db1a72]">
          Step {index + 1} of {STEPS.length}
        </p>
        <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_a]:text-violet-600 dark:[&_a]:text-violet-400 [&_a]:underline [&_a]:break-all">
          {step.body}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
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
