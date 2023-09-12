import { useAppStore } from "@/store";
import "@/styles/globals.css";
import { supabase } from "@/utils/client";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WagmiConfig, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";

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

  const config = createConfig(
    getDefaultConfig({
      // Required API Keys
      alchemyId: "CGVa13LLR40MLOYRpnwZmrRNsGnasvtJ", // or infuraId
      walletConnectProjectId: "2df30772655cd76de2f649cf7ad4bc6f",

      chains: [polygon],

      // Required
      appName: "Buildoor",

      // Optional
      appDescription: "Product Tour",
      appUrl: "https://product-tour-dashboard.vercel.app/", // your app's url
      appIcon: "https://product-tour-dashboard.vercel.app/icon.jpg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/icon.jpg" />
      </Head>

      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <article
            className={
              "min-h-screen bg-neutral-50 dark:bg-primary-dark dark:text-white " +
              montserrat.className
            }
          >
            <Component {...pageProps} />
          </article>
        </ConnectKitProvider>
      </WagmiConfig>
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
