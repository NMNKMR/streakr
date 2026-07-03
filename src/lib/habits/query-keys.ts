export const habitKeys = {
  all: ["habits"] as const,
  detail: (id: string) => ["habit", id] as const,
  completions: (id: string) => ["completions", id] as const,
  completionsForDate: (id: string, date: string) =>
    ["completions", id, date] as const,
  skips: (id: string) => ["skips", id] as const,
  skipsForDate: (id: string, date: string) => ["skips", id, date] as const,
};
