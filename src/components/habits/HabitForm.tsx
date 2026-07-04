import { DurationSection } from "@/components/habits/DurationSection";
import { EmojiPickerSheet } from "@/components/habits/EmojiPickerSheet";
import { IntervalScheduleSection } from "@/components/habits/IntervalScheduleSection";
import { RecurrenceKindSelect } from "@/components/habits/RecurrenceKindSelect";
import { RemindersPreview } from "@/components/habits/RemindersPreview";
import { StreakBadge } from "@/components/habits/StreakBadge";
import { TimeListEditor } from "@/components/habits/TimeListEditor";
import { WeekdaySelect } from "@/components/habits/WeekdaySelect";
import { FormSectionLabel } from "@/components/ui/FormSectionLabel";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
  buildHabitFromForm,
  DEFAULT_FORM_VALUES,
  getRemindersPreview,
  habitToFormValues,
  validateFormValues,
  type HabitFormValues,
} from "@/lib/habits/form";
import type { Habit } from "@/lib/habits/types";
import { ALL_WEEKDAYS } from "@/lib/habits/types";
import { useTheme } from "@/providers/theme";
import { useUIStore } from "@/store/ui-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HabitFormProps = {
  mode: "create" | "edit";
  habit?: Habit;
  onSubmit: (habit: Habit) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

export function HabitForm({
  mode,
  habit,
  onSubmit,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
}: HabitFormProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const setHabitFormDirty = useUIStore((state) => state.setHabitFormDirty);

  const initialValues = useMemo(
    () => (habit ? habitToFormValues(habit) : DEFAULT_FORM_VALUES),
    [habit],
  );

  const [values, setValues] = useState<HabitFormValues>(initialValues);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  useEffect(() => {
    setHabitFormDirty(dirty);
    return () => setHabitFormDirty(false);
  }, [dirty, setHabitFormDirty]);

  const errors = touched ? validateFormValues(values) : {};
  const hasErrors = Object.keys(validateFormValues(values)).length > 0;

  const patch = (next: Partial<HabitFormValues>) => {
    setValues((current) => ({ ...current, ...next }));
  };

  const handleKindChange = (recurrenceKind: HabitFormValues["recurrenceKind"]) => {
    setValues((current) => {
      const next = { ...current, recurrenceKind };
      if (recurrenceKind === "weekly" && current.weekdays.length === 7) {
        next.weekdays = [1, 2, 3, 4, 5];
      }
      if (recurrenceKind === "interval") {
        next.weekdays = [...ALL_WEEKDAYS];
      }
      return next;
    });
  };

  const handleBack = () => {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert("Discard changes?", "You have unsaved changes.", [
      { text: "Keep editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleSave = () => {
    setTouched(true);
    const nextErrors = validateFormValues(values);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(buildHabitFromForm(values, habit));
  };

  const preview = getRemindersPreview(values);

  return (
    <>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text
          style={[
            typography.labelMd,
            styles.headerTitle,
            { color: colors.onBackground },
          ]}
        >
          {mode === "create" ? "New Habit" : "Edit Habit"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FormSectionLabel compact>Habit identity</FormSectionLabel>
            {mode === "edit" && habit ? (
              <StreakBadge streak={habit.streak} inline />
            ) : null}
          </View>
          <GlassCard>
            <View style={styles.identityRow}>
              <Pressable
                onPress={() => setShowEmojiPicker(true)}
                style={[
                  styles.emojiTile,
                  {
                    backgroundColor: colors.surfaceContainer,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <Text style={styles.emoji}>{values.emoji}</Text>
              </Pressable>
              <TextInput
                value={values.name}
                onChangeText={(name) => patch({ name })}
                placeholder="Habit name"
                placeholderTextColor={colors.textSubtle}
                style={[
                  typography.bodyMd,
                  styles.nameInput,
                  { color: colors.onBackground },
                ]}
              />
            </View>
            {errors.name ? (
              <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
                {errors.name}
              </Text>
            ) : null}
          </GlassCard>
        </View>

        <View style={styles.section}>
          <FormSectionLabel>Schedule type</FormSectionLabel>
          <RecurrenceKindSelect value={values.recurrenceKind} onChange={handleKindChange} />
        </View>

        <View style={styles.section}>
          <FormSectionLabel>Schedule details</FormSectionLabel>
          <GlassCard>
            {values.recurrenceKind === "daily" ? (
              <>
                <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: spacing.sm }]}>
                  Times per day
                </Text>
                <TimeListEditor
                  times={values.times}
                  onChange={(times) => patch({ times })}
                  error={errors.times}
                />
              </>
            ) : null}

            {values.recurrenceKind === "weekly" ? (
              <>
                <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: spacing.sm }]}>
                  On these days
                </Text>
                <WeekdaySelect
                  selected={values.weekdays}
                  onChange={(weekdays) => patch({ weekdays })}
                />
                {errors.weekdays ? (
                  <Text style={[typography.labelSm, { color: colors.error, marginTop: spacing.sm }]}>
                    {errors.weekdays}
                  </Text>
                ) : null}
                <Text
                  style={[
                    typography.labelSm,
                    { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
                  ]}
                >
                  At these times
                </Text>
                <TimeListEditor
                  times={values.times}
                  onChange={(times) => patch({ times })}
                  error={errors.times}
                />
              </>
            ) : null}

            {values.recurrenceKind === "interval" ? (
              <IntervalScheduleSection
                values={values}
                onChange={patch}
                errors={errors}
              />
            ) : null}
          </GlassCard>
        </View>

        <View style={styles.section}>
          <FormSectionLabel>Duration</FormSectionLabel>
          <DurationSection
            enabled={values.timedEnabled}
            minutes={values.durationMinutes}
            onToggle={(timedEnabled) => patch({ timedEnabled })}
            onChangeMinutes={(durationMinutes) => patch({ durationMinutes })}
          />
        </View>

        <View style={styles.section}>
          <FormSectionLabel>Reminders</FormSectionLabel>
          <RemindersPreview text={preview} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.background,
            borderTopColor: colors.glassBorder,
          },
        ]}
      >
        <View style={styles.footerActions}>
          <GradientButton
            label={mode === "create" ? "Save Habit" : "Save Changes"}
            onPress={handleSave}
            disabled={hasErrors && touched}
            loading={isSubmitting}
            style={styles.footerPrimary}
          />
          {mode === "edit" && onDelete ? (
            <Pressable
              onPress={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              style={({ pressed }) => [
                styles.footerOutline,
                {
                  borderColor: colors.glassBorder,
                  opacity: pressed || isDeleting ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[typography.labelMd, { color: colors.error }]}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Text style={[typography.headlineMd, { color: colors.onBackground }]}>
              Delete habit?
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: spacing.sm }]}>
              This will remove the habit and its history. This cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowDeleteConfirm(false)}>
                <Text style={[typography.labelMd, { color: colors.textMuted }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowDeleteConfirm(false);
                  onDelete?.();
                }}
              >
                <Text style={[typography.labelMd, { color: colors.error }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>

    <EmojiPickerSheet
      visible={showEmojiPicker}
      selected={values.emoji}
      onSelect={(emoji) => patch({ emoji })}
      onClose={() => setShowEmojiPicker(false)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emojiTile: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 28,
  },
  nameInput: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  footerPrimary: {
    flex: 1,
  },
  footerOutline: {
    flex: 1,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
});
