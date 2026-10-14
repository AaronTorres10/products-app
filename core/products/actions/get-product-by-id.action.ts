import { API_URL, productsApi } from "../../api/productsApi";
import { type Product } from "../interface/product.interface";

export const getProductsById = async (id: string): Promise<Product> => {
  try {
    const { data } = await productsApi.get<Product>(`/products/${id}`);
    return {
      ...data,
      images: data.images.map((image) => `${API_URL}/files/product/${image}`),
    };
  } catch (error) {
    throw new Error(`product with id ${id} not found`);
  }
};
