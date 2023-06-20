import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { session, setSession } = useAppStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!session) {
      router.push("/");
    }
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error while signing out", error);

    setSession(null);
    router.push("/");
  }

  return (
    <nav className="bg-blue-800 text-white flex justify-between p-5">
      <div>
        <img
          src="https://avatars.githubusercontent.com/u/76592198?s=200&v=4"
          width="35"
          height="35"
          style={{
            border: "1px solid white",
            borderRadius: "6px",
          }}
        />
      </div>
      <Button variant="secondary" onClick={() => signOut()}>
        Log Out
      </Button>
    </nav>
  );
}
