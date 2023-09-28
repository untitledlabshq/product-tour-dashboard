import { configureServerSideSIWE } from "connectkit-next-siwe";

export const siweServer = configureServerSideSIWE({
  session: {
    cookieName: "buildoor-siwe-login",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});
