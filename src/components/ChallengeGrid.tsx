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
    <section id="challenges" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          CHALLENGE DURATIONS
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Choose Your Horizon
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Pick a timeframe that challenges you while fitting your daily rhythm. From a 7-day quick reset to a transformative 300-day journey.
        </p>
      </div>

      {/* Responsive Grid: 2 cols on mobile (300 days spans both), 3 on tablet, 3-4 on desktop */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
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
    </section>
  );
};
