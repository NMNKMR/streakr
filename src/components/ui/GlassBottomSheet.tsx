import { radius, spacing } from "@/constants/spacing";
import { useTheme } from "@/providers/theme";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import {
  InteractionManager,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEFAULT_SNAP_POINTS = ["50%"];

type GlassBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Pass a module-level constant array — do not inline `["50%"]` in JSX. */
  snapPoints?: readonly (string | number)[];
};

export function GlassBottomSheet({
  visible,
  onClose,
  children,
  snapPoints = DEFAULT_SNAP_POINTS,
}: GlassBottomSheetProps) {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!visible) {
      ref.current?.dismiss();
      return;
    }

    let cancelled = false;
    const open = () => {
      if (!cancelled) ref.current?.present();
    };

    const task = InteractionManager.runAfterInteractions(open);
    const timer = setTimeout(open, 50);

    return () => {
      cancelled = true;
      task.cancel();
      clearTimeout(timer);
    };
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.55}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderBackground = useCallback(
    ({ style }: { style?: StyleProp<ViewStyle> }) => (
      <View
        style={[
          style,
          styles.background,
          {
            borderColor: colors.glassBorder,
            backgroundColor: colors.background,
          },
        ]}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={48}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
      </View>
    ),
    [colors.glassBorder, colors.glassSurface, isDarkMode],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={[...snapPoints]}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      handleIndicatorStyle={[
        styles.handle,
        { backgroundColor: colors.textSubtle },
      ]}
      handleStyle={styles.handleArea}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  handleArea: {
    paddingTop: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

export const TIME_PICKER_SNAP_POINTS = ["42%"] as const;
export const EMOJI_PICKER_SNAP_POINTS = ["52%"] as const;
