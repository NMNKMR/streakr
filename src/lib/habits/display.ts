import { format } from "date-fns";
import { addDays } from "./dates";
import type { CompletionRecord, Habit, Recurrence, SkipRecord, TimeOfDay } from "./types";
import {
  getDisplayStreak,
  getExpectedOccurrenceCount,
  getExpectedOccurrences,
  isDayComplete,
  isDaySkipped,
} from "./streak";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;

export function formatTimeOfDay(time: TimeOfDay): string {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return format(date, "h:mm a");
}

export function formatDateHeader(date: Date): string {
  return format(date, "MMMM d").toUpperCase();
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 17) return "Good Afternoon,";
  return "Good Evening,";
}

export function getRecurrenceKindLabel(kind: Recurrence["kind"]): string {
  switch (kind) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "interval":
      return "Interval";
  }
}

export function getPrimaryScheduleLabel(habit: Habit): string {
  const { recurrence } = habit;
  switch (recurrence.kind) {
    case "daily":
      return recurrence.times[0]
        ? formatTimeOfDay(recurrence.times[0])
        : "Daily";
    case "weekly":
      return recurrence.times[0]
        ? formatTimeOfDay(recurrence.times[0])
        : "Weekly";
    case "interval":
      return `Every ${recurrence.everyMinutes / 60} hours (${formatTimeOfDay(recurrence.windowStart)} - ${formatTimeOfDay(recurrence.windowEnd)})`;
  }
}

export function getIntervalReminderCount(recurrence: Extract<Recurrence, { kind: "interval" }>): number {
  const start = recurrence.windowStart.hour * 60 + recurrence.windowStart.minute;
  const end = recurrence.windowEnd.hour * 60 + recurrence.windowEnd.minute;
  return Math.floor((end - start) / recurrence.everyMinutes) + 1;
}

/** Compact interval label for habit list cards, e.g. "Every 2h". */
export function getIntervalScheduleShort(
  recurrence: Extract<Recurrence, { kind: "interval" }>,
): string {
  const everyHours = recurrence.everyMinutes / 60;
  const unit =
    everyHours >= 1 && Number.isInteger(everyHours)
      ? `${everyHours}h`
      : `${recurrence.everyMinutes}m`;
  return `Every ${unit}`;
}

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getWeeklyDaysLabel(recurrence: Extract<Recurrence, { kind: "weekly" }>): string {
  return [...recurrence.weekdays]
    .sort((a, b) => a - b)
    .map((day) => WEEKDAY_NAMES[day])
    .join(", ");
}

export function getWeekdayDots(recurrence: Extract<Recurrence, { kind: "weekly" }>): boolean[] {
  return WEEKDAY_LABELS.map((_, index) => recurrence.weekdays.includes(index));
}

export function getTodayProgressLabel(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
): string | null {
  if (habit.recurrence.kind !== "interval") return null;
  const total = getExpectedOccurrenceCount(habit.recurrence, today);
  if (total === 0) return null;
  return `${completions.length} of ${total} done`;
}

/** Compact interval progress for inline card meta, e.g. "2/9". */
export function getTodayProgressShort(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
): string | null {
  if (habit.recurrence.kind !== "interval") return null;
  const total = getExpectedOccurrenceCount(habit.recurrence, today);
  if (total === 0) return null;
  return `${completions.length}/${total}`;
}

export function getNextOccurrenceTime(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
  skips: SkipRecord[],
): TimeOfDay | null {
  const occurrences = getExpectedOccurrences(habit.recurrence, today);
  const completed = new Set(
    completions
      .filter((item) => item.completedDate === today)
      .map((item) => item.occurrenceIndex),
  );

  for (let index = 0; index < occurrences.length; index += 1) {
    if (completed.has(index)) continue;
    if (skips.some((skip) => skip.skippedDate === today && skip.occurrenceIndex === index)) {
      continue;
    }
    return occurrences[index] ?? null;
  }

  return occurrences[0] ?? null;
}

/** Human-readable next reminder, including upcoming days when not scheduled today. */
export function getNextReminderLabel(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
  skips: SkipRecord[],
): string {
  const expectedToday = getExpectedOccurrenceCount(habit.recurrence, today);

  if (expectedToday > 0 && !isDayComplete(habit.recurrence, today, completions, skips)) {
    const pendingToday = getNextOccurrenceTime(habit, today, completions, skips);
    if (pendingToday) {
      return `Next at ${formatTimeOfDay(pendingToday)} today`;
    }
  }

  for (let offset = 0; offset <= 14; offset += 1) {
    const dateKey = addDays(today, offset);
    const occurrences = getExpectedOccurrences(habit.recurrence, dateKey);
    if (occurrences.length === 0) continue;

    const time =
      offset === 0
        ? getNextOccurrenceTime(habit, dateKey, completions, skips)
        : (occurrences[0] ?? null);
    if (!time) continue;

    const timeLabel = formatTimeOfDay(time);
    if (offset === 0) return `Next at ${timeLabel} today`;
    if (offset === 1) return `Next at ${timeLabel} tomorrow`;
    const dayName = format(new Date(`${dateKey}T12:00:00`), "EEEE");
    return `Next at ${timeLabel} on ${dayName}`;
  }

  return "No upcoming reminders";
}

export function getHabitScheduleDetail(habit: Habit): string {
  const { recurrence } = habit;
  switch (recurrence.kind) {
    case "daily":
      if (recurrence.times.length === 0) return "Daily";
      return recurrence.times.length > 1
        ? `Daily at ${recurrence.times.map(formatTimeOfDay).join(", ")}`
        : `Daily at ${formatTimeOfDay(recurrence.times[0])}`;
    case "weekly":
      if (recurrence.times.length === 0) {
        return getWeeklyDaysLabel(recurrence);
      }
      return `${getWeeklyDaysLabel(recurrence)} at ${formatTimeOfDay(recurrence.times[0])}`;
    case "interval":
      return `${getIntervalScheduleShort(recurrence)} (${formatTimeOfDay(recurrence.windowStart)} – ${formatTimeOfDay(recurrence.windowEnd)})`;
  }
}

export function shouldShowOnToday(
  habit: Habit,
  today: string,
  skips: SkipRecord[],
): boolean {
  if (isDaySkipped(skips, today)) return false;
  return getExpectedOccurrenceCount(habit.recurrence, today) > 0;
}

export function getTodaySectionMeta(
  habit: Habit,
  today: string,
  completions: CompletionRecord[],
  skips: SkipRecord[],
) {
  const expected = getExpectedOccurrenceCount(habit.recurrence, today);
  const complete = isDayComplete(habit.recurrence, today, completions, skips);
  const streak = getDisplayStreak(habit, today);
  const progress = getTodayProgressLabel(habit, today, completions);
  const progressShort = getTodayProgressShort(habit, today, completions);
  const nextTime = getNextOccurrenceTime(habit, today, completions, skips);

  return {
    expected,
    complete,
    streak,
    progress,
    progressShort,
    nextTime,
    scheduleLabel: nextTime ? formatTimeOfDay(nextTime) : getPrimaryScheduleLabel(habit),
  };
}

export function groupHabitsByKind(habits: Habit[]) {
  return {
    daily: habits.filter((habit) => habit.recurrence.kind === "daily"),
    weekly: habits.filter((habit) => habit.recurrence.kind === "weekly"),
    interval: habits.filter((habit) => habit.recurrence.kind === "interval"),
  };
}

export function getSectionBadge(
  habits: Habit[],
  today: string,
  getSkips: (habitId: string) => SkipRecord[],
  getCompletions: (habitId: string) => CompletionRecord[],
): string {
  let left = 0;
  let done = 0;

  habits.forEach((habit) => {
    const skips = getSkips(habit.id);
    const completions = getCompletions(habit.id);
    const expected = getExpectedOccurrenceCount(habit.recurrence, today);
    if (expected === 0 || isDaySkipped(skips, today)) return;

    if (isDayComplete(habit.recurrence, today, completions, skips)) {
      done += 1;
    } else {
      left += 1;
    }
  });

  if (left === 0 && done > 0) return `${done}/${done} Done`;
  if (done > 0) return `${done}/${done + left} Done`;
  return `${left} Left`;
}
