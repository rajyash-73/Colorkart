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
 * Link styling targets links inside paragraphs and list items only, so cards
 * and buttons placed in the content keep their own look.
 */
export default function LegalPage({
  title,
  heading,
  description,
  path,
  showUpdated = true,
  aside,
  children,
}: {
  title: string;
  heading: string;
  description: string;
  path: string;
  showUpdated?: boolean;
  /** Optional right-hand column on wide screens; stacks below on narrow ones. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <SEOHead title={title} description={description} canonicalPath={path} />
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 ${aside ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{heading}</h1>
        {showUpdated && <p className="mt-2 text-sm text-gray-400">Last updated: {LEGAL_UPDATED}</p>}

        <div className={aside ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10' : undefined}>
        <div
          className="mt-8 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300
            [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
            [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white
            [&_p_a]:text-violet-600 dark:[&_p_a]:text-violet-400 [&_p_a]:underline [&_p_a]:underline-offset-2
            [&_li_a]:text-violet-600 dark:[&_li_a]:text-violet-400 [&_li_a]:underline [&_li_a]:underline-offset-2"
        >
          {children}
        </div>
        {/* Outside the text wrapper, so none of the prose styling reaches it. */}
        {aside && <aside className="mt-10 lg:sticky lg:top-24 lg:mt-8">{aside}</aside>}
        </div>
      </main>

      <Footer />
    </div>
  );
}
