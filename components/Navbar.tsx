import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "@/assets/TooltipLogo.svg";
import PrimaryButton from "./PrimaryButton";

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
    <nav className="bg-primary dark:bg-gray-900 text-white flex justify-between items-center py-3 px-10">
      <div>
        <Link href="/">
          <img
            src={Logo.src}
          />
        </Link>
      </div>
      <PrimaryButton className="px-4" variant="secondary" onClick={() => signOut()}>
        Log Out
      </PrimaryButton>
    </nav>
  );
}
