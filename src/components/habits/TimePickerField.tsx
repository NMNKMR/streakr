import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { formatTimeOfDay } from "@/lib/habits/display";
import type { TimeOfDay } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TimePickerFieldProps = {
  value: TimeOfDay;
  onChange: (time: TimeOfDay) => void;
  label?: string;
};

function toDate(time: TimeOfDay): Date {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
}

export function TimePickerField({ value, onChange, label }: TimePickerFieldProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(toDate(value));

  const displayDate = useMemo(() => toDate(value), [value.hour, value.minute]);

  const openPicker = () => {
    setDraft(displayDate);
    setVisible(true);
  };

  const commitDraft = () => {
    onChange({ hour: draft.getHours(), minute: draft.getMinutes() });
    setVisible(false);
  };

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setVisible(false);
      if (selected) {
        onChange({ hour: selected.getHours(), minute: selected.getMinutes() });
      }
      return;
    }
    if (selected) setDraft(selected);
  };

  return (
    <>
      <View style={styles.wrapper}>
        {label ? (
          <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: spacing.xs }]}>
            {label}
          </Text>
        ) : null}
        <Pressable
          onPress={openPicker}
          style={[
            styles.field,
            {
              backgroundColor: colors.glassSurface,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <Text style={[typography.bodyMd, { color: colors.onBackground }]}>
            {formatTimeOfDay(value)}
          </Text>
        </Pressable>
      </View>

      {Platform.OS === "ios" ? (
        <Modal visible={visible} transparent animationType="slide">
          <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surfaceContainerHigh,
                paddingBottom: insets.bottom + spacing.md,
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setVisible(false)}>
                <Text style={[typography.labelMd, { color: colors.textMuted }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={commitDraft}>
                <Text style={[typography.labelMd, { color: colors.primary }]}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={draft}
              mode="time"
              display="spinner"
              onChange={handleChange}
              themeVariant="dark"
            />
          </View>
        </Modal>
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
    flex: 1,
  },
  field: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});
