import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { useTheme } from "../hooks/use-theme";

interface Props extends PressableProps {
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedButton = ({ children, icon, ...rest }: Props) => {
  const theme = useTheme();

  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.primary,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Text style={styles.buttonText}>{children}</Text>

      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="#ffffff"
          style={{ marginLeft: 8 }}
        />
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
