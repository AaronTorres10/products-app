import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "./use-theme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColor,
) {
  const theme = useTheme();

  return theme[colorName];
}
