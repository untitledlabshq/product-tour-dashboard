import { useAppStore } from "@/store";
import { supabase } from "@/utils/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";
import { useSIWE } from "connectkit";
import SIWEButton from "./SIWEButton";
import { useAccount } from "wagmi";
import { useUser } from "@supabase/auth-helpers-react";
import useUserData from "@/hooks/useUserData";
import { API_URL } from "@/constants";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { usePlenaSigning } from "@/hooks/usePlenaSigning";
export default function Navbar() {
  const { session, setSession } = useAppStore();
  const { isSignedIn, data } = useSIWE();
  const { PlenaSignedIn } = usePlenaSigning();
  const { address, status, isConnected } = useAccount();
  const router = useRouter();

  const user = useUser();

  const { userData, encryptedAddress } = useUserData();

  // const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // setMounted(true);
    if (
      (typeof window !== "undefined" &&
        ((!session && !isSignedIn && status !== "reconnecting") ||
          (isSignedIn && (!data || data?.address !== address)))) ||
      PlenaSignedIn
    ) {
      router.push("/");
    }
  }, [session, isSignedIn, status]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn("Error while signing out", error);

    setSession(null);
    router.push("/");
  }

  function checkout() {
    const baseURL = API_URL + "/checkout";
    const params = new URLSearchParams();
    params.set("success_url", window.location.href + "?is_success=true");

    if (session && session?.access_token) {
      params.set("typeOfAuthorization", "web2");
      params.set("identity", session.access_token);
    } else if (isSignedIn && isConnected) {
      if (!userData || !encryptedAddress) {
        toast.error("An error occurred with web3 user");
        return;
      }
      params.set("typeOfAuthorization", "web3");
      params.set("identity", encryptedAddress);
    }
    const url = baseURL + "?" + params.toString();

    // Redirect to Checkout
    window.location.href = url;
  }

  return (
    <nav className="bg-primary dark:bg-gray-900 text-white flex justify-between items-center py-3 px-10 md:px-12">
      <div>
        <Link href={"/dashboard"}>
          <img src="/logo_white.png" alt="Logo" width={120} />
        </Link>
      </div>
      <div className="flex items-center space-x-3">
        {/* <Link href="/profile">Profile</Link> */}
        {userData && (
          <div>
            {userData.is_pro ? (
              <Link
                href={
                  "https://billing.stripe.com/p/login/test_00g28VcFa0cY0YU288"
                }
                target="_blank"
              >
                <div className="group min-w-[1rem] cursor-pointer text-sm duration-300 transition-all px-5 py-2 border border-primary hover:bg-primary rounded-full">
                  <span className="group-hover:hidden">⚡️ Pro</span>
                  <span className="hidden group-hover:block">Manage</span>
                </div>
              </Link>
            ) : (
              <Button variant={"ghost"} onClick={checkout}>
                ⚡️ Upgrade to Pro
              </Button>
            )}
          </div>
        )}

        {user && !isSignedIn && (
          <div className="flex items-center space-x-2 ">
            <img
              src={user.user_metadata.avatar_url}
              className="w-7 rounded-full"
            />
            <p className="text-sm">{user.user_metadata.full_name}</p>
          </div>
        )}

        {isSignedIn && !user ? (
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
