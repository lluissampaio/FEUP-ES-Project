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
      data: () => ({ items: [{ id: "1", name: "Leite", currentPrice: 0.89, quantity: 1, image_ref: "leite", formattedCapacity: "1L" }] }),
    });
    return jest.fn(); // unsubscribe
  }),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("useCart hook", () => {
  it("deve carregar produtos da base de dados ao inicializar", async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe("Leite");
    expect(result.current.total).toBe(0.89);
  });

  it("deve calcular o total corretamente com múltiplos itens", async () => {
    const { onSnapshot } = require("firebase/firestore");
    onSnapshot.mockImplementationOnce((ref, callback) => {
      callback({
        exists: () => true,
        data: () => ({
          items: [
            { id: "1", name: "Leite", currentPrice: 1.0, quantity: 2, image_ref: "leite" },
            { id: "2", name: "Pão", currentPrice: 1.5, quantity: 1, image_ref: "padaria" },
          ],
        }),
      });
      return jest.fn();
    });

    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.total).toBe(3.5);
  });

  it("deve chamar setDoc ao atualizar a quantidade", async () => {
    const { setDoc } = require("firebase/firestore");
    const { result } = renderHook(() => useCart());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.updateQuantity("1", 1);
    });

    expect(setDoc).toHaveBeenCalled();
  });
});
