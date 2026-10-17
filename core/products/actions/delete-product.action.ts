import { productsApi } from "../../api/productsApi";

export const deleteProduct = async (productId: string): Promise<void> => {
  if (!productId || productId === "new") {
    throw new Error("El producto todavía no se ha creado.");
  }

  try {
    await productsApi.delete(`/products/${productId}`);
  } catch {
    throw new Error("No se pudo eliminar el producto. Vuelve a intentarlo.");
  }
};
