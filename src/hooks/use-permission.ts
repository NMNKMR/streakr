import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  type NotificationPermissionStatus,
} from "@/lib/notifications/permissions";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

export type { NotificationPermissionStatus };

type HookPermissionStatus = NotificationPermissionStatus | "loading";

export function usePermission() {
  const [status, setStatus] = useState<HookPermissionStatus>("loading");

  const refresh = useCallback(async () => {
    setStatus(await getNotificationPermissionStatus());
  }, []);

  useEffect(() => {
    void refresh();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    setStatus(granted ? "granted" : await getNotificationPermissionStatus());
    return granted;
  }, []);

  const openSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return {
    status,
    isLoading: status === "loading",
    isGranted: status === "granted",
    isDenied: status === "denied",
    isUndetermined: status === "undetermined",
    requestPermission,
    openSettings,
    refresh,
  };
}
