import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export default function useCart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sincronização com Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", "default");
    
    // Listener em tempo real
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setProducts(docSnap.data().items || []);
      } else {
        setProducts([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar carrinho:", err);
      setError("Erro ao carregar carrinho");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Função auxiliar para guardar no Firestore
  const saveToFirestore = async (newItems) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "users", user.uid, "cart", "default");
    try {
      await setDoc(cartRef, { items: newItems }, { merge: true });
    } catch (err) {
      console.error("Erro ao guardar carrinho:", err);
      setError("Erro ao sincronizar com base de dados");
    }
  };

  const addProduct = async (product) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        next = [...prev, { ...product, quantity: 1 }];
      }
      saveToFirestore(next);
      return next;
    });
  };

  const remove = async (id) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToFirestore(next);
      return next;
    });
  };

  const updateQuantity = async (id, delta) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(1, p.quantity + delta);
          return { ...p, quantity: newQty };
        }
        return p;
      });
      saveToFirestore(next);
      return next;
    });
  };

  const updateItemStore = async (id, storeId) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          return { ...p, selectedStoreId: storeId };
        }
        return p;
      });
      saveToFirestore(next);
      return next;
    });
  };

  const clear = async () => {
    setProducts([]);
    saveToFirestore([]);
  };

  const total = products.reduce((sum, p) => {
    let price = p.currentPrice;
    if (p.selectedStoreId && p.prices && p.prices[p.selectedStoreId]) {
      price = p.prices[p.selectedStoreId].current_price;
    }
    return sum + price * p.quantity;
  }, 0);

  return { products, total, loading, error, addProduct, remove, updateQuantity, updateItemStore, clear };
}
