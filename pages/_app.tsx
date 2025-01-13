import "@rainbow-me/rainbowkit/styles.css";
import { useAppStore } from "@/store";
import "@/styles/globals.css";
import { supabase } from "@/utils/client";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, http } from "wagmi";
import * as chains from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { siweClient } from "@/constants/siweClient";
import CongratsDialog from "@/components/CongratsDialog";
import NavigationLoader from "@/components/NavigationLoader";
import { ConnectKitCustomTheme } from "@/constants";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { useSearchParams } from "next/navigation";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Dynamically import the connector code
      const { rainbowPlenaConnector } = await import("@/lib/pleaConfigConnect");
      
      const connectors = connectorsForWallets(
        [
          {
            groupName: "Recommended",
            wallets: [
              rainbowPlenaConnector,
              rainbowWallet
            ],
          },
        ],
        {
          appName: "Buildoor",
          appUrl: "https://product-tour-dashboard.vercel.app/",
          appIcon: "https://product-tour-dashboard.vercel.app/icon.jpg",
          projectId: "2df30772655cd76de2f649cf7ad4bc6f",
        }
      );

      const wagmiConfig = createConfig({
        ...getDefaultConfig({
          connectors,
          walletConnectProjectId: "2df30772655cd76de2f649cf7ad4bc6f",
          //@ts-ignore
          chains: Object.values(chains),
          appName: "Buildoor",
          appDescription: "Product Tour",
          appUrl: "https://product-tour-dashboard.vercel.app/",
          appIcon: "https://product-tour-dashboard.vercel.app/icon.jpg",
        }),
      });
      
      if (isMounted) setConfig(wagmiConfig);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <siweClient.Provider
            enabled={true}
            nonceRefetchInterval={300000}
            sessionRefetchInterval={300000}
            signOutOnDisconnect={true}
            signOutOnAccountChange={true}
            signOutOnNetworkChange={true}
          >
            <ConnectKitProvider
              theme="midnight"
              customTheme={ConnectKitCustomTheme}
            >
              {children}
            </ConnectKitProvider>
          </siweClient.Provider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const store = useAppStore();
  const { setCongrats } = useAppStore();
  const queryParams = useSearchParams();

  useEffect(() => {
    if (queryParams.get("is_success") == "true") {
      setCongrats(true);
      history.replaceState(
        null,
        "",
        window.location.origin + window.location.pathname
      );
    }

    if (store.session) {
      supabase.auth.getSession().then(async (data) => {
        const expiresAt = data.data.session?.expires_at!;
        const hasExpired =
          new Date().getTime() > new Date((expiresAt * 1000) / 2).getTime();

        if (hasExpired) {
          const newSession = await supabase.auth.refreshSession();
          store.setSession(newSession.data.session);
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/icon.jpg" />
      </Head>

      <NavigationLoader />

      <Providers>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}
        >
          <article
            className={
              "min-h-screen bg-neutral-50 dark:bg-primary-dark dark:text-white " +
              montserrat.className
            }
          >
            <Component {...pageProps} />
          </article>
        </SessionContextProvider>
      </Providers>

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
      <CongratsDialog />
    </>
  );
}