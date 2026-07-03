import { HabitsEmptyState } from "@/components/habits/HabitsEmptyState";
import { RitualHabitCard } from "@/components/habits/RitualHabitCard";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useHabits } from "@/hooks/use-habits";
import { groupHabitsByKind } from "@/lib/habits/display";
import { todayDateKey } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HabitSection({
  title,
  habits,
  today,
}: {
  title: string;
  habits: Habit[];
  today: string;
}) {
  const { colors } = useTheme();

  if (habits.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[typography.labelSm, styles.sectionTitle, { color: colors.textSubtle }]}>
          {title}
        </Text>
        <Text style={[typography.labelXs, { color: colors.textSubtle }]}>
          {habits.length} {habits.length === 1 ? "Habit" : "Habits"}
        </Text>
      </View>
      {habits.map((habit) => (
        <RitualHabitCard key={habit.id} habit={habit} today={today} />
      ))}
    </View>
  );
}

export default function HabitsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const today = todayDateKey();
  const { data: habits = [], isLoading } = useHabits();
  const grouped = groupHabitsByKind(habits);

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
          <Text style={[typography.headlineLgMobile, { color: colors.onBackground }]}>
            Your Rituals
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
            Build your best self.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : habits.length === 0 ? (
          <HabitsEmptyState />
        ) : (
          <>
            <HabitSection title="DAILY" habits={grouped.daily} today={today} />
            <HabitSection title="WEEKLY" habits={grouped.weekly} today={today} />
            <HabitSection title="INTERVAL" habits={grouped.interval} today={today} />
          </>
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
    marginBottom: spacing.xxl,
    gap: 4,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
