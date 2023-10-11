import { useAccount, useConnect } from "wagmi";
import SIWEButton from "./SIWEButton";
import metamaskIcon from "@/assets/metamask.svg";
import { useModal, useSIWE } from "connectkit";
import { shortAddress } from "@/utils";

function CustomConnectButton() {
  const { isConnected, address } = useAccount();
  const { isSignedIn } = useSIWE();
  const { openSIWE } = useModal();

  if (!isConnected) {
    return (
      <button
        className="flex justify-center items-center space-x-2 p-3 rounded-xl border border-primary-gray w-full"
        onClick={() => openSIWE()}
      >
        <img src={metamaskIcon.src} alt="MetaMask Logo" width={24} />
        <span className="font-semibold text-sm">Login via Wallet</span>
      </button>
    );
  } else if (isConnected && !isSignedIn && address) {
    return (
      <button
        className="flex justify-center items-center space-x-2 p-3 rounded-xl border border-primary-gray w-full"
        onClick={() => openSIWE()}
      >
        <img src={metamaskIcon.src} alt="MetaMask Logo" width={24} />
        <span className="font-semibold text-sm">Sign in with Wallet</span>
      </button>
    );
  } else {
    return <SIWEButton />;
  }
}

export default CustomConnectButton;
