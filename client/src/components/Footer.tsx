import React from 'react';
import { ArrowUpRight, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const APP_LINKS = [
  { label: 'Color Palette Generator',      href: '/generator' },
  { label: 'Explore Palettes',             href: '/explore' },
  { label: 'Contrast Checker',             href: '/contrast-checker' },
  { label: 'Gradient Generator',           href: '/gradient-generator' },
  { label: 'Color Picker',                 href: '/color-picker' },
  { label: 'Image to Palette',             href: '/image-palette' },
  { label: 'Palette Visualizer',           href: '/visualize' },
  { label: 'Font Generator',               href: '/font-generator' },
  { label: 'Korean Color Analysis',        href: '/korean-color-analysis' },
];

const RESOURCE_LINKS = [
  { label: "Designer's Guide",    href: '/designers-guide' },
  { label: 'Generator Guide',     href: '/generator-guide' },
  { label: 'Korean Color Analysis Guide', href: '/korean-color-analysis-guide' },
  { label: 'Visualizer Guide',    href: '/visualizer-guide' },
  { label: 'Image Palette Guide', href: '/image-palette-guide' },
  { label: 'FAQ',                 href: '/faq' },
];

const LEGAL_LINKS = [
  { label: 'About',          href: '/about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 text-sm"
      >
        {label}
        <ArrowUpRight size={11} className="opacity-60" />
      </a>
    </li>
  );
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-16 h-7">
                <img src="/logo_circles.svg" alt="Coolors Logo" className="h-full" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Coolors
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              The super fast color palette generator for designers and developers.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created by <span className="font-semibold text-gray-900 dark:text-white">Yash</span>
              </p>
              <a
                href="mailto:rajyash73@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors"
              >
                rajyash73@gmail.com
              </a>
            </div>
            <div className="flex items-center mt-4 gap-2">
              <a
                href="mailto:rajyash73@gmail.com"
                className="p-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Applications</h4>
            <ul className="space-y-2.5">
              {APP_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-500">
          <span>© {currentYear} Coolors — All rights reserved.</span>
          <span className="mt-2 sm:mt-0 flex items-center gap-1">
            Made with <Heart size={13} className="text-red-500" /> for designers everywhere
          </span>
        </div>
      </div>
    </footer>
  );
}
