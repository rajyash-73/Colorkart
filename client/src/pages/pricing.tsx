import React, { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import LegalPage, { CONTACT_EMAIL, REFUND_DAYS } from '@/components/LegalPage';
import PaypalGuide from '@/components/PaypalGuide';
import { usePro, PRO_PRICE_LABEL, PRO_INTENT_KEY, FREE_SAVE_LIMIT } from '@/hooks/use-pro';
import { useAuth } from '@/hooks/use-auth';
import { useCheckout } from '@/hooks/use-checkout';

// "₹100 (≈ $1)" split so the rupee figure can be large and the dollar small,
// while still coming from the one constant checkout is priced against.
const [PRICE_INR, ...rest] = PRO_PRICE_LABEL.split(' ');
const PRICE_USD = rest.join(' ');

const FREE_FEATURES = [
  'Generate unlimited palettes with five color theory modes',
  'Lock, adjust and export as CSS, SCSS, Tailwind, JSON or PNG',
  'Contrast checker, gradient generator, color picker and font generator',
  'Korean personal color analysis',
  'The first rows of the Explore library',
  `Save up to ${FREE_SAVE_LIMIT} palettes with a free account`,
];

const PRO_FEATURES = [
  'Every palette on Explore, curated and community-shared',
  'No ads, anywhere on the site',
  'Palette Visualizer: see your colors in real UI mockups',
  'Image to Palette: extract colors from any photo',
  'Font and color pairing simulator with PNG, JPG and PDF export',
  'Unlimited saved palettes',
];

function Plan({
  name, price, sub, note, features, highlight = false, children,
}: {
  name: string;
  price: string;
  sub?: string;
  note: string;
  features: string[];
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white dark:bg-gray-900 p-5 ${
        highlight ? 'border-[#db1a72] shadow-md' : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        {highlight && <Sparkles size={15} className="text-[#db1a72]" />}
        {name}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{price}</span>
        {sub && <span className="text-sm text-gray-500 dark:text-gray-400">{sub}</span>}
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</div>
      <div className="mt-4 flex-1 space-y-2">
        {features.map(f => (
          <div key={f} className="flex items-start gap-2 text-sm leading-snug text-gray-600 dark:text-gray-300">
            <Check size={15} className="mt-0.5 flex-shrink-0 text-green-500" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export default function Pricing() {
  const { isPro, loading } = usePro();
  const { user } = useAuth();
  // Get Pro here opens the payment gateway directly: this page already lays
  // out what Pro includes, so there is no confirmation step in between.
  const { startCheckout, busy } = useCheckout();

  // Back from sign-in with a purchase pending: open checkout straight away,
  // since that is what they clicked before being sent to sign in.
  useEffect(() => {
    if (!user || loading) return;
    try {
      if (sessionStorage.getItem(PRO_INTENT_KEY) !== '1') return;
      sessionStorage.removeItem(PRO_INTENT_KEY);
    } catch { return; }
    if (!isPro) startCheckout();
  }, [user, loading, isPro, startCheckout]);

  return (
    <LegalPage
      title="Pricing: Free and Pro | Coolors"
      heading="Pricing"
      description={`Coolors is free to use. Pro is a one-time ${PRO_PRICE_LABEL} payment that removes ads and unlocks the visualizer, image-to-palette, font pairing and unlimited saves.`}
      path="/pricing"
      showUpdated={false}
      wide
      hero={
        <>
          {/* Three equal tiles in one row from laptop width up, sized so the
              whole row fits the first screen without scrolling. */}
          <div className="grid gap-5 lg:grid-cols-3">
            <Plan name="Free" price="₹0" note="Free forever, no card needed" features={FREE_FEATURES}>
              <a
                href="/generator"
                className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Start generating
              </a>
            </Plan>

            <Plan
              name="Pro"
              price={PRICE_INR}
              sub={PRICE_USD}
              note="One-time payment. No subscription, no renewals."
              features={PRO_FEATURES}
              highlight
            >
              {loading ? null : isPro ? (
                <div className="w-full rounded-xl bg-green-50 dark:bg-green-900/20 py-2.5 text-center text-sm font-semibold text-green-700 dark:text-green-300">
                  You have Pro. Thank you!
                </div>
              ) : (
                <button
                  onClick={startCheckout}
                  disabled={busy}
                  className="w-full rounded-xl bg-[#db1a72] hover:bg-[#c2155f] active:scale-[0.98] disabled:opacity-60 py-2.5 text-sm font-semibold text-white transition"
                >
                  {busy ? 'Opening checkout…' : `Get Pro for ${PRICE_INR}`}
                </button>
              )}
            </Plan>
            <PaypalGuide />
          </div>
        </>
      }
    >
      <p>
        Generating palettes is free and always will be. Pro is a single one-time payment that removes ads for
        good and unlocks the rest.
      </p>

      <h2>How payment works</h2>
      <ul>
        <li>Pro is a one-time payment of {PRO_PRICE_LABEL}. There is no subscription and you will never be charged again.</li>
        <li>The price is set in Indian Rupees and is the total you pay. The dollar figure is approximate.</li>
        <li>Payments are processed securely by Razorpay. In India you can pay by card, UPI, net banking or wallet.</li>
        <li>
          Paying from outside India? Choose PayPal at checkout. You don't need a PayPal account; you can pay
          with your card.
        </li>
      </ul>

      <h2>Delivery</h2>
      <p>
        Pro is a digital service, so there is nothing to ship. It is activated on your Coolors account the
        moment your payment succeeds, and works on every device you sign in to. If Pro isn't active within
        10 minutes of paying, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your
        payment ID and we'll sort it out.
      </p>

      <h2>What "lifetime" means</h2>
      <p>
        Your Pro access lasts for as long as Coolors operates this service, with no renewal fees.
      </p>

      <h2>Refunds</h2>
      <p>
        Not happy? You can get a full refund within {REFUND_DAYS} days of purchase. See our{' '}
        <a href="/refund-policy">Refund Policy</a> for details.
      </p>

      <h2>Questions</h2>
      <p>
        Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
