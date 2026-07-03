import { radius, spacing } from "@/constants/spacing";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

type ScreenHeaderProps = {
  showLogo?: boolean;
  onCalendarPress?: () => void;
};

export function ScreenHeader({ showLogo = true, onCalendarPress }: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {showLogo ? (
        <Image
          source={require("@/assets/icons/brand-logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      ) : (
        <View style={styles.logoSpacer} />
      )}

      <Pressable
        accessibilityLabel="Open calendar"
        onPress={onCalendarPress}
        style={[styles.calendarButton, { backgroundColor: colors.glassSurface, borderColor: colors.glassBorder }]}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.onSurface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 36,
  },
  logoSpacer: {
    width: 120,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
