import { CustomFonts } from "@/constants/theme";
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
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const ThemedButton = ({
  children,
  icon,
  loading = false,
  variant = "primary",
  disabled,
  style,
  ...rest
}: Props) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const showDisabledStyle = disabled && !loading;
  const color = showDisabledStyle
    ? theme.textSecondary
    : variant === "primary" || variant === "danger"
      ? theme.onPrimary
      : theme.primary;

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        {
          backgroundColor: showDisabledStyle
            ? theme.border
            : variant === "danger"
              ? theme.danger
              : variant === "primary"
                ? theme.primary
                : theme.backgroundSelected,
          opacity: state.pressed && !isDisabled ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{children}</Text>
      {loading ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        icon && <Ionicons name={icon} size={20} color={color} />
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    fontFamily: CustomFonts.regular,
    fontSize: 16,
  },
});
