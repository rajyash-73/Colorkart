import React from 'react';
import LegalPage, { CONTACT_EMAIL } from '@/components/LegalPage';
import { PRO_PRICE_LABEL } from '@/hooks/use-pro';

export default function Terms() {
  return (
    <LegalPage
      title="Terms and Conditions | Coolors.in"
      heading="Terms and Conditions"
      description="The terms that apply to using Coolors.in, including accounts, Coolors.in Pro purchases, your palettes and acceptable use."
      path="/terms"
    >
      <p>
        These terms apply to your use of Coolors.in ("we", "us"), a color palette generator built
        and run by Yash. By using the site you agree to them. If you don't agree, please don't use the site.
      </p>

      <h2>The service</h2>
      <p>
        Coolors.in provides color palette tools. Most are free. Coolors.in Pro is an optional one-time purchase
        that unlocks additional features, described on our <a href="/pricing">Pricing</a> page.
      </p>

      <h2>Accounts</h2>
      <p>
        Some features need an account. Keep your sign-in secure, as you are responsible for activity on
        your account. Please give us accurate information, including a working email address so we can
        reach you about purchases.
      </p>

      <h2>Coolors.in Pro</h2>
      <ul>
        <li>Pro is a one-time payment of {PRO_PRICE_LABEL}. There is no subscription and no renewal.</li>
        <li>It is activated on the account you are signed in to when you pay, and can't be transferred to another account.</li>
        <li>"Lifetime" means for as long as Coolors.in operates this service.</li>
        <li>
          Payments are processed by Razorpay, and by PayPal for payments from outside India. We never see
          or store your card, UPI or bank details.
        </li>
        <li>Refunds are covered by our <a href="/refund-policy">Refund Policy</a>.</li>
      </ul>

      <h2>Your palettes</h2>
      <p>
        Palettes you create are yours to use in any project, personal or commercial. When you save a
        palette as public, you allow us to show it, with its name, to other visitors on Coolors.in. You
        can make it private or delete it at any time.
      </p>

      <h2>Acceptable use</h2>
      <p>Please don't misuse the service. That includes:</p>
      <ul>
        <li>trying to access Pro features without paying for them</li>
        <li>scraping or bulk-downloading the palette library</li>
        <li>interfering with the site's security or performance</li>
        <li>publishing palette names that are offensive or unlawful</li>
        <li>using Coolors.in for anything illegal</li>
      </ul>
      <p>We may suspend accounts that break these rules.</p>

      <h2>Advertising and third parties</h2>
      <p>
        Visitors without Pro see ads served by Mediavine. Coolors.in also relies on third-party services,
        including Supabase for accounts and data, Razorpay and PayPal for payments, and Vercel for hosting.
        Their own terms apply to how they operate.
      </p>

      <h2>Changes</h2>
      <p>
        We may add, change or remove features, and we may update these terms. The date at the top of this
        page shows when they last changed. Continuing to use Coolors.in after a change means you accept the
        updated terms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        Coolors.in is provided "as is". We work to keep it running and accurate, but we can't guarantee it
        will always be available or free of errors.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, our total liability for any claim related to Coolors.in is limited to
        the amount you have paid us, if any.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of
        the courts of India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
