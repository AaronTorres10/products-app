import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    KanitRegular: require("@/assets/fonts/kanit-font/Kanit-Regular.ttf"),
    KanitBold: require("@/assets/fonts/kanit-font/Kanit-Bold.ttf"),
    KanitThin: require("@/assets/fonts/kanit-font/Kanit-Thin.ttf"),
  });

  const colorScheme = useColorScheme();

  if (error) {
    throw error;
  }

  if (!loaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
