import { db } from "@/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, startAt, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function useProducts(searchQuery){

    const [products, setProducts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const debouncedQuery = useDebounce(searchQuery, 2000);
    const normalizedQuery = debouncedQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const extractProductData = async (q) => {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const dbData = doc.data();

        const formattedCapacity = `${dbData.capacity} ${dbData.measurement_unit}`;

        let bestStore = "";
        let currentPrice = 0;
        let originalPrice = null;
        let isPromo = false;

        if (dbData.prices && Object.keys(dbData.prices).length > 0) {
            const [winningStore, winningData] = Object.entries(dbData.prices).reduce((prev, curr) => {
                return prev[1].current_price < curr[1].current_price ? prev : curr;
            });
            bestStore = winningStore;
            currentPrice = winningData.current_price;
            originalPrice = winningData.original_price;
            isPromo = winningData.is_promo;
        }
        return {
          id: doc.id,
          name: dbData.name,
          formattedCapacity,
          currentPrice,
          originalPrice,
          isPromo,
          bestStore,
          image_ref: dbData.image_ref,
        };
      });
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === 20);
      return data;
    }
    useEffect(() => {
        if (!normalizedQuery) {
            setProducts([]);
            setLoading(false);
            return;
        }
        async function fetchInitialProducts() {
          try {
            const q = query(collection(db, "products"), 
              orderBy("name_for_search"), 
              where("name_for_search", ">=", normalizedQuery), 
              where("name_for_search", "<=", normalizedQuery + '\uf8ff'), 
              limit(20))
            const data = await extractProductData(q);
            setProducts(data);
          } catch (error) {
              console.error("Erro ao buscar produtos:", error);
          } finally {
              setLoading(false);
          }
        }
        fetchInitialProducts();
      }, [normalizedQuery]);

      const loadMore = async () => {
        if (!hasMore || loading || !lastVisible) return;
        setLoadingMore(true);
        try {
            const q = query(collection(db, "products"), 
              orderBy("name_for_search"), 
              where("name_for_search", ">=", normalizedQuery), 
              where("name_for_search", "<=", normalizedQuery + '\uf8ff'), 
              startAt(lastVisible),
              limit(20))
            const data = await extractProductData(q);
            setProducts(prev => [...prev, ...data]);
          } catch (error) {
              console.error("Erro ao buscar produtos:", error);
          } finally {
              setLoadingMore(false);
          }
      };

      return { products, loading, loadMore, loadingMore, hasMore };
}