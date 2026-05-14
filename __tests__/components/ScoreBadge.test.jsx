import ScoreBadge from "@/components/ScoreBadge";
import { render, screen } from "@testing-library/react-native";
import React from "react";

describe("Unit Test: Components - ScoreBadge", () => {
  it("Returns null if grade is missing", () => {
    const { toJSON } = render(<ScoreBadge type="eco" grade={null} />);
    expect(toJSON()).toBeNull();
  });

  it("Normalizes lowercase grades and renders correct label", () => {
    render(<ScoreBadge type="eco" grade="a" />);
    
    expect(screen.getByText("ECO")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("Renders Nutri label correctly", () => {
    render(<ScoreBadge type="nutri" grade="C" />);
    expect(screen.getByText("NUTRI")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
  });
});