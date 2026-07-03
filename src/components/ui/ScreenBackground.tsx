import { useTheme } from "@/providers/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type ScreenBackgroundProps = {
  children: ReactNode;
};

export function ScreenBackground({ children }: ScreenBackgroundProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {isDarkMode ? (
        <>
          <View
            style={[
              styles.glow,
              styles.glowOrange,
              { backgroundColor: colors.glowOrange },
            ]}
          />
          <View
            style={[
              styles.glow,
              styles.glowPurple,
              { backgroundColor: colors.glowPurple },
            ]}
          />
        </>
      ) : (
        <LinearGradient
          colors={["#f8f5ff", "#ece4ff", "#f8f5ff"]}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  glow: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.55,
  },
  glowOrange: {
    width: 280,
    height: 280,
    top: -40,
    right: -80,
  },
  glowPurple: {
    width: 320,
    height: 320,
    bottom: 120,
    left: -120,
  },
});
