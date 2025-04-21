import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Github, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn("bg-gradient-to-r from-gray-50 to-gray-100 py-6 sm:py-8 rounded-2xl border border-gray-200", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-7">
                <img src="/logo_circles.svg" alt="Coolors.in Logo" className="h-full" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Coolors.in
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
              Our color palette generator helps designers and developers create beautiful, harmonious color combinations with ease.
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white text-gray-700 hover:text-blue-600 rounded-full border border-gray-200 shadow-sm transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="mailto:coolors.in@gmail.com"
                className="p-2 bg-white text-gray-700 hover:text-blue-600 rounded-full border border-gray-200 shadow-sm transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Application</h4>
              <ul className="space-y-2">
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '/visualize'}
                  >
                    Visualizer
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '/image-palette'}
                  >
                    Image to Palette
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '/designers-guide'}
                  >
                    Designer's Guide
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '/faq'}
                  >
                    FAQ
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '/privacy-policy'}
                  >
                    Privacy Policy
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
                <li>
                  <div 
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => window.location.href = '#'}
                  >
                    Terms of Service
                    <ArrowUpRight className="ml-1" size={12} />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            © {currentYear} Coolors.in - All rights reserved.
          </div>
          <div className="mt-3 sm:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for designers everywhere
          </div>
        </div>
      </div>
    </footer>
  );
}