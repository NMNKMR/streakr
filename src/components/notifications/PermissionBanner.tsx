import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";

export function PermissionBanner() {
  const { colors } = useTheme();

  // TODO(phase-4): wire to usePermission() — user-owned
  const isDenied = true;

  if (!isDenied) return null;

  return (
    <GlassCard padding={14} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: "rgba(253, 212, 0, 0.15)" }]}>
          <Ionicons name="warning-outline" size={20} color={colors.warning} />
        </View>
        <View style={styles.copy}>
          <Text style={[typography.labelMd, { color: colors.onSurface }]}>
            Notifications are off
          </Text>
          <Text style={[typography.labelSm, { color: colors.textMuted }]}>
            Enable them to stay on track with reminders.
          </Text>
        </View>
        <Pressable onPress={() => Linking.openSettings()}>
          <Text style={[typography.labelSm, { color: colors.tertiaryContainer }]}>
            Open Settings
          </Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
