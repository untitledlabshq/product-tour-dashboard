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
import { ConnectKitProvider, getDefaultConfig, SIWESession } from "connectkit";
import { siweClient } from "@/constants/siweClient";
import CongratsDialog from "@/components/CongratsDialog";
import NavigationLoader from "@/components/NavigationLoader";
import { ConnectKitCustomTheme } from "@/constants";
import { GetServerSideProps } from "next";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import Layout from "@/components/layout";
import { useSearchParams } from "next/navigation";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const getServerSideProps: GetServerSideProps = async () => {
  console.log("Running on the server!");
  return {
    props: {},
  };
};

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
      // Check if session is expired, get new one
      supabase.auth.getSession().then(async (data) => {
        const expiresAt = data.data.session?.expires_at!;

        // Consider expiry as half of expiresAt time since it somehow stops working beforehand
        const hasExpired =
          new Date().getTime() > new Date((expiresAt * 1000) / 2).getTime();

        if (hasExpired) {
          const newSession = await supabase.auth.refreshSession();
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

  // If page layout is available, use it. Else return the page
  // const getLayout =
  // // @ts-ignore
  //   Component.getLayout === true
  //     ? (page: any) => <Layout>{page}</Layout>
  //     : (page: any) => page;

  return (
    <>
      <Head>
        <link rel="icon" href="/icon.jpg" />
      </Head>

      <NavigationLoader />

      <WagmiConfig config={config}>
        <siweClient.Provider
          // Optional parameters
          enabled={true} // defaults true
          nonceRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
          sessionRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
          signOutOnDisconnect={true} // defaults true
          signOutOnAccountChange={true} // defaults true
          signOutOnNetworkChange={true} // defaults true
        >
          <ConnectKitProvider
            theme="midnight"
            customTheme={ConnectKitCustomTheme}
          >
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
                {/* {getLayout(<Component {...pageProps} />)} */}
                <Component {...pageProps} />
              </article>
            </SessionContextProvider>
          </ConnectKitProvider>
        </siweClient.Provider>
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
      <CongratsDialog />
    </>
  );
}
