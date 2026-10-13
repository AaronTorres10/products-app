import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    KanitRegular: require("@/assets/fonts/kanit-font/Kanit-Regular.ttf"),
    KanitBold: require("@/assets/fonts/kanit-font/Kanit-Bold.ttf"),
    KanitThin: require("@/assets/fonts/kanit-font/Kanit-Thin.ttf"),
  });

  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  if (error) {
    throw error;
  }

  if (!loaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <View style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </View>
  );
}
