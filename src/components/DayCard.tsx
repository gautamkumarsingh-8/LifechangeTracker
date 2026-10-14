import React, { memo, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Lock,
  AlertCircle,
  Clock,
  FileText,
  CalendarDays,
  Leaf,
  PenLine,
  X,
} from 'lucide-react';

import { DayRecord, DayStatus } from '../types.ts';
import { formatDisplayDate } from '../utils/dateUtils.ts';
import { playClickSound } from '../utils/audio.ts';

interface DayCardProps {
  day: DayRecord;
  status: DayStatus;
  isToday: boolean;
  onCompleteDay: (dayNumber: number, note?: string) => void;
  onSaveNote: (dayNumber: number, note: string) => void;
  soundEnabled: boolean;
}

const MAX_NOTE_LENGTH = 280;

const DayCardBase: React.FC<DayCardProps> = ({
  day,
  status,
  isToday,
  onCompleteDay,
  onSaveNote,
  soundEnabled,
}) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [reflectionInput, setReflectionInput] = useState(
    day.reflectionNote || ''
  );

  // Keep input in sync if the saved note changes from outside
  useEffect(() => {
    if (!showNoteForm) setReflectionInput(day.reflectionNote || '');
  }, [day.reflectionNote, showNoteForm]);

  const completed = status === 'completed';
  const eligible = status === 'eligible';
  const missed = status === 'missed';
  const upcoming = status === 'upcoming';

  const trimmed = reflectionInput.trim();
  const unchanged = trimmed === (day.reflectionNote || '').trim();

  const openNoteForm = () => {
    playClickSound(soundEnabled);
    setShowNoteForm((prev) => !prev);
  };

  const closeNoteForm = () => {
    setReflectionInput(day.reflectionNote || '');
    setShowNoteForm(false);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unchanged) return;
    playClickSound(soundEnabled);
    onSaveNote(day.dayNumber, trimmed);
    setShowNoteForm(false);
  };

  const statusConfig = completed
    ? {
        label: 'Done',
        icon: CheckCircle2,
        pill: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400',
      }
    : eligible
    ? {
        label: 'Ready',
        icon: Clock,
        pill: 'bg-lime-100 text-lime-700 dark:bg-lime-950/60 dark:text-lime-400',
      }
    : missed
    ? {
        label: 'Missed',
        icon: AlertCircle,
        pill: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      }
    : {
        label: 'Locked',
        icon: Lock,
        pill: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      };

  const StatusIcon = statusConfig.icon;

  const cardStyle = completed
    ? 'border-green-200 bg-gradient-to-br from-green-50 via-white to-white dark:border-green-900/60 dark:from-green-950/30 dark:via-slate-900 dark:to-slate-900'
    : eligible
    ? 'border-green-400 bg-white shadow-md shadow-green-500/10 ring-1 ring-green-400/30 dark:border-green-500/60 dark:bg-slate-900'
    : missed
    ? 'border-rose-200 bg-white dark:border-rose-900/50 dark:bg-slate-900'
    : 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70';

  const iconTile = completed
    ? 'bg-green-500 text-white shadow-sm shadow-green-500/30'
    : eligible
    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
    : missed
    ? 'bg-rose-100 text-rose-500 dark:bg-rose-950'
    : 'bg-slate-100 text-slate-400 dark:bg-slate-800';

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${cardStyle}`}
    >
      {/* Left accent strip */}
      {(completed || eligible) && (
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-emerald-600" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconTile}`}
          >
            {completed ? (
              <CheckCircle2 size={20} strokeWidth={2} />
            ) : (
              <CalendarDays size={19} strokeWidth={1.8} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Day {day.dayNumber}
              </h3>

              {isToday && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                  TODAY
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
              {formatDisplayDate(day.scheduledDate)}
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold sm:text-[11px] ${statusConfig.pill}`}
        >
          <StatusIcon size={13} />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Saved reflection preview */}
      {day.reflectionNote && !showNoteForm && (
        <div className="mt-3 flex gap-2 rounded-xl border border-green-100 bg-green-50/60 px-3 py-2 dark:border-green-900/40 dark:bg-green-950/20">
          <FileText
            size={13}
            className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
          />
          <p className="line-clamp-2 text-[11px] italic leading-relaxed text-slate-600 dark:text-slate-300">
            {day.reflectionNote}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 border-t border-slate-200/70 pt-3 dark:border-slate-800">
        {eligible && (
          <>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onCompleteDay(day.dayNumber);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-green-600/25 transition hover:from-green-400 hover:to-emerald-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-offset-slate-900"
            >
              <CheckCircle2 size={15} />
              Mark as done
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Small steps, big results. Aaj ka din tumhara hai.
            </p>
          </>
        )}

        {completed && (
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
              <Leaf size={13} />
              Day complete. Keep growing!
            </span>

            <button
              type="button"
              onClick={openNoteForm}
              aria-expanded={showNoteForm}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/40 dark:hover:text-green-400"
            >
              <PenLine size={13} />
              {day.reflectionNote ? 'Edit note' : 'Add note'}
            </button>
          </div>
        )}

        {missed && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-rose-500 dark:text-rose-400">
              Is din ka challenge nikal gaya. Koi baat nahi, aage badho.
            </span>

            <button
              type="button"
              onClick={openNoteForm}
              aria-expanded={showNoteForm}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <PenLine size={13} />
              {day.reflectionNote ? 'Edit note' : 'Reflect'}
            </button>
          </div>
        )}

        {upcoming && (
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Lock size={12} />
            Unlocks on {formatDisplayDate(day.scheduledDate)}
          </p>
        )}

        {/* Note form */}
        {showNoteForm && (
          <form onSubmit={handleSaveNoteSubmit} className="mt-3 space-y-2">
            <label htmlFor={`note-${day.dayNumber}`} className="sr-only">
              Reflection note for day {day.dayNumber}
            </label>
            <textarea
              id={`note-${day.dayNumber}`}
              autoFocus
              rows={3}
              maxLength={MAX_NOTE_LENGTH}
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') closeNoteForm();
              }}
              placeholder="Aaj kya accha raha? Chhoti si jeet bhi likho."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] tabular-nums text-slate-400">
                {reflectionInput.length}/{MAX_NOTE_LENGTH}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeNoteForm}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={12} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={unchanged}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save note
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </article>
  );
};

export const DayCard = memo(DayCardBase);