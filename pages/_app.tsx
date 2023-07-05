import { useAppStore } from "@/store";
import "@/styles/globals.css";
import { supabase } from "@/utils/client";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { useEffect } from "react";

const montserrat = Montserrat({
  // weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const store = useAppStore();

  useEffect(() => {
    if (store.session) {
      // Check if session is expired, get new one
      supabase.auth.getSession().then(async (data) => {
        const expiresAt = data.data.session?.expires_at!;

        // Consider expiry as half of expiresAt time since it somehow stops working beforehand
        const hasExpired =
          new Date().getTime() > new Date((expiresAt * 1000) / 2).getTime();

        if (hasExpired) {
          const newSession = await supabase.auth.refreshSession();
          console.log({ newSession });
          store.setSession(newSession.data.session);
        }
      });
    }
  }, []);

  return (
    <article
      className={
        "min-h-screen bg-neutral-50 dark:bg-neutral-900 dark:text-white " +
        montserrat.className
      }
    >
      <Component {...pageProps} />
    </article>
  );
}
