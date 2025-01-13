import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSIWE, useModal } from "connectkit";
import plenaIcon from "@/assets/plena.svg";


function CustomConnectButton() {
  const { isSignedIn } = useSIWE();
  const { openSIWE } = useModal();

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
        if (isConnected && !isSignedIn && account.address) {
          return (
            <button
              onClick={() => openSIWE()}
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
            <span className="font-semibold text-sm">
              {account.displayName}
            </span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;