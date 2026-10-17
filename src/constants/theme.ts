/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#172033",
    background: "#F6F7FB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#EEECFF",
    textSecondary: "#667085",
    primary: "#4F46E5",
    onPrimary: "#FFFFFF",
    border: "#E4E7EE",
    success: "#176647",
    successBackground: "#E9F6EF",
    warning: "#8A4B0F",
    warningBackground: "#FFF3DF",
    danger: "#B42338",
    dangerBackground: "#FDEDF0",
  },
  dark: {
    text: "#F2F4F8",
    background: "#101827",
    backgroundElement: "#1C2638",
    backgroundSelected: "#303054",
    textSecondary: "#AAB5C7",
    primary: "#A5B4FC",
    onPrimary: "#172033",
    border: "#344054",
    success: "#8EDAB3",
    successBackground: "#173C32",
    warning: "#F4C77C",
    warningBackground: "#44351F",
    danger: "#FDA4AF",
    dangerBackground: "#452733",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});
export const CustomFonts = {
  regular: "KanitRegular",
  bold: "KanitBold",
  thin: "KanitThin",
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
