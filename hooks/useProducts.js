import { db } from "@/firebaseConfig";
import { mapDocToProduct } from "@/utils/mappers";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function usePaginatedProducts(category, searchQuery) {
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    const normalizeText = (text) =>
      (text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const buildInitialQuery = () => {
      const productsRef = collection(db, "products");
      const cleanSearch = normalizeText(debouncedQuery);

      if (cleanSearch) {
        return query(
          productsRef,
          orderBy("name_for_search"),
          where("name_for_search", ">=", cleanSearch),
          where("name_for_search", "<=", cleanSearch + "\uf8ff"),
          limit(40),
        );
      }

      if (category && category !== "tudo") {
        return query(
          productsRef,
          where("category", "==", category),
          orderBy("name_for_search"),
          limit(20),
        );
      }

      return query(productsRef, orderBy("name_for_search"), limit(20));
    };

    async function fetchInitial() {
      setLoading(true);
      setHasMore(true);
      try {
        const q = buildInitialQuery();
        const snapshot = await getDocs(q);

        let fetchedProducts = snapshot.docs.map(mapDocToProduct);
        const cleanSearch = normalizeText(debouncedQuery);

        if (cleanSearch && category && category !== "tudo") {
          fetchedProducts = fetchedProducts.filter(
            (p) => p.category === category,
          );
        }

        setProducts(fetchedProducts);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length >= 20);
      } catch (error) {
        console.error("Firestore initial fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, [category, debouncedQuery]);

  const loadMore = async () => {
    if (
      !hasMore ||
      loading ||
      loadingMore ||
      !lastVisible ||
      searchQuery.trim()
    )
      return;

    setLoadingMore(true);
    try {
      const productsRef = collection(db, "products");
      let q;

      if (category && category !== "tudo") {
        q = query(
          productsRef,
          where("category", "==", category),
          orderBy("name_for_search"),
          startAfter(lastVisible),
          limit(20),
        );
      } else {
        q = query(
          productsRef,
          orderBy("name_for_search"),
          startAfter(lastVisible),
          limit(20),
        );
      }

      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(mapDocToProduct);

      setProducts((prev) => [...prev, ...newProducts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error("Firestore pagination error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return { products, loading, loadMore, loadingMore, hasMore };
}
