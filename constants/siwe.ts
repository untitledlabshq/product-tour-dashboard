import { SIWEConfig } from "connectkit";
import { SIWE_API_URL } from ".";
import axios from "axios";
import { SiweMessage } from "siwe";

// https://github.com/expressjs/session/issues/520

export const siweConfig: SIWEConfig = {
  getNonce: async () => (await axios.get(SIWE_API_URL + "/nonce")).data,
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
      await fetch(SIWE_API_URL + "/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    ).json(),
  getSession: async () =>
    (
      await fetch(SIWE_API_URL + "/session", { credentials: "same-origin" })
    ).json(),
  signOut: async () => (await axios.get(SIWE_API_URL + "/logout")).data,
};
