import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { isEveryDaySelected } from "@/lib/habits/form";
import { ALL_WEEKDAYS } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;

type WeekdaySelectProps = {
  selected: number[];
  onChange: (weekdays: number[]) => void;
  showEveryDayHint?: boolean;
};

export function WeekdaySelect({
  selected,
  onChange,
  showEveryDayHint = false,
}: WeekdaySelectProps) {
  const { colors } = useTheme();
  const everyDay = isEveryDaySelected(selected);

  const toggleDay = (day: number) => {
    if (selected.includes(day)) {
      const next = selected.filter((item) => item !== day);
      onChange(next.length ? next : [day]);
      return;
    }
    onChange([...selected, day].sort((a, b) => a - b));
  };

  const selectEveryDay = () => {
    onChange([...ALL_WEEKDAYS]);
  };

  return (
    <View>
      {showEveryDayHint && everyDay ? (
        <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: spacing.sm }]}>
          Every day
        </Text>
      ) : null}

      <View style={styles.row}>
        {WEEKDAY_LABELS.map((label, index) => {
          const active = selected.includes(index);
          return (
            <Pressable
              key={`${label}-${index}`}
              onPress={() => toggleDay(index)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primaryContainer : colors.glassSurface,
                  borderColor: active ? colors.primaryContainer : colors.glassBorder,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelSm,
                  { color: active ? colors.onPrimary : colors.textMuted },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showEveryDayHint && !everyDay ? (
        <Pressable onPress={selectEveryDay} style={styles.everyDayLink}>
          <Text style={[typography.labelSm, { color: colors.primary }]}>Select every day</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  chip: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  everyDayLink: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
});
