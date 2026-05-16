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
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";

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
        <AccountMenuItem title="Ajuda" iconName="help" onPress={onPressMock} />,
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

  describe("AccountScreen", () => {
    it("renders all three menu items", () => {
      render(<AccountScreen />);
      expect(screen.getByText("Localização")).toBeTruthy();
      expect(screen.getByText("Ajuda")).toBeTruthy();
      expect(screen.getByText("Sobre nós")).toBeTruthy();
    });

    it("renders user profile information", () => {
      render(<AccountScreen />);
      expect(screen.getByText("User123")).toBeTruthy();
      expect(screen.getByText("user123@email.com")).toBeTruthy();
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
