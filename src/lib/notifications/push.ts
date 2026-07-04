import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { requestNotificationPermission } from "./permissions";

export const PUSH_TOKEN_STORAGE_KEY = "@streakr/push_token";

export type PushRegistrationFailureReason =
  | "not_device"
  | "permission_denied"
  | "no_project_id"
  | "error";

export type PushRegistrationResult =
  | { ok: true; token: string }
  | { ok: false; reason: PushRegistrationFailureReason; message?: string };

function getExpoProjectId(): string | null {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  return typeof projectId === "string" && projectId.length > 0 ? projectId : null;
}

export async function getPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
}

export async function savePushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
}

export async function clearPushToken(): Promise<void> {
  await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
}

export function getPushRegistrationMessage(result: PushRegistrationResult): string {
  if (result.ok) return "Push token registered.";

  switch (result.reason) {
    case "not_device":
      return "Push tokens require a physical device.";
    case "permission_denied":
      return "Allow notifications to register for push.";
    case "no_project_id":
      return "Missing EAS project ID in app config.";
    case "error":
      return result.message ?? "Could not register push token.";
  }
}

/**
 * Requests permission if needed, fetches an Expo push token, and persists it.
 * Requires an EAS dev/production build on a physical device with push credentials configured.
 */
export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  if (!Device.isDevice) {
    return { ok: false, reason: "not_device" };
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    return { ok: false, reason: "permission_denied" };
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    return { ok: false, reason: "no_project_id" };
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await savePushToken(token);
    return { ok: true, token };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown push registration error";
    return { ok: false, reason: "error", message };
  }
}
