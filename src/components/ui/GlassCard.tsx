import { radius } from "@/constants/spacing";
import { useTheme } from "@/providers/theme";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
};

export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  const { colors, isDarkMode } = useTheme();

  const content = (
    <View
      style={[
        styles.inner,
        {
          padding,
          backgroundColor: colors.glassSurface,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={32} tint={isDarkMode ? "dark" : "light"} style={styles.blur}>
        {content}
      </BlurView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  inner: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
});
