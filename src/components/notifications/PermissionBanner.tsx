import { GlassCard } from "@/components/ui/GlassCard";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { usePermission } from "@/hooks/use-permission";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function PermissionBanner() {
  const { colors } = useTheme();
  const { isDenied, isLoading, openSettings } = usePermission();

  if (isLoading || !isDenied) return null;

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
            Enable them in Settings to receive habit reminders.
          </Text>
        </View>
        <Pressable onPress={openSettings} hitSlop={8}>
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
