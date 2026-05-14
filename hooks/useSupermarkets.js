import { db } from "@/firebaseConfig";
import { calculateDistance, formatDistance } from "@/utils/distance";
import { formatTime } from "@/utils/time";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export function useSupermarkets(userLocation) {
  const [rawSupermarkets, setRawSupermarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupermarkets() {
      try {
        const querySnapshot = await getDocs(collection(db, "stores"));
        const data = querySnapshot.docs.map((doc) => {
          const dbData = doc.data();
          const today = new Date();
          const currentMinutes = today.getHours() * 60 + today.getMinutes();
          const todaySchedule = dbData.schedule ? dbData.schedule[today.getDay()] : null;
          
          let isOpen = false;
          let scheduleToday = "Indisponível";

          if (todaySchedule) {
            isOpen = currentMinutes >= todaySchedule.opening && currentMinutes <= todaySchedule.closing;
            scheduleToday = `${formatTime(todaySchedule.opening)}-${formatTime(todaySchedule.closing)}`;
          }

          return {
            id: doc.id,
            name: dbData.name || "Sem Nome",
            location: dbData.location, // Guardamos as coordenadas brutas para cálculo posterior
            isOpen, 
            scheduleToday 
          };
        });
        setRawSupermarkets(data);
      } catch (error) {
        console.error("Erro ao buscar supermercados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSupermarkets();
  }, []);

  // 2. Processamento Local: Recalcula a distância síncronamente sempre que o GPS atualizar
  const supermarkets = useMemo(() => {
    return rawSupermarkets.map(store => {
      let dist = null;
      if (store.location && userLocation?.latitude && userLocation?.longitude) {
        dist = calculateDistance(
          userLocation.latitude, userLocation.longitude, 
          store.location.latitude, store.location.longitude
        );
      }
      return {
        ...store,
        rawDistance: dist,
        formattedDistance: formatDistance(dist),
      };
    });
  }, [rawSupermarkets, userLocation]);

  return { supermarkets, loading };
}