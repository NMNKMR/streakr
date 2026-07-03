import { HabitsEmptyState } from "@/components/habits/HabitsEmptyState";
import { TodayHabitCard } from "@/components/habits/TodayHabitCard";
import { PermissionBanner } from "@/components/notifications/PermissionBanner";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCompletionsForDate, useSkipsForDate } from "@/hooks/use-habit-detail";
import {
  useHabits,
  useMarkNextOccurrenceDone,
  useStartSession,
  useStopSession,
} from "@/hooks/use-habits";
import { formatDateHeader, getGreeting, getSectionBadge, groupHabitsByKind } from "@/lib/habits/display";
import { getExpectedOccurrenceCount, isDaySkipped, todayDateKey } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TodayHabitRow({ habit, today }: { habit: Habit; today: string }) {
  const { data: completions = [] } = useCompletionsForDate(habit.id, today);
  const { data: skips = [] } = useSkipsForDate(habit.id, today);
  const markNext = useMarkNextOccurrenceDone();
  const startSession = useStartSession();
  const stopSession = useStopSession();

  if (isDaySkipped(skips, today)) return null;

  return (
    <TodayHabitCard
      habit={habit}
      today={today}
      completions={completions}
      skips={skips}
      onMarkNext={() => markNext.mutate({ habitId: habit.id, dateKey: today })}
      onStartSession={() => startSession.mutate(habit.id)}
      onStopSession={() => stopSession.mutate(habit.id)}
    />
  );
}

export default function TodayScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const today = todayDateKey();
  const now = new Date();
  const { data: habits = [], isLoading } = useHabits();

  const todayHabits = habits.filter(
    (habit) => getExpectedOccurrenceCount(habit.recurrence, today) > 0,
  );

  const handleCalendarPress = () => {
    // TODO(calendar-view): open habit calendar modal/screen
  };

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
        <ScreenHeader onCalendarPress={handleCalendarPress} />

        <View style={styles.hero}>
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
            {getGreeting(now)}
          </Text>
          <Text style={[typography.headlineLgMobile, { color: colors.onBackground }]}>
            Streakr
          </Text>
        </View>

        <PermissionBanner />

        <View style={styles.sectionHeader}>
          <Text style={[typography.headlineMd, { color: colors.onSurface }]}>
            Today&apos;s Focus
          </Text>
          <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
            {formatDateHeader(now)}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : todayHabits.length === 0 ? (
          <HabitsEmptyState
            title="Nothing due today"
            description="Create a habit or check back on scheduled days. Your rituals will appear here when they're due."
            ctaLabel="Create Habit"
          />
        ) : (
          todayHabits.map((habit) => (
            <TodayHabitRow key={habit.id} habit={habit} today={today} />
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.marginMobile,
  },
  hero: {
    marginBottom: spacing.lg,
    gap: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
});
