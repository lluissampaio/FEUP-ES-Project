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
  onSnapshot: jest.fn(() => jest.fn()),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/store/useSupermarketsStore", () => ({
  useSupermarketsStore: (selector) => {
    const state = {
      supermarkets: [
        { id: "continente", name: "Continente" },
        { id: "pingo-doce", name: "Pingo Doce" },
      ],
      fetchSupermarkets: jest.fn(),
      loading: false,
      fetched: true,
    };
    return selector ? selector(state) : state;
  },
}));

import Cart from "@/app/(tabs)/list";
import useCart from "@/hooks/useList";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("@/hooks/useList");

describe("Acceptance Test: Página do Carrinho - Novas Funcionalidades", () => {
  it('deve renderizar o seletor global "Poupar em:"', () => {
    useCart.mockReturnValue({
      products: [
        {
          id: "1",
          name: "Pimento",
          currentPrice: 1.0,
          quantity: 1,
          bestStore: "continente",
          prices: { continente: { current_price: 1.0 } },
        },
      ],
      total: 1.0,
      loading: false,
      updateAllItemsStore: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText("Poupar em:")).toBeTruthy();
    expect(screen.getByText("Melhor Preço (Mix)")).toBeTruthy();
  });

  it("deve chamar updateAllItemsStore ao selecionar um supermercado global", () => {
    const updateAllItemsStore = jest.fn();
    useCart.mockReturnValue({
      products: [
        {
          id: "1",
          name: "Pimento",
          currentPrice: 1.0,
          quantity: 1,
          bestStore: "continente",
          prices: {
            continente: { current_price: 1.0 },
            "pingo-doce": { current_price: 0.8 },
          },
        },
      ],
      total: 1.0,
      loading: false,
      updateAllItemsStore,
    });

    render(<Cart />);

    fireEvent.press(screen.getByText("Melhor Preço (Mix)"));

    expect(screen.getByText("Pingo Doce")).toBeTruthy();

    fireEvent.press(screen.getByText("Pingo Doce"));
    expect(updateAllItemsStore).toHaveBeenCalledWith("pingo-doce");
  });

  it("deve remover o item da UI quando a quantidade chega a 0", () => {
    const updateQuantity = jest.fn();
    useCart.mockReturnValue({
      products: [
        {
          id: "1",
          name: "Pimento",
          currentPrice: 1.0,
          quantity: 1,
          bestStore: "continente",
          prices: { continente: { current_price: 1.0 } },
        },
      ],
      total: 1.0,
      loading: false,
      updateQuantity,
    });

    render(<Cart />);

    fireEvent.press(screen.getByTestId("decrement-button"));
    expect(updateQuantity).toHaveBeenCalledWith("1", -1);
  });
});
<<<<<<< HEAD
=======

describe("Unit/Integration Tests: Total Poupado UI", () => {
  it("não deve mostrar o texto de poupança se totalSaved for 0", () => {
    useCart.mockReturnValue({
      products: [],
      total: 0,
      totalSaved: 0,
      loading: false,
    });

    render(<Cart />);

    expect(screen.queryByText(/Poupou:/)).toBeNull();
  });

  it("deve renderizar 'Poupou: X €' quando totalSaved é maior que 0", () => {
    useCart.mockReturnValue({
      products: [
        {
          id: "1",
          name: "Produto Promo",
          currentPrice: 1.0,
          quantity: 1,
        },
      ],
      total: 1.0,
      totalSaved: 2.5,
      loading: false,
    });

    render(<Cart />);

    expect(screen.getByText("Poupou: 2.50 €")).toBeTruthy();
  });
});
>>>>>>> main
