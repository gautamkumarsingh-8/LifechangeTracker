import React, { useState } from 'react';
import { Sunrise, Shield, FileText, Mail, Info, X } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  soundEnabled: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, soundEnabled }) => {
  const [activeModal, setActiveModal] = useState<'about' | 'privacy' | 'terms' | 'contact' | null>(null);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/60 transition-colors dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-xs">
              <Sunrise className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Life Change Tracker
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Small Daily Actions. A Better Life.
              </p>
            </div>
          </div>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onScrollToSection('hero');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onScrollToSection('challenges');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Challenges
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onScrollToSection('guides');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Guides
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onScrollToSection('faq');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveModal('about');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveModal('privacy');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveModal('terms');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveModal('contact');
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Bottom Details & Copyright */}
        <div className="mt-8 border-t border-stone-200/60 pt-6 text-center text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p>
            © {currentYear} Life Change Tracker. All rights reserved. Data is preserved securely in your local browser storage.
          </p>
        </div>
      </div>

      {/* About Modal */}
      {activeModal === 'about' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <Info className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">About Life Change Tracker</h3>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Life Change Tracker</strong> is a distraction-free, privacy-first habit and personal challenge platform. We believe real personal growth does not require complex algorithms, intrusive social feeds, or cloud lock-in. Showing up every day on a structured calendar schedule builds genuine confidence and mental discipline.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeModal === 'privacy' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">Privacy Policy</h3>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We respect your privacy. All your challenge data, goals, and reflections are kept exclusively on your local device in browser storage. We do not sell your personal data, track your browsing across external websites, or transmit your records to third-party ad networks.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Use Modal */}
      {activeModal === 'terms' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">Terms of Use</h3>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Life Change Tracker is provided as a free self-improvement and habit-tracking tool for personal educational and productivity purposes. While our goal is to help you maintain consistency, individual results depend on your own personal discipline and execution.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === 'contact' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <Mail className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">Contact Life Change Tracker</h3>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Have feedback, questions, or challenge ideas? Contact our team directly:
            </p>
            <div className="mt-3 rounded-xl bg-stone-100 p-3 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              support@lifechangetracker.app
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
