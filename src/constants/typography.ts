import type { TextStyle } from "react-native";

export const fonts = {
  displayExtraBold: "Syne_800ExtraBold",
  displayBold: "Syne_700Bold",
  displaySemiBold: "Syne_600SemiBold",
  sansRegular: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
} as const;

export const typography = {
  headlineXl: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
  },
  headlineLg: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  },
  headlineLgMobile: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineMd: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: fonts.sansRegular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
  },
  labelSm: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.36,
  },
  labelXs: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
