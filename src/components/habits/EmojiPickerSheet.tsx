import { HABIT_EMOJIS } from "@/constants/habit-emojis";
import { radius, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surfaceContainerHigh,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <Text style={[typography.labelMd, styles.title, { color: colors.onBackground }]}>
          Choose an emoji
        </Text>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
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
                    backgroundColor: active ? colors.primaryContainer : colors.glassSurface,
                    borderColor: active ? colors.primaryContainer : colors.glassBorder,
                  },
                ]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    maxHeight: "55%",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingBottom: spacing.md,
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
