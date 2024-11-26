import { useAccount, useConnect } from "wagmi";
import SIWEButton from "./SIWEButton";
import plenaIcon from "@/assets/plena.svg";
import { useModal, useSIWE } from "connectkit";
import { shortAddress } from "@/utils";

function PleaConnectButton() {
  const { isConnected, address } = useAccount();
  const { isSignedIn } = useSIWE();
  const { openSIWE } = useModal();

  if (!isConnected) {
    return (
      <button
        className="flex justify-center items-center space-x-2 p-3 rounded-xl border border-primary-gray w-full"
        onClick={() => openSIWE()}
      >
        <img src={plenaIcon.src} alt="MetaMask Logo" width={24} />
        <span className="font-semibold text-sm">Login via Plena</span>
      </button>
    );
  } else if (isConnected && !isSignedIn && address) {
    return (
      <button
        className="flex justify-center items-center space-x-2 p-3 rounded-xl border border-orange-300 w-full"
        onClick={() => openSIWE()}
      >
        <img src={plenaIcon.src} alt="MetaMask Logo" width={24} />
        <span className="font-semibold text-sm">Sign in Plena</span>
      </button>
    );
  } else {
    return <SIWEButton />;
  }
}

export default PleaConnectButton;
