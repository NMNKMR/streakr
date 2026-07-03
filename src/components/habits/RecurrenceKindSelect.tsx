import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { getRecurrenceKindLabel } from "@/lib/habits/display";
import type { RecurrenceKind } from "@/lib/habits/form";
import { useTheme } from "@/providers/theme";
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
            style={[
              styles.segment,
              active && {
                backgroundColor: colors.primaryContainer,
              },
            ]}
          >
            <Text
              style={[
                typography.labelSm,
                { color: active ? colors.onPrimary : colors.textMuted },
              ]}
            >
              {getRecurrenceKindLabel(kind)}
            </Text>
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
  segment: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
});
