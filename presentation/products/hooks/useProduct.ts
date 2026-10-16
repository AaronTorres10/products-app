import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";
import { updateCreateProduct } from "../../../core/products/actions/create-update-product.action";
import { getProductsById } from "../../../core/products/actions/get-product-by-id.action";
import { Product } from "../../../core/products/interface/product.interface";

export const useProduct = (productId: string) => {
  const productQuery = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductsById(productId),
    staleTime: 1000 * 60 * 60, // => 1 hora
  });

  // Mutación
  const productMutation = useMutation({
    mutationFn: async (data: Product) => updateCreateProduct(data),
    onSuccess(data: Product) {
      Alert.alert("Producto guardado", `${data.title} se guardo correctamente`);
    },
  });

  //Mantener el Id del producto en caso de ser uno nuevo

  return {
    productQuery,
    productMutation,
  };
};
