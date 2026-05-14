import QuantitySelector from "@/components/QuantitySelector";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Unit Test: Components - QuantitySelector", () => {
  const mockIncrement = jest.fn();
  const mockDecrement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the current value correctly", () => {
    render(<QuantitySelector value={3} onIncrement={mockIncrement} onDecrement={mockDecrement} />);
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("Triggers increment and decrement handlers", () => {
    render(<QuantitySelector value={2} onIncrement={mockIncrement} onDecrement={mockDecrement} />);
    
    fireEvent.press(screen.getByLabelText("Aumentar quantidade"));
    expect(mockIncrement).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText("Diminuir quantidade"));
    expect(mockDecrement).toHaveBeenCalledTimes(1);
  });

  it("Disables decrement button at minimum boundary", () => {
    render(<QuantitySelector value={1} min={1} onIncrement={mockIncrement} onDecrement={mockDecrement} />);
    
    const decButton = screen.getByLabelText("Diminuir quantidade");
    expect(decButton.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(decButton);
    expect(mockDecrement).not.toHaveBeenCalled();
  });

  it("Disables increment button at maximum boundary", () => {
    render(<QuantitySelector value={99} max={99} onIncrement={mockIncrement} onDecrement={mockDecrement} />);
    
    const incButton = screen.getByLabelText("Aumentar quantidade");
    expect(incButton.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(incButton);
    expect(mockIncrement).not.toHaveBeenCalled();
  });
});