// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API_URL } from "@/constants";
import { siweServer } from "@/constants/siweServer";
import { fetchUserByAddress } from "@/utils/api";
import { getEncryptedAddress } from "@/utils/crypto";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "PATCH")
    return res
      .status(500)
      .json({ error: "Can't process " + req.method + " requests" });

  const { address } = await siweServer.getSession(req, res);

  let user = null;
  let encryptedAddress = null;

  // Web3
  if (address) {
    user = await fetchUserByAddress(address);
    encryptedAddress = getEncryptedAddress(address);

    try {
      const chains = user.chains || [];
      const chainId: string = req.body.chainId.toString();
      const newChains = [...chains, chainId];

      if (!chainId) {
        return res
          .status(500)
          .json({ error: "No chainId provided", message: null });
      }

      if (chains.includes(chainId)) {
        return res
          .status(200)
          .json({ message: "ChainId already exists", error: null });
      }

      await axios.patch(
        API_URL + "/user",
        {
          id: user.id,
          user: {
            chains: newChains,
          },
        },
        {
          headers: {
            Authorization: "web3 " + encryptedAddress,
          },
        }
      );
    } catch (e: any) {
      console.error("Error while updating chain analytics", e);
      return res
        .status(500)
        .json({ message: null, error: e.message || e.detail || e });
    }

    return res.status(200).json({ message: "OK", error: null });
  }

  return res.status(404).json({
    message: null,
    error: "No authenticated web3 user found",
  });
}
