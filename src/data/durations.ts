/**
 * Challenge Durations Data for Life Change Tracker
 * 11 durations with pastel color schemes, descriptions, and styling.
 */

import { ChallengeDuration } from '../types.ts';

export interface DurationMeta {
  duration: ChallengeDuration;
  label: string;
  badge: string;
  description: string;
  lightCardBg: string;
  darkCardBg: string;
  borderColor: string;
  textColor: string;
  accentBg: string;
}

export const CHALLENGE_DURATIONS: DurationMeta[] = [
  {
    duration: 7,
    label: '7 Days',
    badge: 'Quick Reset',
    description: 'Perfect for breaking a short slump or kickstarting a new routine with quick wins.',
    lightCardBg: 'bg-sky-50/90 hover:bg-sky-100/90',
    darkCardBg: 'dark:bg-sky-950/30 dark:hover:bg-sky-950/50',
    borderColor: 'border-sky-200/80 dark:border-sky-800/40',
    textColor: 'text-sky-950 dark:text-sky-100',
    accentBg: 'bg-sky-600',
  },
  {
    duration: 10,
    label: '10 Days',
    badge: 'Kickstart Sprint',
    description: 'A focused double work-week sprint to build early discipline and proof of commitment.',
    lightCardBg: 'bg-violet-50/90 hover:bg-violet-100/90',
    darkCardBg: 'dark:bg-violet-950/30 dark:hover:bg-violet-950/50',
    borderColor: 'border-violet-200/80 dark:border-violet-800/40',
    textColor: 'text-violet-950 dark:text-violet-100',
    accentBg: 'bg-violet-600',
  },
  {
    duration: 14,
    label: '14 Days',
    badge: 'Momentum Builder',
    description: 'Two full weeks of deliberate consistency to solidify basic daily routines.',
    lightCardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    darkCardBg: 'dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
    borderColor: 'border-emerald-200/80 dark:border-emerald-800/40',
    textColor: 'text-emerald-950 dark:text-emerald-100',
    accentBg: 'bg-emerald-600',
  },
  {
    duration: 21,
    label: '21 Days',
    badge: 'Habit Anchor',
    description: 'The classic psychological milestone to cement a new neurological habit pattern.',
    lightCardBg: 'bg-purple-50/90 hover:bg-purple-100/90',
    darkCardBg: 'dark:bg-purple-950/30 dark:hover:bg-purple-950/50',
    borderColor: 'border-purple-200/80 dark:border-purple-800/40',
    textColor: 'text-purple-950 dark:text-purple-100',
    accentBg: 'bg-purple-600',
  },
  {
    duration: 30,
    label: '30 Days',
    badge: 'Monthly Shift',
    description: 'A full calendar month to establish undeniable changes in lifestyle and identity.',
    lightCardBg: 'bg-amber-50/90 hover:bg-amber-100/90',
    darkCardBg: 'dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
    borderColor: 'border-amber-200/80 dark:border-amber-800/40',
    textColor: 'text-amber-950 dark:text-amber-100',
    accentBg: 'bg-amber-600',
  },
  {
    duration: 40,
    label: '40 Days',
    badge: 'Discipline Forge',
    description: 'Forty days of proven consistency to deeply transform willpower, mental focus, and grit.',
    lightCardBg: 'bg-lime-50/90 hover:bg-lime-100/90',
    darkCardBg: 'dark:bg-lime-950/30 dark:hover:bg-lime-950/50',
    borderColor: 'border-lime-200/80 dark:border-lime-800/40',
    textColor: 'text-lime-950 dark:text-lime-100',
    accentBg: 'bg-lime-600',
  },
  {
    duration: 60,
    label: '60 Days',
    badge: 'Deep Practice',
    description: 'Two months of unwavering dedication. Transform initial effort into natural automaticity.',
    lightCardBg: 'bg-rose-50/90 hover:bg-rose-100/90',
    darkCardBg: 'dark:bg-rose-950/30 dark:hover:bg-rose-950/50',
    borderColor: 'border-rose-200/80 dark:border-rose-800/40',
    textColor: 'text-rose-950 dark:text-rose-100',
    accentBg: 'bg-rose-600',
  },
  {
    duration: 90,
    label: '90 Days',
    badge: 'Quarterly Shift',
    description: 'A comprehensive 3-month season of growth. Noticeable physical and mental transformation.',
    lightCardBg: 'bg-teal-50/90 hover:bg-teal-100/90',
    darkCardBg: 'dark:bg-teal-950/30 dark:hover:bg-teal-950/50',
    borderColor: 'border-teal-200/80 dark:border-teal-800/40',
    textColor: 'text-teal-950 dark:text-teal-100',
    accentBg: 'bg-teal-600',
  },
  {
    duration: 100,
    label: '100 Days',
    badge: 'Century Journey',
    description: 'One hundred unbroken days of dedication. Join the century club of committed achievers.',
    lightCardBg: 'bg-indigo-50/90 hover:bg-indigo-100/90',
    darkCardBg: 'dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50',
    borderColor: 'border-indigo-200/80 dark:border-indigo-800/40',
    textColor: 'text-indigo-950 dark:text-indigo-100',
    accentBg: 'bg-indigo-600',
  },
  {
    duration: 200,
    label: '200 Days',
    badge: 'Mastery & Resilience',
    description: 'Over half a year of discipline. Weather seasonal changes and maintain fierce focus.',
    lightCardBg: 'bg-cyan-50/90 hover:bg-cyan-100/90',
    darkCardBg: 'dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50',
    borderColor: 'border-cyan-200/80 dark:border-cyan-800/40',
    textColor: 'text-cyan-950 dark:text-cyan-100',
    accentBg: 'bg-cyan-600',
  },
  {
    duration: 300,
    label: '300 Days',
    badge: 'Ultimate Transformation',
    description: 'Near-year dedication. An inspiring commitment that permanently alters your trajectory.',
    lightCardBg: 'bg-orange-50/90 hover:bg-orange-100/90',
    darkCardBg: 'dark:bg-orange-950/30 dark:hover:bg-orange-950/50',
    borderColor: 'border-orange-200/80 dark:border-orange-800/40',
    textColor: 'text-orange-950 dark:text-orange-100',
    accentBg: 'bg-orange-600',
  },
];
