import Home from "@/app/(tabs)/home";
import useFeaturedProducts from "@/hooks/useFeaturedProducts";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/hooks/useFeaturedProducts", () => jest.fn());

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("@/constants/images", () => ({
  getImageForProductCategory: jest.fn(() => null),
  getImageForSupermarket: jest.fn(() => null),
}));

describe("Integration Test: Home Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Cenário 1: Renderiza estado de loading", () => {
    useFeaturedProducts.mockReturnValue({ products: [], loading: true });

    render(<Home />);

    expect(screen.queryByText("Melhores Promoções")).toBeNull();
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("Cenário 2: Processa e exibe Melhores Promoções ignorando falsos positivos", () => {
    useFeaturedProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: "1",
          name: "Pior Promo",
          formattedCapacity: "1L",
          originalPrice: 10,
          currentPrice: 9,
          isPromo: true,
          image_ref: "default",
        },
        {
          id: "2",
          name: "Melhor Promo",
          formattedCapacity: "1L",
          originalPrice: 10,
          currentPrice: 5,
          isPromo: true,
          image_ref: "default",
        },
        {
          id: "3",
          name: "Falsa Promo",
          formattedCapacity: "1L",
          originalPrice: 10,
          currentPrice: 10,
          isPromo: true,
          image_ref: "default",
        },
        {
          id: "4",
          name: "Sem Promo",
          formattedCapacity: "1L",
          originalPrice: null,
          currentPrice: 10,
          isPromo: false,
          image_ref: "default",
        },
      ],
    });

    render(<Home />);

    expect(screen.getByText("Melhor Promo")).toBeTruthy();
    expect(screen.getByText("Pior Promo")).toBeTruthy();
    expect(screen.queryByText("Falsa Promo")).toBeNull();
    expect(screen.queryByText("Sem Promo")).toBeNull();
  });

  it("Cenário 3: Filtra e exibe estritamente Produtos Ecológicos", () => {
    useFeaturedProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: "5",
          name: "Maçã Eco",
          formattedCapacity: "1kg",
          currentPrice: 2,
          isPromo: false,
          image_ref: "frutas_vegetais",
        },
        {
          id: "6",
          name: "Arroz Eco",
          formattedCapacity: "1kg",
          currentPrice: 1,
          isPromo: false,
          image_ref: "mercearia",
        },
        {
          id: "7",
          name: "Carne Poluente",
          formattedCapacity: "1kg",
          currentPrice: 5,
          isPromo: false,
          image_ref: "talho",
        },
      ],
    });

    render(<Home />);

    expect(screen.getByText("Maçã Eco")).toBeTruthy();
    expect(screen.getByText("Arroz Eco")).toBeTruthy();
    expect(screen.queryByText("Carne Poluente")).toBeNull();
  });

  it("Cenário 4: Valida a integridade da navegação (Search, Ver Tudo, Produto)", () => {
    useFeaturedProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: "8",
          name: "Super Promo",
          formattedCapacity: "1L",
          originalPrice: 10,
          currentPrice: 5,
          isPromo: true,
          image_ref: "default",
        },
      ],
    });

    render(<Home />);

    fireEvent.press(screen.getByTestId("home-search-bar"));
    expect(router.push).toHaveBeenCalledWith("/search/supermarkets");

    const verTudoBtns = screen.getAllByText("Ver tudo");
    fireEvent.press(verTudoBtns[0]);
    expect(router.push).toHaveBeenCalledWith("/explore");

    fireEvent.press(screen.getByText("Super Promo"));
    expect(router.push).toHaveBeenCalledWith("/product/8");
  });
});
