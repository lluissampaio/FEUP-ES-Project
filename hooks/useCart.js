import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

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

  // Remove valores undefined para evitar erro do Firebase
  const sanitizeItems = (items) => {
    return items.map(item => {
      const sanitized = { ...item };
      Object.keys(sanitized).forEach(key => {
        if (sanitized[key] === undefined) {
          sanitized[key] = null;
        }
      });
      return sanitized;
    });
  };

  const saveToFirestore = async (newItems) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "users", user.uid, "cart", "default");
    try {
      const cleanItems = sanitizeItems(newItems);
      await setDoc(cartRef, { items: cleanItems }, { merge: true });
    } catch (err) {
      console.error("Erro ao guardar carrinho:", err);
      setError("Erro ao sincronizar com base de dados");
    }
  };

  const addProduct = async (product, quantityToAdd = 1, storeId = null) => {
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.id === product.id 
            ? { 
                ...p, 
                quantity: p.quantity + quantityToAdd,
                selectedStoreId: storeId || p.selectedStoreId || null 
              } 
            : p
        );
      } else {
        next = [...prev, { 
          ...product, 
          quantity: quantityToAdd, 
          selectedStoreId: storeId || null,
          originalPrice: product.originalPrice || null 
        }];
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
      let next = prev.map((p) => {
        if (p.id === id) {
          return { ...p, quantity: p.quantity + delta };
        }
        return p;
      });

      next = next.filter(p => p.quantity > 0);

      saveToFirestore(next);
      return next;
    });
  };

  const updateItemStore = async (productId, storeId) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, selectedStoreId: storeId || null };
        }
        return p;
      });
      saveToFirestore(next);
      return next;
    });
  };

  const updateAllItemsStore = async (storeId) => {
    setProducts((prev) => {
      const next = prev.map((p) => ({
        ...p,
        selectedStoreId: storeId || null
      }));
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
    return sum + (price * p.quantity);
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
    clear 
  };
}
