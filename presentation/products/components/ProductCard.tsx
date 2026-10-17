import { ThemedText } from "@/presentation/theme/components/themed-text";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Product } from "../../../core/products/interface/product.interface";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const theme = useTheme();
  const stockColor =
    product.stock === 0
      ? theme.danger
      : product.stock < 5
        ? theme.warning
        : theme.success;
  const stockBackground =
    product.stock === 0
      ? theme.dangerBackground
      : product.stock < 5
        ? theme.warningBackground
        : theme.successBackground;
  const stockLabel =
    product.stock === 0
      ? "Agotado"
      : product.stock < 5
        ? "Pocas unidades"
        : "Disponible";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Editar ${product.title}`}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product.id}`)}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}
    >
      <View
        style={[styles.imageContainer, { backgroundColor: theme.background }]}
      >
        {product.images.length > 0 ? (
          <Image
            source={{ uri: product.images[0] }}
            resizeMode="contain"
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="image-outline"
              size={32}
              color={theme.textSecondary}
            />
            <ThemedText type="small" themeColor="textSecondary">
              Sin fotografía
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.details}>
        <ThemedText numberOfLines={2} style={styles.title}>
          {product.title}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.price}>
          $
          {product.price.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: stockBackground }]}>
          <View style={[styles.dot, { backgroundColor: stockColor }]} />
          <ThemedText style={[styles.badgeText, { color: stockColor }]}>
            {stockLabel}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: "50%",
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageContainer: {
    aspectRatio: 0.95,
    margin: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  details: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 16 },
  title: { fontSize: 14, lineHeight: 20, minHeight: 40 },
  price: { fontSize: 20, marginTop: 8, marginBottom: 10 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 12, lineHeight: 18 },
});
