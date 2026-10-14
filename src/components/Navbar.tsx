import React, { useState } from 'react';
import { Sun, Moon, Volume2, VolumeX, Menu, X, Sunrise, Award } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hasActiveChallenge: boolean;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  hasActiveChallenge,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    playClickSound(soundEnabled);
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 cursor-pointer"
          aria-label="Life Change Tracker Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sunrise className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Life Change Tracker
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('hero')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('challenges')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Challenges
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('guides')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Guides
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            FAQ
          </button>
          {hasActiveChallenge && (
            <button
              onClick={() => handleNavClick('active-dashboard')}
              className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Active Challenge</span>
            </button>
          )}
        </nav>

        {/* Actions (Sound + Theme + Mobile Menu Button) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const newState = !soundEnabled;
              onToggleSound();
              playClickSound(newState);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-600 shadow-xs hover:bg-stone-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onToggleTheme();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-600 shadow-xs hover:bg-stone-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-600 shadow-xs hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col space-y-3 pt-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('challenges')}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              Challenges
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('guides')}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              Guides & Articles
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              FAQ
            </button>
            {hasActiveChallenge && (
              <button
                onClick={() => handleNavClick('active-dashboard')}
                className="text-left px-3 py-2 rounded-lg bg-amber-50 text-amber-700 font-semibold dark:bg-amber-950/40 dark:text-amber-300 cursor-pointer"
              >
                Go to Active Challenge
              </button>
            )}

            {/* Mobile Theme Toggle Row */}
            <div className="pt-2 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between px-3 text-sm">
              <span className="text-slate-600 dark:text-slate-400">Theme</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onToggleTheme();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold bg-stone-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
