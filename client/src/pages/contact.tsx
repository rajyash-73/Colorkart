import React from 'react';
import { Mail } from 'lucide-react';
import LegalPage, { CONTACT_EMAIL } from '@/components/LegalPage';

export default function Contact() {
  return (
    <LegalPage
      title="Contact Us | Coolors"
      heading="Contact Us"
      description={`Get in touch with Coolors for help with your account, Pro purchases, refunds or feedback. Email ${CONTACT_EMAIL}.`}
      path="/contact"
      showUpdated={false}
    >
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mb-8 flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
          <Mail size={20} className="text-violet-600 dark:text-violet-400" />
        </span>
        <span>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Email</span>
          <span className="block text-lg font-semibold text-gray-900 dark:text-white">{CONTACT_EMAIL}</span>
        </span>
      </a>

      <p>We aim to reply within two business days.</p>

      <h2>Payments and Pro</h2>
      <p>
        Charged but Pro isn't active, charged twice, or want a refund? Email us with the email address on
        your Coolors account and the Razorpay payment ID from your receipt (it starts with{' '}
        <strong>pay_</strong>). That lets us find your payment straight away.
      </p>

      <h2>Everything else</h2>
      <p>
        Bug reports, feature ideas, feedback and business enquiries are all welcome at the same address.
      </p>

      <h2>Who runs Coolors</h2>
      <p>
        coolors.in is built and run by Yash, an independent developer based in India.
      </p>
    </LegalPage>
  );
}
