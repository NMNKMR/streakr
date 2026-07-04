import { useTheme } from "@/providers/theme";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type ScreenBackgroundProps = {
  children: ReactNode;
};

export function ScreenBackground({ children }: ScreenBackgroundProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
