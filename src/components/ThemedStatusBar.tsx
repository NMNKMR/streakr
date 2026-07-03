import { statusBarStyle } from "@/constants/layout";
import { useTheme } from "@/providers/theme";
import { StatusBar } from "expo-status-bar";

function ThemedStatusBar() {
  const { isDarkMode } = useTheme();
  return (
    <StatusBar style={isDarkMode ? statusBarStyle.dark : statusBarStyle.light} />
  );
}

export default ThemedStatusBar;
