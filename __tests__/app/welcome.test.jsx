import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import WelcomeScreen from "@/app/index.jsx";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

/*------------Mocks------------*/

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Por padrão não chama o callback imediatamente ou chama com null
    return jest.fn();
  }),
}));

jest.mock("@/firebaseConfig", () => ({ auth: {} }));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/components/ThemedText", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock("@/components/ThemedButton", () => {
  const { Pressable } = require("react-native");
  return ({ children, onPress, ...props }) => (
    <Pressable onPress={onPress} {...props}>
      {children}
    </Pressable>
  );
});

/*------------Testes------------*/

describe("Welcome Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título corretamente", () => {
      render(<WelcomeScreen />);
      expect(screen.getByText("Bem-vindo ao Cents")).toBeTruthy();
    });

    it("deve renderizar a proposta de valor", () => {
      render(<WelcomeScreen />);
      expect(
        screen.getByText(/O teu assistente inteligente para poupar/)
      ).toBeTruthy();
    });

    it("deve mostrar os botões de Registar e Login", () => {
      render(<WelcomeScreen />);
      expect(screen.getByText("Registar")).toBeTruthy();
      expect(screen.getByText("Login")).toBeTruthy();
    });

    it("deve mostrar o link de Continuar como convidado", () => {
      render(<WelcomeScreen />);
      expect(screen.getByText("Continuar como convidado")).toBeTruthy();
    });
  });

  describe("Navegação", () => {
    it("deve navegar para a tela de registo ao clicar em Registar", () => {
      render(<WelcomeScreen />);
      fireEvent.press(screen.getByTestId("welcome-register-button"));
      expect(router.push).toHaveBeenCalledWith("/register");
    });

    it("deve navegar para a tela de login ao clicar em Login", () => {
      render(<WelcomeScreen />);
      fireEvent.press(screen.getByTestId("welcome-login-button"));
      expect(router.push).toHaveBeenCalledWith("/login");
    });

    it("deve navegar para as tabs ao clicar em Continuar como convidado", () => {
      render(<WelcomeScreen />);
      fireEvent.press(screen.getByTestId("continue-as-guest"));
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    });
  });

  describe("Autenticação Automática", () => {
    it("deve redirecionar para as tabs se o utilizador já estiver logado", async () => {
      // Mock do onAuthStateChanged para disparar o callback com um user
      onAuthStateChanged.mockImplementationOnce((auth, callback) => {
        callback({ uid: "test-user" });
        return jest.fn();
      });

      render(<WelcomeScreen />);

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
      });
    });
  });
});
