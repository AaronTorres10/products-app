import { useQuery } from "@tanstack/react-query";
import { getProductsById } from "../../../core/products/actions/get-product-by-id.action";

export const useProduct = (productId: string) => {
  const productQuery = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductsById(productId),
    staleTime: 1000 * 60 * 60, // => 1 hora
  });

  // Mutación

  //Mantener el Id del producto en caso de ser uno nuevo

  return {
    productQuery,
  };
};
