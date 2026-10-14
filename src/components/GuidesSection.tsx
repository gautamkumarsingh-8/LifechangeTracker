import React, { useState } from 'react';
import { BookOpen, ArrowRight, Clock, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ChallengeDuration } from '../types.ts';
import { playClickSound } from '../utils/audio.ts';

interface GuideArticle {
  id: string;
  title: string;
  duration?: ChallengeDuration;
  readTime: string;
  summary: string;
  content: string[];
  takeaways: string[];
}

const ARTICLES: GuideArticle[] = [
  {
    id: 'how-to-start-7-day-challenge',
    title: 'How to Start a 7-Day Challenge',
    duration: 7,
    readTime: '3 min read',
    summary: 'A 7-day challenge is the ultimate low-friction sprint to regain momentum, eliminate procrastination, and prove you can follow through.',
    content: [
      'The biggest mistake when setting a 7-day challenge is picking a goal that is overly ambitious. Instead of attempting to work out for two hours every day, commit to 20 minutes of uninterrupted exercise.',
      'Define a concrete anchor: pair your challenge action with an existing daily anchor (e.g., right after morning coffee or immediately after closing your work laptop).',
      'Record your completion every day in your local tracker. Visible streaks create psychological momentum that carries into week two.',
    ],
    takeaways: [
      'Pick a single high-impact habit, not three.',
      'Prepare your environment the evening before.',
      'Treat Day 1 as non-negotiable proof of concept.',
    ],
  },
  {
    id: '10-day-personal-growth-ideas',
    title: '10-Day Personal Growth Challenge Ideas',
    duration: 10,
    readTime: '4 min read',
    summary: 'Ten days is long enough to feel tangible physical or mental clarity without feeling overwhelmed. Discover top high-yield 10-day sprint ideas.',
    content: [
      'Digital Detox Sprint: Keep your smartphone outside your bedroom for 10 consecutive nights to eliminate bedtime doom-scrolling and restore restful sleep.',
      'English & Vocal Fluency: Spend 15 minutes speaking aloud on a chosen subject every day to break conversational hesitation.',
      'Writing & Intellectual Synthesis: Draft 250 words summarizing one concept you learned each day.',
    ],
    takeaways: [
      '10 days provides immediate proof of discipline.',
      'Ideal for academic test prep or language sprints.',
      'Provides a clean milestone before a longer challenge.',
    ],
  },
  {
    id: 'how-to-complete-21-day-challenge',
    title: 'How to Complete a 21-Day Challenge',
    duration: 21,
    readTime: '4 min read',
    summary: 'Why 21 days matters in behavioral psychology, and how to navigate the inevitable motivational dip that occurs around Days 8–12.',
    content: [
      'In classic habit research popularized by Dr. Maxwell Maltz, 21 days represents the baseline window required for old neural representations to fade and new routines to feel automatic.',
      'Days 1–7 run on initial excitement. Days 8–14 are the critical friction zone where novelty wears off. This is where tracking daily completion prevents relapse.',
      'Days 15–21 solidify the identity shift: you no longer "try" to do the action; it has become simply what you do.',
    ],
    takeaways: [
      'Expect resistance during Week 2; do not interpret it as failure.',
      'Focus on showing up, even on days with low energy.',
      'Use the tracker to inspect missed days without giving up.',
    ],
  },
  {
    id: 'create-own-40-day-challenge',
    title: 'How to Create Your Own 40-Day Challenge',
    duration: 40,
    readTime: '5 min read',
    summary: 'The ancient 40-day timeframe has been used across history for deep character forging, overcoming addictions, and lifestyle metamorphosis.',
    content: [
      'A 40-day challenge bridges short sprints and lifelong habits. It demands true lifestyle changes rather than temporary willpower.',
      'Formulate a precise custom goal statement. For example: "No refined sugar and 30 minutes of brisk outdoor walking each day."',
      'Establish a weekly check-in routine. Use the daily reflection notes feature to write down what triggered cravings or distractions.',
    ],
    takeaways: [
      'Clarify your "why" before Day 1.',
      'Build guardrails against predictable weekend distractions.',
      'Celebrate reaching the halfway mark on Day 20.',
    ],
  },
  {
    id: 'stay-consistent-with-goals',
    title: 'How to Stay Consistent With Your Goals',
    duration: 30,
    readTime: '4 min read',
    summary: 'Consistency is not about never having an off day; it is about never missing twice and reducing the friction between decision and action.',
    content: [
      'The Two-Day Rule: If an unforeseen life event forces you to miss a day, make it an absolute rule never to miss two days in a row.',
      'Lower the barrier to entry: On days when you feel exhausted, do a reduced version (e.g., 5 minutes of stretching instead of a 45-minute workout). Keep the streak alive.',
      'Track visually: The human brain thrives on visual progression. Checking off a calendar box releases dopamine and reinforces your identity as a consistent person.',
    ],
    takeaways: [
      'Consistency beats intensity every single time.',
      'Never allow one missed day to spiral into abandonment.',
      'Protect your scheduled daily window.',
    ],
  },
  {
    id: 'how-to-track-daily-progress',
    title: 'How to Track Daily Progress',
    duration: 14,
    readTime: '3 min read',
    summary: 'Why date-based calendar tracking outperforms loose to-do lists, and how to use reflection notes to build emotional resilience.',
    content: [
      'Loose to-do lists allow for vague postponement. A calendar-based challenge locks each commitment to an actual date, forcing clarity.',
      'Honest accounting: If a day passes without completion, marking it honestly preserves integrity. Trying to fake progress ruins the internal confidence a challenge is meant to build.',
      'Reviewing past completions creates an undeniable record of capability that you can look back on whenever self-doubt arises.',
    ],
    takeaways: [
      'Keep dates tied to real calendar milestones.',
      'Log brief notes on obstacles encountered.',
      'Use past challenge history as personal evidence of growth.',
    ],
  },
];

interface GuidesSectionProps {
  onStartWithDuration: (duration: ChallengeDuration) => void;
  soundEnabled: boolean;
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({
  onStartWithDuration,
  soundEnabled,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(null);

  return (
    <section id="guides" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-stone-200/60 dark:border-slate-800/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 mb-2">
          <BookOpen className="h-3.5 w-3.5" />
          <span>ORIGINAL GUIDES & STRATEGIES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Practical Habit & Challenge Guides
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Learn the behavioral science of consistency, overcoming motivational plateaus, and finishing your personal challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((art) => (
          <div
            key={art.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-amber-300 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {art.readTime}
                </span>
                {art.duration && (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {art.duration}-Day Plan
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {art.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedArticle(art);
                }}
                className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Read Guide
              </button>
              {art.duration && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onStartWithDuration(art.duration!);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>Start {art.duration}d</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-stone-200 dark:border-slate-800 max-h-[88vh] overflow-y-auto my-6">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close guide"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{selectedArticle.readTime}</span>
              <span>·</span>
              <span>Practical Habit Guide</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {selectedArticle.title}
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2">
                Key Action Steps
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                {selectedArticle.takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 cursor-pointer"
              >
                Close
              </button>

              {selectedArticle.duration && (
                <button
                  type="button"
                  onClick={() => {
                    const dur = selectedArticle.duration!;
                    setSelectedArticle(null);
                    onStartWithDuration(dur);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start This {selectedArticle.duration}-Day Challenge</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
