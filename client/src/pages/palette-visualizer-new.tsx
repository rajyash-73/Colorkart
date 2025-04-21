import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Layout, Monitor, PieChart, MessageSquare, Calendar } from 'lucide-react';
import { usePalette } from '@/contexts/PaletteContext';
import { Color } from '@/types/Color';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import { isLightColor } from '@/lib/colorUtils';

// Template types
type TemplateType = 'dashboard' | 'landing' | 'analytics' | 'chat' | 'calendar';

export default function PaletteVisualizer() {
  const { palette } = usePalette();
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('dashboard');

  // Helper to get a specific color from palette by index
  const getColor = (index: number): string => {
    if (palette.length <= index) {
      return '#ffffff';
    }
    return palette[index].hex;
  };

  // Helper to get text color based on background for contrast
  const getTextColor = (bgColor: string): string => {
    return isLightColor(bgColor) ? '#1f2937' : '#ffffff';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">
            Palette Visualizer
          </h1>
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="mr-1" size={20} />
            Back to Generator
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          See how your color palette would look in different UI templates
        </p>
      </header>

      {/* Template selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <TemplateButton 
            active={activeTemplate === 'dashboard'} 
            onClick={() => setActiveTemplate('dashboard')}
            icon={<Layout size={18} />}
            label="Dashboard"
          />
          <TemplateButton 
            active={activeTemplate === 'landing'} 
            onClick={() => setActiveTemplate('landing')}
            icon={<Monitor size={18} />}
            label="Landing Page"
          />
          <TemplateButton 
            active={activeTemplate === 'analytics'} 
            onClick={() => setActiveTemplate('analytics')}
            icon={<PieChart size={18} />}
            label="Analytics"
          />
          <TemplateButton 
            active={activeTemplate === 'chat'} 
            onClick={() => setActiveTemplate('chat')}
            icon={<MessageSquare size={18} />}
            label="Chat App"
          />
          <TemplateButton 
            active={activeTemplate === 'calendar'} 
            onClick={() => setActiveTemplate('calendar')}
            icon={<Calendar size={18} />}
            label="Calendar"
          />
        </div>
      </div>

      {/* Template visualization */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 mb-6">
        {activeTemplate === 'dashboard' && (
          <DashboardTemplate palette={palette} getTextColor={getTextColor} />
        )}
        {activeTemplate === 'landing' && (
          <LandingTemplate palette={palette} getTextColor={getTextColor} />
        )}
        {activeTemplate === 'analytics' && (
          <AnalyticsTemplate palette={palette} getTextColor={getTextColor} />
        )}
        {activeTemplate === 'chat' && (
          <ChatTemplate palette={palette} getTextColor={getTextColor} />
        )}
        {activeTemplate === 'calendar' && (
          <CalendarTemplate palette={palette} getTextColor={getTextColor} />
        )}
      </div>

      {/* Color palette reference */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-2">Your Palette</h3>
        <div className="flex h-12 rounded-md overflow-hidden">
          {palette.map((color, index) => (
            <div 
              key={index} 
              className="flex-1" 
              style={{ backgroundColor: color.hex }}
            >
              <div className="h-full flex items-center justify-center">
                <span className={`text-xs font-medium ${isLightColor(color.hex) ? 'text-gray-800' : 'text-white'}`}>
                  {color.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Template button component
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
      className={cn(
        "px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors",
        active 
          ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

// Dashboard Template
function DashboardTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  return (
    <div className="h-[500px] flex flex-col" style={{ backgroundColor: palette[4]?.hex || '#f8fafc' }}>
      {/* Sidebar */}
      <div className="flex h-full">
        <div 
          className="w-56 h-full p-4 flex flex-col" 
          style={{ 
            backgroundColor: palette[0]?.hex || '#1e293b',
            color: getTextColor(palette[0]?.hex || '#1e293b')
          }}
        >
          <div className="font-bold text-xl mb-6">App Name</div>
          
          <div className="space-y-1">
            <div className="p-2 rounded flex items-center gap-2 font-medium" style={{ 
              backgroundColor: palette[1]?.hex || '#334155',
              color: getTextColor(palette[1]?.hex || '#334155')
            }}>
              <Layout size={16} /> Dashboard
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <PieChart size={16} /> Analytics
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <MessageSquare size={16} /> Messages
            </div>
            <div className="p-2 rounded flex items-center gap-2">
              <Calendar size={16} /> Calendar
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-2 rounded">Settings</div>
            <div className="p-2 rounded">Help</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: getTextColor(palette[4]?.hex || '#f8fafc') }}>Dashboard</h1>
            <div 
              className="px-4 py-2 rounded"  
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              + New Item
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="text-sm opacity-80">Total Users</div>
              <div className="text-2xl font-bold">4,927</div>
              <div className="text-xs mt-2 text-green-500">↑ 12% from last month</div>
            </div>
            <div 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="text-sm opacity-80">Revenue</div>
              <div className="text-2xl font-bold">$24,438</div>
              <div className="text-xs mt-2 text-green-500">↑ 8% from last month</div>
            </div>
            <div 
              className="p-4 rounded-lg shadow"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="text-sm opacity-80">Active Projects</div>
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs mt-2 text-red-500">↓ 2 from last month</div>
            </div>
          </div>

          {/* Main panel */}
          <div 
            className="rounded-lg shadow p-4"
            style={{ 
              backgroundColor: palette[3]?.hex || '#ffffff',
              color: getTextColor(palette[3]?.hex || '#ffffff')
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Recent Activity</h2>
              <div className="text-sm">View All</div>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="py-2 border-b last:border-0 flex justify-between">
                  <div>User #{i} completed Task #{i}</div>
                  <div className="text-sm opacity-70">Just now</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Landing Template
function LandingTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  return (
    <div className="h-[500px] overflow-auto" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      {/* Navigation */}
      <header 
        className="px-6 py-4 flex justify-between items-center sticky top-0"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        <div className="font-bold text-xl">Landing Page</div>
        <nav className="flex items-center gap-6">
          <div>Features</div>
          <div>Pricing</div>
          <div>About</div>
          <div 
            className="px-4 py-2 rounded"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            Get Started
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div 
        className="px-6 py-16 flex gap-8 justify-between" 
        style={{ 
          backgroundColor: palette[1]?.hex || '#334155',
          color: getTextColor(palette[1]?.hex || '#334155')
        }}
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="mb-6 opacity-90">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisi vel consectetur interdum.</p>
          <div className="flex gap-4">
            <div 
              className="px-4 py-2 rounded font-medium"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              Get Started
            </div>
            <div 
              className="px-4 py-2 rounded font-medium border"
              style={{ 
                borderColor: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              Learn More
            </div>
          </div>
        </div>
        <div 
          className="w-80 h-48 rounded flex items-center justify-center"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          <span className="text-center">Hero Image</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="p-4 rounded-lg text-center"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ 
                  backgroundColor: palette[2]?.hex || '#3b82f6',
                  color: getTextColor(palette[2]?.hex || '#3b82f6')
                }}
              >
                {i}
              </div>
              <h3 className="font-bold mb-2">Feature {i}</h3>
              <p className="text-sm opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics Template
function AnalyticsTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  // Placeholder for analytics charts
  return (
    <div className="h-[500px] overflow-auto" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <div>Last 7 Days ▼</div>
          <div 
            className="px-3 py-1 rounded text-sm"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            Export
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: palette[0]?.hex || '#1e293b',
              color: getTextColor(palette[0]?.hex || '#1e293b')
            }}
          >
            <h3 className="font-medium mb-2">Page Views</h3>
            <div className="text-3xl font-bold">42,856</div>
            <div className="relative h-40 mt-4">
              {/* Chart placeholders */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-32">
                {[30, 45, 25, 60, 35, 70, 50].map((h, i) => (
                  <div 
                    key={i}
                    className="w-8 rounded-t"
                    style={{ 
                      height: `${h}%`,
                      backgroundColor: palette[1]?.hex || '#334155'
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs pt-2 border-t">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={i} className="w-8 text-center">{day}</div>
                ))}
              </div>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: palette[3]?.hex || '#ffffff',
              color: getTextColor(palette[3]?.hex || '#ffffff')
            }}
          >
            <h3 className="font-medium mb-2">Conversions</h3>
            <div className="text-3xl font-bold">1,286</div>
            <div className="relative h-40 mt-4">
              {/* Donut chart placeholder */}
              <div className="flex justify-center items-center h-full">
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center relative"
                  style={{ 
                    background: `conic-gradient(${palette[2]?.hex || '#3b82f6'} 0% 65%, ${palette[1]?.hex || '#334155'} 65% 100%)`,
                    boxShadow: 'inset 0 0 0 5px white'
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-lg font-bold">65%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg mb-4"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          <h3 className="font-medium mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { name: 'Direct', value: 42 },
              { name: 'Organic Search', value: 28 },
              { name: 'Referral', value: 18 },
              { name: 'Social Media', value: 12 },
            ].map((source, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span>{source.name}</span>
                  <span>{source.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{
                      width: `${source.value}%`,
                      backgroundColor: palette[i % 2 ? 2 : 1]?.hex || '#3b82f6',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Template
function ChatTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  return (
    <div className="h-[500px] flex" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      {/* Sidebar */}
      <div 
        className="w-64 h-full p-4 flex flex-col border-r"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        <h2 className="font-bold text-xl mb-4">Chats</h2>
        <div 
          className="mb-4 px-3 py-2 rounded-md"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent outline-none" 
            style={{ color: getTextColor(palette[0]?.hex || '#1e293b') }}
          />
        </div>
        
        <div className="flex-1 overflow-auto space-y-2">
          {/* Chat list */}
          {[1, 2, 3, 4, 5].map(i => {
            const isActive = i === 1;
            return (
              <div 
                key={i}
                className="p-2 rounded-md flex gap-3"
                style={{
                  backgroundColor: isActive 
                    ? palette[1]?.hex || '#334155' 
                    : 'transparent',
                  color: isActive 
                    ? getTextColor(palette[1]?.hex || '#334155')
                    : getTextColor(palette[0]?.hex || '#1e293b')
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: palette[3]?.hex || '#ffffff',
                    color: getTextColor(palette[3]?.hex || '#ffffff')
                  }}
                >
                  U{i}
                </div>
                <div>
                  <div className="font-medium">User {i}</div>
                  <div className="text-xs opacity-75 truncate">Latest message here...</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div 
          className="p-4 border-b flex justify-between items-center"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: palette[1]?.hex || '#334155',
                color: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              U1
            </div>
            <div>
              <div className="font-medium">User 1</div>
              <div className="text-xs opacity-75">Online</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <PieChart size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div 
          className="flex-1 p-4 overflow-auto"
          style={{ 
            backgroundColor: palette[4]?.hex || '#f8fafc',
            color: getTextColor(palette[4]?.hex || '#f8fafc')
          }}
        >
          {/* User 1 message */}
          <div className="flex gap-3 mb-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ 
                backgroundColor: palette[1]?.hex || '#334155',
                color: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              U1
            </div>
            <div 
              className="px-3 py-2 rounded-lg max-w-[80%]"
              style={{ 
                backgroundColor: palette[0]?.hex || '#1e293b',
                color: getTextColor(palette[0]?.hex || '#1e293b')
              }}
            >
              <p>Hey there! How's it going?</p>
              <div className="text-xs opacity-75 mt-1">10:30 AM</div>
            </div>
          </div>
          
          {/* Current user message */}
          <div className="flex flex-row-reverse gap-3 mb-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              Me
            </div>
            <div 
              className="px-3 py-2 rounded-lg max-w-[80%]"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              <p>I'm doing well, thanks for asking! Just working on a new design.</p>
              <div className="text-xs opacity-75 mt-1">10:32 AM</div>
            </div>
          </div>
          
          {/* User 1 message */}
          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ 
                backgroundColor: palette[1]?.hex || '#334155',
                color: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              U1
            </div>
            <div 
              className="px-3 py-2 rounded-lg max-w-[80%]"
              style={{ 
                backgroundColor: palette[0]?.hex || '#1e293b',
                color: getTextColor(palette[0]?.hex || '#1e293b')
              }}
            >
              <p>That sounds awesome! Can't wait to see it. Let me know if you need any feedback.</p>
              <div className="text-xs opacity-75 mt-1">10:34 AM</div>
            </div>
          </div>
        </div>
        
        {/* Message input */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 px-4 py-2 rounded-full border outline-none"
              style={{ 
                borderColor: getTextColor(palette[3]?.hex || '#ffffff') + '20',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            />
            <button 
              className="px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calendar Template
function CalendarTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  return (
    <div className="h-[500px] flex" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      {/* Sidebar */}
      <div 
        className="w-64 h-full p-4 flex flex-col border-r"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        <h2 className="font-bold text-xl mb-6">Calendar</h2>
        
        <div 
          className="mb-6 rounded-lg p-4"
          style={{ 
            backgroundColor: palette[1]?.hex || '#334155',
            color: getTextColor(palette[1]?.hex || '#334155')
          }}
        >
          <div className="font-bold mb-2">April 2025</div>
          <div className="grid grid-cols-7 text-center text-xs gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center font-medium py-2">{day}</div>
            ))}
            {/* Placeholders for empty days */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {/* Days of month */}
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const isToday = day === 20;
              const hasEvent = [5, 12, 20, 25].includes(day);
              
              return (
                <div 
                  key={day} 
                  className="aspect-square flex items-center justify-center relative rounded-full text-xs"
                  style={{
                    backgroundColor: isToday ? palette[2]?.hex || '#3b82f6' : 'transparent',
                    color: isToday ? getTextColor(palette[2]?.hex || '#3b82f6') : 'inherit'
                  }}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {hasEvent && !isToday && (
                    <div 
                      className="absolute bottom-1 w-1 h-1 rounded-full"
                      style={{ backgroundColor: palette[2]?.hex || '#3b82f6' }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            <div 
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              <div className="font-medium">Today - Birthday Party</div>
              <div className="text-sm">3:00 PM - 6:00 PM</div>
            </div>
            
            <div 
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              <div className="font-medium">Tomorrow - Team Meeting</div>
              <div className="text-sm">10:00 AM - 11:30 AM</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main calendar */}
      <div className="flex-1 p-4 flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
            April 2025
          </h1>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 rounded"
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff')
              }}
            >
              Today
            </button>
            <button 
              className="px-3 py-1 rounded"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              + New Event
            </button>
          </div>
        </header>
        
        {/* Week view */}
        <div 
          className="flex-1 rounded-lg overflow-hidden border"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff'),
            borderColor: getTextColor(palette[3]?.hex || '#ffffff') + '20'
          }}
        >
          <div className="grid grid-cols-7 border-b">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div 
                key={day} 
                className="p-2 text-center border-r last:border-r-0"
                style={{ borderColor: getTextColor(palette[3]?.hex || '#ffffff') + '20' }}
              >
                <div className="font-medium">{day}</div>
                <div className="text-sm opacity-75">April {[19, 20, 21, 22, 23, 24, 25][day.indexOf(day) % 7]}</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 h-full">
            {/* Days of the week */}
            {[19, 20, 21, 22, 23, 24, 25].map((date, i) => {
              const isToday = date === 20;
              return (
                <div 
                  key={date} 
                  className="border-r last:border-r-0 relative"
                  style={{ 
                    borderColor: getTextColor(palette[3]?.hex || '#ffffff') + '20',
                    backgroundColor: isToday ? getTextColor(palette[3]?.hex || '#ffffff') + '05' : 'transparent'
                  }}
                >
                  {/* Events on the day */}
                  {date === 20 && (
                    <div 
                      className="absolute top-2 left-1 right-1 p-2 rounded"
                      style={{ 
                        backgroundColor: palette[2]?.hex || '#3b82f6',
                        color: getTextColor(palette[2]?.hex || '#3b82f6')
                      }}
                    >
                      <div className="text-xs font-medium">Birthday Party</div>
                      <div className="text-xs">3:00 PM - 6:00 PM</div>
                    </div>
                  )}
                  
                  {date === 21 && (
                    <div 
                      className="absolute top-2 left-1 right-1 p-2 rounded"
                      style={{ 
                        backgroundColor: palette[1]?.hex || '#334155',
                        color: getTextColor(palette[1]?.hex || '#334155')
                      }}
                    >
                      <div className="text-xs font-medium">Team Meeting</div>
                      <div className="text-xs">10:00 AM - 11:30 AM</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}