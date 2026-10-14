import { FlatList } from "react-native";
import { Product } from "../../../core/products/interface/product.interface";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  loadNextPage: () => void;
}

const ProductsList = ({ products, loadNextPage }: Props) => {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
};

export default ProductsList;
