import React, { useState } from "react";
import SEOHead from '@/components/SEOHead';
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/components/LegalPage";
import { PRO_PRICE_LABEL } from "@/hooks/use-pro";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="About Coolors.in — Free Color Palette Generator"
        description="Learn about Coolors.in — a free color palette generator built for designers, developers and artists. Discover our story, mission and the tools we offer."
        keywords="about coolors, color palette generator about, who made coolors, coolors creator, color tool for designers"
        canonicalPath="/about"
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Coolors.in",
          "url": "https://www.coolors.in/about",
          "description": "Coolors.in is a free color palette generator built for designers, developers and artists worldwide.",
          "author": {
            "@type": "Person",
            "name": "Yash",
            "email": "rajyash73@gmail.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Coolors.in",
            "url": "https://www.coolors.in"
          }
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <article
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-10
            text-[15px] leading-relaxed text-gray-600 dark:text-gray-300
            [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
            [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white
            [&_p_a]:text-violet-600 dark:[&_p_a]:text-violet-400 [&_p_a]:underline [&_p_a]:underline-offset-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">About Coolors.in</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            A free color palette generator built for designers, developers and artists — designed to make
            beautiful color work effortless.
          </p>

          <h2>Our story</h2>
          <p>
            Coolors.in started with a simple frustration: finding the right color palette for a project took too
            long. Switching between tools, manually adjusting hex codes, and second-guessing combinations ate up
            hours that should have been spent designing.
          </p>
          <p>
            So we built a better way. Press the spacebar — get a new palette. Lock the colors you love. Tweak the
            rest. Export in the exact format your workflow needs. What used to take an hour now takes seconds.
          </p>
          <p>
            The tool grew from a personal utility into something we wanted to share with everyone. Today
            Coolors.in offers a full suite of color tools — from a WCAG contrast checker to a Korean personal
            color analysis — most of them free, all in one place.
          </p>

          <h2>A note from the creator</h2>
          <p>
            I'm Yash, and I built Coolors.in to democratize color palette generation. Generate unlimited color
            palettes, or browse the Explore library: curated palettes plus ones shared by the community.
          </p>
          <p>
            Pro is a one-time <strong>{PRO_PRICE_LABEL}</strong>, no subscription. It removes ads for good and
            unlocks unlimited saves, the visualizer, image-to-palette and font pairing.{' '}
            <strong>Generating always stays free.</strong>
          </p>
          <p>
            Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>Happy generating!</p>

          <h2>Our mission</h2>
          <ul>
            <li>
              <strong>Free to start.</strong> Generating, exporting and sharing palettes is free with no sign-up.
              A single one-time payment unlocks the Pro tools — no subscription, ever.
            </li>
            <li>
              <strong>Built for everyone.</strong> Whether you're a professional designer, a developer building a
              UI, or a student learning color theory — Coolors.in works for you.
            </li>
            <li>
              <strong>Community first.</strong> Palettes shared on the Explore page enrich the color pool for every
              user. Your taste shapes what the world creates.
            </li>
          </ul>

          <h2>Used worldwide</h2>
          <p>
            Coolors.in is used by designers, developers and artists across the US, UK, Europe, India, and beyond.
            The site is available in multiple languages and optimised for global audiences — because great color
            design is universal.
          </p>

          <a
            href="/generator"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 font-semibold text-white transition-colors"
          >
            Open the generator
            <ArrowRight size={18} />
          </a>
        </article>
      </main>

      <Footer />
    </div>
  );
}
