import React, { useState } from "react";
import SEOHead from '@/components/SEOHead';
import { Palette, Heart, ArrowRight, Mail, Users, Sparkles, Code2, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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
            "name": "Coolors",
            "url": "https://www.coolors.in"
          }
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <main className="container mx-auto px-4 py-16 max-w-4xl">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Coolors.in
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A free color palette generator built for designers, developers and artists — designed to make beautiful color work effortless.
          </p>
        </div>

        {/* Story */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Coolors.in started with a simple frustration: finding the right color palette for a project took too long. Switching between tools, manually adjusting hex codes, and second-guessing combinations ate up hours that should have been spent designing.
              </p>
              <p>
                So we built a better way. Press the spacebar — get a new palette. Lock the colors you love. Tweak the rest. Export in the exact format your workflow needs. What used to take an hour now takes seconds.
              </p>
              <p>
                The tool grew from a personal utility into something we wanted to share with everyone. Today Coolors.in offers a full suite of color tools — from a WCAG contrast checker to a Korean personal color analysis — all free, all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Creator */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Built by a Designer Who Codes</h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Yash</h3>
                <p className="text-violet-100 leading-relaxed mb-4">
                  Coolors.in is built and maintained by Yash — a developer with a passion for design tools. Every feature on this site comes from real-world design problems: the generator exists because picking harmonious colors is hard, the contrast checker exists because accessibility matters, and the Korean Color Analysis exists because personal color theory deserves a modern, free tool.
                </p>
                <a
                  href="mailto:rajyash73@gmail.com"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium"
                >
                  <Mail size={15} />
                  rajyash73@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Heart className="w-7 h-7 text-pink-500" />,
                  title: "Always Free",
                  desc: "Every tool on Coolors.in is completely free. No paywalls, no subscription tiers, no sign-up required to generate and export.",
                },
                {
                  icon: <Users className="w-7 h-7 text-violet-500" />,
                  title: "Built for Everyone",
                  desc: "Whether you're a professional designer, a developer building a UI, or a student learning color theory — Coolors.in works for you.",
                },
                {
                  icon: <Sparkles className="w-7 h-7 text-amber-500" />,
                  title: "Community First",
                  desc: "Palettes shared on the Explore page enrich the color pool for every user. Your taste shapes what the world creates.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="text-center p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex justify-center mb-3">{icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What We Offer</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Eight free tools — all in one place.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Color Palette Generator", href: "/generator", desc: "Generate palettes with color theory modes — complementary, analogous, triadic and more." },
                { label: "Explore Palettes", href: "/explore", desc: "Browse 190+ curated palettes from the community. Filter by color, style or mood." },
                { label: "Palette Visualizer", href: "/visualize", desc: "See how your colors look in real UI templates — dashboards, landing pages, chat apps." },
                { label: "Image to Palette", href: "/image-palette", desc: "Extract dominant colors from any photo and apply them directly to the generator." },
                { label: "Contrast Checker", href: "/contrast-checker", desc: "Verify WCAG 2.1 AA/AAA compliance for accessible, readable designs." },
                { label: "Gradient Generator", href: "/gradient-generator", desc: "Build CSS linear, radial and conic gradients with live preview and instant export." },
                { label: "Color Picker", href: "/color-picker", desc: "Inspect any color. Get HEX, RGB and HSL codes plus shades, tints and tones." },
                { label: "Korean Color Analysis", href: "/korean-color-analysis", desc: "Find your personal color season — Spring, Summer, Autumn or Winter — from a photo." },
              ].map(({ label, href, desc }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all group"
                >
                  <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                    <ArrowRight size={14} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Global reach */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Used Worldwide</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Coolors.in is used by designers, developers and artists across the US, UK, Europe, India, and beyond.
                  The site is available in multiple languages and optimised for global audiences — because great color design is universal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-12 border border-transparent dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Start Creating</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Jump into the generator and build your first palette — free, instant, no sign-up required.
          </p>
          <a
            href="/generator"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-colors shadow-lg"
          >
            Open the Generator
            <ArrowRight size={18} />
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
}
