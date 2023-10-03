import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";
import { supabase } from "@/utils/client";
import Head from "next/head";
import { ConnectKitButton, useSIWE } from "connectkit";
import SIWEButton from "@/components/SIWEButton";

export default function Home() {
  const { session, setSession } = useAppStore();

  const { isSignedIn } = useSIWE();

  const [mounted, setMounted] = useState(false);

  const router = useRouter();

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

  if (!session && !isSignedIn) {
    return (
      <>
        <Head>
          <title>Product Tours by Buildoor</title>
        </Head>
        {mounted && (
          <main className="min-h-screen grid place-items-center dark:text-white">
            <div className="w-5/6 lg:w-[30%] mx-auto">
              <img
                src="/logo_white.png"
                alt="Buildoor Logo"
                className="mb-10"
              />
              <div className="flex items-center justify-center space-x-3">
                <SIWEButton />
              </div>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={["google"]}
                redirectTo={window.location.origin}
              />
            </div>
          </main>
        )}
      </>
    );
  } else {
    router.push("/dashboard");
    return;
  }
}
