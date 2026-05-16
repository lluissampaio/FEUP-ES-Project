// hooks/useActiveLocation.js
import { useUserLocation } from "./useUserLocation";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@location_override";

export function useActiveLocation() {
  const {
    location: gpsLocation,
    isLoading: isGpsLoading,
    refreshLocation,
  } = useUserLocation();
  const [override, setOverride] = useState(null);
  const [isLoadingOverride, setIsLoadingOverride] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setOverride(JSON.parse(stored));
      setIsLoadingOverride(false);
    });
  }, []);

  const isLoading = isLoadingOverride || isGpsLoading;
  const location = override
    ? { latitude: override.lat, longitude: override.lon }
    : gpsLocation;

  const setManualLocation = async (loc) => {
    const data = {
      type: "manual",
      lat: loc.latitude,
      lon: loc.longitude,
      name: loc.displayString,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOverride(data);
  };

  const clearOverride = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setOverride(null);
  };

  return {
    location,
    isLoading,
    override,
    setManualLocation,
    clearOverride,
    refreshLocation,
  };
}
