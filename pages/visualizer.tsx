import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { usePalette } from '../client/src/contexts/PaletteContext';
import Header from '../client/src/components/Header';
import Footer from '../client/src/components/Footer';
import { Calendar, BarChart, LineChart, Store, Layout, MessageSquare } from 'lucide-react';
import { Color } from '../client/src/types/Color';
import { isLightColor } from '../client/src/lib/colorUtils';

type TemplateType = 'dashboard' | 'landing' | 'analytics' | 'chat' | 'calendar';

interface TemplateButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TemplateButton({ active, onClick, icon, label }: TemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
        active 
          ? 'bg-primary text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

const PaletteVisualizer: NextPage = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { palette } = usePalette();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Function to determine if text should be dark or light based on background color
  const getTextColor = (hex: string) => {
    return isLightColor(hex) ? 'text-gray-900' : 'text-white';
  };
  
  // A helper function for text color in JSX templates
  const textColorClass = (hex: string) => {
    return isLightColor(hex) ? 'text-gray-900' : 'text-white';
  };
  
  // Server-side rendering fallback content
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Head>
          <title>Palette Visualizer - Coolors.in | See Your Colors in Action</title>
          <meta name="description" content="See your color palettes in realistic UI templates. Visualize your colors applied to dashboards, landing pages, charts, and more." />
          <meta name="keywords" content="color palette visualizer, UI color template, design preview" />
          <link rel="canonical" href="https://coolors.in/visualizer" />
        </Head>
        
        <Header 
          onHelp={() => {}} 
          onExport={() => {}} 
          onSave={() => {}}
          mobileMenuOpen={false}
          toggleMobileMenu={() => {}}
        />
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Loading Palette Visualizer...</div>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Palette Visualizer - Coolors.in | See Your Colors in Action</title>
        <meta name="description" content="See your color palettes in realistic UI templates. Visualize your colors applied to dashboards, landing pages, charts, and more." />
        <meta name="keywords" content="color palette visualizer, UI color template, design preview" />
        <link rel="canonical" href="https://coolors.in/visualizer" />
      </Head>
      
      <Header 
        onHelp={() => {}} 
        onExport={() => {}} 
        onSave={() => {}}
        onVisualize={() => {}}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Palette Visualizer</h1>
          <p className="text-gray-600">See how your color palette looks in different UI contexts</p>
        </div>
        
        <div className="grid grid-cols-5 gap-3 mb-6 max-w-md">
          <TemplateButton 
            active={activeTemplate === 'dashboard'} 
            onClick={() => setActiveTemplate('dashboard')} 
            icon={<Layout size={20} />} 
            label="Dashboard" 
          />
          <TemplateButton 
            active={activeTemplate === 'landing'} 
            onClick={() => setActiveTemplate('landing')} 
            icon={<Store size={20} />} 
            label="Landing" 
          />
          <TemplateButton 
            active={activeTemplate === 'analytics'} 
            onClick={() => setActiveTemplate('analytics')} 
            icon={<BarChart size={20} />} 
            label="Analytics" 
          />
          <TemplateButton 
            active={activeTemplate === 'chat'} 
            onClick={() => setActiveTemplate('chat')} 
            icon={<MessageSquare size={20} />} 
            label="Chat" 
          />
          <TemplateButton 
            active={activeTemplate === 'calendar'} 
            onClick={() => setActiveTemplate('calendar')} 
            icon={<Calendar size={20} />} 
            label="Calendar" 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTemplate === 'dashboard' && (
            <DashboardTemplate palette={palette} getTextColor={textColorClass} />
          )}
          {activeTemplate === 'landing' && (
            <LandingTemplate palette={palette} getTextColor={textColorClass} />
          )}
          {activeTemplate === 'analytics' && (
            <AnalyticsTemplate palette={palette} getTextColor={textColorClass} />
          )}
          {activeTemplate === 'chat' && (
            <ChatTemplate palette={palette} getTextColor={textColorClass} />
          )}
          {activeTemplate === 'calendar' && (
            <CalendarTemplate palette={palette} getTextColor={textColorClass} />
          )}
        </div>
        
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to Use This Tool</h2>
          <p className="text-gray-700 mb-3">
            This visualizer helps you see how your palette would look in real-world UI scenarios. 
            Choose different templates above to visualize your colors in context.
          </p>
          <p className="text-gray-700">
            Return to the main palette generator to make adjustments, then come back to see how they look!
          </p>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

// Template Components
function DashboardTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Use the first 5 colors from palette, or default if not enough
  const colors = [...palette];
  while (colors.length < 5) {
    colors.push({ hex: "#e5e5e5", rgb: { r: 229, g: 229, b: 229 }, locked: false });
  }
  
  return (
    <div className="p-0">
      {/* Navigation */}
      <div className="flex" style={{ backgroundColor: colors[0].hex }}>
        <div className="w-64 p-4">
          <div className={`font-bold text-xl ${getTextColor(colors[0].hex)}`}>Admin Panel</div>
        </div>
        <div className="flex-1 flex justify-end items-center p-4">
          <div className={`flex items-center space-x-4 ${getTextColor(colors[0].hex)}`}>
            <span className="cursor-pointer">Search</span>
            <span className="cursor-pointer">Notifications</span>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
      
      <div className="flex min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 p-4" style={{ backgroundColor: colors[1].hex }}>
          <ul className={`space-y-3 ${getTextColor(colors[1].hex)}`}>
            <li className="p-2 rounded cursor-pointer font-medium" style={{ backgroundColor: colors[0].hex }}>
              <span className={getTextColor(colors[0].hex)}>Dashboard</span>
            </li>
            <li className="p-2 rounded cursor-pointer">Users</li>
            <li className="p-2 rounded cursor-pointer">Products</li>
            <li className="p-2 rounded cursor-pointer">Orders</li>
            <li className="p-2 rounded cursor-pointer">Analytics</li>
            <li className="p-2 rounded cursor-pointer">Settings</li>
          </ul>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6" style={{ backgroundColor: colors[2].hex }}>
          <div className={`text-2xl font-bold mb-6 ${getTextColor(colors[2].hex)}`}>Dashboard Overview</div>
          
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
              <div className={`text-sm ${getTextColor(colors[3].hex)}`}>Total Sales</div>
              <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>$24,582</div>
              <div className={`text-xs ${getTextColor(colors[3].hex)}`}>+12% from last month</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
              <div className={`text-sm ${getTextColor(colors[3].hex)}`}>Active Users</div>
              <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>2,845</div>
              <div className={`text-xs ${getTextColor(colors[3].hex)}`}>+5% from last week</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
              <div className={`text-sm ${getTextColor(colors[3].hex)}`}>Conversion</div>
              <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>5.27%</div>
              <div className={`text-xs ${getTextColor(colors[3].hex)}`}>-0.5% from yesterday</div>
            </div>
          </div>
          
          {/* Chart area */}
          <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors[4].hex }}>
            <div className={`text-lg font-medium mb-4 ${getTextColor(colors[4].hex)}`}>Sales Analytics</div>
            <div className="h-60 w-full flex items-end justify-between space-x-2">
              <div className="h-20% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '20%' }}></div>
              <div className="h-45% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '45%' }}></div>
              <div className="h-30% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '30%' }}></div>
              <div className="h-60% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '60%' }}></div>
              <div className="h-40% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '40%' }}></div>
              <div className="h-55% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '55%' }}></div>
              <div className="h-75% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '75%' }}></div>
              <div className="h-65% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '65%' }}></div>
              <div className="h-80% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '80%' }}></div>
              <div className="h-45% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '45%' }}></div>
              <div className="h-35% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '35%' }}></div>
              <div className="h-50% w-6 rounded-t-sm" style={{ backgroundColor: colors[0].hex, height: '50%' }}></div>
            </div>
          </div>
          
          {/* Recent orders */}
          <div className="rounded-lg" style={{ backgroundColor: colors[4].hex }}>
            <div className={`p-4 border-b ${getTextColor(colors[4].hex)}`}>
              <div className="text-lg font-medium">Recent Orders</div>
            </div>
            <div className="p-4">
              <table className={`min-w-full ${getTextColor(colors[4].hex)}`}>
                <thead>
                  <tr>
                    <th className="text-left pb-2">Order ID</th>
                    <th className="text-left pb-2">Customer</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">#12345</td>
                    <td>John Smith</td>
                    <td><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors[0].hex }}>
                      <span className={getTextColor(colors[0].hex)}>Completed</span>
                    </span></td>
                    <td>$126.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">#12346</td>
                    <td>Jane Doe</td>
                    <td><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors[1].hex }}>
                      <span className={getTextColor(colors[1].hex)}>Processing</span>
                    </span></td>
                    <td>$58.50</td>
                  </tr>
                  <tr>
                    <td className="py-2">#12347</td>
                    <td>Robert Brown</td>
                    <td><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors[3].hex }}>
                      <span className={getTextColor(colors[3].hex)}>Pending</span>
                    </span></td>
                    <td>$235.75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Use the first 5 colors from palette, or default if not enough
  const colors = [...palette];
  while (colors.length < 5) {
    colors.push({ hex: "#e5e5e5", rgb: { r: 229, g: 229, b: 229 }, locked: false });
  }
  
  return (
    <div className="p-0">
      {/* Header */}
      <header style={{ backgroundColor: colors[0].hex }} className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className={`text-xl font-bold ${getTextColor(colors[0].hex)}`}>ColorBrand</div>
          <nav>
            <ul className={`flex space-x-6 ${getTextColor(colors[0].hex)}`}>
              <li>Home</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </nav>
          <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors[4].hex }}>
            <span className={getTextColor(colors[4].hex)}>Sign Up</span>
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section style={{ backgroundColor: colors[1].hex }} className="py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className={`text-4xl font-bold mb-4 ${getTextColor(colors[1].hex)}`}>
              Create Beautiful Color Palettes
            </h1>
            <p className={`text-lg mb-6 ${getTextColor(colors[1].hex)}`}>
              Your ultimate tool for generating stunning color combinations for your projects.
              Save time and create professional designs effortlessly.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: colors[3].hex }}>
                <span className={getTextColor(colors[3].hex)}>Get Started</span>
              </button>
              <button className={`px-6 py-3 rounded-lg font-medium border ${getTextColor(colors[1].hex)}`}>
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 rounded-lg flex">
              <div className="w-1/5 h-full" style={{ backgroundColor: colors[0].hex }}></div>
              <div className="w-1/5 h-full" style={{ backgroundColor: colors[1].hex }}></div>
              <div className="w-1/5 h-full" style={{ backgroundColor: colors[2].hex }}></div>
              <div className="w-1/5 h-full" style={{ backgroundColor: colors[3].hex }}></div>
              <div className="w-1/5 h-full" style={{ backgroundColor: colors[4].hex }}></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{ backgroundColor: colors[2].hex }} className="py-16">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-8 text-center ${getTextColor(colors[2].hex)}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors[4].hex }}>
              <div className={`text-xl font-semibold mb-3 ${getTextColor(colors[4].hex)}`}>
                Generate Instantly
              </div>
              <p className={getTextColor(colors[4].hex)}>
                Create beautiful color palettes with a single click. Save time and focus on your design.
              </p>
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors[4].hex }}>
              <div className={`text-xl font-semibold mb-3 ${getTextColor(colors[4].hex)}`}>
                Export Anywhere
              </div>
              <p className={getTextColor(colors[4].hex)}>
                Export your palettes in multiple formats and use them in your favorite design tools.
              </p>
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors[4].hex }}>
              <div className={`text-xl font-semibold mb-3 ${getTextColor(colors[4].hex)}`}>
                Color Theory
              </div>
              <p className={getTextColor(colors[4].hex)}>
                Access advanced color theory options to create harmonious and balanced palettes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section style={{ backgroundColor: colors[3].hex }} className="py-16">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-8 text-center ${getTextColor(colors[3].hex)}`}>
            What Our Users Say
          </h2>
          <div className="flex justify-center">
            <div className="max-w-xl p-6 rounded-lg" style={{ backgroundColor: colors[0].hex }}>
              <p className={`text-lg italic mb-4 ${getTextColor(colors[0].hex)}`}>
                "This color palette generator has completely transformed my workflow. I can create stunning designs in minutes that used to take hours!"
              </p>
              <div className={`font-medium ${getTextColor(colors[0].hex)}`}>
                - Sarah Johnson, UX Designer
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: colors[0].hex }} className="py-8">
        <div className="container mx-auto px-6">
          <div className={`text-center ${getTextColor(colors[0].hex)}`}>
            <p>© 2023 ColorBrand. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AnalyticsTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Use the first 5 colors from palette, or default if not enough
  const colors = [...palette];
  while (colors.length < 5) {
    colors.push({ hex: "#e5e5e5", rgb: { r: 229, g: 229, b: 229 }, locked: false });
  }
  
  return (
    <div style={{ backgroundColor: colors[4].hex }} className="p-6">
      <div className={`text-2xl font-bold mb-4 ${getTextColor(colors[4].hex)}`}>
        Analytics Dashboard
      </div>
      
      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="px-3 py-2 rounded-md" style={{ backgroundColor: colors[1].hex }}>
          <span className={getTextColor(colors[1].hex)}>Last 30 days</span>
        </div>
        <div className="px-3 py-2 rounded-md" style={{ backgroundColor: colors[0].hex }}>
          <span className={getTextColor(colors[0].hex)}>All channels</span>
        </div>
        <div className="px-3 py-2 rounded-md" style={{ backgroundColor: colors[0].hex }}>
          <span className={getTextColor(colors[0].hex)}>All users</span>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
          <div className={`text-sm mb-1 ${getTextColor(colors[3].hex)}`}>Total Visitors</div>
          <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>24,581</div>
          <div className={`text-xs ${getTextColor(colors[3].hex)}`}>↑ 12.5%</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
          <div className={`text-sm mb-1 ${getTextColor(colors[3].hex)}`}>Conversion Rate</div>
          <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>5.27%</div>
          <div className={`text-xs ${getTextColor(colors[3].hex)}`}>↓ 0.3%</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
          <div className={`text-sm mb-1 ${getTextColor(colors[3].hex)}`}>Average Order</div>
          <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>$48.71</div>
          <div className={`text-xs ${getTextColor(colors[3].hex)}`}>↑ 3.1%</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors[3].hex }}>
          <div className={`text-sm mb-1 ${getTextColor(colors[3].hex)}`}>Revenue</div>
          <div className={`text-2xl font-bold ${getTextColor(colors[3].hex)}`}>$14,582</div>
          <div className={`text-xs ${getTextColor(colors[3].hex)}`}>↑ 8.3%</div>
        </div>
      </div>
      
      {/* Chart area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 p-4 rounded-lg" style={{ backgroundColor: colors[2].hex }}>
          <div className={`text-lg font-medium mb-4 ${getTextColor(colors[2].hex)}`}>Revenue Over Time</div>
          <div className="relative h-60">
            {/* Line chart simulation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200"></div>
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M0,35 L10,28 L20,30 L30,20 L40,15 L50,18 L60,10 L70,15 L80,5 L90,8 L100,2" 
                fill="none" 
                stroke={colors[0].hex} 
                strokeWidth="2"
              />
              <path 
                d="M0,38 L10,36 L20,34 L30,32 L40,30 L50,33 L60,25 L70,28 L80,22 L90,25 L100,20" 
                fill="none" 
                stroke={colors[1].hex} 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors[2].hex }}>
          <div className={`text-lg font-medium mb-4 ${getTextColor(colors[2].hex)}`}>Traffic Source</div>
          <div className="h-60 relative">
            {/* Pie chart simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full relative overflow-hidden">
                <div style={{ backgroundColor: colors[0].hex, width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
                <div style={{ backgroundColor: colors[1].hex, width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 100% 0, 50% 0, 0 0, 0 50%)' }}></div>
                <div style={{ backgroundColor: colors[3].hex, width: '100%', height: '100%', clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data table */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: colors[3].hex }}>
        <div className={`p-4 border-b ${getTextColor(colors[3].hex)} border-opacity-20`}>
          <div className="text-lg font-medium">Top Performing Products</div>
        </div>
        <div className="overflow-x-auto">
          <table className={`min-w-full ${getTextColor(colors[3].hex)}`}>
            <thead>
              <tr className="border-b border-opacity-20">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Orders</th>
                <th className="p-3 text-left">Revenue</th>
                <th className="p-3 text-left">Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-opacity-10">
                <td className="p-3">Product A</td>
                <td className="p-3">853</td>
                <td className="p-3">$12,245</td>
                <td className="p-3">8.4%</td>
              </tr>
              <tr className="border-b border-opacity-10">
                <td className="p-3">Product B</td>
                <td className="p-3">645</td>
                <td className="p-3">$10,150</td>
                <td className="p-3">6.7%</td>
              </tr>
              <tr>
                <td className="p-3">Product C</td>
                <td className="p-3">532</td>
                <td className="p-3">$8,760</td>
                <td className="p-3">5.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChatTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Use the first 5 colors from palette, or default if not enough
  const colors = [...palette];
  while (colors.length < 5) {
    colors.push({ hex: "#e5e5e5", rgb: { r: 229, g: 229, b: 229 }, locked: false });
  }
  
  return (
    <div style={{ backgroundColor: colors[4].hex }} className="h-[600px] flex">
      {/* Sidebar */}
      <div className="w-64 h-full flex flex-col border-r" style={{ backgroundColor: colors[0].hex, borderColor: `${colors[1].hex}40` }}>
        <div className={`p-4 border-b ${getTextColor(colors[0].hex)}`} style={{ borderColor: `${colors[1].hex}40` }}>
          <div className="text-lg font-bold">Messages</div>
        </div>
        
        <div className="p-2">
          <div className={`text-sm font-medium p-2 ${getTextColor(colors[0].hex)}`}>Conversations</div>
          
          {/* Contact list */}
          <div className="space-y-1">
            <div className="p-2 rounded-md flex items-center" style={{ backgroundColor: colors[1].hex }}>
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div className={getTextColor(colors[1].hex)}>
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-xs opacity-75">Online</div>
              </div>
            </div>
            
            <div className="p-2 rounded-md flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div className={getTextColor(colors[0].hex)}>
                <div className="font-medium">John Smith</div>
                <div className="text-xs opacity-75">Last seen 10m ago</div>
              </div>
            </div>
            
            <div className="p-2 rounded-md flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div className={getTextColor(colors[0].hex)}>
                <div className="font-medium">Emily Davis</div>
                <div className="text-xs opacity-75">Last seen 2h ago</div>
              </div>
            </div>
            
            <div className="p-2 rounded-md flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div className={getTextColor(colors[0].hex)}>
                <div className="font-medium">Michael Brown</div>
                <div className="text-xs opacity-75">Last seen yesterday</div>
              </div>
            </div>
            
            <div className="p-2 rounded-md flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div className={getTextColor(colors[0].hex)}>
                <div className="font-medium">Jessica Williams</div>
                <div className="text-xs opacity-75">Last seen 3d ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b flex items-center" style={{ backgroundColor: colors[3].hex, borderColor: `${colors[1].hex}40` }}>
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
          <div className={getTextColor(colors[3].hex)}>
            <div className="font-medium">Sarah Johnson</div>
            <div className="text-xs">Online</div>
          </div>
          <div className="ml-auto flex space-x-3">
            <div className={`cursor-pointer ${getTextColor(colors[3].hex)}`}>
              <i className="fas fa-phone"></i>
            </div>
            <div className={`cursor-pointer ${getTextColor(colors[3].hex)}`}>
              <i className="fas fa-video"></i>
            </div>
            <div className={`cursor-pointer ${getTextColor(colors[3].hex)}`}>
              <i className="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundColor: colors[2].hex }}>
          <div className="space-y-4">
            {/* Received message */}
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <div className="max-w-[70%]">
                <div className="rounded-lg p-3" style={{ backgroundColor: colors[1].hex }}>
                  <div className={getTextColor(colors[1].hex)}>
                    Hey there! How's your project coming along?
                  </div>
                </div>
                <div className={`text-xs mt-1 ${getTextColor(colors[2].hex)} opacity-75`}>10:30 AM</div>
              </div>
            </div>
            
            {/* Sent message */}
            <div className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="rounded-lg p-3" style={{ backgroundColor: colors[0].hex }}>
                  <div className={getTextColor(colors[0].hex)}>
                    It's going well! I'm working on the color palette right now. What do you think of these colors?
                  </div>
                </div>
                <div className={`text-xs mt-1 ${getTextColor(colors[2].hex)} opacity-75 text-right`}>10:32 AM</div>
              </div>
            </div>
            
            {/* Sent message */}
            <div className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="rounded-lg p-3 flex" style={{ backgroundColor: colors[0].hex }}>
                  <div className={`flex-1 ${getTextColor(colors[0].hex)}`}>
                    <div className="w-full h-20 flex">
                      <div className="w-1/5 h-full" style={{ backgroundColor: colors[0].hex }}></div>
                      <div className="w-1/5 h-full" style={{ backgroundColor: colors[1].hex }}></div>
                      <div className="w-1/5 h-full" style={{ backgroundColor: colors[2].hex }}></div>
                      <div className="w-1/5 h-full" style={{ backgroundColor: colors[3].hex }}></div>
                      <div className="w-1/5 h-full" style={{ backgroundColor: colors[4].hex }}></div>
                    </div>
                  </div>
                </div>
                <div className={`text-xs mt-1 ${getTextColor(colors[2].hex)} opacity-75 text-right`}>10:32 AM</div>
              </div>
            </div>
            
            {/* Received message */}
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <div className="max-w-[70%]">
                <div className="rounded-lg p-3" style={{ backgroundColor: colors[1].hex }}>
                  <div className={getTextColor(colors[1].hex)}>
                    These look amazing! I especially like the combination of the first and third colors.
                  </div>
                </div>
                <div className={`text-xs mt-1 ${getTextColor(colors[2].hex)} opacity-75`}>10:35 AM</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t" style={{ backgroundColor: colors[3].hex, borderColor: `${colors[1].hex}40` }}>
          <div className="flex items-center">
            <div className={`mr-3 cursor-pointer ${getTextColor(colors[3].hex)}`}>
              <i className="fas fa-plus"></i>
            </div>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 py-2 px-3 rounded-full"
              style={{ backgroundColor: colors[4].hex, color: isLightColor(colors[4].hex) ? '#333' : '#fff' }}
            />
            <div className={`ml-3 cursor-pointer ${getTextColor(colors[3].hex)}`}>
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Use the first 5 colors from palette, or default if not enough
  const colors = [...palette];
  while (colors.length < 5) {
    colors.push({ hex: "#e5e5e5", rgb: { r: 229, g: 229, b: 229 }, locked: false });
  }
  
  // Helper function to create dates for the calendar
  const getDates = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };
  
  const dates = getDates();
  
  return (
    <div className="p-6" style={{ backgroundColor: colors[4].hex }}>
      <div className="flex items-center justify-between mb-6">
        <div className={`text-2xl font-bold ${getTextColor(colors[4].hex)}`}>
          Calendar - August 2023
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-md" style={{ backgroundColor: colors[0].hex }}>
            <span className={getTextColor(colors[0].hex)}>
              <i className="fas fa-chevron-left"></i>
            </span>
          </button>
          <button className="p-2 rounded-md" style={{ backgroundColor: colors[0].hex }}>
            <span className={getTextColor(colors[0].hex)}>
              <i className="fas fa-chevron-right"></i>
            </span>
          </button>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 rounded-md" style={{ backgroundColor: colors[0].hex }}>
          <span className={getTextColor(colors[0].hex)}>Month</span>
        </button>
        <button className="px-4 py-2 rounded-md" style={{ backgroundColor: colors[3].hex }}>
          <span className={getTextColor(colors[3].hex)}>Week</span>
        </button>
        <button className="px-4 py-2 rounded-md" style={{ backgroundColor: colors[3].hex }}>
          <span className={getTextColor(colors[3].hex)}>Day</span>
        </button>
      </div>
      
      {/* Calendar grid */}
      <div style={{ backgroundColor: colors[2].hex }} className="rounded-lg overflow-hidden">
        {/* Day names */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: `${colors[3].hex}40` }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className={`p-3 text-center font-medium ${getTextColor(colors[2].hex)}`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar dates */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before the 1st */}
          {[0, 1, 2].map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-2 border-b border-r" style={{ borderColor: `${colors[3].hex}30` }}></div>
          ))}
          
          {dates.map((date, index) => {
            // Add special styling for specific dates to simulate events
            const hasEvent = date === 4 || date === 10 || date === 15 || date === 22 || date === 28;
            const isToday = date === 17;
            
            return (
              <div 
                key={date} 
                className={`h-24 p-2 border-b border-r relative ${(index + 3) % 7 === 0 ? 'border-r-0' : ''}`}
                style={{ borderColor: `${colors[3].hex}30` }}
              >
                <div 
                  className={`w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                    isToday ? 'font-bold' : ''
                  }`}
                  style={isToday ? { backgroundColor: colors[1].hex } : {}}
                >
                  <span className={isToday ? getTextColor(colors[1].hex) : getTextColor(colors[2].hex)}>
                    {date}
                  </span>
                </div>
                
                {hasEvent && (
                  <div className="px-2 py-1 rounded-md text-xs mb-1" style={{ backgroundColor: colors[0].hex }}>
                    <span className={getTextColor(colors[0].hex)}>
                      {date === 4 ? 'Team Meeting' : ''}
                      {date === 10 ? 'Project Review' : ''}
                      {date === 15 ? 'Client Call' : ''}
                      {date === 22 ? 'Workshop' : ''}
                      {date === 28 ? 'Deadline' : ''}
                    </span>
                  </div>
                )}
                
                {date === 12 && (
                  <div className="px-2 py-1 rounded-md text-xs" style={{ backgroundColor: colors[3].hex }}>
                    <span className={getTextColor(colors[3].hex)}>Design Review</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors[0].hex }}></div>
          <span className={getTextColor(colors[4].hex)}>Meetings</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors[3].hex }}></div>
          <span className={getTextColor(colors[4].hex)}>Reviews</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors[1].hex }}></div>
          <span className={getTextColor(colors[4].hex)}>Today</span>
        </div>
      </div>
    </div>
  );
}

export default PaletteVisualizer;