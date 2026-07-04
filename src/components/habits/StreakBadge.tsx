import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type StreakBadgeProps = {
  streak: number;
  inline?: boolean;
  compact?: boolean;
};

export function StreakBadge({ streak, inline = false, compact = false }: StreakBadgeProps) {
  const { colors } = useTheme();

  if (streak <= 0) return null;

  if (compact) {
    return (
      <View style={[styles.row, styles.rowInline, styles.compactChip]}>
        <Ionicons name="flame" size={13} color={colors.primary} />
        <Text style={[typography.labelSm, { color: colors.primary }]}>{streak}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, inline && styles.rowInline]}>
      <Ionicons name="flame" size={14} color={colors.primary} />
      <Text style={[typography.labelSm, styles.text, { color: colors.primary }]}>
        {streak} Day Streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rowInline: {
    marginTop: 0,
  },
  compactChip: {
    gap: 2,
  },
  text: {
    textTransform: "none",
  },
});
