import AuthScreen from "@/presentation/auth/components/AuthScreen";
import { useAuthForm } from "@/presentation/auth/hooks/useAuthForm";
import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedTextInput from "@/presentation/theme/components/themedTextInput";
import { View } from "react-native";
export default function LoginScreen() {
  const { form, errors, message, isPosting, updateField, submit } =
    useAuthForm(false);
  return (
    <AuthScreen
      title="Ingresar"
      subtitle="Por favor ingrese para poder continuar"
    >
      <View style={{ marginTop: 20 }}>
        <ThemedTextInput
          placeholder="Correo Electrónico"
          accessibilityLabel="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          icon="mail-outline"
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          error={errors.email}
          editable={!isPosting}
        />
        <ThemedTextInput
          placeholder="Contraseña"
          accessibilityLabel="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock-closed-outline"
          value={form.password}
          onChangeText={(value) => updateField("password", value)}
          error={errors.password}
          editable={!isPosting}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>
      {!!message && (
        <ThemedText
          accessibilityLiveRegion="polite"
          style={{ color: "#c62828", marginBottom: 10 }}
        >
          {message}
        </ThemedText>
      )}
      <View style={{ marginTop: 10 }}>
        <ThemedButton onPress={submit} loading={isPosting} icon="arrow-forward">
          Ingresar
        </ThemedButton>
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>¿No tienes cuenta?</ThemedText>
        <ThemedLink href="/auth/register" style={{ marginHorizontal: 5 }}>
          Crear una cuenta
        </ThemedLink>
      </View>
    </AuthScreen>
  );
}
