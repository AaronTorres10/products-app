import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

const LogoutIconButton = () => {
  const primaryColor = useThemeColor({}, "primary");
  const { logout } = useAuthStore();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Cerrar sesión"
      style={{ padding: 10 }}
      onPress={logout}
    >
      <Ionicons name="log-out-outline" size={24} color={primaryColor} />
    </TouchableOpacity>
  );
};

export default LogoutIconButton;
