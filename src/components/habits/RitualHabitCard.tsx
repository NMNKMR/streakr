import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
  getIntervalReminderCount,
  getIntervalScheduleShort,
  getPrimaryScheduleLabel,
  getWeekdayDots,
} from "@/lib/habits/display";
import { getDisplayStreak } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";

type RitualHabitCardProps = {
  habit: Habit;
  today: string;
};

type MetaChipProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accent?: boolean;
};

function MetaChip({ icon, label, accent = false }: MetaChipProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: accent ? `${colors.primaryContainer}22` : colors.glassSurface,
          borderColor: accent ? `${colors.primaryContainer}55` : colors.glassBorder,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={11}
        color={accent ? colors.primary : colors.textMuted}
      />
      <Text
        style={[
          typography.labelXs,
          { color: accent ? colors.primary : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

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
              <Text style={[typography.labelMd, { color: colors.onSurface }]} numberOfLines={1}>
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
                  {streak > 0 ? (
                    <MetaChip icon="flame" label={String(streak)} accent />
                  ) : null}
                </View>
              ) : habit.recurrence.kind === "interval" ? (
                <View style={styles.intervalMeta}>
                  <Text
                    style={[typography.labelSm, styles.intervalSchedule, { color: colors.textMuted }]}
                    numberOfLines={1}
                  >
                    {getIntervalScheduleShort(habit.recurrence)}
                  </Text>
                  <View style={styles.chipRow}>
                    <MetaChip
                      icon="notifications-outline"
                      label={`${getIntervalReminderCount(habit.recurrence)}/day`}
                    />
                    {streak > 0 ? (
                      <MetaChip icon="flame" label={String(streak)} accent />
                    ) : null}
                  </View>
                </View>
              ) : (
                <View style={styles.metaRow}>
                  <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                    {getPrimaryScheduleLabel(habit)}
                  </Text>
                  {streak > 0 ? (
                    <MetaChip icon="flame" label={String(streak)} accent />
                  ) : null}
                </View>
              )}
            </View>

            <View style={[styles.chevron, { borderColor: colors.glassBorder }]}>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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
    gap: 4,
  },
  intervalMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  intervalSchedule: {
    flexShrink: 1,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  weekdayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  weekdayDot: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
