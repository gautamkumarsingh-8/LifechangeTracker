import React, { useState } from 'react';
import { CheckCircle2, Lock, AlertCircle, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
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

export const DayCard: React.FC<DayCardProps> = ({
  day,
  status,
  isToday,
  onCompleteDay,
  onSaveNote,
  soundEnabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflectionInput, setReflectionInput] = useState(day.reflectionNote || '');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(day.dayNumber, reflectionInput);
    setShowNoteForm(false);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        status === 'completed'
          ? 'border-emerald-200/90 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20'
          : status === 'eligible'
          ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-400/30 dark:border-amber-500/80 dark:bg-amber-950/30'
          : status === 'missed'
          ? 'border-rose-200/80 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
          : 'border-stone-200/60 bg-stone-50/40 opacity-70 dark:border-slate-800 dark:bg-slate-900/40'
      }`}
    >
      {/* Top Header: Day Number + Status Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Day {day.dayNumber}
          </span>
          {isToday && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
              TODAY
            </span>
          )}
        </div>

        {/* Status Indicator Icon */}
        <div>
          {status === 'completed' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Done</span>
            </span>
          )}
          {status === 'eligible' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>Available</span>
            </span>
          )}
          {status === 'missed' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4" />
              <span>Missed</span>
            </span>
          )}
          {status === 'upcoming' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              <span>Locked</span>
            </span>
          )}
        </div>
      </div>

      {/* Date Subtitle */}
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        {formatDisplayDate(day.scheduledDate)}
      </div>

      {/* Existing Reflection Note Preview */}
      {day.reflectionNote && (
        <div className="mt-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 p-2.5 text-xs text-slate-700 dark:text-slate-300 border border-stone-200/60 dark:border-slate-800">
          <p className="italic line-clamp-2">"{day.reflectionNote}"</p>
        </div>
      )}

      {/* Action Slot */}
      <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
        {status === 'eligible' && (
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onCompleteDay(day.dayNumber);
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 px-3 text-xs font-bold text-slate-950 shadow-sm shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Complete Today's Challenge</span>
          </button>
        )}

        {status === 'completed' && (
          <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
            <span>Logged on schedule</span>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setShowNoteForm(!showNoteForm);
              }}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="h-3 w-3" />
              <span>{day.reflectionNote ? 'Edit Note' : 'Add Note'}</span>
            </button>
          </div>
        )}

        {status === 'missed' && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Date passed</span>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setShowNoteForm(!showNoteForm);
              }}
              className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <FileText className="h-3 w-3" />
              <span>{day.reflectionNote ? 'View Note' : 'Log Reflection'}</span>
            </button>
          </div>
        )}

        {status === 'upcoming' && (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
            Available on {formatDisplayDate(day.scheduledDate)}
          </div>
        )}

        {/* Reflection Note Drawer / Input */}
        {showNoteForm && (
          <form onSubmit={handleSaveNoteSubmit} className="mt-3 space-y-2">
            <textarea
              rows={2}
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="What went well? Any obstacles or thoughts?"
              className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
