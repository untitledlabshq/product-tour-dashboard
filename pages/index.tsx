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
    });

    setMounted(true);

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <>
        {mounted && (
          <div className="md:w-1/2 mx-auto">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
            />
          </div>
        )}
      </>
    );
  } else {
    router.push("/dashboard");
    return;
  }
}
