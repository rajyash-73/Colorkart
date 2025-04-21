import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function DesignersGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Helmet>
        <title>Designer's Guide to Color Theory | Coolors.in</title>
        <meta name="description" content="Learn about color theory, harmonies, and how to create beautiful, effective color palettes for your design projects with our comprehensive designer's guide." />
        <meta name="keywords" content="color theory, color harmonies, monochromatic, analogous, complementary, triadic, tetradic, designer guide" />
        <link rel="canonical" href="https://coolors.in/designers-guide" />
        {/* Dynamic structured data for the designer's guide page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Choosing the Right Color Palette: A Designer's Guide",
            "description": "Learn about color theory, harmonies, and how to create beautiful, effective color palettes for your design projects.",
            "author": {
              "@type": "Organization",
              "name": "Coolors.in"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Coolors.in",
              "logo": {
                "@type": "ImageObject",
                "url": "https://coolors.in/logo.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://coolors.in/designers-guide"
            }
          })}
        </script>
      </Helmet>
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span>Back to Home</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 prose prose-lg max-w-4xl">
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choosing the Right Color Palette: A Designer's Guide
          </h1>

          <div className="space-y-6">
            <p className="text-gray-700">
              Picking the right color palette can make or break a design. Whether you're building a website, 
              crafting a brand identity, or designing an app UI, your choice of colors directly influences 
              how your audience perceives your work. That's where color theory comes in.
            </p>

            <p className="text-gray-700">
              Color theory offers practical rules and harmonies to create visually appealing combinations. 
              One popular method is the <strong className="text-blue-600">monochromatic palette</strong>, which uses different 
              shades and tints of a single color — perfect for minimalist designs. <strong className="text-blue-600">Analogous palettes</strong>, 
              which combine neighboring colors on the color wheel (like blue, blue-green, and green), 
              offer smooth transitions and natural aesthetics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Monochromatic</h3>
                <p className="text-gray-700 text-sm">
                  Uses variations in lightness and saturation of a single color. 
                  Perfect for clean, minimal interfaces where you want subtle distinction without distraction.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-900"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-700"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-300"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-100"></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-100 p-5 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-700 mb-3">Analogous</h3>
                <p className="text-gray-700 text-sm">
                  Uses colors adjacent to each other on the color wheel.
                  Creates harmonious, comfortable designs that work well for nature-inspired themes.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                  <div className="h-6 w-6 rounded-full bg-teal-500"></div>
                  <div className="h-6 w-6 rounded-full bg-green-500"></div>
                  <div className="h-6 w-6 rounded-full bg-lime-500"></div>
                  <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-700">
              Need contrast? Go for a <strong className="text-blue-600">complementary palette</strong>, which pairs colors from opposite 
              sides of the wheel — like purple and yellow. For a more dynamic twist, try a <strong className="text-blue-600">split-complementary palette</strong>: 
              one base color and two adjacent to its complement. It's vibrant but more forgiving than direct complements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-purple-50 to-yellow-100 p-5 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Complementary</h3>
                <p className="text-gray-700 text-sm">
                  Uses colors from opposite sides of the color wheel.
                  Creates strong contrast and impact – ideal for call-to-action buttons or focal points.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-purple-600"></div>
                  <div className="h-6 w-6 rounded-full bg-purple-400"></div>
                  <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                  <div className="h-6 w-6 rounded-full bg-yellow-400"></div>
                  <div className="h-6 w-6 rounded-full bg-yellow-600"></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-red-100 p-5 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Split-Complementary</h3>
                <p className="text-gray-700 text-sm">
                  Uses a base color and two colors adjacent to its complement.
                  Provides vibrant contrast while being more balanced than complementary schemes.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-600"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-400"></div>
                  <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                  <div className="h-6 w-6 rounded-full bg-red-400"></div>
                  <div className="h-6 w-6 rounded-full bg-amber-400"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-700">
              <strong className="text-blue-600">Triadic and tetradic palettes</strong> use three or four evenly spaced colors on the wheel, 
              giving balanced contrast and variety. These are ideal for bold branding or creative projects.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-gradient-to-br from-red-50 to-blue-100 p-5 rounded-lg border border-red-200">
                <h3 className="text-xl font-semibold text-red-700 mb-3">Triadic</h3>
                <p className="text-gray-700 text-sm">
                  Uses three colors equally spaced around the color wheel.
                  Creates balanced, vibrant color schemes perfect for playful, energetic designs.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-red-500"></div>
                  <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-green-100 p-5 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Tetradic</h3>
                <p className="text-gray-700 text-sm">
                  Uses four colors arranged into two complementary pairs.
                  Rich color scheme offering many possibilities for variation and accent colors.
                </p>
                <div className="mt-3 flex space-x-2">
                  <div className="h-6 w-6 rounded-full bg-purple-500"></div>
                  <div className="h-6 w-6 rounded-full bg-green-500"></div>
                  <div className="h-6 w-6 rounded-full bg-red-500"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-700">
              At Coolors.in, you can experiment with all these rules using our easy palette generator. 
              Not sure where to start? Just pick a base color and choose a rule — we'll handle the rest.
            </p>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg text-center my-8">
              <h3 className="text-xl font-bold mb-2">Start exploring colors like a pro!</h3>
              <p className="mb-4">Bring your design ideas to life with the perfect palette</p>
              <div
                className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
                Try Our Color Generator
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}