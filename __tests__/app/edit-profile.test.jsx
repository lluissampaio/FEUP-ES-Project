import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*------------Mocks------------*/

jest.mock("firebase/auth", () => ({
  updateProfile: jest.fn(() => Promise.resolve()),
  updateEmail: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
}));

let mockUser = {
  displayName: "TestUser",
  email: "test@email.com",
  isAnonymous: false,
  reload: jest.fn(() => Promise.resolve()),
};

jest.mock("@/firebaseConfig", () => ({
  auth: {
    get currentUser() {
      return mockUser;
    },
  },
}));

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock ThemedText and ThemedView to avoid context issues
jest.mock("@/components/ThemedText", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock("@/components/ThemedView", () => {
  const { View } = require("react-native");
  return ({ children, ...props }) => <View {...props}>{children}</View>;
});

import EditProfile from "@/app/edit-profile.jsx";
import { updateProfile, reauthenticateWithCredential } from "firebase/auth";

/*------------Testes------------*/

describe("EditProfile screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  /*------------Unit Tests------------*/

  describe("Unit Tests: Renderização", () => {
    it("Renderiza todos os campos para utilizador autenticado", () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);

      expect(screen.getByText("Editar Perfil")).toBeTruthy();
      expect(screen.getByText("Nome")).toBeTruthy();
      expect(screen.getByText("Email")).toBeTruthy();
      expect(screen.getByText("Nova Palavra-passe")).toBeTruthy();
      expect(
        screen.getByText(
          "Palavra-passe Atual (Obrigatório para mudar Email/Pass)",
        ),
      ).toBeTruthy();
      expect(screen.getByText("Guardar Alterações")).toBeTruthy();
    });

    it("Oculta campos sensíveis para utilizador convidado", () => {
      mockUser = null; // Guest user bypasses login entirely

      render(<EditProfile />);

      expect(screen.getByText("Editar Perfil")).toBeTruthy();
      expect(screen.getByText("Nome")).toBeTruthy();

      // Email and Password fields shouldn't exist
      expect(screen.queryByText("Email")).toBeNull();
      expect(screen.queryByText("Nova Palavra-passe")).toBeNull();
      expect(
        screen.queryByText(
          "Palavra-passe Atual (Obrigatório para mudar Email/Pass)",
        ),
      ).toBeNull();
    });
  });

  /*------------Integration Tests------------*/

  describe("Integration Tests", () => {
    it("Atualiza estado ao escrever nos inputs (Utilizador Autenticado)", () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);

      const nameInput = screen.getByPlaceholderText("O seu nome");
      const emailInput = screen.getByPlaceholderText("O seu email");

      fireEvent.changeText(nameInput, "NovoNome");
      fireEvent.changeText(emailInput, "novo@email.com");

      expect(nameInput.props.value).toBe("NovoNome");
      expect(emailInput.props.value).toBe("novo@email.com");
    });

    it("Alerta quando o formulário é submetido sem alterações", () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);
      const saveButton = screen.getByText("Guardar Alterações");

      fireEvent.press(saveButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        "Aviso",
        "Nenhuma alteração foi feita.",
      );
      expect(updateProfile).not.toHaveBeenCalled();
    });

    it("Convidado grava nome no AsyncStorage", async () => {
      mockUser = null;

      render(<EditProfile />);

      const nameInput = screen.getByPlaceholderText("O seu nome");
      fireEvent.changeText(nameInput, "Convidado123");

      const saveButton = screen.getByText("Guardar Alterações");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "guestName",
          "Convidado123",
        );
        expect(Alert.alert).toHaveBeenCalledWith(
          "Sucesso",
          "Perfil atualizado com sucesso!",
          expect.any(Array),
        );
      });
    });
  });

  /*-----------UAT Tests-----------*/

  describe("User Acceptance Tests (UAT)", () => {
    it("UAT 1: Mudança de Nome com Sucesso chama updateProfile", async () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);

      const nameInput = screen.getByPlaceholderText("O seu nome");
      fireEvent.changeText(nameInput, "NomeAtualizado");

      const saveButton = screen.getByText("Guardar Alterações");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(updateProfile).toHaveBeenCalledWith(mockUser, {
          displayName: "NomeAtualizado",
        });
        expect(mockUser.reload).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          "Sucesso",
          "Perfil atualizado com sucesso!",
          expect.any(Array),
        );
      });
    });

    it("UAT 2: Mudança Sensível falha sem Palavra-passe atual", async () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);

      const emailInput = screen.getByPlaceholderText("O seu email");
      fireEvent.changeText(emailInput, "novoemail@email.com");

      const saveButton = screen.getByText("Guardar Alterações");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Atenção",
          "É necessária a Palavra-passe atual para alterar o Email ou a Palavra-passe.",
        );
        expect(reauthenticateWithCredential).not.toHaveBeenCalled();
      });
    });

    it("UAT 3: Mudança Sensível prossegue com Palavra-passe atual correta", async () => {
      mockUser = {
        displayName: "TestUser",
        email: "test@email.com",
        isAnonymous: false,
        reload: jest.fn(() => Promise.resolve()),
      };

      render(<EditProfile />);

      const emailInput = screen.getByPlaceholderText("O seu email");
      const currentPasswordInput = screen.getByPlaceholderText(
        "A sua palavra-passe atual",
      );

      fireEvent.changeText(emailInput, "novoemail@email.com");
      fireEvent.changeText(currentPasswordInput, "passwordCerta");

      const saveButton = screen.getByText("Guardar Alterações");
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(reauthenticateWithCredential).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          "Sucesso",
          "Perfil atualizado com sucesso!",
          expect.any(Array),
        );
      });
    });
  });
});
