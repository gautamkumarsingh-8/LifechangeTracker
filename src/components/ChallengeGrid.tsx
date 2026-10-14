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
      className="mx-auto w-full max-w-7xl px-3 py-8
        sm:px-5 sm:py-12
        lg:px-8 lg:py-16"
    >
      {/* Section Heading */}
      <div className="mx-auto mb-7 w-full max-w-2xl text-center sm:mb-10">
        <div
          className="mb-3 inline-flex max-w-full items-center justify-center
            gap-2 rounded-full border border-green-400/70
            bg-green-50 px-3 py-2
            text-[9px] font-extrabold tracking-[0.12em]
            text-slate-900
            dark:bg-amber-950/40 dark:text-amber-400
            sm:text-[10px] sm:tracking-[0.18em]"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          <span>YOUR JOURNEY STARTS HERE</span>
        </div>

        <h2
          className="text-2xl font-black leading-tight tracking-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
            md:text-4xl"
        >
          Choose Your{' '}
          <span className="text-green-500">Challenge</span>
        </h2>

        <p
          className="mx-auto mt-3 max-w-lg px-1
            text-xs leading-5 text-slate-500
            dark:text-slate-400
            sm:text-sm sm:leading-6
            md:text-base"
        >
          Small daily actions. Better habits. A stronger you.
          Pick your duration and start today.
        </p>
      </div>

      {/* Responsive Challenge Cards */}
      <div
        className="grid w-full min-w-0 grid-cols-2 items-stretch
          gap-2.5
          sm:gap-4
          md:grid-cols-3 md:gap-5
          lg:grid-cols-4 lg:gap-6"
      >
        {CHALLENGE_DURATIONS.map((meta) => (
          <div key={meta.duration} className="h-full w-full min-w-0">
            <ChallengeCard
              meta={meta}
              isSelected={selectedDuration === meta.duration}
              onSelect={onSelectDuration}
              soundEnabled={soundEnabled}
            />
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <p
        className="mx-auto mt-6 max-w-md px-2 text-center
          text-[10px] leading-5 font-medium text-slate-400
          dark:text-slate-500
          sm:mt-8 sm:text-xs sm:leading-6"
      >
        One day at a time. One step closer to your best self.
      </p>
    </section>
  );
};