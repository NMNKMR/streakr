import { radius } from "@/constants/spacing";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

type GradientFabProps = {
  href?: "/new";
};

export function GradientFab({ href = "/new" }: GradientFabProps) {
  const { colors } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={({ pressed }) => [
          styles.shadow,
          {
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
            shadowColor: colors.primaryContainer,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primaryContainer, colors.tertiaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="add" size={30} color={colors.onPrimary} />
        </LinearGradient>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
