import { addDays, getWeekday } from "./dates";
import type { CompletionRecord, Habit, Recurrence, SkipRecord, TimeOfDay } from "./types";

function timeToMinutes(time: TimeOfDay): number {
  return time.hour * 60 + time.minute;
}

function minutesToTime(minutes: number): TimeOfDay {
  return {
    hour: Math.floor(minutes / 60) % 24,
    minute: minutes % 60,
  };
}

export function expandIntervalTimes(
  recurrence: Extract<Recurrence, { kind: "interval" }>,
): TimeOfDay[] {
  const start = timeToMinutes(recurrence.windowStart);
  const end = timeToMinutes(recurrence.windowEnd);
  const times: TimeOfDay[] = [];

  for (let minutes = start; minutes <= end; minutes += recurrence.everyMinutes) {
    times.push(minutesToTime(minutes));
  }

  return times;
}

function occursOnWeekday(recurrence: Recurrence, dateKey: string): boolean {
  if (recurrence.kind === "daily") return true;
  return recurrence.weekdays.includes(getWeekday(dateKey));
}

export function isDaySkipped(
  skips: SkipRecord[],
  dateKey: string,
): boolean {
  return skips.some((skip) => skip.skippedDate === dateKey);
}

export function isWholeDaySkipped(
  skips: SkipRecord[],
  dateKey: string,
): boolean {
  return skips.some(
    (skip) => skip.skippedDate === dateKey && skip.occurrenceIndex === null,
  );
}

export function isOccurrenceSkipped(
  skips: SkipRecord[],
  dateKey: string,
  occurrenceIndex: number,
): boolean {
  if (isWholeDaySkipped(skips, dateKey)) return true;
  return skips.some(
    (skip) =>
      skip.skippedDate === dateKey && skip.occurrenceIndex === occurrenceIndex,
  );
}

export function getExpectedOccurrences(
  recurrence: Recurrence,
  dateKey: string,
): TimeOfDay[] {
  if (!occursOnWeekday(recurrence, dateKey)) return [];

  switch (recurrence.kind) {
    case "daily":
      return recurrence.times;
    case "weekly":
      return recurrence.times;
    case "interval":
      return expandIntervalTimes(recurrence);
  }
}

export function getExpectedOccurrenceCount(
  recurrence: Recurrence,
  dateKey: string,
): number {
  return getExpectedOccurrences(recurrence, dateKey).length;
}

export function isDayComplete(
  recurrence: Recurrence,
  dateKey: string,
  completions: CompletionRecord[],
  skips: SkipRecord[] = [],
): boolean {
  if (isDaySkipped(skips, dateKey)) return false;

  const expectedCount = getExpectedOccurrenceCount(recurrence, dateKey);
  if (expectedCount === 0) return false;

  const completedIndices = new Set(
    completions
      .filter((completion) => completion.completedDate === dateKey)
      .map((completion) => completion.occurrenceIndex),
  );

  for (let index = 0; index < expectedCount; index += 1) {
    if (!completedIndices.has(index)) return false;
  }

  return true;
}

export function isCompletedToday(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
  skips: SkipRecord[] = [],
): boolean {
  return isDayComplete(habit.recurrence, today, completions, skips);
}

export function isDueToday(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
  skips: SkipRecord[] = [],
): boolean {
  if (isDaySkipped(skips, today)) return false;

  const expectedCount = getExpectedOccurrenceCount(habit.recurrence, today);
  if (expectedCount === 0) return false;
  return !isDayComplete(habit.recurrence, today, completions, skips);
}

export function getNextPendingOccurrenceIndex(
  recurrence: Recurrence,
  dateKey: string,
  completions: CompletionRecord[],
  skips: SkipRecord[] = [],
): number | null {
  if (isDaySkipped(skips, dateKey)) return null;

  const expectedCount = getExpectedOccurrenceCount(recurrence, dateKey);
  const completedIndices = new Set(
    completions
      .filter((completion) => completion.completedDate === dateKey)
      .map((completion) => completion.occurrenceIndex),
  );

  for (let index = 0; index < expectedCount; index += 1) {
    if (completedIndices.has(index)) continue;
    if (isOccurrenceSkipped(skips, dateKey, index)) continue;
    return index;
  }

  return null;
}

export function computeStreakOnMark(
  habit: Habit,
  today: string,
  wasDayCompleteBefore: boolean,
  isDayCompleteAfter: boolean,
): { streak: number; lastCompletedISO: string } | null {
  if (!isDayCompleteAfter || wasDayCompleteBefore) return null;

  const yesterday = addDays(today, -1);
  const streak =
    habit.lastCompletedISO === yesterday ? habit.streak + 1 : 1;

  return { streak, lastCompletedISO: today };
}

export function getDisplayStreak(habit: Habit, today: string): number {
  if (!habit.lastCompletedISO) return 0;

  const yesterday = addDays(today, -1);
  if (
    habit.lastCompletedISO === today ||
    habit.lastCompletedISO === yesterday
  ) {
    return habit.streak;
  }

  return 0;
}

export { addDays, getWeekday, toDateKey, todayDateKey } from "./dates";
