import { auth, db } from "@/firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

const sanitizeItems = (items) =>
  items.map((item) => {
    const sanitized = { ...item };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) sanitized[key] = null;
    });
    return sanitized;
  });

export default function useCart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", "default");

    const unsubscribe = onSnapshot(
      cartRef,
      (docSnap) => {
        setProducts(docSnap.exists() ? (docSnap.data().items ?? []) : []);
        setLoading(false);
      },
      (err) => {
        setError("Erro");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const saveToFirestore = useCallback(async (newItems) => {
    const user = auth.currentUser;
    if (!user) return;
    const cartRef = doc(db, "users", user.uid, "cart", "default");
    try {
      await setDoc(cartRef, { items: sanitizeItems(newItems) });
    } catch (err) {
      setError("Erro");
    }
  }, []);

  const addProduct = useCallback(
    async (product, quantityToAdd = 1, storeId = null) => {
      setProducts((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        const next = existing
          ? prev.map((p) =>
              p.id === product.id
                ? {
                    ...p,
                    quantity: p.quantity + quantityToAdd,
                    selectedStoreId: storeId ?? p.selectedStoreId ?? null,
                  }
                : p,
            )
          : [
              ...prev,
              {
                ...product,
                quantity: quantityToAdd,
                selectedStoreId: storeId ?? null,
                originalPrice: product.originalPrice ?? null,
              },
            ];
        saveToFirestore(next);
        return next;
      });
    },
    [saveToFirestore],
  );

  const remove = useCallback(
    async (id) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        saveToFirestore(next);
        return next;
      });
    },
    [saveToFirestore],
  );

  const updateQuantity = useCallback(
    async (id, delta) => {
      setProducts((prev) => {
        const next = prev
          .map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + delta } : p,
          )
          .filter((p) => p.quantity > 0);
        saveToFirestore(next);
        return next;
      });
    },
    [saveToFirestore],
  );

  const updateItemStore = useCallback(
    async (productId, storeId) => {
      setProducts((prev) => {
        const next = prev.map((p) =>
          p.id === productId ? { ...p, selectedStoreId: storeId ?? null } : p,
        );
        saveToFirestore(next);
        return next;
      });
    },
    [saveToFirestore],
  );

  const updateAllItemsStore = useCallback(
    async (storeId) => {
      setProducts((prev) => {
        const next = prev.map((p) => ({
          ...p,
          selectedStoreId: storeId ?? null,
        }));
        saveToFirestore(next);
        return next;
      });
    },
    [saveToFirestore],
  );

  const clear = useCallback(async () => {
    setProducts([]);
    saveToFirestore([]);
  }, [saveToFirestore]);

  const total = products.reduce((sum, p) => {
    const price =
      p.selectedStoreId && p.prices?.[p.selectedStoreId]
        ? p.prices[p.selectedStoreId].current_price
        : (p.currentPrice ?? 0);
    return sum + price * p.quantity;
  }, 0);

  return {
    products,
    total,
    loading,
    error,
    addProduct,
    remove,
    updateQuantity,
    updateItemStore,
    updateAllItemsStore,
    clear,
  };
}
