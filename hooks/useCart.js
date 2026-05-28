import { useCartStore } from "@/store/useCartStore";

export default function useCart() {
  const {
    products,
    loading,
    error,
    addProductLocal,
    removeLocal,
    updateQuantityLocal,
    clearLocal,
  } = useCartStore();

  const addProduct = (product, quantity = 1, selectedStoreId = null) => {
    addProductLocal(product, quantity, selectedStoreId);
  };

  const remove = (id) => {
    removeLocal(id);
  };

  const updateQuantity = (id, delta) => {
    updateQuantityLocal(id, delta);
  };

  const clear = () => {
    clearLocal();
  };

  const total = products.reduce((sum, p) => {
    const price = p.price || p.currentPrice || 0;
    return sum + price * p.quantity;
  }, 0);

  return {
    products,
    total,
    loading,
    error,
    addProduct,
    remove,
    updateQuantity,
    clear,
  };
}