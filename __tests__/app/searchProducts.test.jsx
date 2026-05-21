import CategoryProductsScreen from "@/app/(tabs)/explore/products";
import useProducts from "@/hooks/useProducts";
import { render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => ({ category: "tudo", title: "Produtos" }),
}));

jest.mock("@/hooks/useProducts", () => jest.fn());

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("@shopify/flash-list", () => {
  const { View } = require("react-native");
  return {
    FlashList: ({ data, renderItem, ListEmptyComponent }) => (
      <View>
        {data && data.length > 0
          ? data.map((item, index) => (
              <View key={item.id ?? index}>{renderItem({ item, index })}</View>
            ))
          : ListEmptyComponent}
      </View>
    ),
  };
});

describe("Acceptance Test: Pesquisa de Produtos e Preços no Explore", () => {
  it("Cenário 1 e 2: Renderiza produto base, capacidade e calcula a badge de Melhor Preço", () => {
    useProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: "prod_acucar_mb",
          name: "Açúcar Branco",
          formattedCapacity: "1 Kg",
          currentPrice: 0.94,
          isPromo: true,
          originalPrice: 1.08,
          bestStore: "Minipreço",
        },
      ],
      hasMore: false,
    });

    render(<CategoryProductsScreen />);

    expect(screen.getByText("Açúcar Branco")).toBeTruthy();
    expect(screen.getByText("1 Kg")).toBeTruthy();
    expect(screen.getByText(/Melhor preço:/)).toBeTruthy();
    expect(screen.getByText("Minipreço")).toBeTruthy();
  });

  it("Cenário 3: Renderiza preço promocional com strikethrough vs Preço Normal", () => {
    useProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: "prod_1",
          name: "Produto Com Promo",
          currentPrice: 0.94,
          isPromo: true,
          originalPrice: 1.08,
          bestStore: "Minipreço",
        },
        {
          id: "prod_2",
          name: "Produto Sem Promo",
          currentPrice: 0.99,
          isPromo: false,
          originalPrice: 0.99,
          bestStore: "Continente",
        },
      ],
      hasMore: false,
    });

    render(<CategoryProductsScreen />);

    expect(screen.getByText("0.94€")).toBeTruthy();
    const originalPricePromo = screen.getByText("1.08€");
    expect(originalPricePromo).toBeTruthy();
    expect(originalPricePromo.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "line-through" }),
      ]),
    );

    expect(screen.getByText("0.99€")).toBeTruthy();
  });

  it("Cenário 4: Erro de rede / Sem resultados mostra Empty State", () => {
    useProducts.mockReturnValue({
      loading: false,
      products: [],
      hasMore: false,
    });

    render(<CategoryProductsScreen />);

    expect(screen.getByText("Nenhum produto encontrado")).toBeTruthy();
  });
});
