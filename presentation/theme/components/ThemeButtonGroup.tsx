import { CustomFonts } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/use-theme";

interface Props {
  options: string[];
  selectedOptions: string[];
  labels?: Record<string, string>;
  onSelect: (option: string) => void;
}

const ThemedButtonGroup = ({
  options,
  selectedOptions,
  labels,
  onSelect,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = selectedOptions.includes(option);

        return (
          <TouchableOpacity
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            activeOpacity={0.7}
            onPress={() => onSelect(option)}
            style={[
              styles.button,
              {
                borderColor: selected ? theme.primary : theme.border,
                backgroundColor: selected
                  ? theme.backgroundSelected
                  : theme.backgroundElement,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: selected ? theme.primary : theme.textSecondary },
              ]}
            >
              {labels?.[option] ?? option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ThemedButtonGroup;

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontFamily: CustomFonts.regular, fontSize: 14 },
});
