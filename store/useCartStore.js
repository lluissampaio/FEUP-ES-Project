import { create } from "zustand";

export const useCartStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addProductLocal: (product, quantityToAdd = 1, storeId = null) => {
    set((state) => {
      const existing = state.products.find((p) => p.id === product.id);
      
      if (existing) {
        return {
          products: state.products.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + quantityToAdd }
              : p
          ),
        };
      } else {
        return {
          products: [
            ...state.products,
            {
              ...product,
              quantity: quantityToAdd,
              selectedStoreId: storeId,
              price: product.currentPrice || product.price,
            },
          ],
        };
      }
    });
  },

  removeLocal: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  updateQuantityLocal: (id, delta) => {
    set((state) => ({
      products: state.products
        .map((p) =>
          p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
        )
        .filter((p) => p.quantity > 0),
    }));
  },

  clearLocal: () => set({ products: [] }),
}));