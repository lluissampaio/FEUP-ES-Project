import CategoryCard from "@/components/CategoryCard";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Unit Test: Componente CategoryCard", () => {
  it("Deve renderizar o label passado pela configuração", () => {
    const config = {
      id: "frutas",
      label: "Frutas Frescas",
      themeKey: "green",
      asset: "frutas_vegetais",
    };

    render(<CategoryCard config={config} onPress={jest.fn()} />);

    expect(screen.getByText("Frutas Frescas")).toBeTruthy();
  });

  it("Deve invocar o método onPress", () => {
    const mockOnPress = jest.fn();
    const config = {
      id: "teste",
      label: "Teste",
      themeKey: "gray",
      asset: "default",
    };

    render(<CategoryCard config={config} onPress={mockOnPress} />);

    fireEvent.press(screen.getByTestId("category-card-teste"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
