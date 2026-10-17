import ProductList from "@/presentation/products/components/ProductList";
import { useProducts } from "@/presentation/products/hooks/useProducts";
import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { productsQuery, loadNextPage } = useProducts();
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom, backgroundColor: theme.background },
      ]}
    >
      <ProductList
        products={productsQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
        isLoading={productsQuery.isLoading}
        isFetchingNextPage={productsQuery.isFetchingNextPage}
        hasError={productsQuery.isError}
        onRetry={() => productsQuery.refetch()}
        header={
          <View style={styles.header}>
            <ThemedText
              type="smallBold"
              themeColor="primary"
              style={styles.eyebrow}
            ></ThemedText>
            <ThemedText type="title" style={styles.title}>
              Tu catálogo
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              Tus productos, siempre en orden.
            </ThemedText>
            <ThemedButton
              icon="add-outline"
              style={styles.createButton}
              onPress={() => router.push("/(products-app)/product/new")}
            >
              Nuevo producto
            </ThemedButton>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Productos
            </ThemedText>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", maxWidth: 800, alignSelf: "center" },
  header: { paddingTop: 16, paddingBottom: 16 },
  eyebrow: { fontSize: 11, letterSpacing: 2 },
  title: { marginTop: 8, marginBottom: 8 },
  createButton: { marginTop: 24 },
  sectionTitle: { marginTop: 28 },
});
