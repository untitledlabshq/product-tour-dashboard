import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSIWE, useModal } from "connectkit";
import plenaIcon from "@/assets/plena.svg";
import { useAccount, useChainId, useConnections, useDisconnect } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import { hashMessage } from "@/utils/utilities";
import { eip1271 } from "@/utils/eip1271";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { usePlenaSigning } from "@/hooks/usePlenaSigning";

function CustomConnectButton() {
  // const { isSignedIn } = useSIWE();
  // const { openSIWE } = useModal();
  const account = useAccount();
  const walletAddress = account?.address;
  const { disconnect } = useDisconnect();
  const connections = useConnections();
  const chainId = useChainId();
  let connector = connections[0]?.connector;
  const [pending, setPending] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();
  const { isSignedIn } = useSIWE();
  const { openSIWE } = useModal();
  const { signTrx } = usePlenaSigning();
  const openSignModal = () => {
    setIsSignModalOpen(true);
  };
  const closeSignModal = () => {
    setIsSignModalOpen(false);
    setPending(false);
    setResult(false);
  };
  const utf8ToHex = (str) => {
    const bytes = ethers.toUtf8Bytes(str);
    const hex = ethers.hexlify(bytes);
    return hex;
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        openChainModal,
        mounted,
        authenticationStatus,
      }) => {
        // If RainbowKit or wagmi is still loading, or the user is not yet authenticated
        const isReady = mounted && authenticationStatus !== "loading";
        // Check if the wallet is connected
        const isConnected = isReady && account && chain;

        // 1) Not Connected
        if (!isConnected) {
          return (
            <button
              onClick={openConnectModal}
              className="flex justify-center items-center space-x-2 p-3 mb-3 rounded-xl border border-primary-gray w-full"
            >
              <img src={plenaIcon.src} alt="Wallet Icon" width={24} />
              <span className="font-semibold text-sm">Login via Wallet</span>
            </button>
          );
        }

        // 2) Connected but not SIWE signed
        if (isConnected &&  account.address) {
          return (
            <button
              onClick={() => connector && connector.sendPlenaTransaction ? signTrx(connector, walletAddress) : openSIWE()}
              className="flex justify-center items-center space-x-2 p-3 mb-3 rounded-xl border border-orange-300 w-full"
            >
              {/* 
                If you have a specific icon for this step, you can use that here.
                For example: <img src={metamaskIcon.src} alt="Sign In Icon" width={24} />
              */}
              <img src={plenaIcon.src} alt="Sign In Icon" width={24} />
              <span className="font-semibold text-sm">Sign in with Wallet</span>
            </button>
          );
        }

        // 3) Connected & SIWE Signed
        // (At this point, user might want to see account details or open the account modal)
        return (
          <button
            onClick={openAccountModal}
            className="flex justify-center items-center space-x-2 p-3 mb-3 rounded-xl border border-green-500 w-full"
          >
            <span className="font-semibold text-sm">{account.displayName}</span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;
