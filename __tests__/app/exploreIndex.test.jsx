import ExploreCategoriesScreen from "@/app/(tabs)/explore/index";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";

// Mocks
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("@shopify/flash-list", () => {
  const { View } = require("react-native");
  return {
    FlashList: ({ data, renderItem }) => (
      <View>
        {data.map((item, index) => (
          <View key={item.id ?? index}>{renderItem({ item, index })}</View>
        ))}
      </View>
    ),
  };
});

describe("Integration Test: Ecrã Explorar (Categorias e Pesquisa Global)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve renderizar a barra de pesquisa e a grelha de categorias", () => {
    render(<ExploreCategoriesScreen />);

    expect(screen.getByText("Encontra Produtos")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search Store")).toBeTruthy();
    expect(screen.getByText("Frutas e Vegetais")).toBeTruthy();
    expect(screen.getByText("Mercearia")).toBeTruthy();
  });

  it("Deve navegar para a lista de produtos passando a query da pesquisa global", () => {
    render(<ExploreCategoriesScreen />);

    const searchInput = screen.getByPlaceholderText("Search Store");

    // Escrever no input e simular o enter (onSubmitEditing)
    fireEvent.changeText(searchInput, "Arroz");
    fireEvent(searchInput, "submitEditing");

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/(tabs)/explore/products",
      params: { category: "tudo", initialSearch: "Arroz" },
    });
  });

  it("Não deve navegar se a pesquisa estiver vazia", () => {
    render(<ExploreCategoriesScreen />);

    const searchInput = screen.getByPlaceholderText("Search Store");
    fireEvent.changeText(searchInput, "   ");
    fireEvent(searchInput, "submitEditing");

    expect(router.push).not.toHaveBeenCalled();
  });

  it("Deve navegar para a respetiva categoria ao clicar no CategoryCard", () => {
    render(<ExploreCategoriesScreen />);

    // Clica no cartão da "Mercearia"
    const merceariaCard = screen.getByTestId("category-card-mercearia");
    fireEvent.press(merceariaCard);

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/(tabs)/explore/products",
      params: { category: "mercearia", title: "Mercearia" },
    });
  });
});
