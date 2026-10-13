import { StyleSheet, Text, type TextProps } from "react-native";

import { CustomFonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/presentation/theme/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: CustomFonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  title: {
    fontFamily: "KanitBold",
    fontSize: 32,
    lineHeight: 32,
  },

  small: {
    fontFamily: CustomFonts.thin,
    fontSize: 14,
    lineHeight: 20,
  },
});
