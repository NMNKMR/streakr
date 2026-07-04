import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** When true, title renders above subtitle (e.g. Habits). Default: subtitle above title. */
  titleFirst?: boolean;
  onCalendarPress?: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  titleFirst = false,
  onCalendarPress,
}: ScreenHeaderProps) {
  const { colors } = useTheme();

  const titleNode = (
    <Text style={[typography.headlineLgMobile, { color: colors.onBackground }]}>
      {title}
    </Text>
  );

  const subtitleNode = subtitle ? (
    <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
      {subtitle}
    </Text>
  ) : null;

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        {titleFirst ? (
          <>
            {titleNode}
            {subtitleNode}
          </>
        ) : (
          <>
            {subtitleNode}
            {titleNode}
          </>
        )}
      </View>

      <Pressable
        accessibilityLabel="Open calendar"
        onPress={onCalendarPress}
        style={[
          styles.calendarButton,
          {
            backgroundColor: colors.glassSurface,
            borderColor: colors.glassBorder,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.onSurface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
