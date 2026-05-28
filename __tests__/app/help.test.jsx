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

  describe("Unit Tests: Main Functional Requirements", () => {
    it("renders the header correctly", () => {
      render(<HelpPage />);
      expect(screen.getByText("Ajuda")).toBeTruthy();
    });

    it("renders the hero area with title and subtitle", () => {
      render(<HelpPage />);
      expect(screen.getByText("Como podemos ajudar?")).toBeTruthy();
      expect(
        screen.getByText("Tire o melhor partido das funcionalidades da app"),
      ).toBeTruthy();
    });

    it("renders all FAQ questions and answers", () => {
      render(<HelpPage />);

      expect(screen.getByText("Perguntas Frequentes (FAQs)")).toBeTruthy();

      // Check Questions
      expect(
        screen.getByText("Como funciona o algoritmo de comparação de preços?"),
      ).toBeTruthy();
      expect(
        screen.getByText("As promoções estão sempre atualizadas?"),
      ).toBeTruthy();
      expect(
        screen.getByText("Posso confiar no preço final apresentado?"),
      ).toBeTruthy();
      expect(
        screen.getByText("Como posso criar uma lista de compras?"),
      ).toBeTruthy();

      // Check Answers (partial matching since they are long strings)
      expect(
        screen.getByText(
          /O nosso algoritmo analisa os preços de cada produto em múltiplos supermercados/,
        ),
      ).toBeTruthy();
      expect(
        screen.getByText(
          /Sim, cruzamos dados constantemente para garantir que as promoções aplicadas refletem o valor real/,
        ),
      ).toBeTruthy();
      expect(
        screen.getByText(
          /O valor apresentado reflete fielmente as promoções atuais/,
        ),
      ).toBeTruthy();
      expect(
        screen.getByText(
          /Basta navegar pela app, procurar os seus produtos favoritos/,
        ),
      ).toBeTruthy();
    });
  });

  describe("Integration Tests: Component Interactions", () => {
    it("navigates back when back button is pressed", () => {
      const { router } = require("expo-router");
      render(<HelpPage />);

      const backButton = screen.getByTestId("help-back-button");
      fireEvent.press(backButton);

      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });

  describe("User Acceptance Tests (UAT)", () => {
    it("Acceptance: Clareza de Informação - User can read FAQs and navigate back", () => {
      const { router } = require("expo-router");
      render(<HelpPage />);

      // User can read short answers to FAQs
      expect(screen.getByText("Perguntas Frequentes (FAQs)")).toBeTruthy();
      expect(
        screen.getByText("Como funciona o algoritmo de comparação de preços?"),
      ).toBeTruthy();

      // User has a functional back button to return to the previous screen
      const backButton = screen.getByTestId("help-back-button");
      fireEvent.press(backButton);

      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });
});
