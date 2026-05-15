import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

/*------------Mocks------------*/

// Mock do Firebase para evitar a importação dos módulos reais
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
}));

jest.mock("@/firebaseConfig", () => ({ auth: {} }));

// Mock do router (navegação entre abas)
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

// Mock ThemedText - versão que retira contexto
jest.mock("@/components/ThemedText", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Mock ThemedView - versão que retira contexto
jest.mock("@/components/ThemedView", () => {
  const { View } = require("react-native");
  return ({ children, ...props }) => <View {...props}>{children}</View>;
});

import Login from "@/app/login.jsx";

/*------------Testes------------*/

describe("Login screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    render(<Login />);
  });

  /*------------Texto no ecrã------------*/

  describe("Text", () => {
    it("Título", () => {
      expect(screen.getByText("Log in")).toBeTruthy();
    });

    it("Subtítulo", () => {
      expect(screen.getByText("Insira as suas credenciais")).toBeTruthy();
    });

    it("Email", () => {
      expect(screen.getByText("Email")).toBeTruthy();
    });

    it("Password", () => {
      expect(screen.getByText("Password")).toBeTruthy();
    });

    it("Login button", () => {
      expect(screen.getByText("Log In")).toBeTruthy();
    });

    it("Password esquecida", () => {
      expect(screen.getByText("Esqueceu-se da sua password?")).toBeTruthy();
    });

    it("Registe-se", () => {
      expect(screen.getByText("Registe-se")).toBeTruthy();
    });
  });

  /*------------Testes de aceitação------------*/

  describe("Testes de aceitação", () => {
    it("Login com sucesso", async () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const loginButton = screen.getByTestId("login-button");

      const { router } = require("expo-router");

      fireEvent.changeText(emailInput, "exemplo@email.com");
      fireEvent.changeText(passwordInput, "exemplo123");
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
      });
    });

    it("Campos vazios", () => {
      const loginButton = screen.getByTestId("login-button");

      fireEvent.press(loginButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        "Erro",
        "Por favor preencha todos os campos",
      );
    });
  });

  /*------------Testes de integração------------*/

  describe("Testes de integração", () => {
    it("Login chama as funções corretamente quando os campos estão vazios", async () => {
      const loginButton = screen.getByTestId("login-button");
      const { router } = require("expo-router");

      fireEvent.press(loginButton);

      expect(Alert.alert).toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });

    it("Preenchimento dos campos atualiza o estado corretamente", () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");

      fireEvent.changeText(emailInput, "exemplo@email.com");
      fireEvent.changeText(passwordInput, "exemplo123");

      expect(emailInput.props.value).toBe("exemplo@email.com");
      expect(passwordInput.props.value).toBe("exemplo123");

      const { router } = require("expo-router");
      expect(router.replace).not.toHaveBeenCalled();
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });
});
