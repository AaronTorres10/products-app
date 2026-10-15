import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useRef, useState } from "react";
import { useTheme } from "../hooks/use-theme";

interface Props extends Omit<TextInputProps, "style"> {
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const ThemedTextInput = ({ icon, style, ...rest }: Props) => {
  const theme = useTheme();

  const primaryColor = theme.primary;
  const textColor = theme.text;
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        {
          ...styles.border,
          borderColor: isActive ? primaryColor : "#ccc",
        },
        style,
      ]}
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
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          color: textColor,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 5,
  },
});
