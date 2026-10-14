import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Leaf,
  ShieldCheck,
  FileText,
  Info,
  X,
  ArrowUp,
  Heart,
  Lock,
  Flame,
  Target,
} from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';
import logo from '../assets/images/logo.png';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  soundEnabled: boolean;
}

type ModalType = 'about' | 'privacy' | 'terms';

const MODAL_CONTENT: Record<
  ModalType,
  { icon: React.ReactNode; title: string; description: string }
> = {
  about: {
    icon: <Info className="h-5 w-5" />,
    title: 'About Us',
    description:
      'Life Change Taker helps you build better habits, stay consistent, and achieve your personal goals through small daily actions.',
  },
  privacy: {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Privacy Policy',
    description:
      'Your challenge progress and personal records are stored in your browser. Your data is not uploaded to our servers by this application. Clearing browser storage may delete your saved progress.',
  },
  terms: {
    icon: <FileText className="h-5 w-5" />,
    title: 'Terms of Use',
    description:
      'Life Change Taker is a self-improvement tool designed to support your habits and productivity. Your results depend on your consistency and personal effort.',
  },
};

const linkClass =
  'rounded-md text-sm text-slate-600 transition-colors hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-slate-400 dark:hover:text-green-400';

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  soundEnabled,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const currentYear = new Date().getFullYear();

  const openModal = (modal: ModalType) => {
    playClickSound(soundEnabled);
    setActiveModal(modal);
  };

  const closeModal = () => setActiveModal(null);

  const goTo = (sectionId: string) => {
    playClickSound(soundEnabled);
    onScrollToSection(sectionId);
  };

  // Close with Escape + lock page scroll while the modal is open.
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModal(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeModal]);

  const active = activeModal ? MODAL_CONTENT[activeModal] : null;

  return (
    <footer className="relative overflow-hidden border-t border-green-100 bg-gradient-to-b from-green-50/70 to-white text-slate-700 transition-colors dark:border-green-900/40 dark:from-slate-950 dark:to-slate-950 dark:text-slate-300">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-green-400/10 blur-3xl dark:bg-green-500/10" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <button
              type="button"
              onClick={() => goTo('hero')}
              className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Life Change Taker home"
            >
              <img
                src={logo}
                alt="Life Change Taker"
                className="h-11 w-auto max-w-[185px] object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </button>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Build better habits, one day at a time. Pick a challenge,
              stay consistent, and watch small steps turn into big changes.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1 text-[11px] font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
                <Lock className="h-3 w-3" />
                Data stays in your browser
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-1 text-[11px] font-semibold text-orange-600 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300">
                <Flame className="h-3 w-3" />
                Build your streak
              </span>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="text-center md:text-left">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => goTo('hero')}
                  className={linkClass}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('challenges')}
                  className={`${linkClass} inline-flex items-center gap-1.5`}
                >
                  <Target className="h-3.5 w-3.5" />
                  Challenges
                </button>
              </li>
            </ul>
          </nav>

          {/* Company / legal */}
          <nav aria-label="Company" className="text-center md:text-left">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => openModal('about')}
                  className={linkClass}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal('privacy')}
                  className={linkClass}
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal('terms')}
                  className={linkClass}
                >
                  Terms
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-green-100 pt-6 dark:border-slate-800 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {currentYear} Life Change Taker. All rights reserved.
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-green-700/80 dark:text-green-500/80 sm:justify-start">
              <Leaf className="h-3 w-3" />
              Grow every day. Become your best self.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              Made with
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              for better habits
            </p>

            <button
              type="button"
              onClick={() => goTo('hero')}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-green-200 bg-white text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-slate-700 dark:bg-slate-900 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="footer-modal-title"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-green-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

              <div className="p-6">
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close dialog"
                  className="absolute right-4 top-5 rounded-lg p-1 text-slate-400 transition hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-slate-800 dark:hover:text-green-400"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 pr-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                    {active.icon}
                  </span>
                  <h2
                    id="footer-modal-title"
                    className="text-lg font-bold text-slate-900 dark:text-white"
                  >
                    {active.title}
                  </h2>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {active.description}
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:from-green-400 hover:to-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};