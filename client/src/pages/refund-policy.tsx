import React from 'react';
import LegalPage, { CONTACT_EMAIL, REFUND_DAYS } from '@/components/LegalPage';
import { PRO_PRICE_LABEL, FREE_SAVE_LIMIT } from '@/hooks/use-pro';

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund and Cancellation Policy | Coolors.in"
      heading="Refund and Cancellation Policy"
      description={`Coolors.in Pro comes with a ${REFUND_DAYS}-day full refund. Learn how to request a refund, how long it takes, and what happens to your account.`}
      path="/refund-policy"
    >
      <p>
        Coolors.in Pro is a one-time digital purchase of {PRO_PRICE_LABEL} that unlocks features on
        Coolors.in. This policy explains when you can get your money back and how.
      </p>

      <h2>{REFUND_DAYS}-day refund</h2>
      <p>
        If Pro isn't right for you, email us within {REFUND_DAYS} days of your purchase and we'll refund you in full.
        No questions asked.
      </p>

      <h2>Charged but Pro didn't activate, or charged twice</h2>
      <p>
        Contact us at any time, not only within {REFUND_DAYS} days. If Pro didn't activate, we'll either activate it
        on your account or refund the charge, whichever you prefer. Duplicate charges are always refunded.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the email address on your
        Coolors.in account and the Razorpay payment ID from your receipt (it starts with <strong>pay_</strong>).
      </p>

      <h2>When you'll receive it</h2>
      <p>
        Approved refunds are issued to your original payment method within 5 to 7 business days. Your bank
        or card issuer may take a few more days to show it on your statement.
      </p>

      <h2>What happens to your account</h2>
      <p>
        Once a refund is issued, Pro features are removed from your account. Palettes you have already
        saved stay yours to view and delete; you just can't save new ones beyond the free limit of{' '}
        {FREE_SAVE_LIMIT}.
      </p>

      <h2>Cancellations</h2>
      <p>
        Pro is not a subscription, so there is nothing to cancel and you will never be charged again.
        After {REFUND_DAYS} days, purchases are non-refundable except in the cases described above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about a payment or refund: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
