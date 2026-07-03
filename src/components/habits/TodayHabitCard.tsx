import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { getTodaySectionMeta } from "@/lib/habits/display";
import type { CompletionRecord, Habit, SkipRecord } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StreakBadge } from "@/components/habits/StreakBadge";
import { GlassCard } from "@/components/ui/GlassCard";

type TodayHabitCardProps = {
  habit: Habit;
  today: string;
  completions: CompletionRecord[];
  skips: SkipRecord[];
  onMarkNext: () => void;
  onStartSession: () => void;
  onStopSession: () => void;
};

export function TodayHabitCard({
  habit,
  today,
  completions,
  skips,
  onMarkNext,
  onStartSession,
  onStopSession,
}: TodayHabitCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const meta = getTodaySectionMeta(habit, today, completions, skips);

  const renderAction = () => {
    if (meta.complete) {
      return (
        <View style={[styles.ghostButton, { backgroundColor: colors.glassSurface }]}>
          <Text style={[typography.labelSm, { color: colors.textSubtle }]}>Done</Text>
        </View>
      );
    }

    if (habit.isActive) {
      return (
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onStopSession();
          }}
          style={[styles.ghostButton, { backgroundColor: colors.glassSurface }]}
        >
          <Text style={[typography.labelSm, { color: colors.tertiaryContainer }]}>
            Finish
          </Text>
        </Pressable>
      );
    }

    if (habit.durationMinutes != null) {
      return (
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onStartSession();
          }}
          style={[styles.startButton, { borderColor: colors.primaryContainer }]}
        >
          <Text style={[typography.labelSm, { color: colors.primaryContainer }]}>
            START
          </Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onMarkNext();
        }}
        style={({ pressed }) => [
          styles.plusShadow,
          {
            opacity: pressed ? 0.9 : 1,
            shadowColor: colors.primaryContainer,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primaryContainer, colors.tertiaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.plusButton}
        >
          <Ionicons name="add" size={22} color={colors.onPrimary} />
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Pressable
          style={styles.contentPressable}
          onPress={() => router.push(`/habit/${habit.id}`)}
        >
          <View style={[styles.emojiWrap, { backgroundColor: colors.glassSurface }]}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[typography.labelMd, { color: colors.onSurface }]}>
                {habit.name}
              </Text>
              <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                {meta.scheduleLabel}
              </Text>
            </View>

            <StreakBadge streak={meta.streak} />

            {meta.progress ? (
              <Text style={[typography.labelSm, { color: colors.secondaryContainer, marginTop: 4 }]}>
                {meta.progress}
              </Text>
            ) : null}

            {habit.isActive ? (
              <View style={styles.progressRow}>
                <Ionicons name="sync-outline" size={12} color={colors.tertiaryContainer} />
                <Text style={[typography.labelXs, { color: colors.tertiaryContainer }]}>
                  IN PROGRESS
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>

        {renderAction()}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  contentPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  plusShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButton: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    minWidth: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
