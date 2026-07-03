export type TimeOfDay = { hour: number; minute: number };

/** All seven weekdays (0 = Sunday). */
export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export type Recurrence =
  | { kind: "daily"; times: TimeOfDay[] }
  | { kind: "weekly"; weekdays: number[]; times: TimeOfDay[] }
  | {
      kind: "interval";
      weekdays: number[];
      everyMinutes: number;
      windowStart: TimeOfDay;
      windowEnd: TimeOfDay;
    };

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  recurrence: Recurrence;
  durationMinutes: number | null;
  isActive: boolean;
  activeStartedAt: string | null;
  notificationIds: string[];
  streak: number;
  lastCompletedISO: string | null;
  createdAt: string;
};

export type CompletionRecord = {
  id: string;
  habitId: string;
  completedDate: string;
  completedAt: string;
  occurrenceIndex: number;
};

/** `occurrenceIndex: null` means the entire day was skipped. */
export type SkipRecord = {
  id: string;
  habitId: string;
  skippedDate: string;
  occurrenceIndex: number | null;
  skippedAt: string;
};

export type NotificationPayload = {
  screen: "/habit";
  habitId: string;
};

export type HabitRow = {
  id: string;
  name: string;
  emoji: string;
  recurrence: string;
  duration_minutes: number | null;
  is_active: number;
  active_started_at: string | null;
  notification_ids: string;
  streak: number;
  last_completed: string | null;
  created_at: string;
};

export type CompletionRow = {
  id: string;
  habit_id: string;
  completed_date: string;
  completed_at: string;
  occurrence_index: number;
};

export type SkipRow = {
  id: string;
  habit_id: string;
  skipped_date: string;
  occurrence_index: number | null;
  skipped_at: string;
};

export function parseRecurrence(json: string): Recurrence {
  const parsed = JSON.parse(json) as Recurrence;
  if (parsed.kind === "interval" && !parsed.weekdays) {
    return { ...parsed, weekdays: [...ALL_WEEKDAYS] };
  }
  return parsed;
}

export const rowToHabit = (row: HabitRow): Habit => ({
  id: row.id,
  name: row.name,
  emoji: row.emoji,
  recurrence: parseRecurrence(row.recurrence),
  durationMinutes: row.duration_minutes,
  isActive: row.is_active === 1,
  activeStartedAt: row.active_started_at,
  notificationIds: JSON.parse(row.notification_ids) as string[],
  streak: row.streak,
  lastCompletedISO: row.last_completed,
  createdAt: row.created_at,
});

export const rowToCompletion = (row: CompletionRow): CompletionRecord => ({
  id: row.id,
  habitId: row.habit_id,
  completedDate: row.completed_date,
  completedAt: row.completed_at,
  occurrenceIndex: row.occurrence_index,
});

export const rowToSkip = (row: SkipRow): SkipRecord => ({
  id: row.id,
  habitId: row.habit_id,
  skippedDate: row.skipped_date,
  occurrenceIndex: row.occurrence_index,
  skippedAt: row.skipped_at,
});

export const habitToRow = (habit: Habit): HabitRow => ({
  id: habit.id,
  name: habit.name,
  emoji: habit.emoji,
  recurrence: JSON.stringify(habit.recurrence),
  duration_minutes: habit.durationMinutes,
  is_active: habit.isActive ? 1 : 0,
  active_started_at: habit.activeStartedAt,
  notification_ids: JSON.stringify(habit.notificationIds),
  streak: habit.streak,
  last_completed: habit.lastCompletedISO,
  created_at: habit.createdAt,
});
