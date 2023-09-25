import { ConnectKitButton, useSIWE, SIWEButton as SignInButton } from "connectkit";
import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/router";
import PrimaryButton from "./PrimaryButton";

function SIWEButton() {
  const router = useRouter();

  const { isConnected } = useAccount();
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
