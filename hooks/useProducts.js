import { db } from "@/firebaseConfig";
import { mapDocToProduct } from "@/utils/mappers";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

const searchCache = new Map();

const extractProductData = async (q) => {
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(mapDocToProduct);
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] ?? null;
  const fetchedHasMore = querySnapshot.docs.length === 20;
  return { data, lastDoc, fetchedHasMore };
};

export default function useProducts(searchQuery) {
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, 500);
  const normalizedQuery = debouncedQuery
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  useEffect(() => {
    if (!normalizedQuery) {
      setProducts([]);
      setLoading(false);
      setLastVisible(null);
      setHasMore(true);
      return;
    }

    if (searchCache.has(normalizedQuery)) {
      const cached = searchCache.get(normalizedQuery);
      setProducts(cached.data);
      setLastVisible(cached.lastDoc);
      setHasMore(cached.hasMore);
      setLoading(false);
      return;
    }

    async function fetchInitialProducts() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          orderBy("name_for_search"),
          where("name_for_search", ">=", normalizedQuery),
          where("name_for_search", "<=", normalizedQuery + "\uf8ff"),
          limit(20),
        );
        const { data, lastDoc, fetchedHasMore } = await extractProductData(q);

        searchCache.set(normalizedQuery, {
          data,
          lastDoc,
          hasMore: fetchedHasMore,
        });

        setProducts(data);
        setLastVisible(lastDoc);
        setHasMore(fetchedHasMore);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialProducts();
  }, [normalizedQuery]);

  const loadMore = async () => {
    if (!hasMore || loading || loadingMore || !lastVisible) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "products"),
        orderBy("name_for_search"),
        where("name_for_search", ">=", normalizedQuery),
        where("name_for_search", "<=", normalizedQuery + "\uf8ff"),
        startAt(lastVisible),
        limit(20),
      );
      const { data, lastDoc, fetchedHasMore } = await extractProductData(q);

      const merged = [
        ...(searchCache.get(normalizedQuery)?.data ?? []),
        ...data,
      ];

      searchCache.set(normalizedQuery, {
        data: merged,
        lastDoc,
        hasMore: fetchedHasMore,
      });

      setProducts(merged);
      setLastVisible(lastDoc);
      setHasMore(fetchedHasMore);
    } catch (error) {
      console.error("Erro ao buscar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return { products, loading, loadMore, loadingMore, hasMore };
}
