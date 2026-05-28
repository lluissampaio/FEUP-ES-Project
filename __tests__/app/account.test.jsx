jest.mock("firebase/auth", () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

let mockCurrentUser = {
  displayName: "User123",
  email: "user123@email.com",
  photoURL: "https://example.com/avatar.png",
  reload: jest.fn(() => Promise.resolve()),
};

jest.mock("@/firebaseConfig", () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    },
  },
  db: {},
}));

// hacky way to prevent native module crash

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

import AccountScreen from "@/app/(tabs)/account";
import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import LogoutButton from "@/components/LogoutButton";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { signOut } from "firebase/auth";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("expo-image", () => ({
  Image: "Image",
}));

jest.mock("expo-router", () => {
  const React = require("react");
  return {
    router: { push: jest.fn(), replace: jest.fn() },
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(callback, []);
    }),
  };
});

describe("Account Feature Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = {
      displayName: "User123",
      email: "user123@email.com",
      photoURL: "https://example.com/avatar.png",
      reload: jest.fn(() => Promise.resolve()),
    };
  });

  describe("Unit Tests: Main Functional Requirements", () => {
    describe("AccountHeader Component", () => {
      it("renders user name and email correctly", () => {
        render(
          <AccountHeader
            name="user123"
            email="user123@email.com"
            avatarUrl="https://example.com/avatar.png"
          />,
        );
        expect(screen.getByText("user123")).toBeTruthy();
        expect(screen.getByText("user123@email.com")).toBeTruthy();
      });
    });

    describe("AccountMenuItem Component", () => {
      it("renders title correctly and handles press", () => {
        const onPressMock = jest.fn();
        render(
          <AccountMenuItem
            title="Ajuda"
            iconName="help"
            onPress={onPressMock}
          />,
        );
        expect(screen.getByText("Ajuda")).toBeTruthy();
        const menuItem = screen.getByText("Ajuda");
        fireEvent.press(menuItem);
        expect(onPressMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("LogoutButton Component", () => {
      it("renders 'Log Out' text and handles press", () => {
        const onPressMock = jest.fn();
        render(<LogoutButton onPress={onPressMock} />);
        expect(screen.getByText("Log Out")).toBeTruthy();
        const logoutBtn = screen.getByText("Log Out");
        fireEvent.press(logoutBtn);
        expect(onPressMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("AccountScreen Rendering", () => {
      it("renders user profile information and all menu items", () => {
        render(<AccountScreen />);
        expect(screen.getByText("User123")).toBeTruthy();
        expect(screen.getByText("user123@email.com")).toBeTruthy();
        expect(screen.getByText("Localização")).toBeTruthy();
        expect(screen.getByText("Ajuda")).toBeTruthy();
        expect(screen.getByText("Sobre nós")).toBeTruthy();
      });

      it("falls back to email prefix if displayName is missing", () => {
        mockCurrentUser = {
          email: "teste@email.com",
          reload: jest.fn(() => Promise.resolve()),
        };
        render(<AccountScreen />);
        expect(screen.getByText("teste")).toBeTruthy();
      });

      it("falls back to 'Utilizador' if both displayName and email are missing", () => {
        mockCurrentUser = { reload: jest.fn(() => Promise.resolve()) };
        render(<AccountScreen />);
        expect(screen.getByText("Utilizador")).toBeTruthy();
      });
    });
  });

  describe("Integration Tests: Component Interactions", () => {
    it("navigates to location page when 'Localização' menu item is pressed", () => {
      const { router } = require("expo-router");
      render(<AccountScreen />);
      const locationItem = screen.getByText("Localização");
      fireEvent.press(locationItem);
      expect(router.push).toHaveBeenCalledWith("/location");
    });

    it("navigates to help page when 'Ajuda' menu item is pressed", () => {
      const { router } = require("expo-router");
      render(<AccountScreen />);
      const helpItem = screen.getByText("Ajuda");
      fireEvent.press(helpItem);
      expect(router.push).toHaveBeenCalledWith("/help");
    });
  });

  describe("User Acceptance Tests (UAT)", () => {
    it("Acceptance: User views their profile and logs out successfully", async () => {
      const { router } = require("expo-router");

      // 1. User sees the account screen
      render(<AccountScreen />);

      // 2. User verifies their data is visible
      expect(screen.getByText("User123")).toBeTruthy();
      expect(screen.getByText("user123@email.com")).toBeTruthy();

      // 3. User clicks on Logout
      const logoutBtn = screen.getByText("Log Out");
      fireEvent.press(logoutBtn);

      // 4. System signs out and navigates back to root
      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(router.replace).toHaveBeenCalledWith("/");
      });
    });

    it("fetches guestName from AsyncStorage when user is null", async () => {
      mockCurrentUser = null;
      const AsyncStorage = require("@react-native-async-storage/async-storage");
      AsyncStorage.getItem.mockResolvedValueOnce("ConvidadoLocal");

      render(<AccountScreen />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("guestName");
        expect(screen.getByText("ConvidadoLocal")).toBeTruthy();
      });

      // Reset mock back for other tests if needed
      mockCurrentUser = {
        displayName: "User123",
        email: "user123@email.com",
        photoURL: "https://example.com/avatar.png",
        reload: jest.fn(() => Promise.resolve()),
      };
    });
  });
});
