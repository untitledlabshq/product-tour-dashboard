// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { siweServer } from "@/constants/siweServer";
import { fetchUserByAddress } from "@/utils/api";
import { getEncryptedAddress } from "@/utils/crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  user?: string | null;
  encryptedAddress?: string | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address } = await siweServer.getSession(req, res);

  let user = null;
  let encryptedAddress = null;

  // Web3
  if (address) {
    user = await fetchUserByAddress(address);
    encryptedAddress = getEncryptedAddress(address);

    return res.status(200).json({ user, encryptedAddress });
  }

  return res.status(404).json({
    user,
    encryptedAddress,
    error: "No authenticated web3 user found",
  });
}
