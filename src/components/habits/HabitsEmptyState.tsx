import { GlassCard } from "@/components/ui/GlassCard";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HabitsEmptyStateProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function HabitsEmptyState({
  title = "Start Your Journey",
  description = "You haven't created any habits yet. Take the first step toward a better you.",
  ctaLabel = "Create First Habit",
  icon = "sparkles-outline",
}: HabitsEmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <GlassCard padding={spacing.lg} style={styles.card}>
        <LinearGradient
          colors={[colors.primaryContainer, colors.tertiaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconRing}
        >
          <View
            style={[
              styles.iconInner,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
          >
            <Ionicons name={icon} size={30} color={colors.primary} />
          </View>
        </LinearGradient>

        <Text
          style={[
            typography.headlineMd,
            styles.title,
            { color: colors.onSurface },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            typography.bodyMd,
            styles.description,
            { color: colors.textMuted },
          ]}
        >
          {description}
        </Text>
        <Link href="/new" asChild>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={({ pressed }) => [
              styles.ctaShadow,
              {
                opacity: pressed ? 0.92 : 1,
                shadowColor: colors.primaryContainer,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Ionicons name="add" size={18} color={colors.onPrimary} />
              <Text style={[typography.labelMd, { color: colors.onPrimary }]}>
                {ctaLabel}
              </Text>
            </LinearGradient>
          </Pressable>
        </Link>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    alignItems: "center",
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    padding: 2,
    marginBottom: spacing.lg,
  },
  iconInner: {
    flex: 1,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  description: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  ctaShadow: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
});
