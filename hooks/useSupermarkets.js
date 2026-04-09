import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

// Utilizamos a fórmula de Haversine para distâncias em linha reta esférica.
// É uma aproximação suficientemente precisa para este caso de uso e poupa 
// os custos associados a usar APIs de routing pagas
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`;
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
          
          let dist = null;
          // Fallback de segurança (Null Safety). 
          if (dbData.location && userLat && userLon) {
            dist = calculateDistance(userLat, userLon, dbData.location.latitude, dbData.location.longitude);
          }

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
            rawDistance: dist,
            formattedDistance: dist ? `${dist.toFixed(1)} km` : "N/A",
            isOpen, 
            scheduleToday 
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