import React from 'react';
import LegalPage, { CONTACT_EMAIL } from '@/components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy | Coolors"
      heading="Privacy Policy"
      description="What coolors.in collects, why, who it is shared with, and how to access or delete your data."
      path="/privacy-policy"
    >
      <p>
        This policy explains what coolors.in ("Coolors", "we") collects, why, and what you can do about it.
        Coolors is built and run by Yash, an independent developer based in India.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>When you use the tools.</strong> You don't need an account to generate palettes. We and our
        partners collect standard usage data, such as pages visited, device and browser type, and
        approximate location from your IP address, using cookies and similar technologies, including
        Google Analytics.
      </p>
      <p>
        <strong>When you create an account.</strong> Your email address and name, from the sign-up form or
        your Google account, and the palettes you save: their names, colors, and whether they are public.
      </p>
      <p>
        <strong>When you buy Pro.</strong> Your payment is handled entirely by Razorpay, or by PayPal for
        payments from outside India. We receive and keep only the order ID, payment ID, amount, currency and
        date. We never see or store your card number, UPI ID or bank details.
      </p>
      <p>
        <strong>In your browser.</strong> We keep small pieces of data in your browser's local and session
        storage, such as your current palette, recently loaded palettes, theme preference and sign-in
        state, so the site works as you'd expect. This stays on your device.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To run the site and your account, including saving and syncing your palettes</li>
        <li>To activate Pro and to handle payment questions and refunds</li>
        <li>To show palettes you've made public to other visitors on the Explore page</li>
        <li>To understand how the site is used and improve it</li>
        <li>To show ads to visitors who don't have Pro</li>
      </ul>

      <h2>Advertising</h2>
      <p>
        Ads on Coolors are served by Mediavine, which with its partners may use cookies and device
        identifiers to show relevant ads and measure how they perform. Pro members are not shown ads. You
        can limit personalized advertising through your browser settings or industry opt-out tools.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We don't sell your personal data. We share it only with the services that run Coolors: Supabase
        (accounts and palette storage), Razorpay and PayPal (payments), Mediavine (advertising), Google
        (analytics and web fonts) and Vercel (hosting). Each processes data under its own privacy policy. We may also
        disclose information where the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Account data and saved palettes are kept until you delete them or ask us to delete your account.
        Payment records are kept for as long as we need them for accounting and legal obligations.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Make a palette private or delete it at any time</li>
        <li>
          Ask for a copy of your data, or ask us to correct or delete it, by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
        <li>Block or clear cookies in your browser settings, though some features may stop working</li>
      </ul>

      <h2>Children</h2>
      <p>
        Coolors isn't directed at children under 13, and we don't knowingly collect their personal data.
        If you believe a child has given us personal data, contact us and we'll delete it.
      </p>

      <h2>Changes</h2>
      <p>We'll post any updates on this page and change the date at the top.</p>

      <h2>Contact</h2>
      <p>
        Questions or requests about your data: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
