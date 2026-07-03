import { formatTimeOfDay, getIntervalReminderCount } from "./display";
import type { Habit, Recurrence, TimeOfDay } from "./types";
import { ALL_WEEKDAYS } from "./types";

export type RecurrenceKind = Recurrence["kind"];

export type HabitFormValues = {
  name: string;
  emoji: string;
  recurrenceKind: RecurrenceKind;
  weekdays: number[];
  times: TimeOfDay[];
  everyMinutes: number;
  windowStart: TimeOfDay;
  windowEnd: TimeOfDay;
  timedEnabled: boolean;
  durationMinutes: number;
};

export type HabitFormErrors = {
  name?: string;
  times?: string;
  weekdays?: string;
  window?: string;
};

export const DEFAULT_FORM_VALUES: HabitFormValues = {
  name: "",
  emoji: "✨",
  recurrenceKind: "daily",
  weekdays: [...ALL_WEEKDAYS],
  times: [{ hour: 8, minute: 0 }],
  everyMinutes: 120,
  windowStart: { hour: 8, minute: 0 },
  windowEnd: { hour: 20, minute: 0 },
  timedEnabled: false,
  durationMinutes: 30,
};

function timeToMinutes(time: TimeOfDay): number {
  return time.hour * 60 + time.minute;
}

export function habitToFormValues(habit: Habit): HabitFormValues {
  const base = {
    name: habit.name,
    emoji: habit.emoji,
    timedEnabled: habit.durationMinutes != null,
    durationMinutes: habit.durationMinutes ?? 30,
  };

  switch (habit.recurrence.kind) {
    case "daily":
      return {
        ...base,
        recurrenceKind: "daily",
        weekdays: [...ALL_WEEKDAYS],
        times: habit.recurrence.times.length
          ? habit.recurrence.times
          : [{ hour: 8, minute: 0 }],
        everyMinutes: 120,
        windowStart: { hour: 8, minute: 0 },
        windowEnd: { hour: 20, minute: 0 },
      };
    case "weekly":
      return {
        ...base,
        recurrenceKind: "weekly",
        weekdays: habit.recurrence.weekdays,
        times: habit.recurrence.times.length
          ? habit.recurrence.times
          : [{ hour: 8, minute: 0 }],
        everyMinutes: 120,
        windowStart: { hour: 8, minute: 0 },
        windowEnd: { hour: 20, minute: 0 },
      };
    case "interval":
      return {
        ...base,
        recurrenceKind: "interval",
        weekdays: habit.recurrence.weekdays,
        times: [{ hour: 8, minute: 0 }],
        everyMinutes: habit.recurrence.everyMinutes,
        windowStart: habit.recurrence.windowStart,
        windowEnd: habit.recurrence.windowEnd,
      };
  }
}

export function formValuesToRecurrence(values: HabitFormValues): Recurrence {
  switch (values.recurrenceKind) {
    case "daily":
      return { kind: "daily", times: values.times };
    case "weekly":
      return {
        kind: "weekly",
        weekdays: values.weekdays,
        times: values.times,
      };
    case "interval":
      return {
        kind: "interval",
        weekdays: values.weekdays,
        everyMinutes: values.everyMinutes,
        windowStart: values.windowStart,
        windowEnd: values.windowEnd,
      };
  }
}

export function validateFormValues(values: HabitFormValues): HabitFormErrors {
  const errors: HabitFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Give your habit a name";
  }

  if (values.recurrenceKind === "daily" || values.recurrenceKind === "weekly") {
    if (values.times.length === 0) {
      errors.times = "Add at least one reminder time";
    }
  }

  if (values.recurrenceKind === "weekly" || values.recurrenceKind === "interval") {
    if (values.weekdays.length === 0) {
      errors.weekdays = "Select at least one day";
    }
  }

  if (values.recurrenceKind === "interval") {
    if (timeToMinutes(values.windowEnd) <= timeToMinutes(values.windowStart)) {
      errors.window = "End time must be after start time";
    }
  }

  return errors;
}

export function getRemindersPreview(values: HabitFormValues): string {
  if (values.recurrenceKind === "interval") {
    const recurrence: Extract<Recurrence, { kind: "interval" }> = {
      kind: "interval",
      weekdays: values.weekdays,
      everyMinutes: values.everyMinutes,
      windowStart: values.windowStart,
      windowEnd: values.windowEnd,
    };
    const count = getIntervalReminderCount(recurrence);
    const everyHours = values.everyMinutes / 60;
    const everyLabel =
      everyHours >= 1 && Number.isInteger(everyHours)
        ? `${everyHours} hour${everyHours === 1 ? "" : "s"}`
        : `${values.everyMinutes} min`;
    return `${count} reminders per day · Every ${everyLabel} (${formatTimeOfDay(values.windowStart)} – ${formatTimeOfDay(values.windowEnd)})`;
  }

  if (values.recurrenceKind === "daily") {
    if (values.times.length === 1) {
      return `1 daily alert at ${formatTimeOfDay(values.times[0]!)}`;
    }
    return `${values.times.length} daily alerts`;
  }

  const dayCount = values.weekdays.length;
  return `${values.times.length} alert${values.times.length === 1 ? "" : "s"} on ${dayCount} day${dayCount === 1 ? "" : "s"}`;
}

export function buildHabitFromForm(values: HabitFormValues, existing?: Habit): Habit {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    name: values.name.trim(),
    emoji: values.emoji,
    recurrence: formValuesToRecurrence(values),
    durationMinutes: values.timedEnabled ? values.durationMinutes : null,
    isActive: existing?.isActive ?? false,
    activeStartedAt: existing?.activeStartedAt ?? null,
    notificationIds: existing?.notificationIds ?? [],
    streak: existing?.streak ?? 0,
    lastCompletedISO: existing?.lastCompletedISO ?? null,
    createdAt: existing?.createdAt ?? now,
  };
}

export function isEveryDaySelected(weekdays: number[]): boolean {
  return ALL_WEEKDAYS.every((day) => weekdays.includes(day));
}

export function sortTimes(times: TimeOfDay[]): TimeOfDay[] {
  return [...times].sort(
    (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute),
  );
}

export function timesEqual(a: TimeOfDay, b: TimeOfDay): boolean {
  return a.hour === b.hour && a.minute === b.minute;
}
