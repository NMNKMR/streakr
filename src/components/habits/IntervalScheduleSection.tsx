import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TimePickerField } from "./TimePickerField";
import { WeekdaySelect } from "./WeekdaySelect";
import type { HabitFormValues } from "@/lib/habits/form";

type IntervalScheduleSectionProps = {
  values: Pick<
    HabitFormValues,
    "weekdays" | "everyMinutes" | "windowStart" | "windowEnd"
  >;
  onChange: (patch: Partial<HabitFormValues>) => void;
  errors: { weekdays?: string; window?: string };
};

export function IntervalScheduleSection({
  values,
  onChange,
  errors,
}: IntervalScheduleSectionProps) {
  const { colors } = useTheme();
  const everyHours = values.everyMinutes / 60;

  const stepInterval = (delta: number) => {
    const nextHours = Math.max(1, Math.min(12, everyHours + delta));
    onChange({ everyMinutes: nextHours * 60 });
  };

  return (
    <View style={styles.section}>
      <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: spacing.sm }]}>
        Active days
      </Text>
      <WeekdaySelect
        selected={values.weekdays}
        onChange={(weekdays) => onChange({ weekdays })}
        showEveryDayHint
      />
      {errors.weekdays ? (
        <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
          {errors.weekdays}
        </Text>
      ) : null}

      <View style={[styles.card, { borderColor: colors.glassBorder, marginTop: spacing.lg }]}>
        <Text style={[typography.labelSm, { color: colors.textMuted }]}>Every</Text>
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => stepInterval(-1)}
            style={[styles.stepButton, { borderColor: colors.glassBorder }]}
          >
            <Ionicons name="remove" size={20} color={colors.onBackground} />
          </Pressable>
          <Text style={[typography.headlineMd, { color: colors.onBackground }]}>
            {everyHours} hour{everyHours === 1 ? "" : "s"}
          </Text>
          <Pressable
            onPress={() => stepInterval(1)}
            style={[styles.stepButton, { borderColor: colors.glassBorder }]}
          >
            <Ionicons name="add" size={20} color={colors.onBackground} />
          </Pressable>
        </View>
      </View>

      <View style={styles.windowRow}>
        <TimePickerField
          label="From"
          value={values.windowStart}
          onChange={(windowStart) => onChange({ windowStart })}
        />
        <TimePickerField
          label="To"
          value={values.windowEnd}
          onChange={(windowEnd) => onChange({ windowEnd })}
        />
      </View>
      {errors.window ? (
        <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
          {errors.window}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xs,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "transparent",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
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
  windowRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
