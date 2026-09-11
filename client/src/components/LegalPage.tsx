import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/** Support address used across the business and policy pages. */
export const CONTACT_EMAIL = 'coolors.in@gmail.com';

/** Shown as "Last updated" on the policy pages. Bump it when their text changes. */
export const LEGAL_UPDATED = 'September 11, 2026';

/** Days after purchase in which Pro can be refunded on request. Quoted by the
 *  Refund Policy and Pricing, so the two can never disagree. */
export const REFUND_DAYS = 2;

/**
 * Shared shell for Contact, Pricing and the policy pages. Deliberately plain:
 * these are read rather than browsed, and each is a page a payment reviewer
 * loads to check the business is real.
 *
 * `hero` renders full width between the heading and the text, outside the
 * prose styling, for cards and controls. `wide` widens the page for such a
 * hero while keeping the text below at a readable measure.
 *
 * Link styling targets links inside paragraphs and list items only, so cards
 * and buttons placed in the content keep their own look.
 */
export default function LegalPage({
  title,
  heading,
  description,
  path,
  showUpdated = true,
  wide = false,
  hero,
  children,
}: {
  title: string;
  heading: string;
  description: string;
  path: string;
  showUpdated?: boolean;
  wide?: boolean;
  hero?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <SEOHead title={title} description={description} canonicalPath={path} />
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 ${wide ? 'max-w-7xl pt-5 pb-10' : 'max-w-3xl py-10 sm:py-14'}`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{heading}</h1>
        {showUpdated && <p className="mt-2 text-sm text-gray-400">Last updated: {LEGAL_UPDATED}</p>}

        {hero && <div className="mt-3">{hero}</div>}

        <div
          className={`${hero ? 'mt-4' : 'mt-8'} ${wide ? 'max-w-3xl' : ''} text-[15px] leading-relaxed text-gray-600 dark:text-gray-300
            [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
            [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white
            [&_p_a]:text-violet-600 dark:[&_p_a]:text-violet-400 [&_p_a]:underline [&_p_a]:underline-offset-2
            [&_li_a]:text-violet-600 dark:[&_li_a]:text-violet-400 [&_li_a]:underline [&_li_a]:underline-offset-2`}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
