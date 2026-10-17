import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedTextInput from "@/presentation/theme/components/themedTextInput";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

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
            Un nuevo comienzo.
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            El siguiente paso para organizar tus productos.
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
              Crear una cuenta
            </ThemedText>
            <ThemedTextInput
              label="Nombre completo"
              placeholder="Tu nombre"
              autoCapitalize="words"
              autoComplete="name"
              icon="person-outline"
              editable={false}
            />
            <ThemedTextInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              editable={false}
            />
            <ThemedTextInput
              label="Contraseña"
              placeholder="Crea una contraseña"
              secureTextEntry
              autoCapitalize="none"
              icon="lock-closed-outline"
              editable={false}
            />
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.notice}
            >
              El registro de cuentas todavía no está disponible.
            </ThemedText>
            <ThemedButton disabled icon="arrow-forward">
              Crear cuenta
            </ThemedButton>
          </View>

          <View style={styles.links}>
            <ThemedText type="small" themeColor="textSecondary">
              ¿Ya tienes cuenta?
            </ThemedText>
            <ThemedLink href="/auth/login">Inicia sesión</ThemedLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
  notice: { marginBottom: 16 },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
});
