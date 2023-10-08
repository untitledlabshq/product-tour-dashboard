import { configureClientSIWE } from "connectkit-next-siwe";

// https://github.com/expressjs/session/issues/520

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/api/siwe",
  statement: "Sign in to Buildoor",
});
