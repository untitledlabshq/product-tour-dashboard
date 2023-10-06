import {
  ConnectKitButton,
  useSIWE,
  SIWEButton as SignInButton,
  SIWESession,
} from "connectkit";
import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/router";
import PrimaryButton from "./PrimaryButton";
import axios from "axios";
import { API_URL } from "@/constants";
import { fetchUserByAddress } from "@/utils/api";

function SIWEButton() {
  const router = useRouter();

  const { isConnected, address } = useAccount();
  const { isSignedIn, signOut } = useSIWE({});

  function handleSignOut() {
    signOut()?.then(() => {
      router.push("/");
    });
  }

  if (isSignedIn) {
    return (
      <>
        <ConnectKitButton />
        <PrimaryButton onClick={handleSignOut}>Sign Out</PrimaryButton>
      </>
    );
  }

  // If Not Signed In but is Connected
  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <ConnectKitButton />
        <SignInButton showSignOutButton />
      </div>
    );
  }

  return (
    <>
      <ConnectKitButton />
    </>
  );
}

export default SIWEButton;
