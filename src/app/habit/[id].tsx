import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useHabitDetail } from "@/hooks/use-habit-detail";
import { useTheme } from "@/providers/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: habit, isLoading } = useHabitDetail(id);

  return (
    <ScreenBackground>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.marginMobile },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={[typography.labelMd, { color: colors.primary }]}>Back</Text>
        </Pressable>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : habit ? (
          <>
            <Text style={styles.emoji}>{habit.emoji}</Text>
            <Text style={[typography.headlineMd, { color: colors.onBackground }]}>
              {habit.name}
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: spacing.sm }]}>
              Detail UI coming in the next pass. Streak: {habit.streak}
            </Text>
          </>
        ) : (
          <Text style={[typography.bodyMd, { color: colors.textMuted }]}>Habit not found.</Text>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  back: {
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
});
