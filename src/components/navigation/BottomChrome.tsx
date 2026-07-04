import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientFab } from "@/components/ui/GradientFab";

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "calendar-outline",
  habits: "layers-outline",
  settings: "settings-outline",
};

const TAB_LABELS: Record<string, string> = {
  index: "Today",
  habits: "Habits",
  settings: "Settings",
};

export function BottomChrome(props: BottomTabBarProps) {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom }]}
    >
      <LinearGradient
        colors={
          isDarkMode
            ? ["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.95)"]
            : ["transparent", "rgba(248,245,255,0.4)", "rgba(248,245,255,0.95)"]
        }
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <View
        style={[
          styles.row,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ]}
      >
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={[
            styles.tabBar,
            {
              backgroundColor: colors.glassSurface,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          {props.state.routes.map((route, index) => {
            const focused = props.state.index === index;
            const icon = TAB_ICONS[route.name] ?? "ellipse-outline";
            const label = TAB_LABELS[route.name] ?? route.name;

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  void Haptics.selectionAsync();
                  props.navigation.navigate(route.name);
                }}
                style={[
                  styles.tabItem,
                  focused && {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(80,48,157,0.08)",
                  },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={22}
                  color={focused ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    typography.labelXs,
                    {
                      color: focused ? colors.primary : colors.textMuted,
                      marginTop: 4,
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>

        <GradientFab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.sm,
  },
  tabBar: {
    flex: 1,
    height: spacing.tabBarHeight,
    borderRadius: 9999,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: spacing.sm,
  },
});
