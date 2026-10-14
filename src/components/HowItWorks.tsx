import React from 'react';
import { Target, CalendarCheck, Trophy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Challenge',
      desc: 'Select your duration (from 7 to 300 days) and choose your personal goal.',
      icon: Target,
      bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      step: '02',
      title: 'Complete One Day at a Time',
      desc: 'Follow your scheduled days and record your daily progress in real time.',
      icon: CalendarCheck,
      bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      step: '03',
      title: 'Celebrate Your Growth',
      desc: 'Stay consistent, build genuine discipline, and finish your life-changing challenge.',
      icon: Trophy,
      bg: 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300',
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          SIMPLE ROADMAP
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How Life Change Taker Works
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          No complicated workflows or confusing metrics. Just a steady, honest day-by-day practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700">
                    {item.step}
                  </span>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Step {item.step} of 03
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
