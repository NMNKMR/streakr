import { FormSectionLabel } from "@/components/ui/FormSectionLabel";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { usePermission } from "@/hooks/use-permission";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { getPushRegistrationMessage } from "@/lib/notifications/push";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEME_OPTIONS = ["system", "dark", "light"] as const;
const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

const THEME_ICONS: Record<(typeof THEME_OPTIONS)[number], keyof typeof Ionicons.glyphMap> = {
  system: "phone-portrait-outline",
  dark: "moon-outline",
  light: "sunny-outline",
};

function notificationStatusCopy(
  status: ReturnType<typeof usePermission>["status"],
): { label: string; detail: string; tone: "success" | "warning" | "error" | "neutral" } {
  switch (status) {
    case "loading":
      return {
        label: "Checking…",
        detail: "Reading notification permission from your device.",
        tone: "neutral",
      };
    case "granted":
      return {
        label: "Enabled",
        detail: "Reminders schedule when you save habits with times.",
        tone: "success",
      };
    case "undetermined":
      return {
        label: "Not enabled",
        detail: "Allow notifications to receive habit reminders.",
        tone: "warning",
      };
    case "denied":
      return {
        label: "Disabled",
        detail: "Enable notifications in system settings to get reminders.",
        tone: "error",
      };
  }
}

export default function SettingsScreen() {
  const { colors, mode, toggleTheme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    status,
    isLoading,
    isGranted,
    isDenied,
    isUndetermined,
    requestPermission,
    openSettings,
  } = usePermission();
  const {
    token: pushToken,
    isRegistering,
    registration,
    registrationMessage,
    register: registerPush,
    copyToken,
  } = usePushNotifications();
  const [copied, setCopied] = useState(false);

  const { label, detail, tone } = notificationStatusCopy(status);

  const statusColor =
    tone === "success"
      ? colors.primaryContainer
      : tone === "error"
        ? colors.error
        : tone === "warning"
          ? colors.warning
          : colors.textSubtle;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: spacing.bottomChromeHeight + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.headlineLgMobile, { color: colors.onBackground }]}>
          Settings
        </Text>
        <Text style={[typography.bodyMd, styles.subtitle, { color: colors.textMuted }]}>
          Tune Streakr to your rhythm.
        </Text>

        <FormSectionLabel>Appearance</FormSectionLabel>
        <GlassCard style={styles.card}>
          <View
            style={[
              styles.themeTrack,
              {
                backgroundColor: colors.glassSurface,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            {THEME_OPTIONS.map((option) => {
              const active = mode === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleTheme(option)}
                  style={styles.themeSegmentPressable}
                >
                  {active ? (
                    <LinearGradient
                      colors={[colors.primaryContainer, colors.tertiaryContainer]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.themeSegmentActive}
                    >
                      <Ionicons
                        name={THEME_ICONS[option]}
                        size={16}
                        color={colors.onPrimary}
                      />
                      <Text
                        style={[typography.labelSm, { color: colors.onPrimary, textTransform: "capitalize" }]}
                      >
                        {option}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.themeSegmentInactive}>
                      <Ionicons
                        name={THEME_ICONS[option]}
                        size={16}
                        color={colors.textMuted}
                      />
                      <Text
                        style={[typography.labelSm, { color: colors.textMuted, textTransform: "capitalize" }]}
                      >
                        {option}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
          <Text style={[typography.labelSm, styles.themeHint, { color: colors.textSubtle }]}>
            Active palette: {isDarkMode ? "dark" : "light"}
          </Text>
        </GlassCard>

        <FormSectionLabel>Notifications</FormSectionLabel>
        <GlassCard style={styles.card}>
          <View style={styles.notificationRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.glassSurface }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>

            <View style={styles.notificationCopy}>
              <Text style={[typography.labelMd, { color: colors.onSurface }]}>Reminders</Text>
              <Text style={[typography.bodyMd, { color: colors.textMuted }]}>{detail}</Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: `${statusColor}22` }]}>
              {isLoading ? (
                <ActivityIndicator size="small" color={statusColor} />
              ) : (
                <>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[typography.labelXs, { color: statusColor }]}>{label}</Text>
                </>
              )}
            </View>
          </View>

          {isUndetermined ? (
            <Pressable
              onPress={() => void requestPermission()}
              style={[styles.actionButton, { backgroundColor: colors.primaryContainer }]}
            >
              <Text style={[typography.labelMd, { color: colors.onPrimary }]}>
                Enable Notifications
              </Text>
            </Pressable>
          ) : null}

          {isDenied ? (
            <Pressable
              onPress={openSettings}
              style={[styles.actionButton, styles.actionButtonOutline, { borderColor: colors.glassBorder }]}
            >
              <Ionicons name="settings-outline" size={16} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary }]}>Open System Settings</Text>
            </Pressable>
          ) : null}

          {isGranted ? (
            <View style={[styles.grantedNote, { backgroundColor: colors.glassSurface }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primaryContainer} />
              <Text style={[typography.labelSm, { color: colors.textMuted, flex: 1 }]}>
                Local reminders are active on this device.
              </Text>
            </View>
          ) : null}
        </GlassCard>

        <FormSectionLabel>Push Token</FormSectionLabel>
        <GlassCard style={styles.card}>
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
            Copy this token to send a test push from{" "}
            <Text style={{ color: colors.primary }}>expo.dev/notifications</Text>.
          </Text>

          {pushToken ? (
            <View
              style={[
                styles.tokenBox,
                {
                  backgroundColor: colors.glassSurface,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <Text
                selectable
                style={[typography.labelSm, styles.tokenText, { color: colors.onSurface }]}
              >
                {pushToken}
              </Text>
            </View>
          ) : (
            <Text style={[typography.bodyMd, styles.tokenPlaceholder, { color: colors.textSubtle }]}>
              {isRegistering
                ? "Registering push token…"
                : registrationMessage ?? "No push token yet."}
            </Text>
          )}

          <View style={styles.pushActions}>
            <Pressable
              onPress={async () => {
                const ok = await copyToken();
                if (ok) {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              disabled={!pushToken}
              style={[
                styles.actionButton,
                styles.actionButtonOutline,
                {
                  borderColor: colors.glassBorder,
                  opacity: pushToken ? 1 : 0.45,
                  flex: 1,
                },
              ]}
            >
              <Ionicons
                name={copied ? "checkmark-outline" : "copy-outline"}
                size={16}
                color={colors.primary}
              />
              <Text style={[typography.labelMd, { color: colors.primary }]}>
                {copied ? "Copied" : "Copy Token"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void registerPush().then((result) => {
                  if (!result.ok) {
                    Alert.alert("Push registration failed", getPushRegistrationMessage(result));
                  }
                });
              }}
              disabled={isRegistering}
              style={[
                styles.actionButton,
                { backgroundColor: colors.primaryContainer, flex: 1 },
              ]}
            >
              {isRegistering ? (
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <>
                  <Ionicons name="refresh-outline" size={16} color={colors.onPrimary} />
                  <Text style={[typography.labelMd, { color: colors.onPrimary }]}>Refresh</Text>
                </>
              )}
            </Pressable>
          </View>

          {registration && !registration.ok ? (
            <Text style={[typography.labelSm, styles.pushError, { color: colors.error }]}>
              {registrationMessage}
            </Text>
          ) : null}
        </GlassCard>

        <FormSectionLabel>About</FormSectionLabel>
        <GlassCard style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Ionicons name="flame" size={28} color={colors.primaryContainer} />
            <View>
              <Text style={[typography.labelMd, { color: colors.onSurface }]}>Streakr</Text>
              <Text style={[typography.labelSm, { color: colors.textSubtle }]}>v{APP_VERSION}</Text>
            </View>
          </View>
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
            Build streaks, log habits, and stay on track — one tap at a time.
          </Text>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.marginMobile,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  themeTrack: {
    flexDirection: "row",
    borderRadius: radius.full,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  themeSegmentPressable: {
    flex: 1,
  },
  themeSegmentActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  themeSegmentInactive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  themeHint: {
    marginTop: spacing.sm,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationCopy: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    minWidth: 72,
    justifyContent: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  actionButton: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  actionButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  grantedNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  tokenBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tokenText: {
    fontFamily: "Inter_400Regular",
  },
  tokenPlaceholder: {
    marginTop: spacing.md,
  },
  pushActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pushError: {
    marginTop: spacing.sm,
  },
  aboutCard: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});
