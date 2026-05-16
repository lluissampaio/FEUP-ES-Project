import ProductCard from "@/components/ProductCard";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

// Evitar erros de require() para imagens de assets
jest.mock("@/constants/images", () => ({
  getImageForProductCategory: jest.fn(() => null),
}));

describe("Unit Test: Componente ProductCard", () => {
  const baseProps = {
    name: "Leite Mimosa",
    formattedCapacity: "1 L",
    currentPrice: 0.89,
    originalPrice: null,
    isPromo: false,
    bestStore: null,
    image_ref: "leite",
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Renderização base

  it("Deve renderizar o nome e capacidade do produto", () => {
    render(<ProductCard {...baseProps} />);

    expect(screen.getByText("Leite Mimosa")).toBeTruthy();
    expect(screen.getByText("1 L")).toBeTruthy();
  });

  it("Deve renderizar o preço atual formatado com símbolo €", () => {
    render(<ProductCard {...baseProps} />);

    expect(screen.getByText("0.89€")).toBeTruthy();
  });

  it("Deve renderizar o botão 'Ver Ofertas'", () => {
    render(<ProductCard {...baseProps} />);

    expect(screen.getByText("Ver Ofertas")).toBeTruthy();
  });

  // Promoção

  it("Deve mostrar o preço original riscado quando isPromo=true", () => {
    render(
      <ProductCard
        {...baseProps}
        isPromo={true}
        currentPrice={0.94}
        originalPrice={1.08}
      />,
    );

    const precoOriginal = screen.getByText("1.08€");
    expect(precoOriginal).toBeTruthy();
    expect(precoOriginal.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "line-through" }),
      ]),
    );
  });

  it("Não deve mostrar preço original quando isPromo=false", () => {
    render(<ProductCard {...baseProps} isPromo={false} originalPrice={1.08} />);

    // O preço original não deve aparecer
    expect(screen.queryByText("1.08€")).toBeNull();
  });

  it("Não deve mostrar preço original quando isPromo=true mas originalPrice é null", () => {
    render(
      <ProductCard
        {...baseProps}
        isPromo={true}
        currentPrice={0.5}
        originalPrice={null}
      />,
    );

    // Apenas o preço atual deve estar visível
    expect(screen.getByText("0.50€")).toBeTruthy();
  });

  // Badge de melhor preço

  it("Deve mostrar a badge 'Melhor preço' com o nome da loja quando bestStore está definido", () => {
    render(<ProductCard {...baseProps} bestStore="continente" />);

    expect(screen.getByText(/Melhor preço:/)).toBeTruthy();
    expect(screen.getByText("Continente")).toBeTruthy();
  });

  it("Deve capitalizar o nome da loja na badge", () => {
    render(<ProductCard {...baseProps} bestStore="pingo_doce" />);

    // A lógica faz charAt(0).toUpperCase() + slice(1)
    expect(screen.getByText("Pingo_doce")).toBeTruthy();
  });

  it("Não deve mostrar a badge quando bestStore é null", () => {
    render(<ProductCard {...baseProps} bestStore={null} />);

    expect(screen.queryByText(/Melhor preço:/)).toBeNull();
  });

  it("Não deve mostrar a badge quando bestStore é string vazia", () => {
    render(<ProductCard {...baseProps} bestStore="" />);

    expect(screen.queryByText(/Melhor preço:/)).toBeNull();
  });

  // Interação

  it("Deve chamar onPress ao pressionar o botão 'Ver Ofertas'", () => {
    const onPressMock = jest.fn();
    render(<ProductCard {...baseProps} onPress={onPressMock} />);

    fireEvent.press(screen.getByText("Ver Ofertas"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  // Formatação de preços

  it("Deve formatar preços com sempre 2 casas decimais", () => {
    render(<ProductCard {...baseProps} currentPrice={1} />);

    expect(screen.getByText("1.00€")).toBeTruthy();
  });

  it("Deve formatar corretamente preços com 3 casas decimais (arredondamento)", () => {
    render(<ProductCard {...baseProps} currentPrice={0.999} />);

    // toFixed(2) => "1.00"
    expect(screen.getByText("1.00€")).toBeTruthy();
  });
});
