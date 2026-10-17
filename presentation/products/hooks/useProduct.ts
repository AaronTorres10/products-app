import { useCameraStore } from "@/presentation/store/useCameraStore";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef } from "react";
import { Alert } from "react-native";
import { updateCreateProduct } from "../../../core/products/actions/create-update-product.action";
import { deleteProduct } from "../../../core/products/actions/delete-product.action";
import { getProductsById } from "../../../core/products/actions/get-product-by-id.action";
import { Product } from "../../../core/products/interface/product.interface";

export const useProduct = (productId: string) => {
  const { clearImages } = useCameraStore();

  const queryClient = useQueryClient();

  const productIdRef = useRef(productId); // => new / UUID

  const productQuery = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductsById(productId),
    staleTime: 1000 * 60 * 60, // => 1 hora
  });

  const productDeleteMutation = useMutation({
    mutationFn: () => deleteProduct(productIdRef.current),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ["products", "infinite"] });

      queryClient.setQueriesData<InfiniteData<Product[]>>(
        { queryKey: ["products", "infinite"] },
        (data) =>
          data
            ? {
                ...data,
                pages: data.pages.map((page) =>
                  page.filter((product) => product.id !== productIdRef.current),
                ),
              }
            : data,
      );
      queryClient.invalidateQueries({ queryKey: ["products", "infinite"] });
      queryClient.removeQueries({
        queryKey: ["products", productIdRef.current],
        exact: true,
      });
      clearImages();
      router.replace("/(products-app)/(home)");
    },
  });

  // Mutación
  const productMutation = useMutation({
    mutationFn: async (data: Product) =>
      updateCreateProduct({
        ...data,
        id: productIdRef.current,
      }),

    onSuccess(data: Product) {
      productIdRef.current = data.id;

      clearImages();

      queryClient.invalidateQueries({
        queryKey: ["products", "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products", data.id],
      });

      Alert.alert("Producto guardado", `${data.title} se guardó correctamente`);

      if (productId === "new") {
        router.replace(`/product/${data.id}`);
      }
    },
  });

  //Mantener el Id del producto en caso de ser uno nuevo

  return {
    productQuery,
    productMutation,
    productDeleteMutation,
  };
};
