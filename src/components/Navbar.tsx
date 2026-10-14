
import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Award,
  ChevronRight,
  Target,
  TrendingUp,
  CheckCircle2,
  Heart,
} from 'lucide-react';

import { playClickSound } from '../utils/audio';
import logo from '../assets/images/logo.png';

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
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isDark = theme === 'dark';

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Challenges', id: 'challenges' },
    { label: 'About', id: 'about' },
  ];

  const handleNavClick = (sectionId: string) => {
    playClickSound(soundEnabled);
    setMobileMenuOpen(false);

    if (sectionId === 'about') {
      setIsAboutOpen(true);
      return;
    }

    onScrollToSection(sectionId);
  };

  const handleThemeToggle = () => {
    playClickSound(soundEnabled);
    onToggleTheme();
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    onToggleSound();
    playClickSound(nextState);
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
  };

  const navLinkClass = `
    rounded-xl px-4 py-2.5 text-sm font-semibold
    transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-green-500
    ${
      isDark
        ? 'text-slate-300 hover:bg-green-950/70 hover:text-green-400'
        : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
    }
  `;

  const iconButtonClass = `
    flex h-10 w-10 shrink-0 items-center justify-center
    rounded-xl border transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-green-500
    ${
      isDark
        ? 'border-green-900/60 bg-[#12271B] text-green-300 hover:border-green-600 hover:bg-[#193725]'
        : 'border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
    }
  `;

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full border-b
          backdrop-blur-xl transition-colors duration-300
          ${
            isDark
              ? 'border-green-900/60 bg-[#07130C]/95'
              : 'border-green-100 bg-white/95 shadow-sm shadow-green-950/[0.03]'
          }
        `}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            aria-label="Life Change Taker home"
            className="group shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <span
              className={`
                flex items-center justify-center rounded-xl
                border px-2.5 py-1.5 transition-all duration-300
                ${
                  isDark
                    ? 'border-green-400/20 bg-[#F7FFF8] shadow-[0_0_22px_rgba(74,222,128,0.14)]'
                    : 'border-green-100 bg-white'
                }
              `}
            >
              <img
                src={logo}
                alt="Life Change Taker"
                className="h-10 w-auto max-w-[145px] object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-11 sm:max-w-[185px]"
              />
            </span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={navLinkClass}
              >
                {item.label}
              </button>
            ))}

            {hasActiveChallenge && (
              <button
                type="button"
                onClick={() => handleNavClick('active-dashboard')}
                className="
                  ml-3 inline-flex items-center gap-2
                  rounded-xl bg-green-600 px-4 py-2.5
                  text-sm font-bold text-white
                  shadow-lg shadow-green-600/20
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-green-500
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-green-400
                "
              >
                <Award size={17} />
                My Challenge
                <ChevronRight size={15} />
              </button>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-2">

            {/* SOUND */}
            <button
              type="button"
              onClick={handleSoundToggle}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              aria-pressed={soundEnabled}
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              className={iconButtonClass}
            >
              {soundEnabled ? (
                <Volume2 size={18} />
              ) : (
                <VolumeX size={18} />
              )}
            </button>

            {/* THEME */}
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              title={isDark ? 'Light mode' : 'Dark mode'}
              className={iconButtonClass}
            >
              {isDark ? (
                <Sun size={19} className="text-green-300" />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setMobileMenuOpen((open) => !open);
              }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className={`${iconButtonClass} md:hidden`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className={`
              border-t px-4 pb-5 pt-4 shadow-xl
              sm:px-6 md:hidden
              ${
                isDark
                  ? 'border-green-900/60 bg-[#09180F] shadow-black/20'
                  : 'border-green-100 bg-white shadow-green-950/5'
              }
            `}
          >
            <div className="mx-auto max-w-7xl">

              {/* MOBILE BRAND */}
              <div
                className={`
                  mb-4 flex items-center gap-3 rounded-2xl border p-4
                  ${
                    isDark
                      ? 'border-green-800/50 bg-[#10251A]'
                      : 'border-green-100 bg-green-50'
                  }
                `}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20">
                  <Award size={22} />
                </div>

                <div>
                  <p
                    className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Life Change Taker
                  </p>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Build habits. Change your life.
                  </p>
                </div>
              </div>

              {/* MOBILE LINKS */}
              <nav
                aria-label="Mobile navigation"
                className="space-y-1.5"
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex w-full items-center justify-between
                      rounded-xl px-4 py-3.5 text-left
                      text-sm font-semibold transition-colors
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-green-500
                      ${
                        isDark
                          ? 'text-slate-200 hover:bg-green-950 hover:text-green-300'
                          : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                      }
                    `}
                  >
                    {item.label}
                    <ChevronRight
                      size={18}
                      className="text-green-600 dark:text-green-400"
                    />
                  </button>
                ))}

                {hasActiveChallenge && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('active-dashboard')}
                    className="
                      mt-3 flex w-full items-center justify-between
                      rounded-xl bg-green-600 px-4 py-3.5
                      text-sm font-bold text-white
                      shadow-lg shadow-green-600/20
                      transition-all hover:bg-green-500
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-green-400
                    "
                  >
                    <span className="flex items-center gap-2.5">
                      <Award size={19} />
                      My Challenge
                    </span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </nav>

              {/* MOBILE APPEARANCE */}
              <div
                className={`
                  mt-4 flex items-center justify-between gap-3
                  rounded-2xl border p-4
                  ${
                    isDark
                      ? 'border-green-900/60 bg-[#102219]'
                      : 'border-slate-200 bg-slate-50'
                  }
                `}
              >
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    Appearance
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className="
                    inline-flex shrink-0 items-center gap-2
                    rounded-xl border border-green-600/30
                    bg-green-600/10 px-3.5 py-2.5
                    text-xs font-bold text-green-700
                    transition-colors hover:bg-green-600/15
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-green-500
                    dark:text-green-300
                  "
                >
                  {isDark ? (
                    <>
                      <Sun size={16} />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={16} />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ABOUT POPUP */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-md"
          onClick={closeAbout}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            className={`
              relative my-auto w-full max-w-lg overflow-hidden
              rounded-3xl border shadow-2xl
              ${
                isDark
                  ? 'border-green-800/60 bg-[#0B1B11] text-white'
                  : 'border-green-100 bg-white text-slate-800'
              }
            `}
            onClick={(event) => event.stopPropagation()}
          >
            {/* TOP ACCENT */}
            <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={closeAbout}
              aria-label="Close About popup"
              className={`
                absolute right-4 top-5 flex h-10 w-10
                items-center justify-center rounded-xl
                transition-colors
                ${
                  isDark
                    ? 'text-slate-300 hover:bg-green-900/60'
                    : 'text-slate-500 hover:bg-green-50 hover:text-green-700'
                }
              `}
            >
              <X size={21} />
            </button>

            <div className="max-h-[85vh] overflow-y-auto px-6 pb-7 pt-8 sm:px-8 sm:pb-8">

              {/* BRAND ICON */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/25">
                <Award size={29} />
              </div>

              {/* TITLE */}
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
                About Our Platform
              </p>

              <h2
                id="about-title"
                className="text-3xl font-extrabold tracking-tight sm:text-4xl"
              >
                Life Change{' '}
                <span className="text-green-600 dark:text-green-400">
                  Taker
                </span>
              </h2>

              <p
                className={`mt-4 text-sm leading-7 sm:text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Welcome to Life Change Taker — your companion
                for building better habits and creating a more
                disciplined lifestyle.
              </p>

              <p
                className={`mt-3 text-sm leading-7 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                We believe meaningful change starts with small
                daily actions. Choose a goal, follow your plan,
                track your progress and keep moving forward,
                one day at a time.
              </p>

              {/* FEATURES */}
              <div className="mt-6 space-y-3">

                {/* FEATURE 1 */}
                <div
                  className={`flex gap-3 rounded-2xl border p-4 ${
                    isDark
                      ? 'border-green-900/60 bg-green-950/30'
                      : 'border-green-100 bg-green-50/70'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                    <Target size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold">Set Personal Goals</h3>
                    <p
                      className={`mt-1 text-sm leading-6 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Choose a goal that matters to you and
                      start a 7, 14, 21 or 30-day challenge.
                    </p>
                  </div>
                </div>

                {/* FEATURE 2 */}
                <div
                  className={`flex gap-3 rounded-2xl border p-4 ${
                    isDark
                      ? 'border-green-900/60 bg-green-950/30'
                      : 'border-green-100 bg-green-50/70'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold">Track Daily Progress</h3>
                    <p
                      className={`mt-1 text-sm leading-6 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Record daily completions, reflect on your
                      journey and keep track of your progress.
                    </p>
                  </div>
                </div>

                {/* FEATURE 3 */}
                <div
                  className={`flex gap-3 rounded-2xl border p-4 ${
                    isDark
                      ? 'border-green-900/60 bg-green-950/30'
                      : 'border-green-100 bg-green-50/70'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                    <TrendingUp size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold">Build Consistency</h3>
                    <p
                      className={`mt-1 text-sm leading-6 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Focus on progress over perfection and
                      turn your intentions into daily actions.
                    </p>
                  </div>
                </div>
              </div>

              {/* MISSION */}
              <div className="mt-6 rounded-2xl border border-green-600/20 bg-green-600/10 p-4">
                <div className="flex items-center gap-2">
                  <Heart
                    size={18}
                    className="text-green-600 dark:text-green-400"
                  />
                  <h3 className="font-bold text-green-700 dark:text-green-400">
                    Our Mission
                  </h3>
                </div>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Help people develop discipline, stay
                  consistent and make meaningful changes
                  through simple daily challenges.
                </p>
              </div>

              {/* CALL TO ACTION */}
              <button
                type="button"
                onClick={() => {
                  closeAbout();
                  onScrollToSection('challenges');
                }}
                className="
                  mt-6 flex w-full items-center justify-center
                  gap-2 rounded-xl bg-green-600 px-5 py-3.5
                  font-bold text-white shadow-lg
                  shadow-green-600/20 transition-all
                  hover:-translate-y-0.5 hover:bg-green-500
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-green-400
                "
              >
                Explore Challenges
                <ChevronRight size={19} />
              </button>

              <p
                className={`mt-4 text-center text-xs ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Build habits. Change your life.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
