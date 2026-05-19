import { auth, db } from "@/firebaseConfig";
import { useCartStore } from "@/store/useCartStore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";

const sanitizeItems = (items) =>
  items.map((item) => {
    const sanitized = { ...item };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) sanitized[key] = null;
    });
    return sanitized;
  });

export default function useCart() {
  const {
    products,
    loading,
    error,
    setProducts,
    setLoading,
    setError,
    addProductLocal,
    removeLocal,
    updateQuantityLocal,
    updateItemStoreLocal,
    updateAllItemsStoreLocal,
    clearLocal,
  } = useCartStore();

  const isInitialMount = useRef(true);

  // Sincronização com Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const cartRef = doc(db, "users", user.uid, "cart", "default");
      const unsubscribeSnapshot = onSnapshot(
        cartRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProducts(docSnap.data().items ?? []);
          } else {
            setProducts([]);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Erro no snapshot do carrinho:", err);
          setError("Erro ao carregar carrinho");
          setLoading(false);
        },
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, [setProducts, setLoading, setError]);

  const saveToFirestore = useCallback(
    async (newItems) => {
      const user = auth.currentUser;
      if (!user) return;
      const cartRef = doc(db, "users", user.uid, "cart", "default");
      try {
        await setDoc(cartRef, { items: sanitizeItems(newItems) });
      } catch (err) {
        console.error("Erro ao salvar carrinho:", err);
        setError("Erro ao guardar alterações");
      }
    },
    [setError],
  );

  const addProduct = useCallback(
    async (product, quantityToAdd = 1, storeId = null) => {
      // Atualiza localmente primeiro para feedback instantâneo
      addProductLocal(product, quantityToAdd, storeId);

      // Se houver user, salva no Firestore (o snapshot depois confirma)
      const user = auth.currentUser;
      if (user) {
        // Precisamos do estado atualizado. Como o set do zustand é síncrono mas
        // o products aqui pode estar desatualizado por causa da closure,
        // idealmente o useCartStore deveria expor o estado atualizado.
        // Por simplicidade, recalculamos o next aqui ou usamos o store diretamente
        const currentProducts = useCartStore.getState().products;
        await saveToFirestore(currentProducts);
      }
    },
    [addProductLocal, saveToFirestore],
  );

  const remove = useCallback(
    async (id) => {
      removeLocal(id);
      const user = auth.currentUser;
      if (user) {
        const currentProducts = useCartStore.getState().products;
        await saveToFirestore(currentProducts);
      }
    },
    [removeLocal, saveToFirestore],
  );

  const updateQuantity = useCallback(
    async (id, delta) => {
      updateQuantityLocal(id, delta);
      const user = auth.currentUser;
      if (user) {
        const currentProducts = useCartStore.getState().products;
        await saveToFirestore(currentProducts);
      }
    },
    [updateQuantityLocal, saveToFirestore],
  );

  const updateItemStore = useCallback(
    async (productId, storeId) => {
      updateItemStoreLocal(productId, storeId);
      const user = auth.currentUser;
      if (user) {
        const currentProducts = useCartStore.getState().products;
        await saveToFirestore(currentProducts);
      }
    },
    [updateItemStoreLocal, saveToFirestore],
  );

  const updateAllItemsStore = useCallback(
    async (storeId) => {
      updateAllItemsStoreLocal(storeId);
      const user = auth.currentUser;
      if (user) {
        const currentProducts = useCartStore.getState().products;
        await saveToFirestore(currentProducts);
      }
    },
    [updateAllItemsStoreLocal, saveToFirestore],
  );

  const clear = useCallback(async () => {
    clearLocal();
    const user = auth.currentUser;
    if (user) {
      await saveToFirestore([]);
    }
  }, [clearLocal, saveToFirestore]);

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
