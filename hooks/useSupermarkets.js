import { db } from "@/firebaseConfig";
import { calculateDistance } from "@/utils/distance";
import { formatTime } from "@/utils/time";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";


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