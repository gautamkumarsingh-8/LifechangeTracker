import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { DurationMeta } from '../data/durations.ts';
import { playClickSound } from '../utils/audio.ts';

interface ChallengeCardProps {
  meta: DurationMeta;
  isSelected?: boolean;
  onSelect: (duration: DurationMeta['duration']) => void;
  soundEnabled: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  meta,
  isSelected,
  onSelect,
  soundEnabled,
}) => {
  const is300Days = meta.duration === 300;

  return (
    <button
      type="button"
      onClick={() => {
        playClickSound(soundEnabled);
        onSelect(meta.duration);
      }}
      className={`group relative flex flex-col justify-between text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer ${
        meta.lightCardBg
      } ${meta.darkCardBg} ${meta.borderColor} ${
        is300Days ? 'col-span-2 sm:col-span-1 lg:col-span-2' : ''
      } ${
        isSelected
          ? 'ring-2 ring-amber-500 shadow-md scale-[1.02]'
          : 'hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20'
      }`}
    >
      {/* Top Row: Icon & Tag */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs border border-stone-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {meta.badge}
          </span>
        </div>

        {/* Duration Title */}
        <div className="mt-4">
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${meta.textColor}`}>
            {meta.label}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Card Footer: CTA Hint */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-200/50 pt-3 text-xs font-semibold text-slate-700 dark:text-slate-300 dark:border-slate-800/60">
        <span>Start {meta.label}</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 dark:bg-slate-900/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
};
