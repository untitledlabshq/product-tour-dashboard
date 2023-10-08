import { useSIWE } from "connectkit";
import { useAccount } from "wagmi";

export default function useConnect() {
  const { isSignedIn } = useSIWE();
  const { isConnected } = useAccount();

  return { isWeb3: isSignedIn && isConnected };
}
