import { addDays as fnsAddDays, format, getDay, parseISO } from "date-fns";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function toDateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}

export function addDays(dateKey: string, days: number): string {
  return format(
    fnsAddDays(parseISO(`${dateKey}T12:00:00`), days),
    DATE_KEY_FORMAT,
  );
}

/** 0 = Sunday, matching JS Date.getDay(). */
export function getWeekday(dateKey: string): number {
  return getDay(parseISO(`${dateKey}T12:00:00`));
}

export function todayDateKey(): string {
  return toDateKey(new Date());
}
