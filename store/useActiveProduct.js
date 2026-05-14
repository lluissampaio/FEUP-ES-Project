import { create } from "zustand";

export const useProductStore = create((set) => ({
  activeProduct: null,
  setActiveProduct: (product) => set({ activeProduct: product }),
  clearActiveProduct: () => set({ activeProduct: null }),
}));
