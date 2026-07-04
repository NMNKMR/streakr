import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { StyleSheet, Text } from "react-native";

type FormSectionLabelProps = {
  children: string;
  compact?: boolean;
};

export function FormSectionLabel({ children, compact = false }: FormSectionLabelProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        typography.labelXs,
        styles.label,
        compact && styles.labelCompact,
        { color: colors.textSubtle },
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    marginBottom: 12,
  },
  labelCompact: {
    marginBottom: 0,
  },
});
