import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../client/src/components/Header';

// Define the FAQ data structure
type FAQ = {
  question: string;
  answer: React.ReactNode;
};

const FAQPage: NextPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // FAQ data with rich HTML content
  const faqs: FAQ[] = [
    {
      question: "What is Coolors.in?",
      answer: (
        <p>
          Coolors.in is a free color palette generator that helps designers, developers, and creatives discover, create, and share beautiful color combinations for their projects. It offers intuitive tools to generate, adjust, export, and visualize color palettes.
        </p>
      )
    },
    {
      question: "How do I generate a new color palette?",
      answer: (
        <div>
          <p>There are multiple ways to generate a color palette in Coolors.in:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Press the spacebar on your keyboard (the easiest way)</li>
            <li>Click the "Generate" button in the action bar</li>
            <li>Choose a trending palette from the sidebar</li>
            <li>Upload an image to extract colors</li>
            <li>Select a color theory (complementary, analogous, etc.) from the dropdown</li>
          </ul>
        </div>
      )
    },
    {
      question: "Can I lock specific colors while generating others?",
      answer: (
        <p>
          Yes! Click the lock icon on any color you want to keep fixed. When you generate a new palette (with spacebar or the generate button), locked colors will remain unchanged while other colors will be regenerated.
        </p>
      )
    },
    {
      question: "How do I adjust the colors in my palette?",
      answer: (
        <p>
          Click on any color's "Adjust" button to open the color adjustment modal. You can fine-tune the color using RGB sliders, or enter a specific hex code. Changes apply only to that specific color in your palette.
        </p>
      )
    },
    {
      question: "How can I save or export my palette?",
      answer: (
        <div>
          <p>You have several options to save or export your palette:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Click the "Save" button to store your palette locally</li>
            <li>Click the "Export" button to download your palette as a PNG image or JSON file</li>
            <li>Copy individual hex/RGB values by clicking on the format you need</li>
            <li>Create a URL with your palette to share with others</li>
          </ul>
        </div>
      )
    },
    {
      question: "What color theories are available?",
      answer: (
        <div>
          <p>Coolors.in provides several color theories to guide palette generation:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Monochromatic</strong>: Variations of a single color with different shades and tints</li>
            <li><strong>Analogous</strong>: Colors that sit next to each other on the color wheel</li>
            <li><strong>Complementary</strong>: Colors from opposite sides of the color wheel</li>
            <li><strong>Split-complementary</strong>: A color plus two colors adjacent to its complement</li>
            <li><strong>Triadic</strong>: Three colors evenly spaced around the color wheel</li>
            <li><strong>Tetradic</strong>: Two pairs of complementary colors</li>
            <li><strong>Neutral</strong>: Subtle, desaturated colors that work well as backgrounds</li>
          </ul>
        </div>
      )
    },
    {
      question: "How does the image-to-palette feature work?",
      answer: (
        <p>
          Navigate to the "Image Palette" page, upload an image, and our algorithm will extract the dominant colors from your image to create a harmonious palette. You can adjust the number of colors and extraction method to get the best results.
        </p>
      )
    },
    {
      question: "What is the Palette Visualizer?",
      answer: (
        <p>
          The Palette Visualizer shows how your colors would look in real-world UI components. It offers templates for dashboards, landing pages, analytics, chat interfaces, and calendars so you can see how your palette works in practical applications.
        </p>
      )
    },
    {
      question: "Can I use Coolors.in for commercial projects?",
      answer: (
        <p>
          Yes! Coolors.in is free to use for both personal and commercial projects. The color palettes you generate are yours to use however you wish. We appreciate attribution, but it's not required.
        </p>
      )
    },
    {
      question: "How do I contact Coolors.in for feedback or support?",
      answer: (
        <p>
          For feedback, support, or business inquiries, please email us at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:text-blue-800 underline">coolors.in@gmail.com</a>. We welcome suggestions for new features and improvements!
        </p>
      )
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>FAQ - Coolors.in | Color Palette Generator</title>
        <meta name="description" content="Find answers to frequently asked questions about Coolors.in's color palette generator, features, and how to make the most of our tools." />
        <meta name="keywords" content="color palette FAQ, color generator help, Coolors.in tutorial" />
        <link rel="canonical" href="https://coolors.in/faq" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  // Convert React nodes to plain text for structured data
                  'text': typeof faq.answer === 'string' 
                    ? faq.answer 
                    : 'See our FAQ page for more details.'
                }
              }))
            })
          }}
        />
      </Head>
      
      <Header 
        onHelp={() => {}} 
        onExport={() => {}} 
        onSave={() => {}}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 mt-4">Frequently Asked Questions</h1>
        
        <div className="rounded-lg bg-white shadow-md">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`p-5 border-b border-gray-200 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{faq.question}</h2>
              <div className="text-gray-600 leading-relaxed">{faq.answer}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 bg-blue-50 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Still need help?</h2>
          <p className="text-blue-700 mb-4">
            If you couldn't find the answer you're looking for, check out our <Link href="/designers-guide" className="text-blue-600 hover:text-blue-800 underline">Designer's Guide</Link> for more in-depth information about color theory and best practices.
          </p>
          <p className="text-blue-700">
            For additional support, contact us at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:text-blue-800 underline">coolors.in@gmail.com</a>
          </p>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Coolors.in</h2>
              <p className="text-gray-400 text-sm mt-1">The super fast color palette generator</p>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/designers-guide" className="text-gray-300 hover:text-white transition-colors">
                Designer's Guide
              </Link>
              <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Coolors.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;