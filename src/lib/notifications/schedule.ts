import { expandIntervalTimes } from "@/lib/habits/streak";
import type { Habit, Recurrence, TimeOfDay } from "@/lib/habits/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { NOTIFICATION_CHANNEL_ID } from "./setup";

/** Our weekdays are 0 = Sunday (JS). Expo weekly triggers use 1 = Sunday. */
function toExpoWeekday(weekday: number): number {
  return weekday + 1;
}

function buildNotificationContent(habit: Habit): Notifications.NotificationContentInput {
  return {
    title: `Time for ${habit.emoji} ${habit.name}`,
    body: "Tap to log it.",
    data: {
      screen: "/habit",
      habitId: habit.id,
    },
    ...(Platform.OS === "android" ? { channelId: NOTIFICATION_CHANNEL_ID } : {}),
  };
}

function withChannel<T extends Notifications.NotificationTriggerInput>(
  trigger: T,
): T {
  if (Platform.OS !== "android") return trigger;
  return { ...trigger, channelId: NOTIFICATION_CHANNEL_ID };
}

async function scheduleDaily(habit: Habit, time: TimeOfDay): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(habit),
    trigger: withChannel({
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: time.hour,
      minute: time.minute,
    }),
  });
}

async function scheduleWeekly(
  habit: Habit,
  weekday: number,
  time: TimeOfDay,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(habit),
    trigger: withChannel({
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: toExpoWeekday(weekday),
      hour: time.hour,
      minute: time.minute,
    }),
  });
}

async function scheduleForRecurrence(habit: Habit): Promise<string[]> {
  const { recurrence } = habit;
  const ids: string[] = [];

  switch (recurrence.kind) {
    case "daily":
      for (const time of recurrence.times) {
        ids.push(await scheduleDaily(habit, time));
      }
      break;

    case "weekly":
      for (const weekday of recurrence.weekdays) {
        for (const time of recurrence.times) {
          ids.push(await scheduleWeekly(habit, weekday, time));
        }
      }
      break;

    case "interval": {
      const times = expandIntervalTimes(recurrence);
      for (const weekday of recurrence.weekdays) {
        for (const time of times) {
          ids.push(await scheduleWeekly(habit, weekday, time));
        }
      }
      break;
    }
  }

  return ids;
}

export async function scheduleHabitReminders(habit: Habit): Promise<string[]> {
  return scheduleForRecurrence(habit);
}

export async function cancelHabitReminders(notificationIds: string[]): Promise<void> {
  await Promise.all(
    notificationIds.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // Already fired or cancelled — safe to ignore.
      }
    }),
  );
}

export async function rescheduleHabitReminders(habit: Habit): Promise<string[]> {
  await cancelHabitReminders(habit.notificationIds);
  return scheduleHabitReminders(habit);
}
