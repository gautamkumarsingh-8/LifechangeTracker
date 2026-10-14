/**
 * Life Change Taker — Type Definitions
 */

export type ChallengeDuration = 7 | 10 | 14 | 21 | 30 | 40 | 60 | 90 | 100 | 200 | 300;

export interface GoalItem {
  id: string;
  title: string;
  category: 'Wellness & Health' | 'Discipline & Habits' | 'Productivity & Skills' | 'Mindfulness';
  description: string;
  iconName: string;
}

export interface DayRecord {
  dayNumber: number;
  scheduledDate: string; // ISO format 'YYYY-MM-DD'
  isCompleted: boolean;
  completedAt?: string;  // ISO timestamp string
  reflectionNote?: string;
}

export interface ActiveChallenge {
  id: string;
  userName: string;
  goalId: string;
  goalTitle: string;
  isCustomGoal?: boolean;
  customGoalName?: string;
  durationDays: ChallengeDuration;
  startDate: string;     // 'YYYY-MM-DD'
  endDate: string;       // 'YYYY-MM-DD'
  createdAt: string;     // ISO timestamp string
  days: DayRecord[];
  isFinished: boolean;
  finishedAt?: string;
  isCelebrated?: boolean; // Prevents repeated popups on refresh
}

export interface CompletedChallengeRecord {
  id: string;
  userName: string;
  goalTitle: string;
  durationDays: ChallengeDuration;
  startDate: string;
  endDate: string;
  completedDays: number;
  finishedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
}

export type DayStatus = 'completed' | 'eligible' | 'missed' | 'upcoming';

export interface MotivationalQuote {
  quote: string;
  author: string;
}
