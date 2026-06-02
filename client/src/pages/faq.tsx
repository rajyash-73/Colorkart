import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'wouter';
import { ArrowLeft, Mail } from 'lucide-react';
import Footer from '@/components/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col">
      <SEOHead
        title="FAQ — Color Palette Generator | Coolors"
        description="Find answers to common questions about Coolors color palette generator. Learn how to generate, save, export palettes and use color theory. Help for designers worldwide."
        keywords="color palette generator FAQ, color tool help, how to use color palette generator, palette generator guide, colour palette generator FAQ, color tool questions, color theory help"
        canonicalPath="/faq"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is Coolors?", "acceptedAnswer": { "@type": "Answer", "text": "Coolors is a free online color palette generator that helps you create aesthetic color combinations for your design projects." } },
            { "@type": "Question", "name": "Do I need to create an account?", "acceptedAnswer": { "@type": "Answer", "text": "No, you can use the tool right away without any sign-up or login." } },
            { "@type": "Question", "name": "Can I use the palettes for commercial use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all palettes are free to use for personal or commercial projects." } },
            { "@type": "Question", "name": "How do I generate a palette?", "acceptedAnswer": { "@type": "Answer", "text": "Press the spacebar or click the Generate button on the palette generator page to create a new random color palette." } },
            { "@type": "Question", "name": "What export formats are available?", "acceptedAnswer": { "@type": "Answer", "text": "You can export palettes as PNG images, JSON, CSS variables, SCSS variables, and Tailwind config." } }
          ]
        }}
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-6 flex-grow">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <div
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="mr-1" size={20} />
              Back to Home
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">1. What is Coolors?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Coolors is a free online color palette generator that helps you create aesthetic color combinations for your design projects.
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">2. Do I need to create an account?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No, you can use the tool right away without any sign-up or login.
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">3. Can I copy or download the color palettes?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can copy hex codes and soon we'll offer options to export palettes as images or JSON files.
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">4. Can I use the palettes for commercial use?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, all palettes are free to use for personal or commercial projects.
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">5. Does Coolors store my data?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No personal data is stored. We use anonymous tracking through cookies and analytics tools. Read our <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => window.location.href = '/privacy-policy'}>Privacy Policy</span> for details.
            </p>
          </div>
          
          <div className="pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">6. I have a suggestion or feedback. How can I reach you?</h2>
            <p className="text-gray-600 flex items-center">
              Email us anytime at <a href="mailto:Coolors@gmail.com" className="text-blue-600 hover:underline mx-1 flex items-center"><Mail size={16} className="mr-1" /> Coolors@gmail.com</a> — we'd love to hear from you!
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}