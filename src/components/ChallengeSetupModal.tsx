import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Target,
  Sparkles,
  CheckCircle2,
  Edit3,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { PREDEFINED_GOALS } from '../data/goals.ts';
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
    durationDays: ChallengeDuration;
    startDate: string;
    endDate: string;
  }) => void;
  soundEnabled: boolean;
}

export const ChallengeSetupModal: React.FC<ChallengeSetupModalProps> = ({
  isOpen,
  initialDuration,
  onClose,
  onStartChallenge,
  soundEnabled,
}) => {
  // Controlled form states
  const [userName, setUserName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<ChallengeDuration>(initialDuration);
  const [startDate, setStartDate] = useState<string>(getTodayLocalDateString());

  // Goal input states: live text input and submitted confirmed goal
  const [rawGoalInput, setRawGoalInput] = useState<string>('');
  const [confirmedGoal, setConfirmedGoal] = useState<string | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(true);
  const [showPredefinedDrawer, setShowPredefinedDrawer] = useState<boolean>(false);

  // Validation errors
  const [goalError, setGoalError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Sync initial duration when prop changes
  useEffect(() => {
    setSelectedDuration(initialDuration);
  }, [initialDuration]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayStr = getTodayLocalDateString();
  const calculatedEndDate = calculateEndDate(startDate || todayStr, selectedDuration);

  // Handle Submit Goal button click
  const handleSubmitGoal = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const trimmed = rawGoalInput.trim();

    if (!trimmed) {
      setGoalError('Please write your personal goal before submitting.');
      return;
    }

    playClickSound(soundEnabled);
    setConfirmedGoal(trimmed);
    setIsEditingGoal(false);
    setGoalError(null);
  };

  // Handle Edit Goal
  const handleEditGoal = () => {
    playClickSound(soundEnabled);
    setIsEditingGoal(true);
  };

  // Handle selecting a predefined goal
  const handleSelectPredefined = (title: string) => {
    playClickSound(soundEnabled);
    setRawGoalInput(title);
    setConfirmedGoal(title);
    setIsEditingGoal(false);
    setShowPredefinedDrawer(false);
    setGoalError(null);
  };

  // Final submission: Start Challenge
  const handleStartChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStarting) return;

    // Validate that a goal exists (either confirmed or typed in raw input)
    const effectiveGoal = (confirmedGoal || rawGoalInput).trim();
    if (!effectiveGoal) {
      setGoalError('A personal goal is required to start your challenge.');
      setIsEditingGoal(true);
      return;
    }

    setIsStarting(true);
    playSuccessSound(soundEnabled);

    // User name is optional; fallback to "Friend" or "Achiever" if left empty
    const finalName = userName.trim() || 'Achiever';

    onStartChallenge({
      userName: finalName,
      goalId: 'custom-goal',
      goalTitle: effectiveGoal,
      isCustomGoal: true,
      customGoalName: effectiveGoal,
      durationDays: selectedDuration,
      startDate: startDate || todayStr,
      endDate: calculatedEndDate,
    });

    setIsStarting(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl transition-all my-6 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 p-5 sm:px-6 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 font-bold">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 id="setup-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Set Up Your Challenge
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Define your personal goal and timeline to begin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close setup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleStartChallengeSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Name & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Name (Optional) */}
            <div>
              <label htmlFor="user-name-input" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span>Your Name</span>
                <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                id="user-name-input"
                type="text"
                maxLength={40}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Rahul, Maya, Alex"
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Challenge Duration Selector */}
            <div>
              <label htmlFor="duration-select" className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <span>Challenge Duration</span>
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {selectedDuration} Days
                </span>
              </label>
              <select
                id="duration-select"
                value={selectedDuration}
                onChange={(e) => {
                  playClickSound(soundEnabled);
                  setSelectedDuration(Number(e.target.value) as ChallengeDuration);
                }}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white cursor-pointer"
              >
                {CHALLENGE_DURATIONS.map((d) => (
                  <option key={d.duration} value={d.duration}>
                    {d.duration} Day Challenge — {d.badge}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Personal Goal Section (Input + Submit Button + Live Preview + Edit Option) */}
          <div className="rounded-2xl border-2 border-stone-200/90 bg-stone-50/60 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-850/60 transition-all">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="custom-goal-textarea" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Write Your Personal Goal</span>
                <span className="text-rose-500">*</span>
              </label>

              {/* Predefined Suggestions Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setShowPredefinedDrawer(!showPredefinedDrawer);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{showPredefinedDrawer ? 'Hide suggestions' : 'Browse popular goals (16)'}</span>
              </button>
            </div>

            {/* PREDEFINED SUGGESTIONS ACCORDION */}
            {showPredefinedDrawer && (
              <div className="mb-4 rounded-xl border border-stone-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 max-h-48 overflow-y-auto">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Click any goal below to quickly fill it:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PREDEFINED_GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectPredefined(g.title)}
                      className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors border border-stone-100 dark:border-slate-700/60"
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GOAL INPUT MODE vs CONFIRMED PREVIEW CARD */}
            {isEditingGoal ? (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    id="custom-goal-textarea"
                    rows={3}
                    maxLength={160}
                    value={rawGoalInput}
                    onChange={(e) => {
                      setRawGoalInput(e.target.value);
                      if (goalError) setGoalError(null);
                    }}
                    placeholder="Example: I want to read for 30 minutes every day..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed resize-none"
                  />
                  <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-400 pointer-events-none">
                    {rawGoalInput.length}/160
                  </div>
                </div>

                {goalError && (
                  <p className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                    {goalError}
                  </p>
                )}

                {/* Clearly Visible SUBMIT GOAL Button directly below the input */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Write any personal habit or challenge that matters to you.
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmitGoal}
                    disabled={!rawGoalInput.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                    <span>Submit Goal</span>
                  </button>
                </div>
              </div>
            ) : (
              /* GOAL PREVIEW CARD with Edit Goal option */
              <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-500/40 dark:bg-amber-950/30 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>My Personal Goal</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleEditGoal}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Goal</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed break-words">
                  {confirmedGoal}
                </p>
              </div>
            )}
          </div>

          {/* 3. Dates & Inclusive Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-stone-50 p-4 border border-stone-200/80 dark:bg-slate-800/40 dark:border-slate-800">
            {/* Start Date */}
            <div>
              <label htmlFor="start-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date (Day 1)
              </label>
              <input
                id="start-date-input"
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => {
                  playClickSound(soundEnabled);
                  setStartDate(e.target.value);
                }}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {startDate === todayStr ? 'Begins today (Day 1)' : `Starts on: ${formatDisplayDate(startDate)}`}
              </p>
            </div>

            {/* Calculated End Date (Read-Only) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Calculated End Date (Day {selectedDuration})
              </label>
              <div className="w-full rounded-xl border border-stone-200 bg-stone-100/80 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-200">
                {formatDisplayDate(calculatedEndDate, true)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Inclusive: Start date is Day 1, End date is Day {selectedDuration}
              </p>
            </div>
          </div>

          {/* Modal Footer Actions: Cancel & Start Challenge */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-stone-100 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Start Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
