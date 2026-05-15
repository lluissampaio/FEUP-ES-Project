import { db } from "@/firebaseConfig";
import { useProductStore } from "@/store/useActiveProduct";
import { mapDocToProduct } from "@/utils/mappers";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

// Sorts product.prices entries ascending by current_price. Returns [] when prices is falsy.
const sortPrices = (prices) => {
  if (!prices) return [];
  return Object.entries(prices).sort(
    (a, b) => a[1].current_price - b[1].current_price,
  );
};

// Returns a formatted unit-price string or null when any input is missing.
export const formatUnitPrice = (priceData, capacity, measurementUnit) => {
  if (!capacity || !measurementUnit || !priceData?.current_price) return null;

  const displayUnit =
    measurementUnit.toLowerCase() === "g" ? "kg" : measurementUnit;

  return `${priceData.unit_price.toFixed(2)}€ / ${displayUnit}`;
};

export function useProductDetail(id) {
  const activeProduct = useProductStore((state) => state.activeProduct);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loading, setLoading] = useState(!activeProduct);

  const product = activeProduct ?? fetchedProduct;

  useEffect(() => {
    if (activeProduct || !id) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (!cancelled && snap.exists()) {
          setFetchedProduct(mapDocToProduct(snap));
        }
      } catch (err) {
        console.error("useProductDetail fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id, activeProduct]);

  const [quantity, setQuantity] = useState(1);
  const [selectedStoreKey, setSelectedStoreKey] = useState(null);

  const handleDecrement = useCallback(
    () => setQuantity((q) => Math.max(1, q - 1)),
    [],
  );
  const handleIncrement = useCallback(
    () => setQuantity((q) => Math.min(99, q + 1)),
    [],
  );

  // Stable identity for the lifetime of the hook instance.

  const handleSelectStore = useCallback((key) => {
    setSelectedStoreKey(key);
  }, []);

  const sortedPrices = useMemo(() => sortPrices(product?.prices), [product]);

  useEffect(() => {
    if (sortedPrices.length > 0 && selectedStoreKey === null) {
      setSelectedStoreKey(sortedPrices[0][0]);
    }
  }, [sortedPrices, selectedStoreKey]);

  const selectedPrice = useMemo(() => {
    if (sortedPrices.length === 0) return 0;
    const entry = selectedStoreKey
      ? sortedPrices.find(([key]) => key === selectedStoreKey)
      : null;
    return (entry ?? sortedPrices[0])[1].current_price;
  }, [sortedPrices, selectedStoreKey]);

  const totalPrice = useMemo(
    () => selectedPrice * quantity,
    [selectedPrice, quantity],
  );

  return {
    product,
    loading,
    quantity,
    selectedStoreKey,
    sortedPrices,
    selectedPrice,
    totalPrice,
    handleDecrement,
    handleIncrement,
    handleSelectStore,
  };
}
