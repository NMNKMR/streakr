import { darkColors, lightColors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { ThemeContext, ThemeMode, getThemeForMode } from "./theme";

const THEME_STORAGE_KEY = "@streakr/theme";

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "system";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (isThemeMode(stored)) {
        setMode(stored);
      }
      setIsReady(true);
    });
  }, []);

  const toggleTheme = useCallback((next: ThemeMode) => {
    setMode(next);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const isDarkMode =
    mode === "system" ? systemColorScheme !== "light" : mode === "dark";
  const colors = isDarkMode ? darkColors : lightColors;
  const theme = getThemeForMode(isDarkMode);

  if (!isReady) return null;

  return (
    <ThemeContext.Provider
      value={{ colors, theme, isDarkMode, mode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
