import React from "react";
import { HelpCircle, Eye, Menu, SplitSquareHorizontal, Layers, Pipette, Compass, Type, Sun, Moon, LogIn, LogOut, User, ImageDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

function NavBtn({ href, icon, label, tooltip }: { href: string; icon: React.ReactNode; label: string; tooltip: string }) {
  return (
    <button
      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
      onClick={() => window.location.href = href}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg whitespace-nowrap pointer-events-none z-50">
        {tooltip}
      </span>
    </button>
  );
}

function MobileBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <button
      className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 py-1.5 px-3 rounded-lg transition-colors text-sm w-full"
      onClick={() => window.location.href = href}
    >
      <span className="text-gray-400">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Header({ mobileMenuOpen, toggleMobileMenu }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();

  return (
    <>
      <header className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-16 sm:w-20 md:w-24 h-6 sm:h-8">
              <img src="/logo_circles.svg" alt="Coolors Logo" className="h-full" />
            </div>
            <span className="font-bold text-md sm:text-lg md:text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Coolors
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-0.5">
          <NavBtn href="/explore" icon={<Compass size={15} />} label="Explore" tooltip="Trending palettes" />
          <NavBtn href="/visualize" icon={<Eye size={15} />} label="Visualize" tooltip="Preview in UI templates" />
          <NavBtn href="/image-palette" icon={<ImageDown size={15} />} label="Extract" tooltip="Extract palette from image" />
          <NavBtn href="/contrast-checker" icon={<SplitSquareHorizontal size={15} />} label="Contrast" tooltip="WCAG contrast checker" />
          <NavBtn href="/gradient-generator" icon={<Layers size={15} />} label="Gradient" tooltip="CSS gradient builder" />
          <NavBtn href="/color-picker" icon={<Pipette size={15} />} label="Picker" tooltip="Shades, tints & tones" />
          <NavBtn href="/font-generator" icon={<Type size={15} />} label="Fonts" tooltip="Font generator" />
          <NavBtn href="/designers-guide" icon={<HelpCircle size={15} />} label="Help" tooltip="Designer's guide" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={() => window.location.href = '/saved-palettes'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={15} /><span className="max-w-20 truncate">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => logoutMutation.mutate()}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/auth'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity ml-1"
            >
              <LogIn size={14} />Sign In
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-900 shadow-lg fixed top-[42px] sm:top-[52px] right-2 sm:right-4 w-52 z-50 rounded-xl transform origin-top-right transition-all duration-200 border border-gray-100 dark:border-gray-800 ${mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <div className="py-2 px-2 flex flex-col space-y-0.5">
          <MobileBtn href="/explore" icon={<Compass size={15} />} label="Explore Palettes" />
          <MobileBtn href="/visualize" icon={<Eye size={15} />} label="Visualize" />
          <MobileBtn href="/image-palette" icon={<ImageDown size={15} />} label="Extract from Image" />
          <MobileBtn href="/contrast-checker" icon={<SplitSquareHorizontal size={15} />} label="Contrast" />
          <MobileBtn href="/gradient-generator" icon={<Layers size={15} />} label="Gradient" />
          <MobileBtn href="/color-picker" icon={<Pipette size={15} />} label="Color Picker" />
          <MobileBtn href="/font-generator" icon={<Type size={15} />} label="Font Generator" />
          <MobileBtn href="/designers-guide" icon={<HelpCircle size={15} />} label="Help" />
          <div className="border-t border-gray-100 dark:border-gray-800 my-1 mx-3" />
          {user ? (
            <>
              <MobileBtn href="/saved-palettes" icon={<User size={15} />} label={user.name} />
              <button onClick={() => logoutMutation.mutate()} className="text-red-500 flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm w-full hover:bg-red-50 transition-colors">
                <LogOut size={15} />Sign Out
              </button>
            </>
          ) : (
            <MobileBtn href="/auth" icon={<LogIn size={15} />} label="Sign In" />
          )}
        </div>
      </div>
    </>
  );
}
