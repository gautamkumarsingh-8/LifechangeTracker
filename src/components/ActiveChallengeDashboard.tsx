import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  Flame,
  Trophy,
  Hourglass,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Lock,
  ListChecks,
  Check,
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ClipboardList,
  Circle,
  type LucideIcon,
} from 'lucide-react';

import type { ActiveChallenge } from '../types.ts';
import {
  getTodayLocalDateString,
  formatDisplayDate,
  getDayStatus,
  getCurrentChallengeDayNumber,
} from '../utils/dateUtils.ts';
import { playClickSound } from '../utils/audio.ts';
import { getDailyQuote } from '../data/quotes.ts';

type Day = ActiveChallenge['days'][number];

export type DayStatus = 'completed' | 'eligible' | 'missed' | 'upcoming';

type FilterTab = 'all' | 'pending' | 'completed' | 'missed';

/* ------------------------------------------------------------------ */
/* TODO types + storage                                                */
/* ------------------------------------------------------------------ */

export interface DayTodo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

type TodosByDay = Record<number, DayTodo[]>;

const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function loadTodos(key: string): TodosByDay {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as TodosByDay) : {};
  } catch {
    return {};
  }
}

function persistTodos(key: string, data: TodosByDay) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage full / blocked — ignore */
  }
}

/** Plain-text summary so the parent's existing onSaveDayNote / onCompleteDay still receive something useful. */
function todosToSummary(todos: DayTodo[]): string {
  return todos.map((t) => `${t.done ? '[x]' : '[ ]'} ${t.text}`).join('\n');
}

interface ActiveChallengeDashboardProps {
  challenge: ActiveChallenge;
  onCompleteDay: (dayNumber: number, note?: string) => void;
  onSaveDayNote: (dayNumber: number, note: string) => void;
  onResetChallenge: () => void;
  onStartNewChallenge: () => void;
  soundEnabled: boolean;
}

interface DayDetailModalProps {
  day: Day;
  status: DayStatus;
  isToday: boolean;
  goalTitle: string;
  totalDays: number;
  todos: DayTodo[];
  onTodosChange: (dayNumber: number, todos: DayTodo[]) => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onCompleteDay: (dayNumber: number, note?: string) => void;
  soundEnabled: boolean;
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Done' },
  { id: 'missed', label: 'Missed' },
];

/* ------------------------------------------------------------------ */
/* Progress ring + stat card                                           */
/* ------------------------------------------------------------------ */

const ProgressRing: React.FC<{ percent: number }> = ({ percent }) => {
  const size = 132;
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-[132px] w-[132px] shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="challenge-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#challenge-ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - percent / 100),
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tabular-nums text-white">
          {percent}
          <span className="text-lg font-bold text-green-300">%</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          Complete
        </span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone: string;
}> = ({ icon: Icon, label, value, hint, tone }) => (
  <div className="group rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur transition-colors hover:bg-white/[0.1]">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium text-slate-300">{label}</span>
      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
    </div>

    <p className="mt-2 text-xl font-extrabold tabular-nums text-white sm:text-2xl">
      {value}
    </p>

    {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Day tile                                                            */
/* ------------------------------------------------------------------ */

const TILE_STYLES: Record<DayStatus, string> = {
  completed:
    'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-emerald-500/20 dark:border-emerald-500/30 dark:from-emerald-500/15 dark:to-green-500/5',
  eligible:
    'border-green-500 bg-white shadow-lg shadow-green-500/20 ring-2 ring-green-500/30 hover:shadow-green-500/30 dark:border-green-400 dark:bg-slate-900',
  missed:
    'border-rose-300 bg-rose-50 hover:shadow-rose-500/15 dark:border-rose-500/30 dark:bg-rose-500/10',
  upcoming:
    'border-slate-200 bg-slate-50 hover:shadow-slate-500/10 dark:border-slate-800 dark:bg-slate-900/60',
};

const NUM_STYLES: Record<DayStatus, string> = {
  completed: 'text-emerald-700 dark:text-emerald-300',
  eligible: 'text-green-700 dark:text-green-300',
  missed: 'text-rose-700 dark:text-rose-300',
  upcoming: 'text-slate-500 dark:text-slate-500',
};

const DayTile: React.FC<{
  day: Day;
  status: DayStatus;
  index: number;
  todos: DayTodo[];
  onOpen: () => void;
}> = ({ day, status, index, todos, onOpen }) => {
  const total = todos.length;
  const doneCount = todos.filter((t) => t.done).length;
  const allDone = total > 0 && doneCount === total;
  const locked = status === 'upcoming';

  const StatusIcon =
    status === 'completed'
      ? Check
      : status === 'eligible'
        ? Clock
        : status === 'missed'
          ? AlertTriangle
          : Lock;

  const statusLabel =
    status === 'completed'
      ? 'Done'
      : status === 'eligible'
        ? 'Today'
        : status === 'missed'
          ? 'Missed'
          : 'Locked';

  return (
    <motion.button
      type="button"
      onClick={locked ? undefined : onOpen}
      disabled={locked}
      aria-disabled={locked}
      title={locked ? `Unlocks on ${formatDisplayDate(day.scheduledDate)}` : undefined}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: locked ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 20) * 0.02 }}
      whileHover={locked ? undefined : { y: -3 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      aria-label={
        locked
          ? `Day ${day.dayNumber} — locked until ${formatDisplayDate(day.scheduledDate)}`
          : `Open Day ${day.dayNumber} — ${statusLabel}`
      }
      className={`group relative flex min-h-[132px] ${locked ? 'cursor-not-allowed' : 'cursor-pointer'} flex-col justify-between overflow-hidden rounded-2xl border p-3.5 text-left shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${TILE_STYLES[status]}`}
    >
      {status === 'eligible' && (
        <span className="absolute right-3 top-3 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
      )}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Day
        </p>

        <p className={`text-4xl font-black leading-none tabular-nums ${NUM_STYLES[status]}`}>
          {day.dayNumber}
        </p>

        <p className="mt-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          {formatDisplayDate(day.scheduledDate)}
        </p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            status === 'completed'
              ? 'bg-emerald-600 text-white'
              : status === 'eligible'
                ? 'bg-green-600 text-white'
                : status === 'missed'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusLabel}
        </span>

        {total > 0 ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
              allDone
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
            }`}
          >
            <ListChecks className="h-3 w-3" />
            {doneCount}/{total}
          </span>
        ) : locked ? (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Opens on its day
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-green-700 opacity-80 dark:text-green-400">
            + Add tasks
          </span>
        )}
      </div>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/* Single todo row (check / edit / delete)                             */
/* ------------------------------------------------------------------ */

const TodoRow: React.FC<{
  todo: DayTodo;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}> = ({ todo, onToggle, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const value = draft.trim();
    if (value && value !== todo.text) onEdit(value);
    else setDraft(todo.text);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center gap-2.5 rounded-xl border p-2.5 transition-colors ${
        todo.done
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
        aria-pressed={todo.done}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          todo.done
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-300 text-transparent hover:border-green-500 dark:border-slate-600'
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </button>

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          maxLength={200}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              e.stopPropagation();
              cancel();
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-green-500 bg-white px-2 py-1 text-sm text-slate-900 outline-none ring-2 ring-green-500/20 dark:bg-slate-900 dark:text-white"
        />
      ) : (
        <span
          className={`min-w-0 flex-1 break-words text-sm ${
            todo.done
              ? 'text-slate-500 line-through dark:text-slate-400'
              : 'font-medium text-slate-900 dark:text-white'
          }`}
        >
          {todo.text}
        </span>
      )}

      {!editing && (
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-green-700 dark:hover:bg-slate-800 dark:hover:text-green-400"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </motion.li>
  );
};

/* ------------------------------------------------------------------ */
/* Day detail modal: "Tasks" (edit) tab + "View" (summary) tab         */
/* ------------------------------------------------------------------ */

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  status,
  isToday,
  goalTitle,
  totalDays,
  todos,
  onTodosChange,
  onClose,
  onPrev,
  onNext,
  onCompleteDay,
  soundEnabled,
}) => {
  const [tab, setTab] = useState<'edit' | 'view'>(
    status === 'completed' || status === 'missed' ? 'view' : 'edit'
  );
  const [newText, setNewText] = useState('');
  const addRef = useRef<HTMLInputElement>(null);

  // reset when moving to another day with Prev / Next
  useEffect(() => {
    setNewText('');
    setTab(status === 'completed' || status === 'missed' ? 'view' : 'edit');
  }, [day.dayNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';

      if (event.key === 'Escape' && !typing) onClose();
      if (typing) return;
      if (event.key === 'ArrowLeft') onPrev?.();
      if (event.key === 'ArrowRight') onNext?.();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  const statusInfo = {
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    eligible: {
      label: 'Ready for today',
      icon: Clock,
      style: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    },
    missed: {
      label: 'Missed',
      icon: AlertTriangle,
      style: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    },
    upcoming: {
      label: 'Upcoming · Plan ahead',
      icon: Lock,
      style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
  }[status];

  const StatusIcon = statusInfo.icon;

  const total = todos.length;
  const doneTodos = todos.filter((t) => t.done);
  const pendingTodos = todos.filter((t) => !t.done);
  const percent = total ? Math.round((doneTodos.length / total) * 100) : 0;

  const update = (next: DayTodo[]) => onTodosChange(day.dayNumber, next);

  const addTodo = () => {
    const text = newText.trim();
    if (!text) return;
    playClickSound(soundEnabled);
    update([...todos, { id: makeId(), text, done: false, createdAt: Date.now() }]);
    setNewText('');
    addRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    playClickSound(soundEnabled);
    update(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const editTodo = (id: string, text: string) =>
    update(todos.map((t) => (t.id === id ? { ...t, text } : t)));

  const deleteTodo = (id: string) => {
    playClickSound(soundEnabled);
    update(todos.filter((t) => t.id !== id));
  };

  const completeDay = () => {
    playClickSound(soundEnabled);
    onCompleteDay(day.dayNumber, todosToSummary(todos));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-detail-title"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-green-900 p-6 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                Your daily journey
              </p>

              <h2 id="day-detail-title" className="mt-2 text-3xl font-black">
                Day {day.dayNumber}
                <span className="ml-2 text-sm font-medium text-slate-300">
                  / {totalDays}
                </span>
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {formatDisplayDate(day.scheduledDate)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close day details"
              className="rounded-xl border border-white/15 bg-white/10 p-2 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className={`relative mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusInfo.style}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* goal */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/5">
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
              Challenge goal
            </p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {goalTitle}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {isToday
                ? 'Aaj ke tasks likho, tick karo aur din complete karo.'
                : 'Is din ke tasks dekho ya edit karo.'}
            </p>
          </div>

          {/* tabs */}
          <div
            role="tablist"
            aria-label="Day tasks view"
            className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950"
          >
            {(
              [
                { id: 'edit', label: 'Tasks', icon: ClipboardList },
                { id: 'view', label: 'View', icon: Eye },
              ] as const
            ).map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-white text-slate-950 shadow-sm dark:bg-green-600 dark:text-white'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  {t.id === 'edit' && total > 0 && (
                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] tabular-nums text-green-800 dark:bg-white/20 dark:text-white">
                      {total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ---------- EDIT TAB ---------- */}
          {tab === 'edit' && (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTodo();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={addRef}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  maxLength={200}
                  placeholder="Naya task likho… (Enter dabao)"
                  aria-label="New task"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:from-green-400 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </form>

              {total === 0 ? (
                <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                  <ListChecks className="h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Abhi koi task nahi hai
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    Upar apna pehla task add karo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {doneTodos.length} of {total} done
                    </span>
                    <span className="font-bold tabular-nums text-green-700 dark:text-green-400">
                      {percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <motion.div
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-lime-400 via-green-500 to-emerald-500"
                    />
                  </div>

                  <ul className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {todos.map((todo) => (
                        <TodoRow
                          key={todo.id}
                          todo={todo}
                          onToggle={() => toggleTodo(todo.id)}
                          onEdit={(text) => editTodo(todo.id, text)}
                          onDelete={() => deleteTodo(todo.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </>
              )}

              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                Sab kuch apne-aap save hota hai.
              </p>
            </div>
          )}

          {/* ---------- VIEW TAB ---------- */}
          {tab === 'view' && (
            <div className="space-y-4">
              {total === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                  <Inbox className="h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Is din koi task save nahi hua
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('edit')}
                    className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-500"
                  >
                    Task add karo
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800">
                      <p className="text-lg font-black tabular-nums text-slate-900 dark:text-white">
                        {total}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Total
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-2.5 dark:bg-emerald-500/15">
                      <p className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-300">
                        {doneTodos.length}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-300/80">
                        Done
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-100 p-2.5 dark:bg-amber-500/15">
                      <p className="text-lg font-black tabular-nums text-amber-700 dark:text-amber-300">
                        {pendingTodos.length}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 dark:text-amber-300/80">
                        Pending
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Kya kaam hua
                    </p>
                    {doneTodos.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                        Abhi tak koi task complete nahi hua.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {doneTodos.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-sm text-slate-900 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-slate-100"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span className="break-words">{t.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {pendingTodos.length > 0 && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <Circle className="h-3.5 w-3.5" />
                        Baaki hai
                      </p>
                      <ul className="space-y-1.5">
                        {pendingTodos.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          >
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <span className="break-words">{t.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* complete day */}
          {status === 'eligible' && (
            <button
              type="button"
              onClick={completeDay}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-green-400 hover:to-emerald-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Day
              {total > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] tabular-nums">
                  {doneTodos.length}/{total} tasks
                </span>
              )}
            </button>
          )}

          {/* prev / next */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              disabled={!onPrev}
              onClick={onPrev}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous day
            </button>

            <button
              type="button"
              disabled={!onNext}
              onClick={onNext}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next day
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export const ActiveChallengeDashboard: React.FC<
  ActiveChallengeDashboardProps
> = ({
  challenge,
  onCompleteDay,
  onSaveDayNote,
  onResetChallenge,
  onStartNewChallenge,
  soundEnabled,
}) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pageBatch, setPageBatch] = useState(0);
  const [openDayNumber, setOpenDayNumber] = useState<number | null>(null);

  /* ---- todos: saved in localStorage, per challenge ---- */
  // Key uses only stable fields (no goalTitle) so it never changes mid-challenge
  const storageKey = useMemo(
    () =>
      `challenge-todos:${challenge.userName}:${challenge.startDate}:${challenge.durationDays}`,
    [challenge.userName, challenge.startDate, challenge.durationDays]
  );

  const [todosByDay, setTodosByDay] = useState<TodosByDay>(() =>
    loadTodos(storageKey)
  );

  // Save to localStorage after every change (outside the state updater)
  useEffect(() => {
    persistTodos(storageKey, todosByDay);
  }, [todosByDay, storageKey]);

  const handleTodosChange = (dayNumber: number, next: DayTodo[]) => {
    // Future days are locked: no tasks can be created before their date
    const target = challenge.days.find((d) => d.dayNumber === dayNumber);
    if (target && getDayStatus(target, getTodayLocalDateString()) === 'upcoming') {
      return;
    }

    setTodosByDay((prev) => ({ ...prev, [dayNumber]: next }));

    // Also tell the parent (text summary). Never let a parent error block saving.
    try {
      onSaveDayNote(dayNumber, todosToSummary(next));
    } catch (error) {
      console.error('onSaveDayNote failed', error);
    }
  };

  const todayStr = getTodayLocalDateString();
  const totalDays = challenge.durationDays;

  const completedCount = challenge.days.filter((day) => day.isCompleted).length;
  const progressPercent =
    totalDays > 0
      ? Math.min(100, Math.round((completedCount / totalDays) * 100))
      : 0;

  const remainingDays = Math.max(0, totalDays - completedCount);

  const { currentDayNumber, isBeforeStart, isAfterEnd } =
    getCurrentChallengeDayNumber(
      challenge.startDate,
      challenge.durationDays,
      todayStr
    );

  const dailyQuote = getDailyQuote();
  const todayRecord = challenge.days.find(
    (day) => day.scheduledDate === todayStr
  );
  const isTodayEligible = Boolean(todayRecord && !todayRecord.isCompleted);

  const statusMap = useMemo(() => {
    const map = new Map<number, DayStatus>();

    challenge.days.forEach((day) => {
      map.set(day.dayNumber, getDayStatus(day, todayStr));
    });

    return map;
  }, [challenge.days, todayStr]);

  const counts = useMemo(() => {
    let pending = 0;
    let completed = 0;
    let missed = 0;

    statusMap.forEach((status) => {
      if (status === 'completed') completed++;
      else if (status === 'missed') missed++;
      else pending++;
    });

    return {
      all: challenge.days.length,
      pending,
      completed,
      missed,
    };
  }, [statusMap, challenge.days.length]);

  const tasksCount = useMemo(
    () =>
      Object.values(todosByDay).reduce(
        (sum, list) => sum + (list?.length ?? 0),
        0
      ),
    [todosByDay]
  );

  const streak = useMemo(() => {
    const sorted = [...challenge.days].sort(
      (a, b) => a.dayNumber - b.dayNumber
    );

    const past = sorted.filter((day) => day.scheduledDate <= todayStr);
    let count = 0;

    for (let index = past.length - 1; index >= 0; index--) {
      const day = past[index];

      if (day.isCompleted) count++;
      else if (day.scheduledDate === todayStr) continue;
      else break;
    }

    return count;
  }, [challenge.days, todayStr]);

  const filteredDays = useMemo(
    () =>
      challenge.days.filter((day) => {
        const status = statusMap.get(day.dayNumber);

        if (filter === 'completed') return status === 'completed';
        if (filter === 'pending')
          return status === 'eligible' || status === 'upcoming';
        if (filter === 'missed') return status === 'missed';

        return true;
      }),
    [challenge.days, filter, statusMap]
  );

  const BATCH_SIZE = totalDays > 30 ? 30 : Math.max(1, totalDays);
  const totalBatches = Math.max(
    1,
    Math.ceil(filteredDays.length / BATCH_SIZE)
  );

  const safePageBatch = Math.min(pageBatch, totalBatches - 1);

  const displayedDays =
    totalDays > 30
      ? filteredDays.slice(
          safePageBatch * BATCH_SIZE,
          (safePageBatch + 1) * BATCH_SIZE
        )
      : filteredDays;

  const currentDayLabel = isBeforeStart
    ? 'Soon'
    : isAfterEnd
      ? 'Finished'
      : `${currentDayNumber || 1}`;

  const openDay =
    challenge.days.find((day) => day.dayNumber === openDayNumber) ?? null;

  // Prev / Next only move between unlocked days (never into future days)
  const navigableDays = filteredDays.filter(
    (day) => statusMap.get(day.dayNumber) !== 'upcoming'
  );

  const openIdx = navigableDays.findIndex(
    (day) => day.dayNumber === openDayNumber
  );

  const prevDay = openIdx > 0 ? navigableDays[openIdx - 1] : null;

  const nextDay =
    openIdx >= 0 && openIdx < navigableDays.length - 1
      ? navigableDays[openIdx + 1]
      : null;

  useEffect(() => {
    if (!showResetConfirm) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowResetConfirm(false);
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [showResetConfirm]);

  const handleReset = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setTodosByDay({});
    onResetChallenge();
  };

  return (
    <section
      id="active-dashboard"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-green-900 p-5 text-white shadow-2xl shadow-emerald-900/30 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-green-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProgressRing percent={progressPercent} />

            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-green-300/40 bg-green-400/15 px-3 py-1 text-[11px] font-bold tracking-wide text-green-200">
                <Sparkles className="h-3.5 w-3.5 text-green-300" />
                YOUR PROGRESS
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                Keep going,{' '}
                <span className="bg-gradient-to-r from-lime-200 via-green-300 to-emerald-300 bg-clip-text text-transparent">
                  {challenge.userName}
                </span>
                !
              </h2>

              <p className="mt-1.5 text-sm font-bold text-green-300 sm:text-base">
                {challenge.durationDays}-Day Challenge
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-200 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                  <Target className="h-3.5 w-3.5 shrink-0 text-green-300" />
                  <span className="font-semibold text-white">
                    {challenge.goalTitle}
                  </span>

                  {challenge.isCustomGoal && (
                    <span className="rounded border border-green-300/40 bg-green-400/20 px-1.5 py-0.5 text-[10px] text-green-200">
                      Custom
                    </span>
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  {formatDisplayDate(challenge.startDate)} –{' '}
                  {formatDisplayDate(challenge.endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 lg:self-start">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onStartNewChallenge();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <PlusCircle className="h-3.5 w-3.5 text-green-300" />
              New Challenge
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setShowResetConfirm(true);
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-400/50 hover:bg-rose-500/25 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Linear progress */}
        <div className="relative z-10 mt-7">
          <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-slate-100">
              {completedCount} of {totalDays} days done
            </span>
            <span className="font-bold tabular-nums text-green-300">
              {remainingDays} to go
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-lime-300 via-green-400 to-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.7)]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={CalendarCheck}
            label="Current Day"
            value={
              isBeforeStart || isAfterEnd ? (
                currentDayLabel
              ) : (
                <>
                  {currentDayLabel}
                  <span className="text-sm font-semibold text-slate-400">
                    {' '}/ {totalDays}
                  </span>
                </>
              )
            }
            tone="bg-sky-400/20 text-sky-300"
          />

          <StatCard
            icon={Trophy}
            label="Completed"
            value={completedCount}
            hint={`${progressPercent}% of the journey`}
            tone="bg-green-400/20 text-green-300"
          />

          <StatCard
            icon={Hourglass}
            label="Remaining"
            value={
              <>
                {remainingDays}
                <span className="text-sm font-semibold text-slate-400">
                  {' '}days
                </span>
              </>
            }
            tone="bg-amber-400/20 text-amber-300"
          />

          <StatCard
            icon={Flame}
            label="Streak"
            value={
              <>
                {streak}
                <span className="text-sm font-semibold text-slate-400">
                  {' '}{streak === 1 ? 'day' : 'days'}
                </span>
              </>
            }
            hint={streak > 0 ? "Don't break the chain" : 'Start today'}
            tone="bg-orange-400/20 text-orange-300"
          />
        </div>
      </motion.div>

      {/* QUOTE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="relative mt-6 overflow-hidden rounded-2xl border border-green-200 bg-white p-4 shadow-sm dark:border-green-500/20 dark:bg-slate-900 sm:p-5"
      >
        <Quote
          aria-hidden="true"
          className="absolute -right-2 -top-2 h-20 w-20 text-green-500/10"
        />

        <div className="relative flex items-start gap-3.5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400">
            <Quote className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
              Quote of the day
            </p>

            <p className="mt-1 text-sm font-medium italic leading-relaxed text-slate-900 dark:text-slate-100">
              “{dailyQuote.quote}”
            </p>

            <p className="mt-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              — {dailyQuote.author}
            </p>
          </div>
        </div>
      </motion.div>

      {/* TODAY CTA */}
      {isTodayEligible && todayRecord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="relative mt-6 overflow-hidden rounded-2xl border border-green-400/60 bg-gradient-to-r from-green-50 to-emerald-100 p-4 shadow-md shadow-green-500/10 dark:border-green-500/30 dark:from-green-950/50 dark:to-emerald-950/40 sm:p-5"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-400/25 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  Today is Day {todayRecord.dayNumber}
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {' '}· {formatDisplayDate(todayStr)}
                  </span>
                </h3>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Complete today's goal:{' '}
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    {challenge.goalTitle}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setOpenDayNumber(todayRecord.dayNumber);
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-600 bg-white px-4 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50 dark:border-green-500 dark:bg-transparent dark:text-green-300 dark:hover:bg-green-500/10"
              >
                <ListChecks className="h-4 w-4" />
                Today's Tasks
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onCompleteDay(
                    todayRecord.dayNumber,
                    todosToSummary(todosByDay[todayRecord.dayNumber] ?? [])
                  );
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:from-green-400 hover:to-emerald-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete Today's Challenge
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* CALENDAR HEADER + FILTERS */}
      <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            Daily Challenge Calendar
          </h3>

          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Kisi bhi din par click karke tasks add karo ya dekho.{' '}
            <span className="font-semibold text-green-700 dark:text-green-400">
              {tasksCount} tasks saved
            </span>
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter days"
          className="flex flex-wrap items-center gap-1 self-start rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900 sm:self-auto"
        >
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setFilter(tab.id);
                  setPageBatch(0);
                }}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-green-600 dark:text-white'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                    active
                      ? 'bg-green-100 text-green-800 dark:bg-white/20 dark:text-white'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAGINATION */}
      {totalBatches > 1 && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span className="px-1">
            Showing{' '}
            <b className="text-slate-900 dark:text-white">
              {safePageBatch * BATCH_SIZE + 1}–
              {Math.min((safePageBatch + 1) * BATCH_SIZE, filteredDays.length)}
            </b>{' '}
            of {filteredDays.length} days
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePageBatch === 0}
              onClick={() => setPageBatch((page) => Math.max(0, page - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold transition hover:border-green-400 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>

            <span className="min-w-[48px] text-center font-bold tabular-nums text-slate-900 dark:text-white">
              {safePageBatch + 1} / {totalBatches}
            </span>

            <button
              type="button"
              disabled={safePageBatch >= totalBatches - 1}
              onClick={() =>
                setPageBatch((page) => Math.min(totalBatches - 1, page + 1))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold transition hover:border-green-400 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* DAY GRID */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {displayedDays.map((day, index) => (
          <DayTile
            key={day.dayNumber}
            day={day}
            status={statusMap.get(day.dayNumber) ?? getDayStatus(day, todayStr)}
            index={index}
            todos={todosByDay[day.dayNumber] ?? []}
            onOpen={() => {
              playClickSound(soundEnabled);
              setOpenDayNumber(day.dayNumber);
            }}
          />
        ))}
      </div>

      {displayedDays.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Inbox className="h-6 w-6" />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
            No days found in this filter
          </p>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            There are currently no days in the "{filter}" filter.
          </p>

          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setPageBatch(0);
            }}
            className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-500"
          >
            Show all days
          </button>
        </div>
      )}

      {/* DAY DETAIL MODAL */}
      <AnimatePresence>
        {openDay && (
          <DayDetailModal
            key={openDay.dayNumber}
            day={openDay}
            status={
              statusMap.get(openDay.dayNumber) ??
              getDayStatus(openDay, todayStr)
            }
            isToday={openDay.scheduledDate === todayStr}
            goalTitle={challenge.goalTitle}
            totalDays={totalDays}
            todos={todosByDay[openDay.dayNumber] ?? []}
            onTodosChange={handleTodosChange}
            onClose={() => setOpenDayNumber(null)}
            onPrev={
              prevDay ? () => setOpenDayNumber(prevDay.dayNumber) : undefined
            }
            onNext={
              nextDay ? () => setOpenDayNumber(nextDay.dayNumber) : undefined
            }
            onCompleteDay={onCompleteDay}
            soundEnabled={soundEnabled}
          />
        )}
      </AnimatePresence>

      {/* RESET CONFIRMATION */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onClick={() => setShowResetConfirm(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <h3
                  id="reset-title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  Reset this challenge?
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Your {challenge.durationDays}-day challenge progress, completed
                days, streak and all tasks will be cleared. This action cannot
                be undone.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-500"
                >
                  Keep Challenge
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setShowResetConfirm(false);
                    handleReset();
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};