// Streakr Aura — shared tokens that don't change between light & dark themes.
const sharedColors = {
  primaryFixed: "#ffdbc8",
  primaryFixedDim: "#ffb68b",
  onPrimaryFixed: "#321200",
  onPrimaryFixedVariant: "#753400",
  secondaryFixed: "#ffe171",
  secondaryFixedDim: "#eac400",
  onSecondaryFixed: "#221b00",
  onSecondaryFixedVariant: "#554600",
  tertiaryFixed: "#e9ddff",
  tertiaryFixedDim: "#cfbdff",
  onTertiaryFixed: "#22005d",
  onTertiaryFixedVariant: "#50309d",

  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  gradientPrimary: "#ff7a00",
  gradientTertiary: "#ac8eff",
} as const;

export const darkColors = {
  ...sharedColors,

  background: "#000000",
  onBackground: "#e9ddff",
  surface: "#18063e",
  surfaceDim: "#18063e",
  surfaceBright: "#3f3066",
  surfaceContainerLowest: "#130139",
  surfaceContainerLow: "#201046",
  surfaceContainer: "#24154a",
  surfaceContainerHigh: "#2f2055",
  surfaceContainerHighest: "#3a2b61",
  surfaceVariant: "#3a2b61",
  onSurface: "#e9ddff",
  onSurfaceVariant: "#e0c0af",
  inverseSurface: "#e9ddff",
  inverseOnSurface: "#36275c",
  surfaceTint: "#ffb68b",
  outline: "#a78b7c",
  outlineVariant: "#584235",

  primary: "#ffb68b",
  onPrimary: "#522300",
  primaryContainer: "#ff7a00",
  onPrimaryContainer: "#5c2800",
  inversePrimary: "#994700",

  secondary: "#fff3d3",
  onSecondary: "#3b2f00",
  secondaryContainer: "#fdd400",
  onSecondaryContainer: "#6f5c00",

  tertiary: "#cfbdff",
  onTertiary: "#391186",
  tertiaryContainer: "#ac8eff",
  onTertiaryContainer: "#401c8d",

  error: "#ffb4ab",
  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffdad6",

  textMuted: "rgba(233, 221, 255, 0.6)",
  textSubtle: "rgba(233, 221, 255, 0.45)",
  warning: "#fdd400",
  onWarning: "#3b2f00",

  glassSurface: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glowOrange: "rgba(255, 122, 0, 0.4)",
  glowPurple: "rgba(172, 142, 255, 0.4)",
};

export type ThemeColors = typeof darkColors;

export const lightColors: ThemeColors = {
  ...sharedColors,

  background: "#f8f5ff",
  onBackground: "#22005d",
  surface: "#ffffff",
  surfaceDim: "#e9ddff",
  surfaceBright: "#ffffff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3edff",
  surfaceContainer: "#ece4ff",
  surfaceContainerHigh: "#e4d9ff",
  surfaceContainerHighest: "#ddd0ff",
  surfaceVariant: "#e9ddff",
  onSurface: "#22005d",
  onSurfaceVariant: "#50309d",
  inverseSurface: "#36275c",
  inverseOnSurface: "#e9ddff",
  surfaceTint: "#994700",
  outline: "#7a6580",
  outlineVariant: "#cfbdff",

  primary: "#994700",
  onPrimary: "#ffffff",
  primaryContainer: "#ffb68b",
  onPrimaryContainer: "#321200",
  inversePrimary: "#ffb68b",

  secondary: "#554600",
  onSecondary: "#ffffff",
  secondaryContainer: "#ffe171",
  onSecondaryContainer: "#221b00",

  tertiary: "#50309d",
  onTertiary: "#ffffff",
  tertiaryContainer: "#cfbdff",
  onTertiaryContainer: "#22005d",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#410002",

  textMuted: "rgba(34, 0, 93, 0.65)",
  textSubtle: "rgba(34, 0, 93, 0.45)",
  warning: "#6f5c00",
  onWarning: "#fff3d3",

  glassSurface: "rgba(255, 255, 255, 0.72)",
  glassBorder: "rgba(80, 48, 157, 0.12)",
  glowOrange: "rgba(255, 122, 0, 0.25)",
  glowPurple: "rgba(172, 142, 255, 0.25)",
};
