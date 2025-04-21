import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Layout, Monitor, PieChart, MessageSquare, Calendar } from 'lucide-react';
import { usePalette } from '@/contexts/PaletteContext';
import { Color } from '@/types/Color';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
// Import isLightColor or define it here
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 rounded-full border-8 flex items-center justify-center"
                  style={{ borderColor: palette[2]?.hex || '#3b82f6' }}
                >
                  <div className="absolute top-0 right-0 bottom-0 left-0 rounded-full border-8"
                    style={{ 
                      borderColor: palette[1]?.hex || '#334155',
                      clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                    }}
                  ></div>
                  <div className="text-2xl font-bold">68%</div>
                </div>
              </div>
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
          <h3 className="font-medium mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { label: 'Direct', value: 42 },
              { label: 'Social', value: 28 },
              { label: 'Organic', value: 18 },
              { label: 'Referral', value: 12 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div>{item.label}</div>
                  <div>{item.value}%</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${item.value}%`,
                      backgroundColor: [palette[0]?.hex, palette[1]?.hex, palette[2]?.hex, palette[4]?.hex][i % 4] || '#3b82f6'
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
        className="w-64 flex flex-col border-r"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b')
        }}
      >
        <div className="p-4 border-b">
          <div className="font-bold text-lg">Chats</div>
        </div>
        
        <div className="p-2">
          <div 
            className="p-2 mb-2 rounded"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            <div className="font-medium">Sarah Johnson</div>
            <div className="text-xs opacity-90">Hey, how's it going?</div>
          </div>
          
          {['Mike Smith', 'Team Chat', 'Jane Doe', 'Support'].map((name, i) => (
            <div key={i} className="p-2 mb-2 rounded hover:bg-opacity-10 hover:bg-white">
              <div className="font-medium">{name}</div>
              <div className="text-xs opacity-90">Last message...</div>
            </div>
          ))}
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
          <div className="font-bold">Sarah Johnson</div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              📞
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              📹
            </div>
          </div>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 p-4 overflow-auto"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          {/* Their message */}
          <div className="flex mb-4">
            <div 
              className="max-w-[80%] p-3 rounded-lg rounded-tl-none"
              style={{ 
                backgroundColor: palette[1]?.hex || '#334155',
                color: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              Hey, how's it going? I was wondering if you had time to catch up today?
            </div>
          </div>

          {/* My message */}
          <div className="flex justify-end mb-4">
            <div 
              className="max-w-[80%] p-3 rounded-lg rounded-tr-none"
              style={{ 
                backgroundColor: palette[2]?.hex || '#3b82f6',
                color: getTextColor(palette[2]?.hex || '#3b82f6')
              }}
            >
              Hi Sarah! Yes, I'm free around 2pm if that works for you?
            </div>
          </div>

          {/* Their message */}
          <div className="flex mb-4">
            <div 
              className="max-w-[80%] p-3 rounded-lg rounded-tl-none"
              style={{ 
                backgroundColor: palette[1]?.hex || '#334155',
                color: getTextColor(palette[1]?.hex || '#334155')
              }}
            >
              Perfect! I'll see you at the coffee shop at 2pm.
            </div>
          </div>
        </div>

        {/* Message input */}
        <div 
          className="p-3 border-t flex gap-2"
          style={{ 
            backgroundColor: palette[3]?.hex || '#ffffff',
            color: getTextColor(palette[3]?.hex || '#ffffff')
          }}
        >
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 p-2 rounded-full border bg-transparent outline-none"
          />
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: palette[2]?.hex || '#3b82f6',
              color: getTextColor(palette[2]?.hex || '#3b82f6')
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

// Calendar Template
function CalendarTemplate({ palette, getTextColor }: { palette: Color[], getTextColor: (color: string) => string }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Generate calendar grid
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  
  return (
    <div className="h-[500px] overflow-auto" style={{ backgroundColor: palette[4]?.hex || '#f8fafc', color: getTextColor(palette[4]?.hex || '#f8fafc') }}>
      <header 
        className="p-4 flex justify-between items-center"
        style={{ 
          backgroundColor: palette[0]?.hex || '#1e293b',
          color: getTextColor(palette[0]?.hex || '#1e293b'),
          '--ring-color': palette[2]?.hex || '#3b82f6'
        } as React.CSSProperties}
      >
        <div className="font-bold text-xl">April 2025</div>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-10 hover:bg-white">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-10 hover:bg-white">
            &gt;
          </button>
        </div>
      </header>

      <div className="p-4">
        {/* Calendar header */}
        <div className="grid grid-cols-7 mb-2">
          {days.map(day => (
            <div key={day} className="text-center font-medium py-2">{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}

          {/* Calendar days */}
          {calendarDays.map(day => (
            <div 
              key={day} 
              className={`aspect-square p-1 rounded-md ${day === 15 ? 'ring-2 ring-opacity-100 ring-color' : ''}`}
              style={{ 
                backgroundColor: palette[3]?.hex || '#ffffff',
                color: getTextColor(palette[3]?.hex || '#ffffff'),
                '--ring-color': palette[2]?.hex || '#3b82f6'
              } as React.CSSProperties}
            >
              <div className="h-full flex flex-col">
                <div className="text-sm font-medium">{day}</div>
                
                {/* Show events on specific days */}
                {day === 10 && (
                  <div 
                    className="mt-1 text-xs p-1 rounded-sm"
                    style={{ 
                      backgroundColor: palette[1]?.hex || '#334155',
                      color: getTextColor(palette[1]?.hex || '#334155')
                    }}
                  >
                    Meeting
                  </div>
                )}
                
                {day === 15 && (
                  <div 
                    className="mt-1 text-xs p-1 rounded-sm"
                    style={{ 
                      backgroundColor: palette[2]?.hex || '#3b82f6',
                      color: getTextColor(palette[2]?.hex || '#3b82f6')
                    }}
                  >
                    Birthday
                  </div>
                )}
                
                {day === 22 && (
                  <div 
                    className="mt-1 text-xs p-1 rounded-sm"
                    style={{ 
                      backgroundColor: palette[1]?.hex || '#334155',
                      color: getTextColor(palette[1]?.hex || '#334155')
                    }}
                  >
                    Deadline
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming events */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Upcoming Events</h3>
          <div 
            className="p-3 rounded-lg mb-2"
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
              backgroundColor: palette[1]?.hex || '#334155',
              color: getTextColor(palette[1]?.hex || '#334155')
            }}
          >
            <div className="font-medium">Tomorrow - Team Meeting</div>
            <div className="text-sm">10:00 AM - 11:30 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
}