jest.mock("@/firebaseConfig", () => ({
  auth: { currentUser: { uid: "test-uid" } },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: "test-uid" });
    return jest.fn();
  }),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ exists: () => false, data: () => ({ items: [] }) });
    return jest.fn();
  }),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
}));

import useList from "@/hooks/useList";
import { useCartStore } from "@/store/useCartStore";
import { act, renderHook, waitFor } from "@testing-library/react-native";

describe("Hook useCart", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearLocal();
    });
  });

  describe("Unit Tests: Lógica de Poupança", () => {
    it("deve iniciar com estado empty via mock", async () => {
      const { result } = renderHook(() => useList());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.products).toEqual([]);
      expect(result.current.totalSaved).toBe(0);
    });

    it("calcula o valor total poupado de itens com promoção (Cálculo da Poupança)", async () => {
      const { result } = renderHook(() => useList());

      await act(async () => {
        result.current.addProduct(
          {
            id: "promo1",
            name: "Promo Product",
            currentPrice: 2.0,
            originalPrice: 4.0,
          },
          1,
        );
      });

      expect(result.current.totalSaved).toBe(2.0);
    });

    it("retorna totalSaved igual a 0 se não houver promoção ou desconto", async () => {
      const { result } = renderHook(() => useList());

      await act(async () => {
        result.current.addProduct(
          {
            id: "normal",
            name: "Normal Product",
            currentPrice: 3.0,
            originalPrice: 3.0,
          },
          1,
        );
      });

      expect(result.current.totalSaved).toBe(0);
    });
  });

  describe("Integration Tests: Estado e Atualizações Dinâmicas", () => {
    it("duplica o valor poupado ao duplicar a quantidade (Atualização Dinâmica)", async () => {
      const { result } = renderHook(() => useList());

      await act(async () => {
        result.current.addProduct(
          {
            id: "promo2",
            name: "Promo Product 2",
            prices: {
              "loja-a": {
                current_price: 3.0,
                original_price: 6.0,
                is_promo: true,
              },
            },
          },
          1,
          "loja-a",
        );
      });

      expect(result.current.totalSaved).toBe(3.0); // 6 - 3 = 3

      await act(async () => {
        result.current.updateQuantity("promo2", 1); // Aumenta a quantidade em 1 (fica 2 no total)
      });

      expect(result.current.totalSaved).toBe(6.0); // 3 * 2 = 6
    });
  });
});
