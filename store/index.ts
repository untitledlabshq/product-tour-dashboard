import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  session: any;
  setSession: (session: any) => void;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set(() => ({ session })),
    }),
    {
      name: "bear-storage",
    }
  )
);
