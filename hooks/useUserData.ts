import { useAppStore } from "@/store";
import { fetchUserByToken } from "@/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import axios from "axios";
import { useSIWE } from "connectkit";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

export default function useUserData() {
  const [userData, setUserData] = useState(null as any);
  const [encryptedAddress, setEncryptedAddress] = useState(null as any);

  const { session } = useAppStore();
  const { isSignedIn } = useSIWE();
  const { address } = useAccount();

  const user = useUser();

  useEffect(() => {
    try {
      if (isSignedIn && address) {
        fetchWeb3User();
      } else {
        fetchUser();
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Error while fetching user data");
    }
  }, [user, isSignedIn]);

  async function fetchWeb3User() {
    const data = (await axios.get("/api/web3user")).data;
    const web3User = data.user;
    const localEncryptedAddress = data.encryptedAddress;

    setEncryptedAddress(localEncryptedAddress);
    if (web3User) setUserData(web3User);
  }

  async function fetchUser() {
    if (!session || !session?.access_token) return;

    const userData = await fetchUserByToken(session.access_token);

    setUserData(userData);
  }

  return { userData, encryptedAddress };
}
