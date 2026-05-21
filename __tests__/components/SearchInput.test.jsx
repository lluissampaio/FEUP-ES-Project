import SearchInput from "@/components/SearchInput";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Unit Test: Componente SearchInput", () => {
  it("Renderiza com o placeholder por defeito", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Pesquisar...")).toBeTruthy();
  });

  it("Chama a função onChangeText com o texto digitado", () => {
    const mockOnChange = jest.fn();
    render(<SearchInput testID="search-input" onChangeText={mockOnChange} />);

    fireEvent.changeText(screen.getByTestId("search-input"), "Batata");
    expect(mockOnChange).toHaveBeenCalledWith("Batata");
  });

  it("Chama a função onSubmitEditing quando o utilizador pressiona enter no teclado", () => {
    const mockOnSubmit = jest.fn();
    render(<SearchInput testID="search-input" onSubmitEditing={mockOnSubmit} />);

    fireEvent(screen.getByTestId("search-input"), "submitEditing");
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});