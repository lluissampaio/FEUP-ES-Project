import { db } from "@/firebaseConfig";
import { calculateDistance, formatDistance } from "@/utils/distance";
import { formatScheduleTime } from "@/utils/time";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function useSupermarketDetail(storeId, userLocation) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) return;

    async function fetchStore() {
      setLoading(true);
      setError(null);
      try {
        const docSnap = await getDoc(doc(db, "stores", storeId));
        if (!docSnap.exists()) {
          setError("not_found");
          return;
        }
        const dbData = docSnap.data();

        const today = new Date();
        const currentMinutes = today.getHours() * 60 + today.getMinutes();
        const todayDayIndex = today.getDay();
        const todaySchedule = dbData.schedule ? dbData.schedule[todayDayIndex] : null;

        let isOpen = false;
        if (todaySchedule) {
          isOpen = currentMinutes >= todaySchedule.opening && currentMinutes <= todaySchedule.closing;
        }

        const weeklySchedule = DISPLAY_ORDER.map((dayIndex) => {
          const daySchedule = dbData.schedule ? dbData.schedule[dayIndex] : null;
          return {
            dayName: DAY_NAMES[dayIndex],
            isToday: dayIndex === todayDayIndex,
            timeRange: daySchedule
              ? `${formatScheduleTime(daySchedule.opening)} - ${formatScheduleTime(daySchedule.closing)}`
              : "Fechado",
          };
        });

        const dist =
          dbData.location && userLocation?.latitude && userLocation?.longitude
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                dbData.location.latitude,
                dbData.location.longitude,
              )
            : null;

        setStore({
          id: docSnap.id,
          name: dbData.name || "Sem Nome",
          isOpen,
          formattedDistance: formatDistance(dist),
          weeklySchedule,
        });
      } catch (err) {
        console.error("Erro ao buscar loja:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [storeId, userLocation]);

  return { store, loading, error };
}