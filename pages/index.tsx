import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";
import { supabase } from "@/utils/client";

export default function Home() {
  const { session, setSession } = useAppStore();

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

  if (!session) {
    return (
      <>
        {mounted && (
          <main className="min-h-screen grid place-items-center dark:text-white">
            <div className="w-5/6 lg:w-[30%] mx-auto">
              <h1 className="mt-3 text-2xl font-medium text-center">
                Untitled Labs
              </h1>
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
