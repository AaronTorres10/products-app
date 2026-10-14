import { ThemedText } from "@/presentation/theme/components/themed-text";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
export default function AuthScreen({
  title,
  subtitle,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
}>) {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: 40, backgroundColor }}
      >
        <View style={{ paddingTop: height * 0.35 }}>
          <ThemedText type="title">{title}</ThemedText>
          <ThemedText style={{ color: "grey" }}>{subtitle}</ThemedText>
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
