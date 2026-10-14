import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  PlusCircle,
  AlertTriangle,
  Quote,
} from 'lucide-react';
import { ActiveChallenge } from '../types.ts';
import { DayCard } from './DayCard.tsx';
import {
  getTodayLocalDateString,
  formatDisplayDate,
  getDayStatus,
  getCurrentChallengeDayNumber,
} from '../utils/dateUtils.ts';
import { playClickSound } from '../utils/audio.ts';
import { getDailyQuote } from '../data/quotes.ts';

interface ActiveChallengeDashboardProps {
  challenge: ActiveChallenge;
  onCompleteDay: (dayNumber: number, note?: string) => void;
  onSaveDayNote: (dayNumber: number, note: string) => void;
  onResetChallenge: () => void;
  onStartNewChallenge: () => void;
  soundEnabled: boolean;
}

export const ActiveChallengeDashboard: React.FC<ActiveChallengeDashboardProps> = ({
  challenge,
  onCompleteDay,
  onSaveDayNote,
  onResetChallenge,
  onStartNewChallenge,
  soundEnabled,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'missed'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pageBatch, setPageBatch] = useState(0);

  const todayStr = getTodayLocalDateString();
  const completedCount = challenge.days.filter((d) => d.isCompleted).length;
  const totalDays = challenge.durationDays;
  const progressPercent = Math.min(100, Math.round((completedCount / totalDays) * 100));
  const remainingDays = totalDays - completedCount;

  const { currentDayNumber, isBeforeStart, isAfterEnd } = getCurrentChallengeDayNumber(
    challenge.startDate,
    challenge.durationDays,
    todayStr
  );

  // Daily Motivational Quote
  const dailyQuote = getDailyQuote();

  // Find eligible day for today
  const todayRecord = challenge.days.find((d) => d.scheduledDate === todayStr);
  const isTodayEligible = todayRecord && !todayRecord.isCompleted;

  // Filter days
  const filteredDays = challenge.days.filter((day) => {
    const status = getDayStatus(day, todayStr);
    if (filter === 'completed') return status === 'completed';
    if (filter === 'pending') return status === 'eligible' || status === 'upcoming';
    if (filter === 'missed') return status === 'missed';
    return true;
  });

  // Long challenge batching for 100, 200, 300 days
  const BATCH_SIZE = totalDays > 30 ? 30 : totalDays;
  const totalBatches = Math.ceil(filteredDays.length / BATCH_SIZE);
  const displayedDays =
    totalDays > 30
      ? filteredDays.slice(pageBatch * BATCH_SIZE, (pageBatch + 1) * BATCH_SIZE)
      : filteredDays;

  return (
    <section id="active-dashboard" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Personalized Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>YOUR PROGRESS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Keep going, {challenge.userName}!
            </h2>

            <div className="mt-2 text-base sm:text-lg font-bold text-amber-300">
              {challenge.durationDays}-Day Challenge
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 font-medium text-amber-200">
                <Target className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">{challenge.goalTitle}</span>
                {challenge.isCustomGoal && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Custom Goal
                  </span>
                )}
              </span>
              <span className="text-slate-500">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  {formatDisplayDate(challenge.startDate)} – {formatDisplayDate(challenge.endDate)}
                </span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Reset & New */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onStartNewChallenge();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors border border-white/15 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5 text-amber-300" />
              <span>New Challenge</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setShowResetConfirm(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors border border-white/15 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Numbers */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-200">
              {completedCount} / {totalDays} Days Completed
            </span>
            <span className="font-mono font-bold text-amber-300">
              {progressPercent}% Complete
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400"
            />
          </div>

          {/* 4 Metrics Strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400">Current Day</span>
              <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">
                {isBeforeStart
                  ? 'Starts Soon'
                  : isAfterEnd
                  ? 'Challenge Complete'
                  : `Day ${currentDayNumber || 1} of ${totalDays}`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400">Completed Days</span>
              <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-emerald-400">
                {completedCount} / {totalDays}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400">Remaining</span>
              <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-amber-300">
                {remainingDays} Days
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400">Progress</span>
              <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">
                {progressPercent}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Motivational Quote Banner */}
      <div className="mt-6 flex items-start gap-3.5 rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-xs dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 mt-0.5">
          <Quote className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium italic text-slate-800 dark:text-slate-200">
            "{dailyQuote.quote}"
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            — {dailyQuote.author}
          </p>
        </div>
      </div>

      {/* Today's Immediate Action Banner (If today is eligible and not yet completed) */}
      {isTodayEligible && todayRecord && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 p-4 sm:p-5 dark:bg-amber-500/5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Today is Day {todayRecord.dayNumber} ({formatDisplayDate(todayStr)})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Action required for your goal: <span className="font-semibold text-amber-700 dark:text-amber-300">{challenge.goalTitle}</span>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onCompleteDay(todayRecord.dayNumber);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Complete Today's Challenge</span>
          </button>
        </div>
      )}

      {/* Day Cards Section Header & Filter Tabs */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Challenge Calendar
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Each day unlocks on its scheduled local calendar date. Complete today's step to keep progressing.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 self-start sm:self-auto">
          {(['all', 'pending', 'completed', 'missed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setFilter(tab);
                setPageBatch(0);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tab === 'all' ? `All (${challenge.days.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Batching Pagination for Long Challenges (>30 days) */}
      {totalBatches > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-stone-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-stone-200 dark:border-slate-800">
          <span>
            Showing days {pageBatch * BATCH_SIZE + 1} –{' '}
            {Math.min((pageBatch + 1) * BATCH_SIZE, filteredDays.length)} of {filteredDays.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pageBatch === 0}
              onClick={() => setPageBatch((prev) => Math.max(0, prev - 1))}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono font-medium">
              {pageBatch + 1} / {totalBatches}
            </span>
            <button
              disabled={pageBatch >= totalBatches - 1}
              onClick={() => setPageBatch((prev) => Math.min(totalBatches - 1, prev + 1))}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Grid of Day Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
        {displayedDays.map((day) => {
          const status = getDayStatus(day, todayStr);
          const isToday = day.scheduledDate === todayStr;

          return (
            <DayCard
              key={day.dayNumber}
              day={day}
              status={status}
              isToday={isToday}
              onCompleteDay={onCompleteDay}
              onSaveNote={onSaveDayNote}
              soundEnabled={soundEnabled}
            />
          );
        })}
      </div>

      {displayedDays.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No days match the "{filter}" filter.
          </p>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reset Current Challenge?
              </h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This will clear your active streak and logged completions for your {challenge.durationDays}-day challenge. This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Keep Challenge
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setShowResetConfirm(false);
                  onResetChallenge();
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-sm transition-colors cursor-pointer"
              >
                Yes, Reset Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
