import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";
import { useTheme } from "../hooks/use-theme";
interface Props extends TextInputProps {
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}
const ThemedTextInput = ({
  icon,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const theme = useTheme();
  const primaryColor = theme.primary;
  const textColor = theme.text;
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);
  return (
    <View>
      <View
        style={{
          ...styles.border,
          borderColor: error ? "#c62828" : isActive ? primaryColor : "#ccc",
        }}
        onTouchStart={() => inputRef.current?.focus()}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={textColor}
            style={{ marginRight: 10 }}
          />
        )}

        <TextInput
          ref={inputRef}
          placeholderTextColor="#5c5c5c"
          onFocus={(event) => {
            setIsActive(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsActive(false);
            onBlur?.(event);
          }}
          style={[
            {
              color: textColor,
              marginRight: 10,
              flex: 1,
            },
            style,
          ]}
          {...rest}
        />
      </View>
      {error && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ color: "#c62828", marginBottom: 10 }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
export default ThemedTextInput;
const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 5,
  },
});
