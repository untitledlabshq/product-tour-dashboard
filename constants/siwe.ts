import { SIWEConfig } from "connectkit";
import { API_URL } from ".";
import axios from "axios";
import { SiweMessage } from "siwe";

export const siweConfig: SIWEConfig = {
  getNonce: async () => (await axios.get(API_URL + "/siwe/nonce")).data,
  createMessage: function ({ nonce, address, chainId }) {
    return new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: "Sign in to Buildoor",
    }).prepareMessage();
  },
  verifyMessage: async (data) =>
    (
      await axios.post(API_URL + "/siwe/verify", data, {
        headers: { "Content-Type": "application/json" },
      })
    ).data,
  getSession: async () => (await axios.get(API_URL + "/siwe/session")).data,
  signOut: async () => (await axios.get(API_URL + "/siwe/logout")).data,
};
