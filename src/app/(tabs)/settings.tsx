import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";

const THEME_OPTIONS = ["system", "dark", "light"] as const;

export default function SettingsScreen() {
  const { colors, mode, toggleTheme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

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
      >
        <Text style={[typography.headlineLgMobile, { color: colors.onBackground }]}>
          Settings
        </Text>
        <Text style={[typography.bodyMd, { color: colors.textMuted, marginBottom: spacing.lg }]}>
          Tune Streakr to your rhythm.
        </Text>

        <GlassCard style={styles.card}>
          <Text style={[typography.labelMd, { color: colors.onSurface, marginBottom: spacing.sm }]}>
            Appearance
          </Text>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((option) => {
              const selected = mode === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleTheme(option)}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: selected
                        ? colors.primaryContainer
                        : colors.glassSurface,
                      borderColor: selected ? colors.primary : colors.glassBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: selected ? colors.onPrimary : colors.textMuted,
                        textTransform: "capitalize",
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[typography.labelSm, { color: colors.textSubtle, marginTop: spacing.sm }]}>
            Active palette: {isDarkMode ? "dark" : "light"}
          </Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[typography.labelMd, { color: colors.onSurface }]}>Notifications</Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: spacing.sm }]}>
            {/* TODO(phase-4): permission status + push token — user-owned */}
            Notification settings will appear here once the notification layer is wired up.
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
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  themeRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  themeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    borderWidth: 1,
  },
});
