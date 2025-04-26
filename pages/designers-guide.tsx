import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../client/src/components/Header';
import Footer from '../client/src/components/Footer';
import { SidebarAd, InArticleAd } from '../components/AdSense';

const DesignersGuide: NextPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Designer's Guide to Color Theory - Coolors.in</title>
        <meta name="description" content="Learn the fundamentals of color theory, color harmonies, and how to create stunning color palettes for your designs with our comprehensive guide." />
        <meta name="keywords" content="color theory, color harmonies, design guide, palette creation, color psychology" />
        <link rel="canonical" href="https://coolors.in/designers-guide" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              'headline': 'Designer\'s Guide to Color Theory',
              'image': 'https://coolors.in/designers-guide-banner.jpg',
              'author': {
                '@type': 'Organization',
                'name': 'Coolors.in'
              },
              'publisher': {
                '@type': 'Organization',
                'name': 'Coolors.in',
                'logo': {
                  '@type': 'ImageObject',
                  'url': 'https://coolors.in/logo.svg'
                }
              },
              'datePublished': '2023-01-15',
              'dateModified': new Date().toISOString().split('T')[0]
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

      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Designer's Guide to Color Theory</h1>
            <p className="text-xl md:text-2xl max-w-3xl opacity-90">
              Understanding the fundamental principles that will help you create harmonious and effective color palettes
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <nav className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">In this guide:</h2>
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <a href="#color-basics" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Color Basics
                    </a>
                  </li>
                  <li>
                    <a href="#color-harmonies" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Color Harmonies
                    </a>
                  </li>
                  <li>
                    <a href="#color-psychology" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Color Psychology
                    </a>
                  </li>
                  <li>
                    <a href="#accessibility" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Accessibility
                    </a>
                  </li>
                  <li>
                    <a href="#practical-tips" className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Practical Tips
                    </a>
                  </li>
                </ul>
              </nav>
              
              <section id="color-basics" className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">The Basics of Color Theory</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">The Color Wheel</h3>
                <p className="text-gray-700 mb-4">
                  The color wheel is a circular diagram of colors arranged according to their chromatic relationship. It serves as the foundation for understanding how colors relate to each other and how to create harmonious combinations.
                </p>
                <div className="flex justify-center mb-6">
                  <div className="w-full md:w-2/3 aspect-square rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-red-500 mb-4"></div>
                </div>
                <p className="text-gray-700 mb-6">
                  The traditional RYB (Red, Yellow, Blue) color wheel consists of primary, secondary, and tertiary colors:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong className="text-red-600">Primary colors:</strong> Red, Yellow, Blue - cannot be created by mixing other colors</li>
                  <li><strong className="text-orange-500">Secondary colors:</strong> Orange, Green, Purple - created by mixing two primary colors</li>
                  <li><strong className="text-yellow-600">Tertiary colors:</strong> Created by mixing a primary and its adjacent secondary color</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Color Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Hue</h4>
                    <p className="text-gray-700 text-sm">
                      The pure color itself; what we usually mean when we say "color" (red, blue, yellow, etc.)
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Saturation</h4>
                    <p className="text-gray-700 text-sm">
                      The intensity or purity of a color. Highly saturated colors are vivid, while less saturated colors appear more muted or gray.
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Value/Brightness</h4>
                    <p className="text-gray-700 text-sm">
                      The lightness or darkness of a color. Adding white creates a tint, adding black creates a shade.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Color Models</h3>
                <p className="text-gray-700 mb-4">
                  Different color models are used depending on the medium:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>RGB (Red, Green, Blue):</strong> Used for digital displays and screens. Additive color model.</li>
                  <li><strong>CMYK (Cyan, Magenta, Yellow, Black):</strong> Used for print. Subtractive color model.</li>
                  <li><strong>HSL/HSV (Hue, Saturation, Lightness/Value):</strong> More intuitive models for adjusting colors.</li>
                </ul>
              </section>
              
              <InArticleAd />
              
              <section id="color-harmonies" className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Color Harmonies</h2>
                <p className="text-gray-700 mb-6">
                  Color harmonies are predefined color combinations that work well together. Here are the main types:
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Monochromatic</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#CCEEFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#99DDFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#66CCFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#33AAFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#0088FF' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses different tints, shades, and tones of a single hue. Creates a cohesive and elegant look, but can lack contrast.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Analogous</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#FF9900' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFCC00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFFF00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#CCFF00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#99FF00' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses colors that are adjacent to each other on the color wheel. Creates a harmonious and comfortable design with enough variation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Complementary</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#FF0000' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FF6666' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFFFFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#6666FF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#0000FF' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses colors that are opposite each other on the color wheel. Creates a high-contrast, vibrant look that can be visually striking.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Split-Complementary</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#FF0000' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FF6666' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFFFFF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#66FF66' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#6666FF' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses a base color and the two colors adjacent to its complement. Offers strong visual contrast while being more versatile than a simple complementary scheme.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Triadic</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#FF0000' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FF6666' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFFF00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#66FF66' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#0000FF' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses three colors equally spaced around the color wheel. Creates a vibrant and balanced color scheme, even when using paler or unsaturated versions of the hues.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Tetradic (Double Complementary)</h3>
                    <div className="flex h-12 rounded-md overflow-hidden mb-3">
                      <div className="flex-1" style={{ backgroundColor: '#FF0000' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FFFF00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#00FF00' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#0000FF' }}></div>
                      <div className="flex-1" style={{ backgroundColor: '#FF00FF' }}></div>
                    </div>
                    <p className="text-gray-700">
                      Uses four colors arranged into two complementary pairs. Offers rich color possibilities but can be challenging to balance. Works best when one color dominates.
                    </p>
                  </div>
                </div>
              </section>
              
              <InArticleAd />
              
              <section id="color-psychology" className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Color Psychology</h2>
                <p className="text-gray-700 mb-6">
                  Colors can evoke emotional responses and associations. Understanding color psychology helps you choose colors that reinforce your message.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="font-semibold text-lg text-red-800 mb-2">Red</h3>
                    <p className="text-gray-700 text-sm">
                      Passion, energy, excitement, danger, attention-grabbing
                    </p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
                    <h3 className="font-semibold text-lg text-orange-800 mb-2">Orange</h3>
                    <p className="text-gray-700 text-sm">
                      Enthusiasm, creativity, playfulness, warmth, affordability
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="font-semibold text-lg text-yellow-800 mb-2">Yellow</h3>
                    <p className="text-gray-700 text-sm">
                      Optimism, happiness, warmth, caution, intellect
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-lg text-green-800 mb-2">Green</h3>
                    <p className="text-gray-700 text-sm">
                      Growth, harmony, health, nature, prosperity
                    </p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-lg text-blue-800 mb-2">Blue</h3>
                    <p className="text-gray-700 text-sm">
                      Trust, reliability, tranquility, professionalism, depth
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                    <h3 className="font-semibold text-lg text-purple-800 mb-2">Purple</h3>
                    <p className="text-gray-700 text-sm">
                      Luxury, creativity, wisdom, mystery, spirituality
                    </p>
                  </div>
                  <div className="bg-pink-100 p-4 rounded-lg border-l-4 border-pink-500">
                    <h3 className="font-semibold text-lg text-pink-800 mb-2">Pink</h3>
                    <p className="text-gray-700 text-sm">
                      Femininity, playfulness, romance, tenderness, youth
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-500">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Neutral (Black, White, Gray)</h3>
                    <p className="text-gray-700 text-sm">
                      Sophistication, balance, formality, simplicity, calmness
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Keep in mind that cultural context matters. Colors can have different meanings across different cultures and societies.
                </p>
              </section>
              
              <section id="accessibility" className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Color Accessibility</h2>
                <p className="text-gray-700 mb-6">
                  Ensuring your color choices are accessible to all users, including those with color vision deficiencies, is essential for inclusive design.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Color Contrast</h3>
                <p className="text-gray-700 mb-4">
                  WCAG (Web Content Accessibility Guidelines) recommends:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>AA standard:</strong> Contrast ratio of at least 4.5:1 for normal text and 3:1 for large text</li>
                  <li><strong>AAA standard:</strong> Contrast ratio of at least 7:1 for normal text and 4.5:1 for large text</li>
                </ul>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="py-2 px-4 rounded bg-blue-600 text-white mb-2">
                      Good contrast: White on blue
                    </div>
                    <p className="text-gray-800">This text has good contrast with the background</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
                    <div className="py-2 px-4 rounded bg-yellow-200 text-yellow-300 mb-2">
                      Poor contrast: Yellow on light yellow
                    </div>
                    <p className="text-gray-400">This text has poor contrast with the background</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Color Blindness Considerations</h3>
                <p className="text-gray-700 mb-4">
                  About 8% of men and 0.5% of women have some form of color vision deficiency. To design for color blindness:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Don't rely solely on color to convey information</li>
                  <li>Use patterns, icons, or labels along with colors</li>
                  <li>Test your designs with color blindness simulation tools</li>
                  <li>Use colors with distinctly different brightness levels</li>
                </ul>
              </section>
              
              <InArticleAd />
              
              <section id="practical-tips" className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Practical Tips for Creating Palettes</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">The 60-30-10 Rule</h3>
                <p className="text-gray-700 mb-4">
                  A classic interior design principle that applies equally well to visual design:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>60%:</strong> Dominant color (backgrounds, large areas)</li>
                  <li><strong>30%:</strong> Secondary color (supporting elements)</li>
                  <li><strong>10%:</strong> Accent color (calls to action, highlights)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Starting Points for Palette Creation</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Start with a Brand Color</h4>
                    <p className="text-gray-700 text-sm">
                      If you have a brand color, use it as a starting point and build your palette around it using color harmony principles.
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Draw from Nature</h4>
                    <p className="text-gray-700 text-sm">
                      Nature's color schemes are inherently harmonious. Landscapes, plants, animals, and minerals can provide inspiring color combinations.
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Use Photography</h4>
                    <p className="text-gray-700 text-sm">
                      Extract colors from photographs that capture the mood you want to convey. Our Image Palette tool can help with this!
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Look at Competitors</h4>
                    <p className="text-gray-700 text-sm">
                      Analyze what colors are being used in your industry. You might want to align with industry expectations or deliberately stand out.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Refinement Tips</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Limit your palette to 3-5 colors for most projects</li>
                  <li>Consider adding neutral colors (white, black, grays) to your palette</li>
                  <li>Test your palette in different contexts (dark/light mode, different backgrounds)</li>
                  <li>Ensure sufficient contrast between text and background colors</li>
                  <li>Create extended palettes by adding tints and shades of your core colors</li>
                </ul>
                
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-4">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Try it on Coolors.in!</h3>
                  <p className="text-gray-700 mb-4">
                    Now that you understand the principles of color theory, put your knowledge into practice:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                    <li>Generate random palettes with our <Link href="/" className="text-blue-600 hover:text-blue-800 underline">Palette Generator</Link></li>
                    <li>Extract colors from images with our <Link href="/image-palette" className="text-blue-600 hover:text-blue-800 underline">Image Palette</Link> tool</li>
                    <li>Visualize your palettes in real UI with our <Link href="/visualize" className="text-blue-600 hover:text-blue-800 underline">Palette Visualizer</Link></li>
                  </ul>
                  <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Create Palettes Now
                  </Link>
                </div>
              </section>
              
              <section className="mb-12 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Further Resources</h2>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li><a href="https://color.adobe.com/create/color-wheel" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Adobe Color Wheel</a></li>
                  <li><a href="https://webaim.org/resources/contrastchecker/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">WebAIM Contrast Checker</a></li>
                  <li><a href="https://www.colorsandfonts.com/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Colors & Fonts</a></li>
                  <li><a href="https://colorhunt.co/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Color Hunt</a></li>
                  <li><a href="https://www.pantone.com/connect" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Pantone Connect</a></li>
                </ul>
                <p className="text-gray-700">
                  Remember, while these principles provide a foundation for effective color use, design is also subjective. Trust your instincts and test your color choices with your target audience when possible.
                </p>
              </section>
            </div>
            
            <div className="md:w-1/4">
              <div className="sticky top-6">
                <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><a href="#color-basics" className="hover:text-blue-600 transition-colors">The Basics of Color Theory</a></li>
                    <li><a href="#color-harmonies" className="hover:text-blue-600 transition-colors">Color Harmonies</a></li>
                    <li><a href="#color-psychology" className="hover:text-blue-600 transition-colors">Color Psychology</a></li>
                    <li><a href="#accessibility" className="hover:text-blue-600 transition-colors">Color Accessibility</a></li>
                    <li><a href="#practical-tips" className="hover:text-blue-600 transition-colors">Practical Tips</a></li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <SidebarAd />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold mb-3">Try Our Tools</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <span className="mr-2">🎨</span> Palette Generator
                      </Link>
                    </li>
                    <li>
                      <Link href="/image-palette" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <span className="mr-2">🖼️</span> Image Palette
                      </Link>
                    </li>
                    <li>
                      <Link href="/visualize" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <span className="mr-2">👁️</span> Palette Visualizer
                      </Link>
                    </li>
                    <li>
                      <Link href="/saved-palettes" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <span className="mr-2">💾</span> Saved Palettes
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default DesignersGuide;