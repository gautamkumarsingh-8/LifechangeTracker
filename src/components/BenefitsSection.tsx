import React from 'react';
import { ShieldCheck, Flame, Compass } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'Build Better Habits',
      desc: 'Replace reactive routines with intentional, positive behaviors anchored in your daily schedule.',
      icon: ShieldCheck,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Improve Daily Discipline',
      desc: 'Strengthen focus by honoring promises to yourself, one manageable session at a time.',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Stay Consistent',
      desc: 'Eliminate all-or-nothing thinking. Track visible visual momentum across your chosen timeframe.',
      icon: Compass,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-stone-200/60 dark:border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          PHILOSOPHY
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Small Steps. Lasting Change.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Real change comes from showing up consistently. Focus on today's action, track your progress, and keep moving forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-slate-800">
                  <Icon className={`h-5 w-5 ${b.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h3>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {b.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
