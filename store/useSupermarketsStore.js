import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { create } from "zustand";

export const useSupermarketsStore = create((set, get) => ({
  supermarkets: [],
  loading: false,
  fetched: false,

  fetchSupermarkets: async () => {
    if (get().fetched || get().loading) return;
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, "stores"));
      const data = querySnapshot.docs.map((doc) => {
        const dbData = doc.data();
        return {
          id: doc.id,
          name: dbData.name || "Sem Nome",
          location: dbData.location || null,
          schedule: dbData.schedule || null,
        };
      });
      set({ supermarkets: data, fetched: true });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
