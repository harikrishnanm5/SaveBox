import React, { useState, useEffect } from 'react';
import { PiggyBank, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-md border-gray-200 dark:border-gray-800 py-2' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-100 dark:border-gray-800 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div 
              className={`bg-emerald-500 rounded-xl flex items-center justify-center transition-all duration-500 ease-spring ${
                isScrolled ? 'p-1.5 -rotate-12 scale-90 shadow-sm' : 'p-2 rotate-0 scale-100 shadow-none'
              }`}
            >
              <PiggyBank className={`text-white transition-all duration-300 ${isScrolled ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </div>
            <span 
              className={`font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 ${
                isScrolled ? 'text-lg tracking-tight' : 'text-xl'
              }`}
            >
              SaveBox
            </span>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex space-x-8 text-gray-600 dark:text-gray-300 font-medium">
              <a href="#features" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Features</a>
              <a href="#visualize" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Visualize</a>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};