import { useState, useEffect } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  "https://pualfqvlljzjrdpsrcwy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YWxmcXZsbGp6anJkcHNyY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcwMTEwMTcsImV4cCI6MjAwMjU4NzAxN30.v3JFuKE6MdoWZDUxW8jdIzYCnrFAJ0k_zuTooUGFNyk"
);

export default function Home() {
  const [session, setSession] = useState(null as Session | null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <>
        <div className="md:w-1/2 mx-auto">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </div>
      </>
    );
  } else {
    return <div>Logged in!</div>;
  }
}
