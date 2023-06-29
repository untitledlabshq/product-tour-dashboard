import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  const { session, setSession } = useAppStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!session) {
      router.push("/");
    } else {
      // Check if session is expired, get new one
      supabase.auth.getSession().then(async (data) => {
        const expiresAt = data.data.session?.expires_at!;
        const expDate = new Date(expiresAt * 1000);
        const hasExpired = !(new Date().getTime() - expDate.getTime());

        if (hasExpired) {
          const newSession = await supabase.auth.refreshSession();
          console.log({ newSession });
        }

        console.log({ data, expiresAt, expDate, hasExpired });
      });
    }
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error while signing out", error);

    setSession(null);
    router.push("/");
  }

  return (
    <nav className="bg-primary text-white flex justify-between p-5">
      <div>
        <Link href="/">
          <img
            src="https://avatars.githubusercontent.com/u/76592198?s=200&v=4"
            width="35"
            height="35"
            style={{
              border: "1px solid white",
              borderRadius: "6px",
            }}
          />
        </Link>
      </div>
      <Button variant="secondary" onClick={() => signOut()}>
        Log Out
      </Button>
    </nav>
  );
}
