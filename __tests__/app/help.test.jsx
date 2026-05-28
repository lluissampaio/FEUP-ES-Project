import HelpPage from "@/app/help";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("expo-router", () => {
  return {
    router: { back: jest.fn() },
  };
});

describe("Help Feature Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Clareza de Informação (Acceptance Test)", () => {
    it("renders FAQs correctly", () => {
      render(<HelpPage />);
      
      expect(screen.getByText("Perguntas Frequentes (FAQs)")).toBeTruthy();
      expect(screen.getByText("Como funciona o algoritmo de comparação de preços?")).toBeTruthy();
      expect(screen.getByText("As promoções estão sempre atualizadas?")).toBeTruthy();
      expect(screen.getByText("Posso confiar no preço final apresentado?")).toBeTruthy();
      expect(screen.getByText("Como posso criar uma lista de compras?")).toBeTruthy();
    });

    it("has a functional back button that returns to the previous screen", () => {
      const { router } = require("expo-router");
      render(<HelpPage />);
      
      const backButton = screen.getByTestId("help-back-button");
      fireEvent.press(backButton);
      
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });
});
