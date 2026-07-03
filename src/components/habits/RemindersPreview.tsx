import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type RemindersPreviewProps = {
  text: string;
};

export function RemindersPreview({ text }: RemindersPreviewProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <Ionicons name="notifications-outline" size={18} color={colors.tertiary} />
      <Text style={[typography.labelSm, styles.text, { color: colors.textMuted }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  text: {
    flex: 1,
  },
});
