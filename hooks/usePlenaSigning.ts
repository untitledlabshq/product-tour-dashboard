import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { eip1271 } from "@/utils/eip1271";

interface PlenaSigning {
  PlenaResult: {
    method: string;
    signature: string;
    from: string;
  } | null;
  Plenapending: boolean;
  Plenaerror: Error | null;
  signTrx: (connector: any, walletAddress: string) => Promise<void>;
  PlenaSignedIn: boolean
}

export const usePlenaSigning = (): PlenaSigning => {
    //@ts-ignore
  const [result, setResult] = useState<PlenaSigning["result"]>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  const signTrx = async (connector: any, walletAddress: string) => {
    setPending(true);
    setError(null);

    try {
      const message = `${walletAddress} wants to connect to Buildoor`;
      const hexMsg = Buffer.from(message).toString("hex");
      const msgParams = [hexMsg, walletAddress];

      const res = await connector.sendPlenaTransaction({
        chain: 137,
        method: "personal_sign",
        params: [msgParams],
      });
      console.log("res", res);
      if (!res?.success) {
        setResult(null);
        return;
      }

      const hash = ethers.hashMessage(message);
      const polygonProvider = new ethers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );

      const valid = await eip1271.isValidSignature(
        walletAddress,
        res?.content?.signature,
        hash,
        polygonProvider
      );

    //   if (valid) {
        toast.success("Signing Successful");
        setIsSignedIn(true);
        router.push("/dashboard");
    //   }

      const formattedResult = {
        method: "personal_sign",
        signature: res?.content?.signature,
        from: walletAddress,
      };

      setResult(formattedResult);
    } catch (err) {
      console.error("Signing error", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setResult(null);
    } finally {
      setPending(false);
    }
  };

  return {
    PlenaResult: result,
    Plenapending: pending,
    Plenaerror: error,
    signTrx,
    PlenaSignedIn: isSignedIn
  };
};
