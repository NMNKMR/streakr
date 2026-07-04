import type { NotificationPayload } from "@/lib/habits/types";
import { parseNotificationPayload, registerTapHandler } from "@/lib/notifications/setup";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

function navigateToHabit(
  router: ReturnType<typeof useRouter>,
  payload: NotificationPayload,
) {
  router.push(`/habit/${payload.habitId}`);
}

export function useNotificationHandler() {
  const router = useRouter();
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const subscription = registerTapHandler((payload) => {
      navigateToHabit(router, payload);
    });

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    if (!lastResponse) return;
    if (
      lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      return;
    }

    const payload = parseNotificationPayload(
      lastResponse.notification.request.content.data as Record<string, unknown>,
    );
    if (!payload) return;

    navigateToHabit(router, payload);
    void Notifications.clearLastNotificationResponse();
  }, [lastResponse, router]);
}
