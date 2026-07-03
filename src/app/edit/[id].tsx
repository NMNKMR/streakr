import { HabitForm } from "@/components/habits/HabitForm";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useDeleteHabit, useUpdateHabit } from "@/hooks/use-habits";
import { useHabitDetail } from "@/hooks/use-habit-detail";
import { useTheme } from "@/providers/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { data: habit, isLoading } = useHabitDetail(id);
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  if (isLoading || !habit) {
    return (
      <ScreenBackground>
        <View style={styles.center}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
              Habit not found
            </Text>
          )}
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <HabitForm
        mode="edit"
        habit={habit}
        isSubmitting={updateHabit.isPending}
        isDeleting={deleteHabit.isPending}
        onSubmit={(next) => {
          updateHabit.mutate(next, {
            onSuccess: () => router.back(),
          });
        }}
        onDelete={() => {
          deleteHabit.mutate(habit, {
            onSuccess: () => router.replace("/(tabs)/habits"),
          });
        }}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
});
