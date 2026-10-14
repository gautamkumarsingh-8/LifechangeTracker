import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { playClickSound } from '../utils/audio.ts';

interface HeroSectionProps {
  onStartChallenge: () => void;
  onExploreChallenges: () => void;
  soundEnabled: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartChallenge,
  onExploreChallenges,
  soundEnabled,
}) => {
  return (
    <section id="hero" className="relative px-3 pt-3 pb-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
        {/* Background Image Container */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] w-full flex items-center justify-center">
          <img
            src="/src/assets/images/hero_sunrise_mountains_1791954440703.jpg"
            alt="Serene mountain sunrise landscape bathed in warm golden dawn light"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Measured Contrast Overlay Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-slate-950/40" />

          {/* Decorative Warm Ambient Glow */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 text-center text-white">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wider text-amber-200 backdrop-blur-md border border-white/20 mb-4"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>SMALL STEPS • DAILY CONSISTENCY • PROVEN RESULTS</span>
            </motion.div>

            {/* Requested Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance drop-shadow-sm text-white"
            >
              Small Daily Actions. A Better Life.
            </motion.h1>

            {/* Requested Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed text-balance"
            >
              Start a personal challenge, build consistency, track your progress, and celebrate every milestone.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onStartChallenge();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 active:scale-98 cursor-pointer"
              >
                <span>Start Your Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onExploreChallenges();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md border border-white/25 transition-all hover:bg-white/25 active:scale-98 cursor-pointer"
              >
                <Compass className="h-4 w-4 text-amber-200" />
                <span>Explore Challenges</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
