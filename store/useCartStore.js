import { create } from "zustand";

export const useCartStore = create((set) => ({
  products: [],
  loading: true,
  error: null,

  // ensure scratched defaults to false for items loaded from firestore safely
  setProducts: (products) =>
    set({
      products: (products ?? []).filter(Boolean).map((p) => ({
        ...p,
        scratched: p.scratched ?? false,
      })),
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addProductLocal: (product, quantityToAdd = 1, storeId = null) => {
    set((state) => {
      const existing = state.products.find((p) => p.id === product.id);
      const next = existing
        ? state.products.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + quantityToAdd,
                  selectedStoreId: storeId ?? p.selectedStoreId ?? null,
                }
              : p,
          )
        : [
            ...state.products,
            {
              ...product,
              quantity: quantityToAdd,
              selectedStoreId: storeId ?? null,
              originalPrice: product.originalPrice ?? null,
              scratched: false,
            },
          ];
      return { products: next };
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
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity + delta } : p))
        .filter((p) => p.quantity > 0),
    }));
  },

  updateItemStoreLocal: (productId, storeId) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, selectedStoreId: storeId ?? null } : p,
      ),
    }));
  },

  updateAllItemsStoreLocal: (storeId) => {
    set((state) => ({
      products: state.products.map((p) => ({
        ...p,
        selectedStoreId: storeId ?? null,
      })),
    }));
  },

  scratchItemLocal: (id) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, scratched: !p.scratched } : p,
      ),
    }));
  },

  clearLocal: () => set({ products: [] }),
}));
