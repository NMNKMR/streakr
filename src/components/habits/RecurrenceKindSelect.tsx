import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { getRecurrenceKindLabel } from "@/lib/habits/display";
import type { RecurrenceKind } from "@/lib/habits/form";
import { useTheme } from "@/providers/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const KINDS: RecurrenceKind[] = ["daily", "weekly", "interval"];

type RecurrenceKindSelectProps = {
  value: RecurrenceKind;
  onChange: (kind: RecurrenceKind) => void;
};

export function RecurrenceKindSelect({ value, onChange }: RecurrenceKindSelectProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: colors.glassSurface,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      {KINDS.map((kind) => {
        const active = value === kind;
        return (
          <Pressable
            key={kind}
            onPress={() => onChange(kind)}
            style={styles.segmentPressable}
          >
            {active ? (
              <LinearGradient
                colors={[colors.primaryContainer, colors.tertiaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.segmentActive}
              >
                <Text style={[typography.labelSm, { color: colors.onPrimary }]}>
                  {getRecurrenceKindLabel(kind)}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.segmentInactive}>
                <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                  {getRecurrenceKindLabel(kind)}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: radius.full,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  segmentPressable: {
    flex: 1,
  },
  segmentActive: {
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  segmentInactive: {
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
});
