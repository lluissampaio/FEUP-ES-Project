import useCart from "@/hooks/useCart";
import { act, renderHook } from "@testing-library/react-native";

test("remover um único produto do carrinho", () => {
  const { result } = renderHook(() =>
    useCart([
      { id: "1", name: "Leite", price: 0.89 },
      { id: "2", name: "Pão", price: 1.2 },
    ]),
  );

  act(() => result.current.remove("1"));
  expect(result.current.products).toHaveLength(1);
  expect(result.current.products[0].id).toBe("2");
});

test("atualizar quantidade de um produto", () => {
  const { result } = renderHook(() =>
    useCart([{ id: "1", name: "Leite", price: 0.89 }]),
  );

  expect(result.current.products[0].quantity).toBe(1);
  act(() => result.current.updateQuantity("1", 1));
  expect(result.current.products[0].quantity).toBe(2);
  expect(result.current.total).toBeCloseTo(1.78);

  act(() => result.current.updateQuantity("1", -1));
  expect(result.current.products[0].quantity).toBe(1);

  // Não deve baixar de 1
  act(() => result.current.updateQuantity("1", -1));
  expect(result.current.products[0].quantity).toBe(1);
});
