import { CustomFonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../hooks/use-theme";

interface Props extends Omit<TextInputProps, "style"> {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  error?: string;
  style?: ViewStyle;
}

const ThemedTextInput = ({
  icon,
  label,
  error,
  style,
  onFocus,
  onBlur,
  multiline,
  ...rest
}: Props) => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.border,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error
              ? theme.danger
              : isActive
                ? theme.primary
                : theme.border,
          },
          multiline && styles.multiline,
        ]}
        onTouchStart={() => inputRef.current?.focus()}
      >
        {icon && <Ionicons name={icon} size={20} color={theme.textSecondary} />}
        <TextInput
          {...rest}
          ref={inputRef}
          accessibilityLabel={
            rest.accessibilityLabel ?? label ?? rest.placeholder
          }
          placeholderTextColor={theme.textSecondary}
          multiline={multiline}
          onFocus={(event) => {
            setIsActive(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsActive(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            { color: theme.text },
            multiline && styles.multilineInput,
          ]}
        />
      </View>
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={[styles.error, { color: theme.danger }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontFamily: CustomFonts.regular, fontSize: 14, marginBottom: 8 },
  border: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: CustomFonts.regular,
    fontSize: 16,
    paddingVertical: 14,
  },
  multiline: { alignItems: "flex-start" },
  multilineInput: { minHeight: 120, textAlignVertical: "top" },
  error: { fontFamily: CustomFonts.regular, fontSize: 13, marginTop: 6 },
});
