import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, CheckCircle2, RotateCcw, Share2, Copy, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveChallenge } from '../types.ts';
import { formatDisplayDate, getTodayLocalDateString } from '../utils/dateUtils.ts';
import { playFanfareSound, playClickSound } from '../utils/audio.ts';

interface CelebrationModalProps {
  challenge: ActiveChallenge;
  isOpen: boolean;
  onClose: () => void;
  onStartNewChallenge: () => void;
  soundEnabled: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onStartNewChallenge,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playFanfareSound(soundEnabled);

      // Multi-angle celebratory confetti bursts
      try {
        const count = 180;
        const defaults = {
          origin: { y: 0.7 },
          disableForReducedMotion: true,
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch {
        // Fallback gracefully
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const completedDays = challenge.days.filter((d) => d.isCompleted).length;
  const completionDate = getTodayLocalDateString();

  const handleCelebrateAgain = () => {
    playClickSound(soundEnabled);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#ec4899'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback
    }
  };

  const handleCopyAchievement = () => {
    playClickSound(soundEnabled);
    const summaryText = `🏆 Life Change Taker Achievement 🏆\n\nI just completed my ${challenge.durationDays}-Day Challenge for: "${challenge.goalTitle}"!\n\n${completedDays}/${challenge.durationDays} days completed (100% finished)\nTimeline: ${formatDisplayDate(challenge.startDate)} – ${formatDisplayDate(completionDate)}\n\n"Small Steps • Better Habits • Bigger Changes"`;

    navigator.clipboard?.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl dark:bg-slate-900 border border-amber-500/40 my-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close celebration modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Trophy Illustration */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-xl shadow-amber-500/30">
          <Trophy className="h-10 w-10 text-slate-950" />
        </div>

        {/* Exact Requested Headline */}
        <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          CONGRATULATIONS!
        </span>

        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          You did it, {challenge.userName}!
        </h2>

        {/* Supporting message */}
        <p className="mt-2 text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
          Your {challenge.durationDays}-Day Challenge is complete.
        </p>

        <p className="mt-1 text-xs sm:text-sm text-amber-700 dark:text-amber-400 font-medium">
          {challenge.durationDays} days of effort. One meaningful achievement.
        </p>

        {/* Shareable Achievement Summary Card */}
        <div className="mt-6 rounded-2xl bg-stone-50 p-4 border border-stone-200/90 dark:bg-slate-800/60 dark:border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-700/60 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Personal Goal</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{challenge.goalTitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Finished
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Duration</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{challenge.durationDays} Days</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Completed</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">{completedDays} / {challenge.durationDays} Days</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Completed On</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatDisplayDate(completionDate)}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={handleCelebrateAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Celebrate My Achievement</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAchievement}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-stone-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Share Achievement</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
              onStartNewChallenge();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start a New Challenge</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
