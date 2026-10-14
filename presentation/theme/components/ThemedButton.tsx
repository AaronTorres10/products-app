import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    type PressableProps,
} from "react-native";
import { useTheme } from "../hooks/use-theme";
interface Props extends PressableProps {
  loading?: boolean;
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}
const ThemedButton = ({
  children,
  icon,
  loading = false,
  disabled,
  style,
  ...rest
}: Props) => {
  const theme = useTheme();
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || loading, busy: loading }}
      style={(state) => [
        styles.button,
        {
          backgroundColor: theme.primary,
          opacity: disabled || loading ? 0.5 : state.pressed ? 0.6 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text style={styles.buttonText}>{children}</Text>

      {loading && <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />}
      {icon && !loading && (
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
