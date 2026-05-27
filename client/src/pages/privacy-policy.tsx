import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <SEOHead
        title="Privacy Policy"
        description="Learn about how Coolors collects, uses, and protects your information when using our free color palette generator tool."
        keywords="privacy policy, Coolors privacy"
        canonicalPath="/privacy-policy"
        noIndex={true}
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Privacy Policy</h1>
            <div
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="mr-1" size={20} />
              Back to Home
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Effective date: April 20, 2025</p>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-6">
            At Coolors, your privacy is important to us. This Privacy Policy explains how we collect, use, 
            and protect your information when you use our website.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Information We Collect:</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              <span className="font-medium">Usage Data:</span> We collect anonymous data such as browser type, 
              device information, pages visited, and interaction time.
            </li>
            <li className="mb-2">
              <span className="font-medium">Cookies:</span> We use cookies to improve user experience, analyze traffic, 
              and serve personalized ads via services like Google AdSense.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">How We Use Your Information:</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">To improve website functionality</li>
            <li className="mb-2">To understand user preferences and behaviors</li>
            <li className="mb-2">To serve relevant ads via Google AdSense</li>
          </ul>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Third-Party Services:</h2>
          <p className="mb-6">
            We use services such as Google Analytics and AdSense. These services may collect and use cookies 
            or identifiers. Learn more about how Google uses your data.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Managing Cookies:</h2>
          <p className="mb-6">
            You can disable cookies in your browser settings, but some site features may not work properly.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Data Security:</h2>
          <p className="mb-6">
            We don't collect any personal information such as names or email addresses. 
            All usage is anonymous.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Children's Privacy:</h2>
          <p className="mb-6">
            Coolors does not knowingly collect information from children under the age of 13.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Policy Updates:</h2>
          <p className="mb-6">
            We may update this policy from time to time. Changes will be posted with a new effective date.
          </p>

          <h2 className="text-xl font-semibold mb-3 dark:text-white">Contact:</h2>
          <p className="mb-6">
            If you have questions, email us at <a href="mailto:Coolors@gmail.com" className="text-blue-600 hover:underline">Coolors@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}