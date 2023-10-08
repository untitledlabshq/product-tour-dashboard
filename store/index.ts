import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  session: any;
  congrats: boolean;
  setSession: (session: any) => void;
  setCongrats: (value: boolean) => void;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set(() => ({ session })),

      congrats: false,
      setCongrats: (value) =>
        set(() => ({
          congrats: value,
        })),
    }),
    {
      name: "bear-storage",
    }
  )
);
