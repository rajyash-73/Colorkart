import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail } from 'lucide-react';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions | Coolors.in</title>
        <meta name="description" content="Find answers to common questions about Coolors.in color palette generator. Learn how to use our tool effectively and get the most out of your design process." />
        <meta name="keywords" content="FAQ, color palette generator, coolors help, design tools FAQ" />
        <link rel="canonical" href="https://coolors.in/faq" />
        {/* Dynamic structured data for the FAQ page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Coolors.in?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Coolors.in is a free online color palette generator that helps you create aesthetic color combinations for your design projects."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, you can use the tool right away without any sign-up or login."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use the palettes for commercial use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all palettes are free to use for personal or commercial projects."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 flex-grow">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <div 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="mr-1" size={20} />
              Back to Home
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">1. What is Coolors.in?</h2>
            <p className="text-gray-600">
              Coolors.in is a free online color palette generator that helps you create aesthetic color combinations for your design projects.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Do I need to create an account?</h2>
            <p className="text-gray-600">
              No, you can use the tool right away without any sign-up or login.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Can I copy or download the color palettes?</h2>
            <p className="text-gray-600">
              Yes, you can copy hex codes and soon we'll offer options to export palettes as images or JSON files.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Can I use the palettes for commercial use?</h2>
            <p className="text-gray-600">
              Yes, all palettes are free to use for personal or commercial projects.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Does Coolors.in store my data?</h2>
            <p className="text-gray-600">
              No personal data is stored. We use anonymous tracking through cookies and analytics tools. Read our <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => window.location.href = '/privacy-policy'}>Privacy Policy</span> for details.
            </p>
          </div>
          
          <div className="pb-5">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">6. I have a suggestion or feedback. How can I reach you?</h2>
            <p className="text-gray-600 flex items-center">
              Email us anytime at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:underline mx-1 flex items-center"><Mail size={16} className="mr-1" /> coolors.in@gmail.com</a> — we'd love to hear from you!
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}