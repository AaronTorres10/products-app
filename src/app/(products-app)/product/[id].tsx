import ProductImages from "@/presentation/products/components/ProductImages";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import { useCameraStore } from "@/presentation/store/useCameraStore";
import ThemeButtonGroup from "@/presentation/theme/components/ThemeButtonGroup";
import { ThemedText } from "@/presentation/theme/components/themed-text";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/themedTextInput";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Product,
  Size,
} from "../../../../core/products/interface/product.interface";

const ProductScreen = () => {
  const { selectedImages, removeSelectedImage, clearImages } = useCameraStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { productQuery, productMutation, productDeleteMutation } =
    useProduct(id);
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    return () => clearImages();
  }, [clearImages]);

  if (productQuery.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  if (!productQuery.data) {
    return (
      <View style={styles.loading}>
        <ThemedText type="subtitle">No pudimos abrir el producto</ThemedText>
        <ThemedButton onPress={() => productQuery.refetch()}>
          Reintentar
        </ThemedButton>
      </View>
    );
  }

  const product = productQuery.data;

  return (
    <Formik
      initialValues={{
        ...product,
        title: id === "new" ? "" : product.title,
        price: id === "new" ? "" : product.price.toString(),
        stock: id === "new" ? "" : product.stock.toString(),
      }}
      enableReinitialize
      validateOnMount
      validate={(values) => {
        const errors: Partial<Record<keyof Product, string>> = {};
        if (!values.title.trim())
          errors.title = "Escribe el nombre del producto.";
        if (!values.slug.trim())
          errors.slug = "Escribe un identificador para el producto.";
        if (
          String(values.price).trim() === "" ||
          !Number.isFinite(Number(values.price)) ||
          Number(values.price) < 0
        )
          errors.price = "Ingresa un precio válido.";
        if (
          String(values.stock).trim() === "" ||
          !Number.isInteger(Number(values.stock)) ||
          Number(values.stock) < 0
        )
          errors.stock = "Ingresa una cantidad entera válida.";
        return errors;
      }}
      onSubmit={(productLike) =>
        productMutation.mutate({
          ...productLike,
          price: Number(productLike.price),
          stock: Number(productLike.stock),
          images: [...productLike.images, ...selectedImages],
        })
      }
    >
      {({
        values,
        errors,
        touched,
        dirty,
        isValid,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <KeyboardAvoidingView
          style={[styles.container, { backgroundColor: theme.background }]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={productQuery.isFetching}
                onRefresh={() => productQuery.refetch()}
                tintColor={theme.primary}
                colors={[theme.primary]}
              />
            }
          >
            <ThemedText
              type="smallBold"
              themeColor="primary"
              style={styles.eyebrow}
            >
              TU CATÁLOGO / {id === "new" ? "CREAR" : "EDITAR"}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {id === "new" ? "Nuevo producto" : "Editar producto"}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.intro}>
              Cuida cada detalle de tu catálogo.
            </ThemedText>
            <ProductImages
              images={[...values.images, ...selectedImages]}
              onAddImages={() => router.push("/camera")}
              disabled={
                productMutation.isPending || productDeleteMutation.isPending
              }
              onRemoveImage={(index) => {
                if (index < values.images.length) {
                  setFieldValue(
                    "images",
                    values.images.filter(
                      (_, imageIndex) => imageIndex !== index,
                    ),
                  );
                  return;
                }
                removeSelectedImage(index - values.images.length);
              }}
            />

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Información general
              </ThemedText>
              <ThemedTextInput
                label="Nombre del producto"
                placeholder="Ej. Camiseta de algodón"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                error={touched.title ? errors.title : undefined}
              />
              <ThemedTextInput
                label="Descripción"
                placeholder="Materiales, corte y detalles del producto"
                multiline
                numberOfLines={5}
                value={values.description}
                onChangeText={handleChange("description")}
              />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Precio e inventario
              </ThemedText>
              <View style={styles.row}>
                <ThemedTextInput
                  label="Precio ($)"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  style={styles.field}
                  value={values.price}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  error={touched.price ? errors.price : undefined}
                />
                <ThemedTextInput
                  label="Unidades"
                  placeholder="0"
                  keyboardType="number-pad"
                  style={styles.field}
                  value={values.stock}
                  onChangeText={handleChange("stock")}
                  onBlur={handleBlur("stock")}
                  error={touched.stock ? errors.stock : undefined}
                />
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Variantes
              </ThemedText>
              <ThemedText type="small" style={styles.label}>
                Tallas disponibles
              </ThemedText>
              <ThemeButtonGroup
                options={["XS", "S", "M", "L", "XL", "XXL", "XXXL"]}
                selectedOptions={values.sizes}
                onSelect={(selectedSize) => {
                  const newSizesValue = values.sizes.includes(
                    selectedSize as Size,
                  )
                    ? values.sizes.filter((s) => s !== selectedSize)
                    : [...values.sizes, selectedSize];
                  setFieldValue("sizes", newSizesValue);
                }}
              />
              <ThemedText
                type="small"
                style={[styles.label, styles.categoryLabel]}
              >
                Categoría
              </ThemedText>
              <ThemeButtonGroup
                options={["kid", "men", "women", "unisex"]}
                labels={{
                  kid: "Infantil",
                  men: "Hombre",
                  women: "Mujer",
                  unisex: "Unisex",
                }}
                selectedOptions={[values.gender]}
                onSelect={(selectedOption) =>
                  setFieldValue("gender", selectedOption)
                }
              />
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Identificador
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.help}
              >
                Un nombre único para identificar el producto, sin espacios.
              </ThemedText>
              <ThemedTextInput
                label="Slug"
                placeholder="camiseta-de-algodon"
                autoCapitalize="none"
                autoCorrect={false}
                value={values.slug}
                onChangeText={handleChange("slug")}
                onBlur={handleBlur("slug")}
                error={touched.slug ? errors.slug : undefined}
              />
            </View>
            {id !== "new" && (
              <TouchableOpacity
                accessibilityRole="button"
                disabled={
                  productMutation.isPending || productDeleteMutation.isPending
                }
                onPress={() => {
                  productDeleteMutation.reset();
                  setShowDeleteConfirmation(true);
                }}
                style={[styles.deleteButton, { borderColor: theme.border }]}
              >
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
                <ThemedText themeColor="danger">Eliminar producto</ThemedText>
              </TouchableOpacity>
            )}
          </ScrollView>
          <View
            style={[
              styles.footer,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                paddingBottom: Math.max(bottom, 16),
              },
            ]}
          >
            {id !== "new" && !dirty && selectedImages.length === 0 && (
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.help}
              >
                Sin cambios por guardar.
              </ThemedText>
            )}
            {!isValid && (
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.help}
              >
                Completa el nombre, identificador, precio y unidades con datos
                válidos para guardar.
              </ThemedText>
            )}
            {productMutation.isError && (
              <ThemedText
                accessibilityRole="alert"
                type="small"
                themeColor="danger"
                style={styles.help}
              >
                No se pudo guardar el producto. Revisa los datos y vuelve a
                intentarlo.
              </ThemedText>
            )}
            <ThemedButton
              icon="checkmark-outline"
              loading={productMutation.isPending}
              disabled={
                productDeleteMutation.isPending ||
                !isValid ||
                (id !== "new" && !dirty && selectedImages.length === 0)
              }
              onPress={() => handleSubmit()}
            >
              {productMutation.isPending
                ? "Guardando"
                : id === "new"
                  ? "Crear producto"
                  : "Guardar cambios"}
            </ThemedButton>
          </View>
          <Modal
            visible={showDeleteConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => {
              if (!productDeleteMutation.isPending)
                setShowDeleteConfirmation(false);
            }}
          >
            <View style={styles.modalOverlay}>
              <View
                accessibilityViewIsModal
                style={[
                  styles.modalCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons name="trash-outline" size={30} color={theme.danger} />
                <ThemedText type="subtitle">¿Eliminar producto?</ThemedText>
                <ThemedText themeColor="textSecondary">
                  Eliminarás “{product.title}” de tu catálogo. Esta acción no se
                  puede deshacer.
                </ThemedText>
                {productDeleteMutation.isError && (
                  <ThemedText
                    accessibilityRole="alert"
                    type="small"
                    themeColor="danger"
                  >
                    {productDeleteMutation.error.message}
                  </ThemedText>
                )}
                <ThemedButton
                  variant="secondary"
                  disabled={productDeleteMutation.isPending}
                  onPress={() => setShowDeleteConfirmation(false)}
                >
                  Conservar producto
                </ThemedButton>
                <ThemedButton
                  variant="danger"
                  icon="trash-outline"
                  loading={productDeleteMutation.isPending}
                  onPress={() => {
                    if (!productDeleteMutation.isPending)
                      productDeleteMutation.mutate();
                  }}
                >
                  {productDeleteMutation.isPending
                    ? "Eliminando"
                    : "Eliminar producto"}
                </ThemedButton>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", maxWidth: 800, alignSelf: "center" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 20,
  },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  eyebrow: { fontSize: 11, letterSpacing: 2 },
  title: { marginTop: 8, marginBottom: 8 },
  intro: { marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1, minWidth: 0 },
  label: { marginBottom: 10 },
  categoryLabel: { marginTop: 24 },
  help: { marginBottom: 12 },
  deleteButton: {
    minHeight: 52,
    borderTopWidth: 1,
    paddingVertical: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  footer: { borderTopWidth: 1, paddingTop: 16, paddingHorizontal: 20 },
});
