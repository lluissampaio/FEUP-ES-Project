import useCart from "@/hooks/useCart";
import { act, renderHook, waitFor } from "@testing-library/react-native";

// Mocks
jest.mock("@/firebaseConfig", () => ({
  auth: { currentUser: { uid: "test-uid" } },
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({
      exists: () => true,
      data: () => ({ 
        items: [
          { 
            id: "1", 
            name: "Leite", 
            currentPrice: 1.0, 
            quantity: 1, 
            image_ref: "leite",
            prices: {
              "continente": { current_price: 1.0 },
              "pingo-doce": { current_price: 0.80 }
            }
          }
        ] 
      }),
    });
    return jest.fn(); // unsubscribe
  }),
  setDoc: jest.fn(),
}));

describe("useCart hook - Funcionalidades Avançadas", () => {
  it("deve remover o produto automaticamente quando a quantidade chega a 0", async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toHaveLength(1);

    await act(async () => {
      await result.current.updateQuantity("1", -1);
    });

    // Como filtramos no estado, deve ficar vazio
    expect(result.current.products).toHaveLength(0);
  });

  it("deve permitir trocar o supermercado de um item e atualizar o total", async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.total).toBe(1.0); // Preço inicial do Continente (default)

    await act(async () => {
      await result.current.updateItemStore("1", "pingo-doce");
    });

    // O selectedStoreId deve estar definido
    expect(result.current.products[0].selectedStoreId).toBe("pingo-doce");
    
    // O total deve refletir o novo preço (0.80)
    expect(result.current.total).toBe(0.80);
  });

  it("deve atualizar todos os itens para um supermercado específico", async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateAllItemsStore("pingo-doce");
    });

    expect(result.current.products[0].selectedStoreId).toBe("pingo-doce");
  });
});
