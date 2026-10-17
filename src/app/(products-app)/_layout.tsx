import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { CustomFonts } from "@/constants/theme";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);
  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  if (status === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { fontFamily: CustomFonts.regular, fontSize: 16 },
        headerStyle: {
          backgroundColor: theme.background,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: "Products Manager",
          headerRight: () => <LogoutIconButton />,
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: "Producto",
          headerBackTitle: "Catálogo",
        }}
      />
    </Stack>
  );
};

export default CheckAuthenticationLayout;
