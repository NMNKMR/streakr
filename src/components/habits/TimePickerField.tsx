import { GlassBottomSheet, TIME_PICKER_SNAP_POINTS } from "@/components/ui/GlassBottomSheet";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { formatTimeOfDay } from "@/lib/habits/display";
import type { TimeOfDay } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type TimePickerFieldProps = {
  value: TimeOfDay;
  onChange: (time: TimeOfDay) => void;
  label?: string;
  /** Wider pill for interval window fields */
  stretch?: boolean;
};

function toDate(time: TimeOfDay): Date {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
}

export function TimePickerField({
  value,
  onChange,
  label,
  stretch = false,
}: TimePickerFieldProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(toDate(value));

  const displayDate = useMemo(() => toDate(value), [value.hour, value.minute]);

  useEffect(() => {
    if (visible) setDraft(displayDate);
  }, [visible, displayDate]);

  const openPicker = () => setVisible(true);

  const closePicker = () => setVisible(false);

  const commitDraft = () => {
    onChange({ hour: draft.getHours(), minute: draft.getMinutes() });
    closePicker();
  };

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      closePicker();
      if (selected) {
        onChange({ hour: selected.getHours(), minute: selected.getMinutes() });
      }
      return;
    }
    if (selected) setDraft(selected);
  };

  return (
    <>
      <View style={[styles.wrapper, stretch && styles.wrapperStretch]}>
        {label ? (
          <Text style={[typography.labelSm, styles.label, { color: colors.textMuted }]}>
            {label}
          </Text>
        ) : null}
        <Pressable
          onPress={openPicker}
          style={({ pressed }) => [
            styles.chip,
            stretch && styles.chipStretch,
            {
              backgroundColor: colors.glassSurface,
              borderColor: colors.glassBorder,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={[typography.labelMd, { color: colors.onBackground }]}>
            {formatTimeOfDay(value)}
          </Text>
        </Pressable>
      </View>

      {Platform.OS === "ios" ? (
        <GlassBottomSheet visible={visible} onClose={closePicker} snapPoints={TIME_PICKER_SNAP_POINTS}>
          <View style={styles.sheetHeader}>
            <Pressable onPress={closePicker} hitSlop={8}>
              <Text style={[typography.labelMd, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
            <Text style={[typography.labelMd, { color: colors.onBackground }]}>
              Pick a time
            </Text>
            <Pressable onPress={commitDraft} hitSlop={8}>
              <Text style={[typography.labelMd, { color: colors.primary }]}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={draft}
            mode="time"
            display="spinner"
            onChange={handleChange}
            themeVariant="dark"
            style={styles.picker}
          />
        </GlassBottomSheet>
      ) : visible ? (
        <DateTimePicker
          value={displayDate}
          mode="time"
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
  },
  wrapperStretch: {
    alignSelf: "stretch",
    flex: 1,
  },
  label: {
    marginBottom: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipStretch: {
    justifyContent: "center",
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
