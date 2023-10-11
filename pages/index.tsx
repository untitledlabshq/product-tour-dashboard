import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";
import { supabase } from "@/utils/client";
import Head from "next/head";
import { ConnectKitButton, useSIWE } from "connectkit";
import { useAccount } from "wagmi";
import bgImage from "@/assets/BG.png";
import Link from "next/link";
import CustomConnectButton from "@/components/CustomConnectButton";
import googleIcon from "@/assets/google.png";

export default function Home() {
  const { session, setSession } = useAppStore();

  const { isSignedIn, data } = useSIWE();

  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const { address } = useAccount();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session) {
        router.push("/");
      }
    });

    setMounted(true);

    return () => subscription.unsubscribe();
  }, []);

  function signInWithGoogle() {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  if (
    (!session && !isSignedIn) ||
    (isSignedIn && (!data || data?.address !== address))
  ) {
    return (
      <>
        <Head>
          <title>Product Tours by Buildoor</title>
        </Head>
        {mounted && (
          <>
            <nav className="bg-primary dark:bg-gray-900 text-white flex justify-between items-center py-4 px-10 md:px-12">
              <Link href="/">
                <img src="/logo_white.png" alt="Logo" width={120} />
              </Link>
              <div className="flex items-center space-x-5">
                {address && <ConnectKitButton />}
                <img src="/icon-only.png" alt="Icon" width={30} />
              </div>
            </nav>

            <main
              className="py-5 min-h-screen grid place-items-center text-white bg-[#00000E]"
              style={{
                background: `url('${bgImage.src}')`,
                backgroundSize: "cover",
                backgroundPosition: "bottom",
              }}
            >
              <div className="min-w-fit mx-auto border border-primary-gray p-5 px-12 rounded-xl bg-primary-purple">
                <div className="mt-5 flex flex-col items-center">
                  <img src="/logo_white.png" alt="Buildoor Logo" width={200} />
                  <p className="mt-3 text-xs text-center max-w-xs break-words text-primary-gray">
                    Get ready to give an immersive experience for your dApp with us
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    className="mb-3 flex justify-center items-center space-x-2 p-3 rounded-xl border border-primary-gray w-full"
                    onClick={() => signInWithGoogle()}
                  >
                    <img src={googleIcon.src} alt="Google Logo" width={24} />
                    <span className="font-semibold text-sm">
                      Login with Google
                    </span>
                  </button>
                  <CustomConnectButton />
                </div>
                <div className="mt-5 w-full text-primary-gray text-center">
                  or
                </div>

                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        radii: {
                          borderRadiusButton: "10px",
                          inputBorderRadius: "10px",
                        },
                        colors: {
                          brand: "#6347F4",
                          brandAccent: "#583af0",
                          inputText: "white",
                          inputLabelText: "white",
                          inputBorder: "#96A0AD"
                        },
                        fonts: {
                          bodyFontFamily: "Montserrat, sans-serif",
                          inputFontFamily: "Montserrat, sans-serif",
                          labelFontFamily: "Montserrat, sans-serif",
                          buttonFontFamily: "Montserrat, sans-serif",
                        },
                      },
                    },
                  }}
                  providers={[]}
                  redirectTo={window.location.origin}
                />
              </div>
            </main>
          </>
        )}
      </>
    );
  } else {
    router.push("/dashboard");
    return;
  }
}
