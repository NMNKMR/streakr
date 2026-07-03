import { Theme, darkTheme, lightTheme } from "@/constants/theme";
import { ThemeColors } from "@/constants/colors";
import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  colors: ThemeColors;
  theme: Theme;
  isDarkMode: boolean;
  mode: ThemeMode;
  toggleTheme: (next: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const getThemeForMode = (isDarkMode: boolean): Theme =>
  isDarkMode ? darkTheme : lightTheme;
