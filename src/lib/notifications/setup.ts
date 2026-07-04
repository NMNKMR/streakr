import type { NotificationPayload } from "@/lib/habits/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATION_CHANNEL_ID = "default";

export function parseNotificationPayload(
  data: Record<string, unknown> | undefined,
): NotificationPayload | null {
  if (!data) return null;

  const { screen, habitId } = data;
  if (screen !== "/habit" || typeof habitId !== "string" || !habitId) {
    return null;
  }

  return { screen: "/habit", habitId };
}

/**
 * Ensures the Android notification channel exists before permission prompts or scheduling.
 * On iOS this is a no-op.
 */
export async function createAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: "Habit Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF7A00",
    enableVibrate: true,
    showBadge: true,
  });
}

/**
 * Shows notification banners while the app is in the foreground.
 * Must be registered before any notifications are scheduled.
 */
export function registerForegroundHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Listens for notification taps (warm start). Returns a subscription — caller must
 * remove it on unmount. Cold-launch taps are handled separately via
 * getLastNotificationResponseAsync in the notification handler hook (Step 4).
 */
export function registerTapHandler(
  callback: (payload: NotificationPayload) => void,
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const payload = parseNotificationPayload(
      response.notification.request.content.data as Record<string, unknown>,
    );
    if (payload) callback(payload);
  });
}
