import { useProductStore } from "@/store/useActiveProduct";
import { act, renderHook } from "@testing-library/react-native";

describe("Unit Test: Store - useActiveProduct", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.clearActiveProduct();
    });
  });

  it("Initializes with activeProduct as null", () => {
    const { result } = renderHook(() => useProductStore());
    expect(result.current.activeProduct).toBeNull();
  });

  it("Updates activeProduct when setActiveProduct is called", () => {
    const { result } = renderHook(() => useProductStore());
    const mockProduct = { id: "123", name: "Test Product" };

    act(() => {
      result.current.setActiveProduct(mockProduct);
    });

    expect(result.current.activeProduct).toEqual(mockProduct);
  });

  it("Clears activeProduct when clearActiveProduct is called", () => {
    const { result } = renderHook(() => useProductStore());

    act(() => {
      result.current.setActiveProduct({ id: "123", name: "Test" });
    });

    expect(result.current.activeProduct).not.toBeNull();

    act(() => {
      result.current.clearActiveProduct();
    });

    expect(result.current.activeProduct).toBeNull();
  });
});
