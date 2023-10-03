import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";
import { useSIWE } from "connectkit";
import SIWEButton from "./SIWEButton";

export default function Navbar() {
  const { session, setSession } = useAppStore();
  const { isSignedIn } = useSIWE();
  const router = useRouter();

  // const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // setMounted(true);

    if (!session && !isSignedIn) {
      router.push("/");
    }
  }, [session, isSignedIn]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error while signing out", error);

    setSession(null);
    router.push("/");
  }

  return (
    <nav className="bg-primary dark:bg-gray-900 text-white flex justify-between items-center py-3 px-10 md:px-12">
      <div>
        <Link href="/">
          <img src="/logo_white.png" alt="Logo" width={120} />
        </Link>
      </div>
      <div className="flex items-center space-x-3">
        <Link href="/profile">Profile</Link>

        {isSignedIn ? (
          <SIWEButton />
        ) : (
          <PrimaryButton
            className="px-4"
            variant="secondary"
            onClick={() => signOut()}
          >
            Log Out
          </PrimaryButton>
        )}
      </div>
    </nav>
  );
}
