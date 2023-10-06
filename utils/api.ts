import { API_URL } from "@/constants";
import { AuthType } from "@/types";
import axios from "axios";
import { getEncryptedAddress } from "./crypto";

export async function updateTourActive(
  id: string,
  value: any,
  access_token: string
) {
  await axios.patch(
    API_URL + "/tour/" + id,
    {
      active: value,
    },
    {
      headers: {
        Authorization: "web2 " + access_token,
      },
    }
  );
}

/**
 * Fetch user by Supabase Auth Access Token or Server-Side Encrypted User Address
 */
export async function fetchUserByToken(
  access_token: string,
  authType: AuthType = "web2"
) {
  return (
    await axios.get(API_URL + "/user", {
      headers: {
        Authorization: authType + " " + access_token,
      },
    })
  ).data;
}

/**
 * **Server-Side Only**
 * Fetch User data from Wallet Address
 * @param address Wallet Address
 */
export async function fetchUserByAddress(address: string) {
  try {
    return await fetchUserByToken(getEncryptedAddress(address), "web3");
  } catch (e) {
    console.error("Error in fetchUserByAddress", e);
    return null;
  }
}

/**
 * **Server-Side Only**
 * Create a new Web3 User
 * @param address Wallet Address
 */
export async function createUser(address: string) {
  // Create new user in DB if not exists
  try {
    let encryptedAddress = getEncryptedAddress(address);

    // Route has Existence check for identity
    await axios.post(API_URL + "/user", {
      is_pro: false,
      provider: "web3",
      identity: encryptedAddress,
    });
  } catch (e) {
    console.error(e);
  }
}
