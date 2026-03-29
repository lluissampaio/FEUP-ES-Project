import { useState } from "react";

export default function useCart(initialProducts = []) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState(null);

  const clear = () => {
    if (products.length === 0) {
      setError("Impossível limpar carrinho vazio");
      return;
    }
    setProducts([]);
    setError(null);
  };

  const total = products.reduce((sum, p) => sum + p.price, 0);

  return { products, total, error, clear };
}
