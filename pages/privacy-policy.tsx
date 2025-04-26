import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../client/src/components/Header';
import Footer from '../client/src/components/Footer';
import { InArticleAd } from '../components/AdSense';

const PrivacyPolicyPage: NextPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Privacy Policy - Coolors.in | Color Palette Generator</title>
        <meta name="description" content="Learn about how Coolors.in handles your data and privacy. We're committed to transparency and protecting your personal information." />
        <meta name="keywords" content="privacy policy, data protection, Coolors.in privacy" />
        <link rel="canonical" href="https://coolors.in/privacy-policy" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              'name': 'Privacy Policy - Coolors.in',
              'description': 'Learn about how Coolors.in handles your data and privacy.',
              'publisher': {
                '@type': 'Organization',
                'name': 'Coolors.in',
                'logo': {
                  '@type': 'ImageObject',
                  'url': 'https://coolors.in/logo.svg'
                }
              }
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 mt-4">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-4 text-gray-600">Last updated: April {currentYear}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Coolors.in ("we," "our," or "us"). We are committed to protecting your privacy and providing a safe online experience. This Privacy Policy explains how we collect, use, and share information about you when you use our website at coolors.in and services (collectively, the "Services").
            </p>
            <p className="text-gray-700">
              By using our Services, you agree to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not agree, please do not use our Services.
            </p>
          </section>
          
          <InArticleAd />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 Information You Provide to Us</h3>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, save color palettes, or contact us. This information may include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Account information (e.g., name, email address, password)</li>
              <li>User-generated content (e.g., color palettes you create or save)</li>
              <li>Communications with us</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-800 mb-2">2.2 Information We Collect Automatically</h3>
            <p className="text-gray-700 mb-4">
              When you use our Services, we automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Device information (e.g., IP address, browser type, operating system)</li>
              <li>Usage information (e.g., pages visited, time spent on pages, actions taken)</li>
              <li>Location information (based on IP address)</li>
              <li>Cookies and similar technologies (see our Cookie Policy section below)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process and fulfill your requests</li>
              <li>Send you technical notices, updates, and administrative messages</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Protect against harmful or unlawful activity</li>
            </ul>
          </section>
          
          <InArticleAd />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Sharing of Information</h2>
            <p className="text-gray-700 mb-4">
              We may share information about you as follows:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>With vendors, service providers, and consultants who need access to such information to perform services for us</li>
              <li>In response to a request for information if we believe disclosure is in accordance with applicable law</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of us or others</li>
              <li>In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookie Policy</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies like web beacons, pixel tags, and local storage to provide and improve our Services. These technologies help us remember your preferences, understand how you use our Services, and customize your experience.
            </p>
            <p className="text-gray-700 mb-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Essential cookies:</strong> Necessary for the functionality of our Services</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics cookies:</strong> Help us understand how users interact with our Services</li>
              <li><strong>Advertising cookies:</strong> Used to deliver relevant advertisements and track ad campaign performance</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of our Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Accessing, correcting, or deleting your personal information</li>
              <li>Objecting to our processing of your personal information</li>
              <li>Requesting restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Withdrawing consent at any time (where processing is based on consent)</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, please contact us at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:text-blue-800">coolors.in@gmail.com</a>.
            </p>
          </section>
          
          <InArticleAd />
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              Our Services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete that information as quickly as possible. If you believe that a child under 16 has provided us with personal information, please contact us at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:text-blue-800">coolors.in@gmail.com</a>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Data Security</h2>
            <p className="text-gray-700">
              We take reasonable measures to protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot guarantee the security of our systems or your information.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to this Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by updating the date at the top of this Privacy Policy and, in some cases, we may provide additional notice. Your continued use of our Services after the updated Privacy Policy has been posted constitutes your acceptance of the changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at <a href="mailto:coolors.in@gmail.com" className="text-blue-600 hover:text-blue-800">coolors.in@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default PrivacyPolicyPage;