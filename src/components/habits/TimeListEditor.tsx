import { GlassBottomSheet, TIME_PICKER_SNAP_POINTS } from "@/components/ui/GlassBottomSheet";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { formatTimeOfDay } from "@/lib/habits/display";
import { sortTimes, timesEqual } from "@/lib/habits/form";
import type { TimeOfDay } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type TimeListEditorProps = {
  times: TimeOfDay[];
  onChange: (times: TimeOfDay[]) => void;
  error?: string;
};

function toDate(time: TimeOfDay): Date {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
}

export function TimeListEditor({ times, onChange, error }: TimeListEditorProps) {
  const { colors } = useTheme();
  const [sheetMode, setSheetMode] = useState<"closed" | "add" | "edit">("closed");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState(toDate({ hour: 12, minute: 0 }));

  const sheetVisible = sheetMode !== "closed";

  const sheetTitle = sheetMode === "add" ? "Add time" : "Edit time";

  useEffect(() => {
    if (sheetMode === "add") {
      setDraft(toDate({ hour: 12, minute: 0 }));
      return;
    }
    if (sheetMode === "edit" && editIndex != null && times[editIndex]) {
      setDraft(toDate(times[editIndex]!));
    }
  }, [sheetMode, editIndex, times]);

  const openAdd = () => {
    setEditIndex(null);
    setSheetMode("add");
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setSheetMode("edit");
  };

  const closeSheet = () => {
    setSheetMode("closed");
    setEditIndex(null);
  };

  const commitDraft = () => {
    const next: TimeOfDay = {
      hour: draft.getHours(),
      minute: draft.getMinutes(),
    };

    if (sheetMode === "add") {
      if (!times.some((time) => timesEqual(time, next))) {
        onChange(sortTimes([...times, next]));
      }
    } else if (sheetMode === "edit" && editIndex != null) {
      const updated = [...times];
      updated[editIndex] = next;
      onChange(sortTimes(updated));
    }

    closeSheet();
  };

  const handlePickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      if (selected) setDraft(selected);
      return;
    }
    if (selected) setDraft(selected);
  };

  const removeTime = (index: number) => {
    onChange(times.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <View>
      <View style={styles.chipGrid}>
        {times.map((time, index) => (
          <View
            key={`${time.hour}-${time.minute}-${index}`}
            style={[
              styles.chip,
              {
                backgroundColor: colors.glassSurface,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <Pressable
              onPress={() => openEdit(index)}
              style={styles.chipMain}
            >
              <Ionicons name="time-outline" size={15} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.onBackground }]}>
                {formatTimeOfDay(time)}
              </Text>
            </Pressable>
            {times.length > 1 ? (
              <Pressable
                onPress={() => removeTime(index)}
                hitSlop={8}
                style={styles.removeInside}
              >
                <Ionicons name="close" size={16} color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
        ))}

        <Pressable
          onPress={openAdd}
          style={({ pressed }) => [
            styles.addChip,
            {
              borderColor: colors.glassBorder,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={[typography.labelMd, { color: colors.primary }]}>Add</Text>
        </Pressable>
      </View>

      {Platform.OS === "ios" ? (
        <GlassBottomSheet visible={sheetVisible} onClose={closeSheet} snapPoints={TIME_PICKER_SNAP_POINTS}>
          <View style={styles.sheetHeader}>
            <Pressable onPress={closeSheet} hitSlop={8}>
              <Text style={[typography.labelMd, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
            <Text style={[typography.labelMd, { color: colors.onBackground }]}>
              {sheetTitle}
            </Text>
            <Pressable onPress={commitDraft} hitSlop={8}>
              <Text style={[typography.labelMd, { color: colors.primary }]}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={draft}
            mode="time"
            display="spinner"
            onChange={handlePickerChange}
            themeVariant="dark"
            style={styles.picker}
          />
        </GlassBottomSheet>
      ) : sheetVisible ? (
        <AndroidTimePicker
          value={draft}
          onChange={(selected) => {
            if (selected) {
              const next: TimeOfDay = {
                hour: selected.getHours(),
                minute: selected.getMinutes(),
              };
              if (sheetMode === "add") {
                if (!times.some((time) => timesEqual(time, next))) {
                  onChange(sortTimes([...times, next]));
                }
              } else if (sheetMode === "edit" && editIndex != null) {
                const updated = [...times];
                updated[editIndex] = next;
                onChange(sortTimes(updated));
              }
            }
            closeSheet();
          }}
          onDismiss={closeSheet}
        />
      ) : null}

      {error ? (
        <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function AndroidTimePicker({
  value,
  onChange,
  onDismiss,
}: {
  value: Date;
  onChange: (date?: Date) => void;
  onDismiss: () => void;
}) {
  return (
    <DateTimePicker
      value={value}
      mode="time"
      onChange={(event, selected) => {
        if (event.type === "dismissed") {
          onDismiss();
          return;
        }
        onChange(selected);
      }}
    />
  );
}

const styles = StyleSheet.create({
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chipMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  removeInside: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.xs,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  picker: {
    alignSelf: "center",
  },
});
