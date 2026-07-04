import {
  EMOJI_PICKER_SNAP_POINTS,
  GlassBottomSheet,
} from "@/components/ui/GlassBottomSheet";
import { HABIT_EMOJIS } from "@/constants/habit-emojis";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Pressable, StyleSheet, Text } from "react-native";

type EmojiPickerSheetProps = {
  visible: boolean;
  selected: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

export function EmojiPickerSheet({
  visible,
  selected,
  onSelect,
  onClose,
}: EmojiPickerSheetProps) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <GlassBottomSheet
      visible
      onClose={onClose}
      snapPoints={EMOJI_PICKER_SNAP_POINTS}
    >
      <Text
        style={[
          typography.labelMd,
          styles.title,
          { color: colors.onBackground },
        ]}
      >
        Choose an emoji
      </Text>
      <BottomSheetScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {HABIT_EMOJIS.map((emoji) => {
          const active = emoji === selected;
          return (
            <Pressable
              key={emoji}
              onPress={() => {
                onSelect(emoji);
                onClose();
              }}
              style={[
                styles.tile,
                {
                  backgroundColor: active
                    ? "rgba(255, 122, 0, 0.18)"
                    : colors.glassSurface,
                  borderColor: active
                    ? colors.primaryContainer
                    : colors.glassBorder,
                },
              ]}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          );
        })}
      </BottomSheetScrollView>
    </GlassBottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    justifyContent: "center",
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 28,
  },
});
