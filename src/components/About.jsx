
import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Target,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AboutProps {
  theme?: 'light' | 'dark';
}

const About: React.FC<AboutProps> = ({ theme = 'light' }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: Target,
      title: 'Personal Goals',
      description:
        'Choose a challenge that matches your goals and start building better habits.',
    },
    {
      icon: CalendarCheck,
      title: 'Daily Tracking',
      description:
        'Track your daily progress, celebrate completed days, and stay consistent.',
    },
    {
      icon: TrendingUp,
      title: 'Visible Progress',
      description:
        'See your progress grow day by day and stay motivated throughout your journey.',
    },
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-[#07130C] text-white'
          : 'bg-[#F8FCF8] text-slate-900'
      }`}
    >
      {/* Header */}
      <header
        className={`border-b ${
          isDark
            ? 'border-green-900/50 bg-[#09180F]'
            : 'border-green-100 bg-white'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-green-600 transition hover:text-green-500"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <span className="flex items-center gap-2 text-sm font-bold sm:text-base">
            <Leaf size={21} className="text-green-500" />
            Life Change Tracker
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-500 shadow-lg shadow-green-500/10">
          <Leaf size={32} />
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-green-600 dark:text-green-400 sm:text-sm">
          About Our Mission
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Small Steps.
          <span className="mt-2 block text-green-600 dark:text-green-400">
            A Better Life.
          </span>
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Life Change Tracker helps you turn meaningful goals into daily
          actions through personal challenges, consistent habits, and
          simple progress tracking.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-500"
        >
          Start Your Journey
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
        <div
          className={`grid items-center gap-8 rounded-3xl border p-6 sm:p-9 md:grid-cols-2 md:gap-12 ${
            isDark
              ? 'border-green-900/50 bg-[#0D2015]'
              : 'border-green-100 bg-white shadow-sm shadow-green-950/5'
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 dark:text-green-400">
              <Heart size={14} />
              Why We Exist
            </span>

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
              Change begins with one small step.
            </h2>

            <p
              className={`mt-4 text-sm leading-7 sm:text-base ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Big changes don't happen overnight. They begin when you
              show up, take action, and repeat small positive behaviours.
              Our goal is to make that journey easier to start, track,
              and continue.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-7 text-white sm:p-9">
            <Sparkles
              size={28}
              className="mb-6 text-green-100"
            />

            <p className="text-2xl font-extrabold leading-relaxed sm:text-3xl">
              Progress over perfection.
            </p>

            <p className="mt-4 text-sm leading-7 text-green-50">
              One day at a time. One goal at a time. Keep moving forward.
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white/90">
              <ShieldCheck size={18} />
              Your journey, your pace.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mb-9 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            What You Can Do
          </p>

          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Everything starts with consistency.
          </h2>

          <p
            className={`mx-auto mt-3 max-w-xl text-sm leading-7 sm:text-base ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Simple tools to help you stay focused on what matters.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className={`rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-green-500/40 ${
                  isDark
                    ? 'border-green-900/50 bg-[#0D2015]'
                    : 'border-green-100 bg-white shadow-sm'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-7 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-green-600 px-6 py-10 text-center text-white shadow-xl shadow-green-600/15 sm:px-12 sm:py-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Your next chapter starts today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-green-50 sm:text-base">
            Choose a challenge, take the first step, and build a better
            version of yourself one day at a time.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50"
          >
            Explore Challenges
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t px-4 py-6 text-center text-xs ${
          isDark
            ? 'border-green-900/50 text-slate-400'
            : 'border-green-100 text-slate-500'
        }`}
      >
        © {new Date().getFullYear()} Life Change Tracker. All rights reserved.
      </footer>
    </main>
  );
};

export default About;