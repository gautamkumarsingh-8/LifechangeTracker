import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Calendar,
  User,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Brain,
  CigaretteOff,
  ShieldCheck,
  Footprints,
  BookOpen,
  Dumbbell,
  Flower2,
  Sunrise,
  PhoneOff,
  PenLine,
  Flag,
  type LucideIcon,
} from 'lucide-react';

import { CHALLENGE_DURATIONS } from '../data/durations.ts';
import { ChallengeDuration } from '../types.ts';
import {
  getTodayLocalDateString,
  calculateEndDate,
  formatDisplayDate,
} from '../utils/dateUtils.ts';
import { playClickSound, playSuccessSound } from '../utils/audio.ts';

interface ChallengeSetupModalProps {
  isOpen: boolean;
  initialDuration: ChallengeDuration;
  onClose: () => void;
  onStartChallenge: (params: {
    userName: string;
    goalId: string;
    goalTitle: string;
    isCustomGoal: boolean;
    customGoalName?: string;
    // NEW (optional): selected category name, e.g. "Running"
    categoryLabel?: string;
    durationDays: ChallengeDuration;
    startDate: string;
    endDate: string;
  }) => void;
  soundEnabled: boolean;
}

interface GoalCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  hint: string;
  goals: string[];
}

const MIN_GOAL_LENGTH = 3;
const MAX_GOAL_LENGTH = 160;

// NOTE: "My Own Goal" category removed. Not selecting any category
// already means the user writes their own goal in the text box.
const GOAL_CATEGORIES: GoalCategory[] = [
  {
    id: 'study',
    label: 'Study',
    icon: GraduationCap,
    hint: 'Padhai, course completion aur daily learning par focus karo.',
    goals: [
      'Study for 2 hours every day without distractions',
      'Finish one chapter every day',
      'Solve 20 practice questions daily',
      'Revise the day’s lessons before sleeping',
    ],
  },
  {
    id: 'self-control',
    label: 'Self Control',
    icon: Brain,
    hint: 'Apne routine aur daily habits ko improve karo.',
    goals: [
      'Follow my daily routine with no excuses',
      'Say no to junk food and sugar',
      'Stop wasting time on social media',
      'Wake up on time without hitting snooze',
    ],
  },
  {
    id: 'quit-smoking',
    label: 'Quit Smoking',
    icon: CigaretteOff,
    hint: 'Smoking chhodne ke liye daily progress par focus karo.',
    goals: [
      'Stay completely smoke-free every single day',
      'Avoid my smoking triggers and protect my streak',
      'Not smoke a single cigarette during this challenge',
    ],
  },
  {
    id: 'quit-masturbation',
    label: 'Quit Masturbation',
    icon: ShieldCheck,
    hint: 'Apni personal habits aur daily routine par focus karo.',
    goals: [
      'Redirect urges into a workout or a walk',
      'Keep my phone away from triggering content',
      'Build healthier daily habits',
    ],
  },
  {
    id: 'running',
    label: 'Running',
    icon: Footprints,
    hint: 'Running se stamina aur consistency improve karo.',
    goals: [
      'Run 3 km every morning',
      'Run or jog for 30 minutes daily',
      'Increase my running distance a little every week',
    ],
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: BookOpen,
    hint: 'Roz padhne ki habit develop karo.',
    goals: [
      'Read 20 pages every day',
      'Read for 30 minutes before bed',
      'Finish one full book during this challenge',
    ],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    hint: 'Apni fitness aur strength par kaam karo.',
    goals: [
      'Workout for 45 minutes every day',
      'Do 50 push-ups a day',
      'Stretch for 10 minutes every morning',
    ],
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: Flower2,
    hint: 'Mindfulness aur mental focus ki habit banao.',
    goals: [
      'Meditate for 10 minutes every morning',
      'Write 3 things I am grateful for every night',
      'Do 5 minutes of deep breathing daily',
    ],
  },
  {
    id: 'early-rising',
    label: 'Early Rising',
    icon: Sunrise,
    hint: 'Apna sleep schedule consistent rakho.',
    goals: [
      'Wake up at 5:30 AM every day',
      'Sleep by 10:30 PM every night',
      'Follow a fixed sleep and wake-up schedule',
    ],
  },
  {
    id: 'digital-detox',
    label: 'Digital Detox',
    icon: PhoneOff,
    hint: 'Phone aur social media ka use control karo.',
    goals: [
      'Limit social media to 30 minutes a day',
      'No phone for the first hour after waking up',
      'Keep a screen-free hour before bed',
    ],
  },
];

export const ChallengeSetupModal: React.FC<ChallengeSetupModalProps> = ({
  isOpen,
  initialDuration,
  onClose,
  onStartChallenge,
  soundEnabled,
}) => {
  const [userName, setUserName] = useState('');
  const [selectedDuration, setSelectedDuration] =
    useState<ChallengeDuration>(initialDuration);
  const [startDate, setStartDate] = useState(getTodayLocalDateString());

  // null = no category selected (default)
  const [categoryId, setCategoryId] = useState<string | null>(null);
  // Goal text is ONLY what the user types (or explicitly taps as a suggestion).
  const [goalText, setGoalText] = useState('');
  const [goalError, setGoalError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const goalRef = useRef<HTMLTextAreaElement>(null);

  const todayStr = getTodayLocalDateString();

  const category = useMemo(
    () => GOAL_CATEGORIES.find((item) => item.id === categoryId) ?? null,
    [categoryId]
  );

  const effectiveStart = startDate || todayStr;
  const calculatedEndDate = calculateEndDate(
    effectiveStart,
    selectedDuration
  );

  useEffect(() => {
    setSelectedDuration(initialDuration);
  }, [initialDuration]);

  useEffect(() => {
    if (isOpen) {
      setIsStarting(false);
      setGoalError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isStarting) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isStarting, onClose]);

  const handlePickCategory = (item: GoalCategory) => {
    playClickSound(soundEnabled);
    setGoalError(null);

    // Clicking the selected category again un-selects it.
    if (item.id === categoryId) {
      setCategoryId(null);
      return;
    }

    // If the text box still holds a suggestion from the previous
    // category, clear it. Text typed by the user is never touched.
    if (category && category.goals.includes(goalText.trim())) {
      setGoalText('');
    }

    // IMPORTANT: we do NOT auto-fill the goal text anymore.
    setCategoryId(item.id);
  };

  const handlePickSuggestion = (text: string) => {
    playClickSound(soundEnabled);
    setGoalError(null);
    // Tapping the selected suggestion again clears it.
    setGoalText((current) => (current.trim() === text ? '' : text));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStarting) return;

    const typedGoal = goalText.trim();

    // Nothing chosen at all: need a category OR a typed goal.
    if (!category && typedGoal.length === 0) {
      setGoalError('Category select karo, ya apna goal likho.');
      goalRef.current?.focus();
      return;
    }

    // If the user typed something, it must be valid.
    if (typedGoal.length > 0 && typedGoal.length < MIN_GOAL_LENGTH) {
      setGoalError('Goal kam se kam 3 characters ka hona chahiye.');
      goalRef.current?.focus();
      return;
    }

    if (typedGoal.length > MAX_GOAL_LENGTH) {
      setGoalError(`Goal ${MAX_GOAL_LENGTH} characters se zyada nahi ho sakta.`);
      return;
    }

    setGoalError(null);
    setIsStarting(true);

    playSuccessSound(soundEnabled);

    // Case 1: only category  -> title = category name
    // Case 2: only typed goal -> custom goal
    // Case 3: both            -> category id + typed text as title
    const isCustomGoal = !category;
    const finalTitle = typedGoal || category?.label || '';

    onStartChallenge({
      userName: userName.trim() || 'Achiever',
      goalId: category ? category.id : 'custom-goal',
      goalTitle: finalTitle,
      isCustomGoal,
      ...(isCustomGoal ? { customGoalName: finalTitle } : {}),
      ...(category ? { categoryLabel: category.label } : {}),
      durationDays: selectedDuration,
      startDate: effectiveStart,
      endDate: calculatedEndDate,
    });
  };

  const labelClass =
    'mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300';

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500';

  const typedGoalTrimmed = goalText.trim();
  const hasValidSelection =
    !!category || typedGoalTrimmed.length >= MIN_GOAL_LENGTH;

  // Text shown in the footer summary
  const summaryTitle = typedGoalTrimmed || category?.label || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="setup-modal-title"
          onClick={() => !isStarting && onClose()}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl"
          >
            {/* HEADER */}
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-5 py-5 text-white sm:px-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                    <Target className="h-5 w-5" />
                  </div>

                  <div>
                    <h2
                      id="setup-modal-title"
                      className="text-xl font-extrabold tracking-tight sm:text-2xl"
                    >
                      Set Up Your Challenge
                    </h2>
                    <p className="text-xs text-green-100 sm:text-sm">
                      Choose your goal, set your duration, and get started.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isStarting}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onClose();
                  }}
                  aria-label="Close setup modal"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
                {/* NAME */}
                <div>
                  <label htmlFor="user-name-input" className={labelClass}>
                    <User className="h-3.5 w-3.5 text-green-600" />
                    Your Name
                    <span className="text-[11px] font-normal normal-case tracking-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="user-name-input"
                    type="text"
                    maxLength={40}
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </div>

                {/* CATEGORY */}
                <div className="rounded-2xl border border-green-200/80 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/15 sm:p-5">
                  <div className={labelClass}>
                    <Sparkles className="h-4 w-4 text-green-600" />
                    Choose a Category
                    <span className="text-[11px] font-normal normal-case tracking-normal text-slate-400">
                      (optional)
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    role="group"
                    aria-label="Goal categories"
                  >
                    {GOAL_CATEGORIES.map((item) => {
                      const Icon = item.icon;
                      const active = item.id === categoryId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handlePickCategory(item)}
                          className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                            active
                              ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-600/25'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:text-green-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              active
                                ? 'bg-white/20'
                                : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>

                          <span className="leading-tight">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                    {category
                      ? category.hint
                      : 'Category chuno, ya neeche apna goal khud likho.'}
                  </p>

                  {/* SUGGESTED GOALS (only fill the text box when tapped) */}
                  <AnimatePresence mode="wait" initial={false}>
                    {category && category.goals.length > 0 && (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="mt-3 flex flex-wrap gap-2"
                      >
                        {category.goals.map((goal) => {
                          const picked = typedGoalTrimmed === goal;

                          return (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => handlePickSuggestion(goal)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-[11px] font-semibold leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                                picked
                                  ? 'border-green-500 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:bg-green-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {picked && (
                                <CheckCircle2 className="h-3 w-3 shrink-0 text-green-600" />
                              )}
                              {goal}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* GOAL TEXT */}
                  <div className="mt-4">
                    <label
                      htmlFor="custom-goal-textarea"
                      className={labelClass}
                    >
                      <PenLine className="h-3.5 w-3.5 text-green-600" />
                      Your Goal
                      {category ? (
                        <span className="text-[11px] font-normal normal-case tracking-normal text-slate-400">
                          (optional)
                        </span>
                      ) : (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>

                    <div className="relative">
                      <textarea
                        ref={goalRef}
                        id="custom-goal-textarea"
                        rows={3}
                        maxLength={MAX_GOAL_LENGTH}
                        value={goalText}
                        aria-invalid={!!goalError}
                        aria-describedby={
                          goalError ? 'goal-error' : undefined
                        }
                        onChange={(event) => {
                          setGoalText(event.target.value);
                          if (goalError) setGoalError(null);
                        }}
                        placeholder={
                          category
                            ? `Optional: ${category.label} ke liye apna goal likho...`
                            : 'Write your goal here...'
                        }
                        className={`${inputClass} resize-none pb-7 font-medium leading-relaxed ${
                          goalError
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                            : ''
                        }`}
                      />

                      <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] font-medium tabular-nums text-slate-400">
                        {goalText.length}/{MAX_GOAL_LENGTH}
                      </span>
                    </div>

                    {goalError && (
                      <p
                        id="goal-error"
                        role="alert"
                        className="mt-1.5 text-xs font-semibold text-rose-500"
                      >
                        {goalError}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {category
                        ? `Sirf "${category.label}" category ke saath start kar sakte ho, ya upar likh kar apna goal add karo.`
                        : 'Apna goal likho, phir Start Challenge par click karo.'}
                    </p>
                  </div>
                </div>

                {/* DURATION */}
                <div>
                  <div className={labelClass}>
                    <Calendar className="h-3.5 w-3.5 text-green-600" />
                    Challenge Duration
                    <span className="ml-auto text-sm font-extrabold normal-case tracking-normal text-green-600 dark:text-green-400">
                      {selectedDuration} Days
                    </span>
                  </div>

                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Challenge duration"
                  >
                    {CHALLENGE_DURATIONS.map((duration) => {
                      const active =
                        Number(duration.duration) ===
                        Number(selectedDuration);

                      return (
                        <button
                          key={duration.duration}
                          type="button"
                          aria-pressed={active}
                          title={`${duration.duration} Day Challenge — ${duration.badge}`}
                          onClick={() => {
                            playClickSound(soundEnabled);
                            setSelectedDuration(
                              duration.duration as ChallengeDuration
                            );
                          }}
                          className={`flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                            active
                              ? 'border-green-500 bg-green-600 text-white shadow-md shadow-green-600/25'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-green-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="text-sm font-extrabold leading-none">
                            {duration.duration}
                          </span>
                          <span
                            className={`mt-0.5 text-[9px] font-semibold uppercase ${
                              active ? 'text-green-100' : 'text-slate-400'
                            }`}
                          >
                            days
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DATES */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="start-date-input"
                        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                      >
                        Start Date (Day 1)
                      </label>

                      <input
                        id="start-date-input"
                        type="date"
                        min={todayStr}
                        value={startDate}
                        onChange={(event) => {
                          playClickSound(soundEnabled);
                          setStartDate(event.target.value);
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/25 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />

                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {effectiveStart === todayStr
                          ? 'Aaj se shuru (Day 1)'
                          : `Starts on ${formatDisplayDate(effectiveStart)}`}
                      </p>
                    </div>

                    <div>
                      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        End Date (Day {selectedDuration})
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
                        <Flag className="h-3.5 w-3.5 shrink-0" />
                        {formatDisplayDate(calculatedEndDate, true)}
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Start date is Day 1; the end date is inclusive.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="shrink-0 border-t border-slate-100 bg-white/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
                <div className="mb-3 hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      hasValidSelection
                        ? 'text-green-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />

                  <span className="truncate">
                    {summaryTitle
                      ? `${selectedDuration} days · ${summaryTitle}`
                      : 'Choose a category or write your goal to get started'}
                  </span>
                </div>

                <div className="flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={isStarting}
                    onClick={() => {
                      playClickSound(soundEnabled);
                      onClose();
                    }}
                    className="w-full rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isStarting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition hover:from-green-400 hover:to-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900 sm:w-auto"
                  >
                    {isStarting ? 'Starting...' : 'Start Challenge'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};