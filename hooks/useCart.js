import { useState } from "react";

export default function useCart(initialProducts = []) {
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, quantity: p.quantity || 1 })),
  );
  const [error, setError] = useState(null);

  const remove = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setError(null);
  };

  const updateQuantity = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p,
      ),
    );
  };

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return { products, total, error, remove, updateQuantity };
}
