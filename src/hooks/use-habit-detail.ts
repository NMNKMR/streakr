import {
  getCompletionHistory,
  getCompletionsForDate,
  getHabitById,
  getSkipHistory,
  getSkipsForDate,
} from "@/lib/habits/storage";
import { habitKeys } from "@/lib/habits/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useHabitDetail(id: string | undefined) {
  return useQuery({
    queryKey: habitKeys.detail(id ?? ""),
    queryFn: () => {
      if (!id) return null;
      return getHabitById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCompletionHistory(id: string | undefined) {
  return useQuery({
    queryKey: habitKeys.completions(id ?? ""),
    queryFn: () => {
      if (!id) return [];
      return getCompletionHistory(id);
    },
    enabled: Boolean(id),
  });
}

export function useCompletionsForDate(
  id: string | undefined,
  dateKey: string,
) {
  return useQuery({
    queryKey: habitKeys.completionsForDate(id ?? "", dateKey),
    queryFn: () => {
      if (!id) return [];
      return getCompletionsForDate(id, dateKey);
    },
    enabled: Boolean(id),
  });
}

export function useSkipHistory(id: string | undefined) {
  return useQuery({
    queryKey: habitKeys.skips(id ?? ""),
    queryFn: () => {
      if (!id) return [];
      return getSkipHistory(id);
    },
    enabled: Boolean(id),
  });
}

export function useSkipsForDate(id: string | undefined, dateKey: string) {
  return useQuery({
    queryKey: habitKeys.skipsForDate(id ?? "", dateKey),
    queryFn: () => {
      if (!id) return [];
      return getSkipsForDate(id, dateKey);
    },
    enabled: Boolean(id),
  });
}
