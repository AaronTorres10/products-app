import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Product } from "../../../core/products/interface/product.interface";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  loadNextPage: () => void;
  header?: ReactElement;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

const ProductsList = ({
  products,
  loadNextPage,
  header,
  isLoading,
  isFetchingNextPage,
  hasError,
  onRetry,
}: Props) => {
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: ["products", "infinite"],
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={header}
      ListEmptyComponent={
        isLoading ? (
          <View
            accessibilityLabel="Cargando productos"
            style={styles.skeletonGrid}
          >
            {[0, 1, 2, 3].map((item) => (
              <View
                key={item}
                style={[
                  styles.skeletonCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.skeletonImage,
                    { backgroundColor: theme.border },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonLine,
                    { backgroundColor: theme.border },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonPrice,
                    { backgroundColor: theme.border },
                  ]}
                />
              </View>
            ))}
          </View>
        ) : (
          <View
            style={[
              styles.empty,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name={hasError ? "cloud-offline-outline" : "cube-outline"}
              size={36}
              color={theme.primary}
            />
            <ThemedText type="subtitle" style={styles.centered}>
              {hasError
                ? "No pudimos cargar el catálogo"
                : "Tu catálogo empieza aquí"}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.centered}>
              {hasError
                ? "Revisa tu conexión y vuelve a intentarlo."
                : "Agrega tu primer producto con su foto, precio y tallas."}
            </ThemedText>
            {hasError && (
              <ThemedButton variant="secondary" onPress={onRetry}>
                Reintentar
              </ThemedButton>
            )}
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={theme.primary} style={styles.footer} />
        ) : hasError && products.length > 0 ? (
          <ThemedButton
            variant="secondary"
            onPress={onRetry}
            style={styles.footer}
          >
            Reintentar carga
          </ThemedButton>
        ) : null
      }
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onPullToRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
    />
  );
};

export default ProductsList;

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 32, flexGrow: 1 },
  row: { gap: 12, marginBottom: 12 },
  empty: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    padding: 28,
    gap: 14,
    marginTop: 8,
  },
  centered: { textAlign: "center" },
  footer: { marginVertical: 20 },
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  skeletonCard: {
    width: "47%",
    flexGrow: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 20,
    gap: 14,
  },
  skeletonImage: {
    width: "100%",
    aspectRatio: 0.95,
    borderRadius: 12,
    opacity: 0.5,
  },
  skeletonLine: { height: 12, width: "90%", borderRadius: 6 },
  skeletonPrice: {
    height: 18,
    width: "55%",
    borderRadius: 6,
    marginBottom: 14,
  },
});
