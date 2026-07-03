import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type DurationSectionProps = {
  enabled: boolean;
  minutes: number;
  onToggle: (enabled: boolean) => void;
  onChangeMinutes: (minutes: number) => void;
};

export function DurationSection({
  enabled,
  minutes,
  onToggle,
  onChangeMinutes,
}: DurationSectionProps) {
  const { colors } = useTheme();

  const step = (delta: number) => {
    onChangeMinutes(Math.max(5, Math.min(180, minutes + delta)));
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.glassSurface,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={[typography.labelMd, { color: colors.onBackground }]}>Timed habit</Text>
          <Text style={[typography.labelSm, { color: colors.textMuted }]}>
            Track a session duration when you complete this habit
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.outlineVariant, true: colors.primaryContainer }}
          thumbColor={colors.white}
        />
      </View>

      {enabled ? (
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => step(-5)}
            style={[styles.stepButton, { borderColor: colors.glassBorder }]}
          >
            <Ionicons name="remove" size={20} color={colors.onBackground} />
          </Pressable>
          <Text style={[typography.headlineMd, { color: colors.onBackground }]}>
            {minutes} min
          </Text>
          <Pressable
            onPress={() => step(5)}
            style={[styles.stepButton, { borderColor: colors.glassBorder }]}
          >
            <Ionicons name="add" size={20} color={colors.onBackground} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
