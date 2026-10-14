import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompletionToastProps {
  dayNumber: number | null;
  onClose: () => void;
}

export const CompletionToast: React.FC<CompletionToastProps> = ({ dayNumber, onClose }) => {
  useEffect(() => {
    if (dayNumber !== null) {
      // Fire subtle mini confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.85, x: 0.5 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#a855f7'],
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback gracefully
      }

      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [dayNumber, onClose]);

  return (
    <AnimatePresence>
      {dayNumber !== null && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border border-amber-500/30 max-w-sm dark:bg-slate-950"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="flex-1 pr-2">
            <h4 className="text-sm font-bold text-white">Great Job!</h4>
            <p className="text-xs text-slate-300">
              You completed Day {dayNumber}. One small step forward!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
