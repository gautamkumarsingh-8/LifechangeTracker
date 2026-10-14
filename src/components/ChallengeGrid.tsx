
import React from 'react';
import { CHALLENGE_DURATIONS } from '../data/durations.ts';
import { ChallengeCard } from './ChallengeCard.tsx';
import { ChallengeDuration } from '../types.ts';

interface ChallengeGridProps {
  selectedDuration?: ChallengeDuration | null;
  onSelectDuration: (duration: ChallengeDuration) => void;
  soundEnabled: boolean;
}

export const ChallengeGrid: React.FC<ChallengeGridProps> = ({
  selectedDuration,
  onSelectDuration,
  soundEnabled,
}) => {
  return (
    <section
      id="challenges"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      {/* Section heading */}
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-11">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-400 bg-green-50 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-black dark:bg-amber-950/40 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          YOUR JOURNEY STARTS HERE
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
          Choose Your{' '}
          <span className="text-green-500">Challenge</span>
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          Small daily actions. Better habits. A stronger you.
          Pick your duration and start today.
        </p>
      </div>

      {/* 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {CHALLENGE_DURATIONS.map((meta) => (
          <ChallengeCard
            key={meta.duration}
            meta={meta}
            isSelected={selectedDuration === meta.duration}
            onSelect={onSelectDuration}
            soundEnabled={soundEnabled}
          />
        ))}
      </div>

      {/* Footer hint */}
      <p className="mt-7 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
        One day at a time. One step closer to your best self.
      </p>
    </section>
  );
};
