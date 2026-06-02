import React from "react";
import SEOHead from '@/components/SEOHead';
import { RefreshCw, Lock, GripVertical, Download, ArrowRight, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function GeneratorGuide() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SEOHead
        title="Color Palette Generator Guide | Coolors"
        description="Learn how to use the Coolors color palette generator. Understand color theory modes, how to lock colors, export palettes and more. Complete guide for designers and developers."
        keywords="color palette generator guide, how to use color palette generator, color theory modes explained, complementary analogous triadic palette, palette export guide, color scheme generator tutorial"
        canonicalPath="/generator-guide"
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Color Palette Generator Guide",
          "description": "Learn how to use the Coolors color palette generator with color theory modes, locking, exporting and more.",
          "author": { "@type": "Organization", "name": "Coolors", "url": "https://www.coolors.in" },
          "publisher": { "@type": "Organization", "name": "Coolors", "url": "https://www.coolors.in" },
          "url": "https://www.coolors.in/generator-guide"
        }}
      />

      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={() => setMobileMenuOpen(m => !m)} />

      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Color Palette Generator
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              Complete Guide
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about generating, customising and exporting color palettes with Coolors — from basic controls to advanced color theory.
          </p>
          <a
            href="/generator"
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
          >
            Open the Generator
            <ArrowRight className="ml-2" size={20} />
          </a>
        </div>

        {/* How to use */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How to Use the Color Palette Generator</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Generating a color palette with Coolors takes seconds. Press the <strong>spacebar</strong> or click <strong>Generate</strong> to
              instantly create a new five-color palette. If you find a color you love, click the <strong>lock icon</strong> to keep it in place
              while the rest of the palette regenerates around it. You can <strong>drag and drop</strong> swatches to reorder them, and{" "}
              <strong>click any color</strong> to fine-tune its hue, saturation and lightness with the built-in color picker. When your palette
              is ready, hit <strong>Export</strong> to download it as a PNG image, CSS custom properties, SCSS variables, Tailwind config or raw
              JSON — whatever fits your workflow.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <RefreshCw size={28} className="text-violet-600" />, title: "Generate", desc: "Press spacebar or click Generate to create a new random palette instantly." },
                { icon: <Lock size={28} className="text-violet-600" />, title: "Lock Colors", desc: "Click the lock icon on any swatch to keep it while regenerating the others." },
                { icon: <GripVertical size={28} className="text-violet-600" />, title: "Reorder", desc: "Drag and drop swatches to arrange them in any order you like." },
                { icon: <Download size={28} className="text-violet-600" />, title: "Export", desc: "Export as PNG, CSS, SCSS, Tailwind config or JSON in one click." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="text-center p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-xl">
                  <div className="flex justify-center mb-3">{icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Color Theory Modes */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Color Theory Modes Explained</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              The generator offers five color theory modes, each based on established relationships on the color wheel.
              Choosing the right mode sets a harmonic foundation before you start locking and tweaking individual swatches.
            </p>
            <div className="space-y-6">
              {[
                {
                  name: "Complementary",
                  color: "bg-violet-600",
                  desc: "Complementary colors sit directly opposite each other on the color wheel — think blue and orange, or red and green. This pairing creates maximum contrast, making designs feel energetic and bold. Use it when you want a primary action color to pop against a neutral background.",
                },
                {
                  name: "Analogous",
                  color: "bg-blue-600",
                  desc: "Analogous colors are neighbors on the color wheel, such as yellow, yellow-green and green. They produce naturally harmonious, cohesive palettes that feel calm and unified — ideal for backgrounds, UI surfaces and brand identities that need to feel approachable rather than attention-grabbing.",
                },
                {
                  name: "Triadic",
                  color: "bg-indigo-600",
                  desc: "A triadic scheme uses three hues spaced evenly around the color wheel — 120° apart. The result is vibrant and well-balanced, giving each color roughly equal visual weight. It's a popular choice for illustration, game UI and anywhere you want a lively, multi-color look without feeling chaotic.",
                },
                {
                  name: "Tetradic",
                  color: "bg-purple-600",
                  desc: "Tetradic (also called double-complementary) uses four hues arranged as two complementary pairs. This gives you the richest variety of any scheme, but requires careful balancing — let one color dominate and use the others as accents to avoid visual overload.",
                },
                {
                  name: "Monochromatic",
                  color: "bg-slate-600",
                  desc: "Monochromatic palettes use a single hue at varying levels of lightness and saturation. The result is elegant and refined — extremely easy to use in UI design because every shade naturally works together. It's the safest starting point if you're new to color theory.",
                },
              ].map(({ name, color, desc }) => (
                <div key={name} className="flex gap-4">
                  <div className={`w-1 rounded-full flex-shrink-0 ${color}`} />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: "How do I generate a color palette?",
                  a: "Press the spacebar or click Generate to create a new random palette instantly. Lock any color you want to keep by clicking the lock icon, then generate again — only unlocked swatches will change.",
                },
                {
                  q: "What color theory modes are available?",
                  a: "Five modes: Complementary (opposite hues, high contrast), Analogous (adjacent hues, harmonious), Triadic (3 equidistant hues, vibrant), Tetradic (4 hues, rich variety), and Monochromatic (one hue at varying lightness).",
                },
                {
                  q: "Can I save my color palettes for free?",
                  a: "Yes. Create a free Coolors account to save unlimited palettes to your library. Saved palettes sync across all devices and can be shared publicly with the community on the Explore page.",
                },
                {
                  q: "How do I export a color palette?",
                  a: "Click Export in the generator toolbar. Choose from PNG image, CSS custom properties, SCSS variables, Tailwind config or JSON format.",
                },
                {
                  q: "Is the color palette generator free?",
                  a: "Yes. Coolors is completely free — no subscription or sign-up required to generate, export and share color palettes. Create an account only if you want to save palettes to your library.",
                },
                {
                  q: "Can I add or remove colors from a palette?",
                  a: "Yes. Use the Add Color button in the toolbar to expand the palette, or click the delete icon on any swatch to remove it. Palettes can have between 2 and 10 colors.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-bold text-lg mb-2">{q}</h3>
                  <p className="text-violet-100 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-violet-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-12 border border-transparent dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Create Your Palette?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Open the generator and start building beautiful color combinations in seconds.
          </p>
          <a
            href="/generator"
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-blue-700 transition-colors duration-300 shadow-lg inline-flex items-center gap-2"
          >
            Open the Generator
            <ArrowRight size={20} />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
