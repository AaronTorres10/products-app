import { ThemedText } from "@/presentation/theme/components/themed-text";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { View } from "react-native";

const HomeScreen = () => {
  const theme = useTheme();

  const primary = theme.primary;

  return (
    <View style={{ paddingTop: 100, paddingHorizontal: 10 }}>
      <ThemedText style={{ fontFamily: "KanitBold", color: primary }}>
        HomeScreen
      </ThemedText>

      <ThemedText style={{ fontFamily: "KanitRegular" }}>HomeScreen</ThemedText>

      <ThemedText style={{ fontFamily: "KanitThin" }}>HomeScreen</ThemedText>

      <ThemedText>HomeScreen</ThemedText>
    </View>
  );
};

export default HomeScreen;
