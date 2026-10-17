import { ThemedText } from "@/presentation/theme/components/themed-text";
import { useTheme } from "@/presentation/theme/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  images: string[];
  onAddImages?: () => void;
  onRemoveImage?: (index: number) => void;
  disabled?: boolean;
}

const ProductImages = ({
  images,
  onAddImages,
  onRemoveImage,
  disabled,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Fotografías</ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onAddImages}
          disabled={disabled}
          style={styles.addButton}
        >
          <Ionicons name="camera-outline" size={20} color={theme.primary} />
          <ThemedText themeColor="primary" type="small">
            Agregar
          </ThemedText>
        </TouchableOpacity>
      </View>
      {images.length === 0 ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Agregar fotografías al producto"
          onPress={onAddImages}
          disabled={disabled}
          style={[
            styles.empty,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundElement,
            },
          ]}
        >
          <View
            style={[styles.icon, { backgroundColor: theme.backgroundSelected }]}
          >
            <Ionicons name="images-outline" size={28} color={theme.primary} />
          </View>
          <ThemedText>Tu producto merece una buena foto</ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.centered}
          >
            Toma una foto o elige desde tu galería.
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <>
          <FlatList
            data={images}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.images}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image
                  accessibilityLabel={`Fotografía ${index + 1} del producto`}
                  source={{ uri: item }}
                  resizeMode="contain"
                  style={[
                    styles.image,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                />
                {onRemoveImage && (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar fotografía ${index + 1}`}
                    onPress={() => onRemoveImage(index)}
                    disabled={disabled}
                    style={styles.removeButton}
                  >
                    <View
                      style={[
                        styles.removeIcon,
                        {
                          backgroundColor: theme.backgroundElement,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Ionicons name="close" size={20} color={theme.danger} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.caption}
          >
            {images.length === 1
              ? "1 fotografía"
              : `${images.length} fotografías · Desliza para verlas`}
            {onRemoveImage ? " · Los cambios se aplican al guardar." : ""}
          </ThemedText>
        </>
      )}
    </View>
  );
};

export default ProductImages;

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  addButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 8,
  },
  empty: {
    minHeight: 220,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  icon: { padding: 16, borderRadius: 20 },
  centered: { textAlign: "center" },
  images: { gap: 12 },
  imageContainer: { width: 260, height: 260 },
  image: { width: 260, height: 260, borderRadius: 20 },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: { marginTop: 10 },
});
