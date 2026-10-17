import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedTextInput from "@/presentation/theme/components/themedTextInput";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { login } = useAuthStore();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const onLogin = async () => {
    if (isPosting) return;
    const email = form.email.trim();
    const { password } = form;
    setError("");

    if (!email || !password) {
      setError("Escribe tu correo y contraseña para continuar.");
      return;
    }

    setIsPosting(true);
    try {
      const wasSuccessful = await login(email, password);
      if (wasSuccessful) {
        router.replace("/");
        return;
      }
      setError("No pudimos iniciar sesión. Verifica tu correo y contraseña.");
    } catch {
      setError("No pudimos conectar. Intenta nuevamente en un momento.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(top, 24),
            paddingBottom: Math.max(bottom, 24),
          },
        ]}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.brandIcon,
              { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <Ionicons name="cube-outline" size={34} color={theme.primary} />
          </View>
          <ThemedText
            type="smallBold"
            themeColor="primary"
            style={styles.eyebrow}
          ></ThemedText>
          <ThemedText type="title" style={styles.title}>
            Todo en su lugar.
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Administra tu catálogo en un solo lugar, con cada detalle bajo
            control.
          </ThemedText>

          <View
            style={[
              styles.form,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText type="subtitle" style={styles.formTitle}>
              Inicia sesión
            </ThemedText>
            <ThemedTextInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              icon="mail-outline"
              editable={!isPosting}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <ThemedTextInput
              label="Contraseña"
              placeholder="Escribe tu contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              icon="lock-closed-outline"
              editable={!isPosting}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              returnKeyType="go"
              onSubmitEditing={onLogin}
            />
            {!!error && (
              <ThemedText
                accessibilityRole="alert"
                type="small"
                themeColor="danger"
                style={styles.error}
              >
                {error}
              </ThemedText>
            )}
            <ThemedButton
              onPress={onLogin}
              loading={isPosting}
              icon="arrow-forward"
            >
              {isPosting ? "Ingresando" : "Ingresar"}
            </ThemedButton>
          </View>

          <View style={styles.links}>
            <ThemedText type="small" themeColor="textSecondary">
              ¿No tienes cuenta?
            </ThemedText>
            <ThemedLink href="/auth/register">Crear una cuenta</ThemedLink>
          </View>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.caption}
          >
            Tu catálogo. Tu siguiente gran idea.
          </ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  content: { width: "100%", maxWidth: 440, alignSelf: "center" },
  brandIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: { fontSize: 11, letterSpacing: 2 },
  title: { marginTop: 10, marginBottom: 12 },
  intro: { marginBottom: 28 },
  form: { padding: 20, borderWidth: 1, borderRadius: 24 },
  formTitle: { marginBottom: 20 },
  error: { marginBottom: 16 },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  caption: { textAlign: "center", marginTop: 32 },
});
