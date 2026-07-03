export const spacing = {
  xs: 4,
  base: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  gutter: 24,
  marginMobile: 16,
  marginDesktop: 64,
  containerMax: 672,
  tabBarHeight: 72,
  bottomChromeHeight: 120,
} as const;

export const radius = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
