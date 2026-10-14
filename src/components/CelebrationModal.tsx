import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  X,
  Download,
  Share2,
  Flame,
  CalendarDays,
  Target,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

import { ActiveChallenge } from '../types.ts';
import {
  formatDisplayDate,
  getTodayLocalDateString,
} from '../utils/dateUtils.ts';
import {
  playFanfareSound,
  playClickSound,
} from '../utils/audio.ts';

interface CelebrationModalProps {
  challenge: ActiveChallenge;
  isOpen: boolean;
  onClose: () => void;
  onStartNewChallenge: () => void;
  soundEnabled: boolean;
}

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700;800&display=swap';

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onStartNewChallenge,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [typedName, setTypedName] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);

  const fullName = (challenge.userName || 'Champion').trim();
  const completedDays = challenge.days.filter(
    (day) => day.isCompleted
  ).length;

  const totalDays = challenge.durationDays;

  const isComplete =
    totalDays > 0 && completedDays >= totalDays;

  const percentage =
    totalDays > 0
      ? Math.min(
          100,
          Math.round((completedDays / totalDays) * 100)
        )
      : 0;

  const completionDate = getTodayLocalDateString();

  const shareText = [
    '🏆 I Did It! 🏆',
    '',
    `🎯 Challenge: ${challenge.goalTitle}`,
    `🔥 Duration: ${totalDays} Days`,
    `✅ Completed: ${completedDays}/${totalDays} Days`,
    `📊 Progress: ${percentage}%`,
    `📅 Finished on: ${formatDisplayDate(completionDate)}`,
    '',
    '💪 Small Steps • Better Habits • Bigger Changes',
    `— ${fullName}`,
    '✨ Life Change Taker',
  ].join('\n');

  // Load fonts.
  useEffect(() => {
    if (document.getElementById('celebration-fonts')) {
      return;
    }

    const link = document.createElement('link');
    link.id = 'celebration-fonts';
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  // Celebration sound and confetti.
  useEffect(() => {
    if (!isOpen) return;

    playFanfareSound(soundEnabled);

    const colors = [
      '#FBBF24',
      '#F59E0B',
      '#34D399',
      '#38BDF8',
      '#F472B6',
    ];

    try {
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 42,
        origin: { x: 0.5, y: 0.45 },
        colors,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: 55,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: 55,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      });
    } catch {
      // Keep the modal working if confetti fails.
    }
  }, [isOpen, soundEnabled]);

  // Name-writing animation.
  useEffect(() => {
    if (!isOpen) return;

    setTypedName('');

    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setTypedName(fullName.slice(0, index));

        if (index >= fullName.length && interval) {
          clearInterval(interval);
        }
      }, 75);
    }, 400);

    return () => {
      clearTimeout(timeout);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen, fullName]);

  if (!isOpen) return null;

  const celebrateAgain = () => {
    playClickSound(soundEnabled);

    try {
      confetti({
        particleCount: 160,
        spread: 110,
        startVelocity: 45,
        origin: { y: 0.55 },
        colors: [
          '#FBBF24',
          '#34D399',
          '#38BDF8',
          '#F472B6',
        ],
        disableForReducedMotion: true,
      });
    } catch {
      // Optional visual effect.
    }
  };

  // Generate a shareable PNG from the achievement card.
  const renderCardImage = async (): Promise<string | null> => {
    const card = cardRef.current;

    if (!card) return null;

    try {
      if ('fonts' in document) {
        await document.fonts.ready;
      }

      return await toPng(card, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#101329',
      });
    } catch (error) {
      console.error('Unable to generate achievement image:', error);
      return null;
    }
  };

  const downloadImage = (dataUrl: string) => {
    const anchor = document.createElement('a');

    anchor.href = dataUrl;
    anchor.download = 'life-change-taker-achievement.png';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleDownload = async () => {
    playClickSound(soundEnabled);
    setBusy(true);

    try {
      setTypedName(fullName);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const image = await renderCardImage();

      if (image) {
        downloadImage(image);
      } else {
        window.alert(
          'There was a problem creating the image. Please try again.'
        );
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    playClickSound(soundEnabled);
    setBusy(true);

    try {
      setTypedName(fullName);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const image = await renderCardImage();

      // Fallback if image generation fails.
      if (!image) {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          '_blank',
          'noopener,noreferrer'
        );
        return;
      }

      const response = await fetch(image);
      const blob = await response.blob();

      const file = new File(
        [blob],
        'life-change-taker-achievement.png',
        { type: 'image/png' }
      );

      const canShareImage =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      if (canShareImage) {
        await navigator.share({
          files: [file],
          title: 'My Challenge Achievement',
          text: shareText,
        });
      } else {
        // Desktop/browser fallback.
        downloadImage(image);

        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error('Sharing failed:', error);

      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    playClickSound(soundEnabled);

    try {
      await navigator.clipboard.writeText(shareText);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.alert(
        'Copy failed. Please check your browser\'s clipboard permission.'
      );
    }
  };

  const handleNewChallenge = () => {
    playClickSound(soundEnabled);
    onClose();
    onStartNewChallenge();
  };

  const sparkles = Array.from({ length: 16 }, (_, index) => ({
    left: `${(index * 37) % 100}%`,
    top: `${(index * 53) % 100}%`,
    delay: (index % 6) * 0.3,
    size: 3 + (index % 3) * 2,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-xl sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !busy
            ) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative my-5 flex w-full max-w-md flex-col items-center"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close celebration"
              className="absolute right-0 top-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Heading */}
            <div className="mb-5 w-full px-3 pt-12 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 12,
                }}
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10 text-amber-300"
              >
                <PartyPopper className="h-7 w-7" />
              </motion.div>

              <p className="mb-1 text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
                Achievement Unlocked
              </p>

              <h2
                id="celebration-title"
                className="bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-300 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
              >
                {isComplete ? 'Congratulations!' : 'Keep Going!'}
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {isComplete
                  ? 'You kept the promise you made to yourself! 🎉'
                  : 'Every step brings you closer to your goal.'}
              </p>
            </div>

            {/* Downloadable 9:16 card */}
            <div
              ref={cardRef}
              className="relative isolate aspect-[9/16] w-[min(100%,320px)] overflow-hidden rounded-[28px] border-2 border-amber-300/50 shadow-2xl shadow-amber-500/10"
              style={{
                fontFamily: "'Poppins', system-ui, sans-serif",
                background:
                  'radial-gradient(ellipse at 50% 0%, #493411 0%, #202341 43%, #101329 100%)',
              }}
            >
              <div
                className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full blur-3xl"
                style={{
                  background: 'rgba(245,158,11,0.25)',
                }}
              />

              <div
                className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl"
                style={{
                  background: 'rgba(16,185,129,0.2)',
                }}
              />

              {/* Animated sparkles */}
              {sparkles.map((sparkle, index) => (
                <motion.span
                  key={index}
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    width: sparkle.size,
                    height: sparkle.size,
                    background: '#FDE68A',
                    boxShadow:
                      '0 0 10px rgba(253,230,138,0.8)',
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.7, 1.3, 0.7],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: sparkle.delay,
                  }}
                />
              ))}

              <div className="relative z-10 flex h-full flex-col items-center justify-between px-5 py-6 text-center">
                {/* Trophy */}
                <div className="flex w-full flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 170,
                      damping: 12,
                      delay: 0.15,
                    }}
                    className="flex h-[76px] w-[76px] items-center justify-center rounded-[25px] border border-yellow-100/50"
                    style={{
                      background:
                        'linear-gradient(135deg,#FDE68A,#F59E0B,#FBBF24)',
                      boxShadow:
                        '0 0 35px rgba(245,158,11,0.35)',
                    }}
                  >
                    <Trophy className="h-10 w-10 text-slate-950" />
                  </motion.div>

                  <h3 className="mt-4 text-xl font-extrabold uppercase tracking-[0.12em] text-amber-200">
                    {isComplete
                      ? 'Challenge Complete'
                      : 'Keep Growing'}
                  </h3>

                  <div className="mt-2 h-0.5 w-24 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                </div>

                {/* Winner */}
                <div className="flex w-full flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400">
                    This Victory Belongs To
                  </span>

                  <div className="mt-3 flex min-h-[78px] w-full items-center justify-center">
                    <span
                      className="max-w-full break-words text-amber-300"
                      style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize:
                          fullName.length > 16
                            ? '36px'
                            : fullName.length > 10
                              ? '44px'
                              : '54px',
                        lineHeight: 1.15,
                        overflowWrap: 'anywhere',
                        textShadow:
                          '0 0 22px rgba(251,191,36,0.4)',
                      }}
                    >
                      {typedName}
                    </span>
                  </div>

                  <p className="mt-3 text-center text-sm font-bold leading-relaxed text-white">
                    {totalDays}-Day Challenge
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-200">
                    <Flame className="h-4 w-4" />
                    {isComplete
                      ? 'You showed your strength! 💪'
                      : 'Every day is a fresh start!'}
                  </div>
                </div>

                {/* Goal and stats */}
                <div className="w-full">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-left">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                        <Target className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          My Goal
                        </p>
                        <p className="mt-1 break-words text-xs font-bold leading-relaxed text-white">
                          {challenge.goalTitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Challenge progress</span>
                      <span className="font-bold text-emerald-300">
                        {percentage}%
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-white/[0.04] px-1 py-2">
                        <Trophy className="mx-auto mb-1 h-4 w-4 text-amber-300" />
                        <p className="text-base font-extrabold text-white">
                          {totalDays}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Total Days
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.04] px-1 py-2">
                        <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-300" />
                        <p className="text-base font-extrabold text-white">
                          {completedDays}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Completed
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.04] px-1 py-2">
                        <CalendarDays className="mx-auto mb-1 h-4 w-4 text-sky-300" />
                        <p className="text-[10px] font-bold leading-5 text-white">
                          {formatDisplayDate(completionDate)}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Finished On
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-300">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      Small Steps • Better Habits
                    </div>

                    <p className="mt-1 text-[11px] font-extrabold tracking-[0.12em] text-amber-300">
                      LIFE CHANGE TAKER
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleShare}
                disabled={busy}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              >
                <Share2 className="h-4 w-4" />
                {busy
                  ? 'Preparing your card...'
                  : 'Share Achievement'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={busy}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60 sm:text-sm"
              >
                <Download className="h-4 w-4" />
                Download Card
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14] sm:text-sm"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>

              <button
                type="button"
                onClick={celebrateAgain}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14] sm:text-sm"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                Celebrate
              </button>

              <button
                type="button"
                onClick={handleNewChallenge}
                disabled={busy}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.14] disabled:opacity-50 sm:text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                New Challenge
              </button>
            </div>

            <p className="mt-4 max-w-xs text-center text-[11px] leading-relaxed text-slate-500">
              Your progress is proof that small steps can create
              big changes. Keep going! ✨
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};