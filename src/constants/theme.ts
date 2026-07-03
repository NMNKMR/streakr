import { darkColors, lightColors } from "./colors";
import { radius, spacing } from "./spacing";
import { typography } from "./typography";

export const darkTheme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
} as const;

export const lightTheme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
} as const;

export type Theme = typeof darkTheme;
