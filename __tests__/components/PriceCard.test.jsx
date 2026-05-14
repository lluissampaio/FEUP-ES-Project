import PriceCard from "@/components/PriceCard";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

// Mock constant dependencies
jest.mock("@/constants/images", () => ({
  getImageForSupermarket: jest.fn(() => null),
}));

describe("Unit Test: Components - PriceCard", () => {
  const mockOnPress = jest.fn();

  const baseProps = {
    storeKey: "continente",
    currentPrice: 1.5,
    originalPrice: 2.0,
    isPromo: false,
    pricePerUnit: "1.50€ / kg",
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders base store information and current price", () => {
    render(<PriceCard {...baseProps} />);

    expect(screen.getByText("Continente")).toBeTruthy();
    expect(screen.getByText("1.50€")).toBeTruthy();
    expect(screen.getByText("1.50€ / kg")).toBeTruthy();
  });

  it("Renders original strike-through price only when isPromo is true", () => {
    const { rerender } = render(
      <PriceCard {...baseProps} isPromo={true} originalPrice={2.0} />,
    );

    const strikePrice = screen.getByText("2.00€");
    expect(strikePrice).toBeTruthy();
    expect(strikePrice.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "line-through" }),
      ]),
    );

    // Re-render without promo
    rerender(<PriceCard {...baseProps} isPromo={false} originalPrice={2.0} />);
    expect(screen.queryByText("2.00€")).toBeNull();
  });

  it("Renders Best Choice banner when isBestChoice is true", () => {
    render(<PriceCard {...baseProps} isBestChoice={true} />);
    expect(screen.getByText("MELHOR ESCOLHA")).toBeTruthy();
  });

  it("Executes onPress with correct storeKey when pressed", () => {
    render(<PriceCard {...baseProps} />);

    fireEvent.press(screen.getByRole("button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith("continente");
  });
});
