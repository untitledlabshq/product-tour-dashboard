// NodeJS-only
import crypto from "crypto";

const cryptoConfig = {
  algo: process.env.AES_ALGO as string,
  key: Buffer.from((process.env.AES_KEY as string) || "", "hex"),
  iv: Buffer.from((process.env.AES_IV as string) || "", "hex"),
};

/**
 * **Server-Side Only**
 * Encrypt wallet address
 * @param address Wallet Address
 */
export function getEncryptedAddress(address: string) {
  // Remove 0x at the start of address
  const data = address.replace("0x", "");

  const cipher = crypto.createCipheriv(
    cryptoConfig.algo,
    cryptoConfig.key,
    cryptoConfig.iv
  );

  return cipher.update(data, "utf-8", "hex") + cipher.final("hex"); // Encrypts data and converts to hex and base64
}
