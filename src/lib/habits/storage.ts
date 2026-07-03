import * as SQLite from "expo-sqlite";

import { todayDateKey } from "./dates";
import {
  computeStreakOnMark,
  getNextPendingOccurrenceIndex,
  isDayComplete,
  isDaySkipped,
  isOccurrenceSkipped,
  isWholeDaySkipped,
} from "./streak";
import {
  CompletionRecord,
  CompletionRow,
  Habit,
  HabitRow,
  SkipRecord,
  SkipRow,
  rowToCompletion,
  rowToHabit,
  rowToSkip,
} from "./types";

export const DATABASE_NAME = "streaks.db";
const DATABASE_VERSION = 2;

export const db = SQLite.openDatabaseSync(DATABASE_NAME);

type VersionRow = { user_version: number };

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function ensureSchema(): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS habits (
      id                TEXT    PRIMARY KEY NOT NULL,
      name              TEXT    NOT NULL,
      emoji             TEXT    NOT NULL,
      recurrence        TEXT    NOT NULL,
      duration_minutes  INTEGER,
      is_active         INTEGER NOT NULL DEFAULT 0,
      active_started_at TEXT,
      notification_ids  TEXT    NOT NULL DEFAULT '[]',
      streak            INTEGER NOT NULL DEFAULT 0,
      last_completed    TEXT,
      created_at        TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS completion_history (
      id               TEXT    PRIMARY KEY NOT NULL,
      habit_id         TEXT    NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      completed_date   TEXT    NOT NULL,
      completed_at     TEXT    NOT NULL,
      occurrence_index INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_completion_habit_date
      ON completion_history(habit_id, completed_date);
  `);
}

async function migrateToV2(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS skip_history (
      id               TEXT    PRIMARY KEY NOT NULL,
      habit_id         TEXT    NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      skipped_date     TEXT    NOT NULL,
      occurrence_index INTEGER,
      skipped_at       TEXT    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_skip_habit_date
      ON skip_history(habit_id, skipped_date);
  `);
}

export async function initDatabase(): Promise<void> {
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await ensureSchema();

  const row = await db.getFirstAsync<VersionRow>("PRAGMA user_version");
  const current = row?.user_version ?? 0;

  if (current < 2) {
    await migrateToV2();
    await db.execAsync(`PRAGMA user_version = 2`);
  }
}

function breakStreak(habitId: string): void {
  db.runSync(
    "UPDATE habits SET streak = 0, last_completed = NULL WHERE id = ?",
    [habitId],
  );
}

export function getHabits(): Habit[] {
  const rows = db.getAllSync<HabitRow>(
    "SELECT * FROM habits ORDER BY created_at DESC",
  );
  return rows.map(rowToHabit);
}

export function getHabitById(id: string): Habit | null {
  const row = db.getFirstSync<HabitRow>("SELECT * FROM habits WHERE id = ?", [
    id,
  ]);
  return row ? rowToHabit(row) : null;
}

export function saveHabit(habit: Habit): void {
  db.runSync(
    `INSERT INTO habits (
      id, name, emoji, recurrence, duration_minutes, is_active,
      active_started_at, notification_ids, streak, last_completed, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      habit.id,
      habit.name,
      habit.emoji,
      JSON.stringify(habit.recurrence),
      habit.durationMinutes,
      habit.isActive ? 1 : 0,
      habit.activeStartedAt,
      JSON.stringify(habit.notificationIds),
      habit.streak,
      habit.lastCompletedISO,
      habit.createdAt,
    ],
  );
}

export function updateHabit(habit: Habit): void {
  db.runSync(
    `UPDATE habits SET
      name = ?,
      emoji = ?,
      recurrence = ?,
      duration_minutes = ?,
      is_active = ?,
      active_started_at = ?,
      notification_ids = ?,
      streak = ?,
      last_completed = ?
    WHERE id = ?`,
    [
      habit.name,
      habit.emoji,
      JSON.stringify(habit.recurrence),
      habit.durationMinutes,
      habit.isActive ? 1 : 0,
      habit.activeStartedAt,
      JSON.stringify(habit.notificationIds),
      habit.streak,
      habit.lastCompletedISO,
      habit.id,
    ],
  );
}

export function deleteHabit(id: string): void {
  db.runSync("DELETE FROM habits WHERE id = ?", [id]);
}

export function updateNotificationIds(habitId: string, ids: string[]): void {
  db.runSync("UPDATE habits SET notification_ids = ? WHERE id = ?", [
    JSON.stringify(ids),
    habitId,
  ]);
}

export function getCompletionHistory(habitId: string): CompletionRecord[] {
  const rows = db.getAllSync<CompletionRow>(
    `SELECT * FROM completion_history
     WHERE habit_id = ?
     ORDER BY completed_at DESC`,
    [habitId],
  );
  return rows.map(rowToCompletion);
}

export function getCompletionsForDate(
  habitId: string,
  dateKey: string,
): CompletionRecord[] {
  const rows = db.getAllSync<CompletionRow>(
    `SELECT * FROM completion_history
     WHERE habit_id = ? AND completed_date = ?
     ORDER BY occurrence_index ASC`,
    [habitId, dateKey],
  );
  return rows.map(rowToCompletion);
}

export function getSkipHistory(habitId: string): SkipRecord[] {
  const rows = db.getAllSync<SkipRow>(
    `SELECT * FROM skip_history
     WHERE habit_id = ?
     ORDER BY skipped_at DESC`,
    [habitId],
  );
  return rows.map(rowToSkip);
}

export function getSkipsForDate(
  habitId: string,
  dateKey: string,
): SkipRecord[] {
  const rows = db.getAllSync<SkipRow>(
    `SELECT * FROM skip_history
     WHERE habit_id = ? AND skipped_date = ?
     ORDER BY skipped_at ASC`,
    [habitId, dateKey],
  );
  return rows.map(rowToSkip);
}

export function skipOccurrence(
  habitId: string,
  dateKey: string,
  occurrenceIndex: number,
): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);

  const skips = getSkipsForDate(habitId, dateKey);
  if (isDaySkipped(skips, dateKey)) return;
  if (isOccurrenceSkipped(skips, dateKey, occurrenceIndex)) return;

  const existingCompletion = db.getFirstSync<{ id: string }>(
    `SELECT id FROM completion_history
     WHERE habit_id = ? AND completed_date = ? AND occurrence_index = ?`,
    [habitId, dateKey, occurrenceIndex],
  );
  if (existingCompletion) return;

  db.runSync(
    `INSERT INTO skip_history (
      id, habit_id, skipped_date, occurrence_index, skipped_at
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      generateId(),
      habitId,
      dateKey,
      occurrenceIndex,
      new Date().toISOString(),
    ],
  );

  breakStreak(habitId);
}

export function skipDay(habitId: string, dateKey: string): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);

  const skips = getSkipsForDate(habitId, dateKey);
  if (isWholeDaySkipped(skips, dateKey)) return;

  db.runSync(
    `INSERT INTO skip_history (
      id, habit_id, skipped_date, occurrence_index, skipped_at
    ) VALUES (?, ?, ?, NULL, ?)`,
    [generateId(), habitId, dateKey, new Date().toISOString()],
  );

  breakStreak(habitId);
}

export function skipNextOccurrence(habitId: string, dateKey?: string): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);

  const today = dateKey ?? todayDateKey();
  const completions = getCompletionsForDate(habitId, today);
  const skips = getSkipsForDate(habitId, today);
  const nextIndex = getNextPendingOccurrenceIndex(
    habit.recurrence,
    today,
    completions,
    skips,
  );
  if (nextIndex == null) return;

  skipOccurrence(habitId, today, nextIndex);
}

export function markOccurrenceDone(
  habitId: string,
  dateKey: string,
  occurrenceIndex: number,
): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);

  const skips = getSkipsForDate(habitId, dateKey);
  if (isDaySkipped(skips, dateKey)) return;
  if (isOccurrenceSkipped(skips, dateKey, occurrenceIndex)) return;

  const existing = db.getFirstSync<{ id: string }>(
    `SELECT id FROM completion_history
     WHERE habit_id = ? AND completed_date = ? AND occurrence_index = ?`,
    [habitId, dateKey, occurrenceIndex],
  );
  if (existing) return;

  const completionsBefore = getCompletionsForDate(habitId, dateKey);
  const wasDayCompleteBefore = isDayComplete(
    habit.recurrence,
    dateKey,
    completionsBefore,
    skips,
  );

  db.runSync(
    `INSERT INTO completion_history (
      id, habit_id, completed_date, completed_at, occurrence_index
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      generateId(),
      habitId,
      dateKey,
      new Date().toISOString(),
      occurrenceIndex,
    ],
  );

  const completionsAfter = getCompletionsForDate(habitId, dateKey);
  const isDayCompleteAfter = isDayComplete(
    habit.recurrence,
    dateKey,
    completionsAfter,
    skips,
  );
  const streakUpdate = computeStreakOnMark(
    habit,
    dateKey,
    wasDayCompleteBefore,
    isDayCompleteAfter,
  );

  if (streakUpdate) {
    db.runSync(
      "UPDATE habits SET streak = ?, last_completed = ? WHERE id = ?",
      [streakUpdate.streak, streakUpdate.lastCompletedISO, habitId],
    );
  }
}

export function startHabitSession(habitId: string): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);
  if (habit.durationMinutes == null) {
    throw new Error("Cannot start session on a habit without duration");
  }
  if (habit.isActive) return;

  updateHabit({
    ...habit,
    isActive: true,
    activeStartedAt: new Date().toISOString(),
  });
}

export function stopHabitSession(habitId: string): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);
  if (!habit.isActive || !habit.activeStartedAt) return;

  const elapsedMs = Date.now() - new Date(habit.activeStartedAt).getTime();
  const elapsedMinutes = elapsedMs / (1000 * 60);
  const today = todayDateKey();

  updateHabit({
    ...habit,
    isActive: false,
    activeStartedAt: null,
  });

  if (
    habit.durationMinutes != null &&
    elapsedMinutes >= habit.durationMinutes
  ) {
    const completions = getCompletionsForDate(habitId, today);
    const skips = getSkipsForDate(habitId, today);
    const nextIndex = getNextPendingOccurrenceIndex(
      habit.recurrence,
      today,
      completions,
      skips,
    );
    if (nextIndex != null) {
      markOccurrenceDone(habitId, today, nextIndex);
    }
  }
}

export function markNextOccurrenceDone(habitId: string, dateKey?: string): void {
  const habit = getHabitById(habitId);
  if (!habit) throw new Error(`Habit not found: ${habitId}`);

  const today = dateKey ?? todayDateKey();
  const completions = getCompletionsForDate(habitId, today);
  const skips = getSkipsForDate(habitId, today);
  const nextIndex = getNextPendingOccurrenceIndex(
    habit.recurrence,
    today,
    completions,
    skips,
  );
  if (nextIndex == null) return;

  markOccurrenceDone(habitId, today, nextIndex);
}
