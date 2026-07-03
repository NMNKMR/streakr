import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type StreakBadgeProps = {
  streak: number;
};

export function StreakBadge({ streak }: StreakBadgeProps) {
  const { colors } = useTheme();

  if (streak <= 0) return null;

  return (
    <View style={styles.row}>
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
  text: {
    textTransform: "none",
  },
});
