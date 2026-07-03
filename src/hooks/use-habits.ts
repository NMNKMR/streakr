import { queryClient } from "@/lib/queryClient";
import {
  deleteHabit,
  getHabits,
  markNextOccurrenceDone,
  markOccurrenceDone,
  saveHabit,
  skipDay,
  skipNextOccurrence,
  skipOccurrence,
  startHabitSession,
  stopHabitSession,
  updateHabit,
} from "@/lib/habits/storage";
import { habitKeys } from "@/lib/habits/query-keys";
import type { Habit } from "@/lib/habits/types";
import { useMutation, useQuery } from "@tanstack/react-query";

function invalidateHabitQueries(habitId?: string, dateKey?: string) {
  void queryClient.invalidateQueries({ queryKey: habitKeys.all });
  if (habitId) {
    void queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
    void queryClient.invalidateQueries({
      queryKey: habitKeys.completions(habitId),
    });
    void queryClient.invalidateQueries({ queryKey: habitKeys.skips(habitId) });
    if (dateKey) {
      void queryClient.invalidateQueries({
        queryKey: habitKeys.completionsForDate(habitId, dateKey),
      });
      void queryClient.invalidateQueries({
        queryKey: habitKeys.skipsForDate(habitId, dateKey),
      });
    }
  }
}

export function useHabits() {
  return useQuery({
    queryKey: habitKeys.all,
    queryFn: getHabits,
  });
}

export function useAddHabit() {
  return useMutation({
    mutationFn: async (habit: Habit) => {
      saveHabit(habit);
      // TODO(phase-4): scheduleHabitReminders(habit) — user-owned
    },
    onSuccess: () => invalidateHabitQueries(),
  });
}

export function useUpdateHabit() {
  return useMutation({
    mutationFn: async (habit: Habit) => {
      updateHabit(habit);
      // TODO(phase-4): rescheduleHabitReminders(habit) — user-owned
    },
    onSuccess: (_data, habit) => invalidateHabitQueries(habit.id),
  });
}

export function useDeleteHabit() {
  return useMutation({
    mutationFn: async (habit: Habit) => {
      // TODO(phase-4): cancelHabitReminders(habit.notificationIds) — user-owned
      deleteHabit(habit.id);
    },
    onSuccess: (_data, habit) => invalidateHabitQueries(habit.id),
  });
}

export function useMarkOccurrenceDone() {
  return useMutation({
    mutationFn: async ({
      habitId,
      dateKey,
      occurrenceIndex,
    }: {
      habitId: string;
      dateKey: string;
      occurrenceIndex: number;
    }) => {
      markOccurrenceDone(habitId, dateKey, occurrenceIndex);
    },
    onSuccess: (_data, { habitId, dateKey }) => {
      invalidateHabitQueries(habitId, dateKey);
    },
  });
}

export function useMarkNextOccurrenceDone() {
  return useMutation({
    mutationFn: async ({
      habitId,
      dateKey,
    }: {
      habitId: string;
      dateKey: string;
    }) => {
      markNextOccurrenceDone(habitId, dateKey);
    },
    onSuccess: (_data, { habitId, dateKey }) => {
      invalidateHabitQueries(habitId, dateKey);
    },
  });
}

export function useSkipOccurrence() {
  return useMutation({
    mutationFn: async ({
      habitId,
      dateKey,
      occurrenceIndex,
    }: {
      habitId: string;
      dateKey: string;
      occurrenceIndex: number;
    }) => {
      skipOccurrence(habitId, dateKey, occurrenceIndex);
    },
    onSuccess: (_data, { habitId, dateKey }) => {
      invalidateHabitQueries(habitId, dateKey);
    },
  });
}

export function useSkipNextOccurrence() {
  return useMutation({
    mutationFn: async ({
      habitId,
      dateKey,
    }: {
      habitId: string;
      dateKey: string;
    }) => {
      skipNextOccurrence(habitId, dateKey);
    },
    onSuccess: (_data, { habitId, dateKey }) => {
      invalidateHabitQueries(habitId, dateKey);
    },
  });
}

export function useSkipDay() {
  return useMutation({
    mutationFn: async ({
      habitId,
      dateKey,
    }: {
      habitId: string;
      dateKey: string;
    }) => {
      skipDay(habitId, dateKey);
    },
    onSuccess: (_data, { habitId, dateKey }) => {
      invalidateHabitQueries(habitId, dateKey);
    },
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: async (habitId: string) => {
      startHabitSession(habitId);
    },
    onSuccess: (_data, habitId) => invalidateHabitQueries(habitId),
  });
}

export function useStopSession() {
  return useMutation({
    mutationFn: async (habitId: string) => {
      stopHabitSession(habitId);
    },
    onSuccess: (_data, habitId) => invalidateHabitQueries(habitId),
  });
}
