import {
  getPushRegistrationMessage,
  getPushToken,
  registerForPushNotifications,
  type PushRegistrationResult,
} from "@/lib/notifications/push";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect } from "react";

const PUSH_TOKEN_QUERY_KEY = ["push-token"] as const;

export function usePushNotifications(options: { autoRegister?: boolean } = {}) {
  const { autoRegister = false } = options;
  const queryClient = useQueryClient();

  const tokenQuery = useQuery({
    queryKey: PUSH_TOKEN_QUERY_KEY,
    queryFn: getPushToken,
  });

  const registerMutation = useMutation({
    mutationFn: registerForPushNotifications,
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.setQueryData(PUSH_TOKEN_QUERY_KEY, result.token);
      }
    },
  });

  useEffect(() => {
    if (!autoRegister) return;
    registerMutation.mutate();
  }, [autoRegister]);

  const copyToken = useCallback(async () => {
    const token = tokenQuery.data;
    if (!token) return false;
    await Clipboard.setStringAsync(token);
    return true;
  }, [tokenQuery.data]);

  const registration: PushRegistrationResult | undefined = registerMutation.data;

  return {
    token: tokenQuery.data ?? null,
    isLoading: tokenQuery.isLoading,
    isRegistering: registerMutation.isPending,
    registration,
    registrationMessage: registration ? getPushRegistrationMessage(registration) : null,
    register: () => registerMutation.mutateAsync(),
    copyToken,
  };
}
