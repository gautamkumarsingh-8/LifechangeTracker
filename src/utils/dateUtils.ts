/**
 * Calendar Date Utilities for Life Change Taker
 * Uses local calendar date representations (YYYY-MM-DD) to prevent timezone drift.
 */

import { DayRecord, DayStatus } from '../types.ts';

/**
 * Format a Date object to 'YYYY-MM-DD' in the user's local timezone.
 */
export function formatLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a 'YYYY-MM-DD' string into a local Date object.
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Return today's local date string formatted as 'YYYY-MM-DD'.
 */
export function getTodayLocalDateString(): string {
  return formatLocalDateString(new Date());
}

/**
 * Compute the inclusive end date for a challenge starting on `startDateStr`
 * spanning `durationDays`.
 *
 * Example:
 * Start Date: 2026-10-14, Duration: 7 days
 * Day 1 = 2026-10-14
 * Day 2 = 2026-10-15
 * Day 3 = 2026-10-16
 * Day 4 = 2026-10-17
 * Day 5 = 2026-10-18
 * Day 6 = 2026-10-19
 * Day 7 = 2026-10-20 -> End Date = 2026-10-20
 */
export function calculateEndDate(startDateStr: string, durationDays: number): string {
  const startDate = parseLocalDateString(startDateStr);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (durationDays - 1));
  return formatLocalDateString(endDate);
}

/**
 * Generate the array of initial DayRecords for a challenge.
 */
export function generateChallengeDays(startDateStr: string, durationDays: number): DayRecord[] {
  const startDate = parseLocalDateString(startDateStr);
  const days: DayRecord[] = [];

  for (let i = 0; i < durationDays; i++) {
    const scheduledDate = new Date(startDate);
    scheduledDate.setDate(startDate.getDate() + i);
    days.push({
      dayNumber: i + 1,
      scheduledDate: formatLocalDateString(scheduledDate),
      isCompleted: false,
    });
  }

  return days;
}

/**
 * Formats a 'YYYY-MM-DD' string into readable date string: '14 Oct 2026'
 */
export function formatDisplayDate(dateStr: string, includeDayOfWeek = false): string {
  if (!dateStr) return '';
  const date = parseLocalDateString(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeDayOfWeek ? { weekday: 'short' } : {}),
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats a short day/month: 'Oct 14'
 */
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseLocalDateString(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Determine the status of a specific day record relative to today.
 */
export function getDayStatus(dayRecord: DayRecord, todayStr: string): DayStatus {
  if (dayRecord.isCompleted) {
    return 'completed';
  }
  if (dayRecord.scheduledDate === todayStr) {
    return 'eligible';
  }
  if (dayRecord.scheduledDate < todayStr) {
    return 'missed';
  }
  return 'upcoming';
}

/**
 * Calculate the current challenge day number based on today's date.
 * Returns null if today is before the start date, or capped at duration if past the end date.
 */
export function getCurrentChallengeDayNumber(
  startDateStr: string,
  durationDays: number,
  todayStr: string
): { currentDayNumber: number | null; isBeforeStart: boolean; isAfterEnd: boolean } {
  if (todayStr < startDateStr) {
    return { currentDayNumber: null, isBeforeStart: true, isAfterEnd: false };
  }
  
  const start = parseLocalDateString(startDateStr);
  const today = parseLocalDateString(todayStr);
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayNumber = diffDays + 1;

  if (dayNumber > durationDays) {
    return { currentDayNumber: durationDays, isBeforeStart: false, isAfterEnd: true };
  }

  return { currentDayNumber: dayNumber, isBeforeStart: false, isAfterEnd: false };
}
