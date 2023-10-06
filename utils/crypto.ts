// NodeJS-only
import crypto from "crypto";

const cryptoConfig = {
  algo: process.env.AES_ALGO as string,
  key: Buffer.from(process.env.AES_KEY as string, "hex"),
  iv: Buffer.from(process.env.AES_IV as string, "hex"),
  // key: crypto.randomBytes(32),
  // iv: crypto.randomBytes(16),
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

  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
}
