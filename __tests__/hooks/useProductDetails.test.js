import { formatUnitPrice } from "@/hooks/useProductDetails";

// Sever local config initialization
jest.mock("@/firebaseConfig", () => ({ db: {} }));

// Sever ESM package traversal
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("Unit Test: Hooks - formatUnitPrice", () => {
  it("Formats standard weight correctly", () => {
    const result = formatUnitPrice(
      { current_price: 1.5, unit_price: 1.5 },
      1,
      "kg",
    );
    expect(result).toBe("1.50€ / kg");
  });

  it("Converts 'g' measurement unit to 'kg' for display standardization", () => {
    const result = formatUnitPrice(
      { current_price: 2.0, unit_price: 8.0 },
      250,
      "g",
    );
    expect(result).toBe("8.00€ / kg");
  });

  it("Returns null if price data or capacity is missing", () => {
    expect(formatUnitPrice(null, 1, "kg")).toBeNull();
    expect(formatUnitPrice({ current_price: 1.5 }, null, "kg")).toBeNull();
    expect(formatUnitPrice({ current_price: 1.5 }, 1, null)).toBeNull();
  });
});
