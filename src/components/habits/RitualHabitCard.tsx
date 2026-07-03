import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
  getIntervalReminderCount,
  getPrimaryScheduleLabel,
  getWeekdayDots,
} from "@/lib/habits/display";
import { getDisplayStreak } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StreakBadge } from "@/components/habits/StreakBadge";
import { GlassCard } from "@/components/ui/GlassCard";

type RitualHabitCardProps = {
  habit: Habit;
  today: string;
};

export function RitualHabitCard({ habit, today }: RitualHabitCardProps) {
  const { colors } = useTheme();
  const streak = getDisplayStreak(habit, today);

  return (
    <Link href={`/habit/${habit.id}`} asChild>
      <Pressable>
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.emojiWrap, { backgroundColor: colors.glassSurface }]}>
              <Text style={styles.emoji}>{habit.emoji}</Text>
            </View>

            <View style={styles.content}>
              <Text style={[typography.labelMd, { color: colors.onSurface }]}>
                {habit.name}
              </Text>

              {habit.recurrence.kind === "weekly" ? (
                <View style={styles.weekdayRow}>
                  {getWeekdayDots(habit.recurrence).map((active, index) => (
                    <View
                      key={`${habit.id}-day-${index}`}
                      style={[
                        styles.weekdayDot,
                        {
                          backgroundColor: active
                            ? colors.primaryContainer
                            : colors.glassSurface,
                          borderColor: active
                            ? colors.primaryContainer
                            : colors.glassBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.labelXs,
                          {
                            color: active ? colors.onPrimary : colors.textSubtle,
                          },
                        ]}
                      >
                        {["S", "M", "T", "W", "T", "F", "S"][index]}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: 4 }]}>
                    {getPrimaryScheduleLabel(habit)}
                  </Text>
                  {habit.recurrence.kind === "interval" ? (
                    <Text style={[typography.labelXs, { color: colors.primary, marginTop: 4 }]}>
                      {getIntervalReminderCount(habit.recurrence)} reminders/day
                    </Text>
                  ) : null}
                  <StreakBadge streak={streak} />
                </>
              )}
            </View>

            <View style={[styles.addGhost, { borderColor: colors.glassBorder }]}>
              <Ionicons name="add" size={20} color={colors.onSurface} />
            </View>
          </View>
        </GlassCard>
      </Pressable>
    </Link>
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
  weekdayRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: spacing.sm,
  },
  weekdayDot: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addGhost: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
