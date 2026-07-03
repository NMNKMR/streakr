import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { formatTimeOfDay } from "@/lib/habits/display";
import { sortTimes, timesEqual } from "@/lib/habits/form";
import type { TimeOfDay } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TimePickerField } from "./TimePickerField";

type TimeListEditorProps = {
  times: TimeOfDay[];
  onChange: (times: TimeOfDay[]) => void;
  error?: string;
};

export function TimeListEditor({ times, onChange, error }: TimeListEditorProps) {
  const { colors } = useTheme();
  const [adding, setAdding] = useState(false);
  const [draftTime, setDraftTime] = useState<TimeOfDay>({ hour: 12, minute: 0 });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const removeTime = (index: number) => {
    onChange(times.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateTime = (index: number, next: TimeOfDay) => {
    const updated = [...times];
    updated[index] = next;
    onChange(sortTimes(updated));
    setEditingIndex(null);
  };

  const addTime = () => {
    if (times.some((time) => timesEqual(time, draftTime))) {
      setAdding(false);
      return;
    }
    onChange(sortTimes([...times, draftTime]));
    setAdding(false);
  };

  return (
    <View>
      <View style={styles.chips}>
        {times.map((time, index) => (
          <View key={`${time.hour}-${time.minute}-${index}`} style={styles.chipRow}>
            {editingIndex === index ? (
              <View style={styles.editBlock}>
                <TimePickerField value={time} onChange={(next) => updateTime(index, next)} />
                <Pressable onPress={() => setEditingIndex(null)}>
                  <Text style={[typography.labelSm, { color: colors.textMuted }]}>Done</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => setEditingIndex(index)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.glassSurface,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <Text style={[typography.labelMd, { color: colors.onBackground }]}>
                  {formatTimeOfDay(time)}
                </Text>
              </Pressable>
            )}
            {times.length > 1 ? (
              <Pressable onPress={() => removeTime(index)} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>

      {adding ? (
        <View style={[styles.addRow, { borderColor: colors.glassBorder }]}>
          <TimePickerField value={draftTime} onChange={setDraftTime} label="New time" />
          <View style={styles.addActions}>
            <Pressable onPress={() => setAdding(false)}>
              <Text style={[typography.labelSm, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
            <Pressable onPress={addTime}>
              <Text style={[typography.labelSm, { color: colors.primary }]}>Add</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setAdding(true)} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={[typography.labelMd, { color: colors.primary }]}>Add Time</Text>
        </Pressable>
      )}

      {error ? (
        <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  editBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  addRow: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  addActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
});
