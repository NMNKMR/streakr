import { typography } from "@/constants/typography";
import { useTheme } from "@/providers/theme";
import { StyleSheet, Text } from "react-native";

type FormSectionLabelProps = {
  children: string;
};

export function FormSectionLabel({ children }: FormSectionLabelProps) {
  const { colors } = useTheme();

  return (
    <Text style={[typography.labelXs, styles.label, { color: colors.textSubtle }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    marginBottom: 12,
  },
});
