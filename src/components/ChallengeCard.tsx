import React, { memo, useMemo } from 'react';
import {
  Check,
  ArrowUpRight,
  Sparkles,
  Zap,
  Flame,
  TrendingUp,
  Crown,
  type LucideIcon,
} from 'lucide-react';

import { ChallengeDuration } from '../types.ts';
import { playClickSound } from '../utils/audio.ts';

interface ChallengeCardProps {
  meta: {
    duration: ChallengeDuration;
    [key: string]: any;
  };
  isSelected: boolean;
  onSelect: (duration: ChallengeDuration) => void;
  soundEnabled: boolean;
}

interface DurationInfo {
  title: string;
  subtitle: string;
  badge: string;
  Icon: LucideIcon;
  accent: string; // gradient (from/to)
  glow: string; // hover glow color
  soft: string;
  text: string;
  border: string;
  chip: string;
}

const getDurationInfo = (duration: number): DurationInfo => {
  if (duration <= 7) {
    return {
      title: 'Quick Start',
      subtitle: 'Build your momentum',
      badge: 'Easy',
      Icon: Zap,
      accent: 'from-emerald-400 to-teal-500',
      glow: 'group-hover:shadow-emerald-500/20',
      soft: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-900/70',
      chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    };
  }

  if (duration <= 30) {
    return {
      title: 'Build Habits',
      subtitle: 'Make consistency a habit',
      badge: 'Popular',
      Icon: Flame,
      accent: 'from-amber-400 to-orange-500',
      glow: 'group-hover:shadow-amber-500/20',
      soft: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-900/70',
      chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    };
  }

  if (duration <= 90) {
    return {
      title: 'Level Up',
      subtitle: 'Grow stronger every day',
      badge: 'Serious',
      Icon: TrendingUp,
      accent: 'from-sky-400 to-indigo-500',
      glow: 'group-hover:shadow-sky-500/20',
      soft: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-900/70',
      chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    };
  }

  return {
    title: 'Life Transformation',
    subtitle: 'Create lasting change',
    badge: 'Elite',
    Icon: Crown,
    accent: 'from-violet-400 to-purple-600',
    glow: 'group-hover:shadow-violet-500/20',
    soft: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-900/70',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  };
};

const getLengthLabel = (duration: number) => {
  if (duration < 14) return `${duration} days`;
  if (duration < 60) return `~${Math.round(duration / 7)} weeks`;
  return `~${Math.round(duration / 30)} months`;
};

const ChallengeCardBase: React.FC<ChallengeCardProps> = ({
  meta,
  isSelected,
  onSelect,
  soundEnabled,
}) => {
  const duration = Number(meta.duration);
  const info = useMemo(() => getDurationInfo(duration), [duration]);
  const { Icon } = info;

  const segments = Math.min(7, Math.max(1, Math.ceil(duration / 7)));
  const isStartHere = !isSelected && duration === 7;

  // 100, 200, 300 jaise 3 digit numbers ke liye mobile par number thoda chhota
  const isLongNumber = duration >= 100;

  const handleSelect = () => {
    playClickSound(soundEnabled);
    onSelect(meta.duration);
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      aria-pressed={isSelected}
      aria-label={`${info.title}, ${duration} day challenge${isSelected ? ', selected' : ''}`}
      className={`group relative flex h-full min-h-[190px] w-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-2 text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-slate-900 dark:focus-visible:ring-offset-slate-950 sm:min-h-[250px] sm:rounded-3xl sm:p-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${info.glow} ${
        isSelected
          ? 'border-amber-400 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/40 dark:border-amber-500'
          : 'border-slate-200 hover:border-amber-300 dark:border-slate-800 dark:hover:border-amber-700'
      }`}
    >
      {/* Top accent bar (thickens on hover/selected) */}
      <div
        className={`absolute inset-x-0 top-0 bg-gradient-to-r transition-all duration-300 ${info.accent} ${
          isSelected ? 'h-1.5' : 'h-1 group-hover:h-1.5'
        }`}
      />

      {/* Visual panel: mobile par height content se, sm+ par aspect ratio */}
      <div
        className={`relative mb-2 mt-1 flex w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border px-1 py-3 ${info.border} ${info.soft} sm:mb-4 sm:mt-0 sm:aspect-[1.7/1] sm:rounded-2xl sm:px-2 sm:py-0`}
      >
        {/* Ambient blobs */}
        <div
          className={`absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${info.accent} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`}
        />
        <div className="absolute -bottom-8 -left-6 h-20 w-20 rounded-full bg-white/60 blur-xl dark:bg-white/5" />

        {/* Subtle dot pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:12px_12px]"
        />

        {/* Mobile: icon upar, number neeche | sm+: side by side */}
        <div className="relative flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-4">
          {/* Icon tile */}
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:bg-slate-900 dark:ring-white/10 sm:h-16 sm:w-16 sm:rounded-2xl motion-reduce:transition-none motion-reduce:group-hover:transform-none">
              <Icon
                className={`h-[18px] w-[18px] shrink-0 sm:h-8 sm:w-8 ${info.text}`}
                strokeWidth={1.8}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex min-w-0 flex-col items-center sm:items-start">
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span
                className={`bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text pb-0.5 font-black leading-none tracking-tighter text-transparent dark:from-white dark:to-slate-300 sm:text-4xl ${
                  isLongNumber ? 'text-xl' : 'text-2xl'
                }`}
              >
                {duration}
              </span>
              <span
                className={`text-[9px] font-bold tracking-wide sm:text-xs ${info.text}`}
              >
                DAYS
              </span>
            </div>

            {/* Week progress segments */}
            <div
              className="mt-1 flex items-center gap-0.5 sm:mt-1.5 sm:gap-1"
              aria-hidden
            >
              {Array.from({ length: segments }).map((_, index) => (
                <span
                  key={index}
                  style={{ transitionDelay: `${index * 30}ms` }}
                  className={`h-[3px] w-1.5 shrink-0 rounded-full bg-gradient-to-r transition-all duration-300 group-hover:w-2 sm:h-1 sm:w-3.5 sm:group-hover:w-[18px] ${info.accent}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Top-right status */}
        {isSelected && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md sm:right-2 sm:top-2 sm:h-6 sm:w-6">
            <Check size={12} strokeWidth={3} />
          </span>
        )}

        {isStartHere && (
          <span className="absolute right-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-extrabold tracking-wide text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-400 dark:ring-emerald-900 sm:right-2 sm:top-2 sm:gap-1 sm:px-2 sm:py-1 sm:text-[9px]">
            <Sparkles size={9} className="shrink-0" />
            START
            <span className="hidden sm:inline">&nbsp;HERE</span>
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col px-0.5 sm:px-0">
        {/* Mobile: title upar, badge neeche | sm+: same row */}
        <div className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <h3 className="min-w-0 break-words text-xs font-extrabold leading-tight text-slate-900 dark:text-white sm:text-base">
            {info.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide sm:px-2 sm:text-[10px] ${info.chip}`}
          >
            {info.badge}
          </span>
        </div>

        <p className="mt-1 text-[10px] leading-[14px] text-slate-500 dark:text-slate-400 sm:text-xs sm:leading-4">
          <span className="block sm:inline">{info.subtitle}</span>
          <span className="mx-1 hidden text-slate-300 dark:text-slate-600 sm:inline">
            •
          </span>
          <span className="block whitespace-nowrap font-semibold sm:inline sm:font-normal">
            {getLengthLabel(duration)}
          </span>
        </p>

        {/* Bottom action */}
        <div
          className={`mt-auto flex items-center justify-between gap-1 border-t border-dashed border-slate-200 pt-1.5 dark:border-slate-800 sm:pt-3 ${
            isSelected ? 'text-amber-600 dark:text-amber-400' : info.text
          }`}
        >
          <span className="min-w-0 truncate text-[10px] font-bold sm:text-xs">
            {isSelected ? 'Selected' : 'Explore'}
            <span className="hidden sm:inline">
              {isSelected ? '' : ' challenge'}
            </span>
          </span>

          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-7 sm:w-7 ${
              isSelected
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-slate-800 dark:group-hover:bg-amber-950'
            }`}
          >
            {isSelected ? (
              <Check size={12} strokeWidth={2.5} />
            ) : (
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            )}
          </span>
        </div>
      </div>
    </button>
  );
};

export const ChallengeCard = memo(ChallengeCardBase);