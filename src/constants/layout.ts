import type { StatusBarStyle } from "expo-status-bar";

import { spacing } from "./spacing";

export const layout = {
  screenPadding: spacing.marginMobile,
  screenPaddingDesktop: spacing.marginDesktop,
  containerMaxWidth: spacing.containerMax,
  gutter: spacing.gutter,
  tabBarHeight: 72,
  bottomChromeHeight: 120,
} as const;

export const statusBarStyle = {
  light: "dark" as StatusBarStyle,
  dark: "light" as StatusBarStyle,
} as const;

export type Layout = typeof layout;
