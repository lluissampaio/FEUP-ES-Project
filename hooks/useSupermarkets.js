import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function useSupermarkets(userLat, userLon) {
  const [supermarkets, setSupermarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupermarkets() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "stores"));
        const data = querySnapshot.docs.map((doc) => {
          const dbData = doc.data();
          const loc = dbData.location;
          
          let dist = null;
          if (loc && userLat && userLon) {
            dist = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);
          }

          return {
            id: doc.id,
            name: dbData.name || "Sem Nome",
            rawDistance: dist,
            formattedDistance: dist ? `${dist.toFixed(1)} km` : "N/A",
          };
        });
        setSupermarkets(data);
      } catch (error) {
        console.error("Erro ao buscar supermercados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSupermarkets();
  }, [userLat, userLon]);

  return { supermarkets, loading };
}