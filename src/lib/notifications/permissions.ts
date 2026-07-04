import { createAndroidChannel } from "@/lib/notifications/setup";
import * as Notifications from "expo-notifications";

export type NotificationPermissionStatus =
  | "granted"
  | "denied"
  | "undetermined";

export function normalizePermissionStatus(
  settings: Notifications.NotificationPermissionsStatus,
): NotificationPermissionStatus {
  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return "granted";
  }

  if (settings.status === Notifications.PermissionStatus.UNDETERMINED) {
    return "undetermined";
  }

  return "denied";
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  const settings = await Notifications.getPermissionsAsync();
  return normalizePermissionStatus(settings);
}

export async function requestNotificationPermission(): Promise<boolean> {
  await createAndroidChannel();

  const currentStatus = await getNotificationPermissionStatus();
  if (currentStatus === "granted") return true;

  const next = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowBadge: false,
    },
  });

  return normalizePermissionStatus(next) === "granted";
}
