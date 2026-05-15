import { create } from "zustand";

export const useCartStore = create((set) => ({
  products: [],
  loading: true,
  error: null,

  setProducts: (products) => set({ products, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Estas funções podem ser usadas para atualizações locais imediatas (optimistic updates)
  // Mas a sincronização real será feita pelo hook useCart com o Firestore
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
              : p
          )
        : [
            ...state.products,
            {
              ...product,
              quantity: quantityToAdd,
              selectedStoreId: storeId ?? null,
              originalPrice: product.originalPrice ?? null,
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
        p.id === productId ? { ...p, selectedStoreId: storeId ?? null } : p
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

  clearLocal: () => set({ products: [] }),
}));
