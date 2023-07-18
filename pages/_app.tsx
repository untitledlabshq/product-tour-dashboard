import { useAppStore } from "@/store";
import "@/styles/globals.css";
import { supabase } from "@/utils/client";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
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
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>

      <article
        className={
          "min-h-screen bg-neutral-50 dark:bg-primary-dark dark:text-white " +
          montserrat.className
        }
      >
        <Component {...pageProps} />
      </article>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="dark"
      />
    </>
  );
}
