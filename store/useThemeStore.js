import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";

const STORAGE_KEY = "@app_theme";

export const useThemeStore = create((set) => ({
  theme: "system",
  initTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ theme: stored });
        Appearance.setColorScheme(stored === "system" ? null : stored);
      }
    } catch (e) {
      console.error("Theme load err:", e);
    }
  },
  setTheme: async (newTheme) => {
    set({ theme: newTheme });
    Appearance.setColorScheme(newTheme === "system" ? null : newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error("Theme save err:", e);
    }
  },
}));