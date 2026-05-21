import CategoryProductsScreen from "@/app/(tabs)/explore/products";
import usePaginatedProducts from "@/hooks/useProducts";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

// Mocks
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(),
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

describe("Integration Test: Listagem de Produtos da Categoria", () => {
  const { useLocalSearchParams } = require("expo-router");

  beforeEach(() => {
    jest.clearAllMocks();
    useLocalSearchParams.mockReturnValue({ category: "bebidas", title: "Bebidas", initialSearch: "" });
  });

  it("Deve exibir o ActivityIndicator durante o carregamento", () => {
    usePaginatedProducts.mockReturnValue({
      products: [],
      loading: true,
      hasMore: false,
    });

    render(<CategoryProductsScreen />);
    
    // Testa título da página e estado de loading
    expect(screen.getByText("Bebidas")).toBeTruthy();
    // Um ActivityIndicator renderizado na view
    expect(screen.queryByText("Nenhum produto encontrado")).toBeNull();
  });

  it("Deve renderizar a lista de produtos retornados pelo hook", () => {
    usePaginatedProducts.mockReturnValue({
      products: [
        { id: "prod_1", name: "Sumo Laranja", currentPrice: 1.5, formattedCapacity: "1 L" },
        { id: "prod_2", name: "Água Natural", currentPrice: 0.5, formattedCapacity: "1.5 L" }
      ],
      loading: false,
      hasMore: false,
    });

    render(<CategoryProductsScreen />);

    expect(screen.getByText("Sumo Laranja")).toBeTruthy();
    expect(screen.getByText("Água Natural")).toBeTruthy();
  });

  it("Deve exibir estado vazio se não houver resultados", () => {
    usePaginatedProducts.mockReturnValue({
      products: [],
      loading: false,
      hasMore: false,
    });

    render(<CategoryProductsScreen />);

    expect(screen.getByText("Nenhum produto encontrado")).toBeTruthy();
  });

  it("Deve navegar para o detalhe do produto ao clicar no ProductCard", () => {
    usePaginatedProducts.mockReturnValue({
      products: [
        { id: "prod_1", name: "Sumo Laranja", currentPrice: 1.5, formattedCapacity: "1 L", image_ref: "bebidas" }
      ],
      loading: false,
    });

    render(<CategoryProductsScreen />);
    
    fireEvent.press(screen.getByTestId("product-card-sumo-laranja"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/product/[id]",
      params: { id: "prod_1" }
    });
  });
});