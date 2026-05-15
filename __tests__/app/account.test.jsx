import AccountScreen from "@/app/(tabs)/account";
import AccountHeader from "@/components/AccountHeader";
import AccountMenuItem from "@/components/AccountMenuItem";
import LogoutButton from "@/components/LogoutButton";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
jest.mock("expo-image", () => ({
  Image: "Image",
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

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
  });
});
