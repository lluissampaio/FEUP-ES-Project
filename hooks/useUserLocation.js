import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        const request = await Location.requestForegroundPermissionsAsync();
        status = request.status;
      }

      if (status !== "granted") {
        // TODO: lógica de fallback para ler a Localização Predefinida
        console.warn("Permissão GPS negada. Falta implementar o fallback.");
        setError("Permissão negada");
        return;
      }

      let loc = await Location.getLastKnownPositionAsync();

      if (!loc) {
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout: Erro no GPS")), 5000),
        );
        loc = await Promise.race([locationPromise, timeoutPromise]);
      }

      if (loc) {
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    } catch (err) {
      console.warn("Aviso GPS:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, isLoading, error, refreshLocation: fetchLocation };
}
