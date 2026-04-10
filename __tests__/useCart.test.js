import useCart from "@/hooks/useCart";
import { act, renderHook } from "@testing-library/react-native";

test("limpar carrinho com produtos remove todos", () => {
  const { result } = renderHook(() =>
    useCart([
      { id: "1", name: "Leite", price: 0.89 },
      { id: "2", name: "Pão", price: 1.2 },
    ]),
  );

  expect(result.current.products).toHaveLength(2);
  act(() => result.current.clear());
  expect(result.current.products).toHaveLength(0);
});

test("limpar carrinho vazio mostra erro", () => {
  const { result } = renderHook(() => useCart([]));

  act(() => result.current.clear());
  expect(result.current.error).toBe("Impossível limpar carrinho vazio");
});
