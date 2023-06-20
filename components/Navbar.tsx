import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { session, setSession } = useAppStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(session);
    setMounted(true);
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error while signing out", error);

    setSession(null);
    router.push("/");
  }

  return (
    <nav className="bg-gray-100 flex justify-between px-3 py-5">
      <h1>Heading</h1>
      {mounted && <p>{session ? session.user.email : ""}</p>}
      <button onClick={() => signOut()}>Log out</button>
    </nav>
  );
}
