import { db } from "@/firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), limit(20));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
          const dbData = doc.data();
          const formattedCapacity = `${dbData.capacity} ${dbData.measurement_unit}`;

          let bestStore = "";
          let currentPrice = 0;
          let originalPrice = null;
          let isPromo = false;

          if (dbData.prices && Object.keys(dbData.prices).length > 0) {
            const [winningStore, winningData] = Object.entries(
              dbData.prices,
            ).reduce((prev, curr) =>
              prev[1].current_price < curr[1].current_price ? prev : curr,
            );
            bestStore = winningStore;
            currentPrice = winningData.current_price;
            isPromo =
              winningData.is_promo === true &&
              winningData.original_price != null;
            originalPrice = isPromo ? winningData.original_price : null;
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

        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}
