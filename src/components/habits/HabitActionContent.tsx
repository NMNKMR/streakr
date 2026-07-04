import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
  useCompletionsForDate,
  useHabitDetail,
  useSkipsForDate,
} from "@/hooks/use-habit-detail";
import {
  useMarkNextOccurrenceDone,
  useStartSession,
  useStopSession,
} from "@/hooks/use-habits";
import {
  getHabitScheduleDetail,
  getNextReminderLabel,
  getRecurrenceKindLabel,
  getTodaySectionMeta,
} from "@/lib/habits/display";
import { todayDateKey } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HabitActionContentProps = {
  habitId: string;
};

type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: boolean;
};

function DetailRow({ icon, label, value, accent = false }: DetailRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.detailRow}>
      <View
        style={[
          styles.detailIcon,
          {
            backgroundColor: accent ? `${colors.primaryContainer}22` : colors.glassSurface,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={accent ? colors.primaryContainer : colors.textMuted}
        />
      </View>
      <View style={styles.detailCopy}>
        <Text style={[typography.labelXs, { color: colors.textSubtle }]}>{label}</Text>
        <Text
          style={[
            typography.bodyMd,
            { color: accent ? colors.primary : colors.onSurface },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function getPrimaryAction(habit: Habit, complete: boolean) {
  if (complete) {
    return { label: "All done today", disabled: true, kind: "done" as const };
  }
  if (habit.isActive) {
    return { label: "Finish Session", disabled: false, kind: "finish" as const };
  }
  if (habit.durationMinutes != null) {
    return { label: "Start Session", disabled: false, kind: "start" as const };
  }
  if (habit.recurrence.kind === "interval") {
    return { label: "Log +1", disabled: false, kind: "log" as const };
  }
  return { label: "Mark Done", disabled: false, kind: "mark" as const };
}

export function HabitActionContent({ habitId }: HabitActionContentProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const today = todayDateKey();

  const { data: habit, isLoading } = useHabitDetail(habitId);
  const { data: completions = [] } = useCompletionsForDate(habitId, today);
  const { data: skips = [] } = useSkipsForDate(habitId, today);

  const markNext = useMarkNextOccurrenceDone();
  const startSession = useStartSession();
  const stopSession = useStopSession();

  const isPending =
    markNext.isPending || startSession.isPending || stopSession.isPending;

  if (isLoading || !habit) {
    return (
      <ScreenBackground>
        <View style={[styles.center, { paddingTop: insets.top }]}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
              Habit not found.
            </Text>
          )}
        </View>
      </ScreenBackground>
    );
  }

  const meta = getTodaySectionMeta(habit, today, completions, skips);
  const action = getPrimaryAction(habit, meta.complete);
  const nextReminder = getNextReminderLabel(habit, today, completions, skips);
  const scheduleDetail = getHabitScheduleDetail(habit);

  const runPrimaryAction = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (action.kind === "finish") {
      stopSession.mutate(habit.id, { onSuccess: () => router.back() });
      return;
    }
    if (action.kind === "start") {
      startSession.mutate(habit.id);
      return;
    }
    markNext.mutate(
      { habitId: habit.id, dateKey: today },
      { onSuccess: () => router.back() },
    );
  };

  const detailRows: ReactNode[] = [];

  if (meta.complete) {
    detailRows.push(
      <DetailRow
        key="complete"
        icon="checkmark-circle"
        label="Today"
        value="All scheduled occurrences complete"
        accent
      />,
    );
  } else {
    detailRows.push(
      <DetailRow
        key="next"
        icon="alarm-outline"
        label="Next reminder"
        value={nextReminder}
      />,
    );
  }

  detailRows.push(
    <DetailRow
      key="schedule"
      icon="calendar-outline"
      label="Schedule"
      value={scheduleDetail}
    />,
  );

  if (meta.streak > 0) {
    detailRows.push(
      <DetailRow
        key="streak"
        icon="flame"
        label="Current streak"
        value={`${meta.streak} day${meta.streak === 1 ? "" : "s"}`}
        accent
      />,
    );
  }

  if (meta.progress) {
    detailRows.push(
      <DetailRow
        key="progress"
        icon="stats-chart-outline"
        label="Today's progress"
        value={meta.progress}
      />,
    );
  }

  if (habit.isActive) {
    detailRows.push(
      <DetailRow
        key="session"
        icon="timer-outline"
        label="Session"
        value={
          habit.durationMinutes != null
            ? `In progress · ${habit.durationMinutes} min habit`
            : "In progress"
        }
        accent
      />,
    );
  }

  return (
    <ScreenBackground>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[typography.labelMd, styles.headerTitle, { color: colors.onBackground }]}>
          Quick Action
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.emojiWrap, { backgroundColor: colors.glassSurface }]}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
          </View>
          <Text style={[typography.headlineMd, styles.name, { color: colors.onBackground }]}>
            {habit.name}
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
            {getRecurrenceKindLabel(habit.recurrence.kind)}
          </Text>
        </View>

        <GlassCard style={styles.metaCard}>
          <View style={styles.detailList}>{detailRows}</View>
        </GlassCard>

        <View style={styles.actionBlock}>
          {!meta.complete ? (
            <GradientButton
              label={action.label}
              onPress={runPrimaryAction}
              loading={isPending}
              disabled={action.disabled}
            />
          ) : (
            <Pressable
              onPress={() => router.back()}
              style={[styles.secondaryButton, { borderColor: colors.glassBorder }]}
            >
              <Text style={[typography.labelMd, { color: colors.primary }]}>Back to Today</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => router.push(`/edit/${habit.id}`)}
          style={({ pressed }) => [
            styles.editButton,
            {
              borderColor: colors.primary,
              backgroundColor: colors.glassSurface,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={[typography.labelMd, { color: colors.primary }]}>Edit Habit</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.marginMobile,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: spacing.marginMobile,
  },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  emojiWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 44,
  },
  name: {
    textAlign: "center",
  },
  metaCard: {
    marginBottom: spacing.lg,
  },
  detailList: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  detailCopy: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  actionBlock: {
    marginTop: spacing.sm,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
});
