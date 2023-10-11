import CongratsDialog from "@/components/CongratsDialog";
import Navbar from "@/components/Navbar";
import PrimaryButton from "@/components/PrimaryButton";
import { API_URL } from "@/constants";
import { siweServer } from "@/constants/siweServer";
import { useAppStore } from "@/store";
import { fetchUserByAddress, fetchUserByToken } from "@/utils/api";
import { getEncryptedAddress } from "@/utils/crypto";
import { ConnectKitButton, useSIWE } from "connectkit";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { address } = await siweServer.getSession(req, res);

  let user = null;
  let encryptedAddress = null;
  if (address) {
    user = await fetchUserByAddress(address);
    encryptedAddress = getEncryptedAddress(address);
  }

  return {
    props: {
      userWeb3: user,
      encryptedAddress,
    },
  };
};

function Profile({
  userWeb3,
  encryptedAddress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useAppStore((state) => state.session);
  const { setCongrats } = useAppStore();
  const queryParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({} as any);

  const { isSignedIn } = useSIWE();

  const { isConnected } = useAccount();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (queryParams.get("is_success") == "true") {
        console.log({ setCongrats });
        setCongrats(true);
      }

      setMounted(true);

      getUser();
    }
  }, []);

  async function getUser() {
    if (userWeb3 !== null) {
      setUser(userWeb3);
    }

    if (!session || !session?.access_token) return;

    // Fetch user's UUID from custom table
    const userData = await fetchUserByToken(session.access_token);

    setUser(userData);
  }

  function checkout() {
    const baseURL = API_URL + "/checkout";
    const params = new URLSearchParams();
    params.set("success_url", window.location.href + "?is_success=true");

    if (session && session?.access_token) {
      params.set("typeOfAuthorization", "web2");
      params.set("identity", session.access_token);
    } else if (isSignedIn && isConnected) {
      params.set("typeOfAuthorization", "web3");
      params.set("identity", encryptedAddress);
    }
    const url = baseURL + "?" + params.toString();

    // Redirect to Checkout
    window.location.href = url;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar />
      <main className="p-10">
        <div className="mt-5">
          {mounted && session && session.user && (
            <div className="flex items-center space-x-2">
              <img
                src={session.user.user_metadata.avatar_url || ""}
                alt="Profile Photo"
                className="border-2 rounded-full w-10"
                onError={({ currentTarget }) => {
                  currentTarget.style.display = "none";
                }}
              />
              <div>
                <h3>{session.user.user_metadata.name}</h3>
                <p className="text-sm text-gray-400">{session.user.email}</p>
              </div>
            </div>
          )}
          {isSignedIn && (
            <>
              <ConnectKitButton />
            </>
          )}
        </div>

        {Object.hasOwn(user, "is_pro") && (
          <>
            <div className="mt-5">
              <h2 className="text-lg">Current Plan</h2>
              <div
                className={
                  "mt-3 p-5 bg-primary-light rounded-xl inline-block " +
                  (!user.is_pro && "border border-primary")
                }
              >
                Free
              </div>
              <div
                className={
                  "ml-3 mt-3 p-5 bg-primary-light rounded-xl inline-block " +
                  (user.is_pro && "border border-primary")
                }
              >
                Pro
              </div>
            </div>

            <div className="mt-5">
              {mounted &&
                (!user.is_pro ? (
                  <PrimaryButton onClick={checkout}>
                    Upgrade to Pro
                  </PrimaryButton>
                ) : (
                  <Link
                    href={
                      "https://billing.stripe.com/p/login/test_00g28VcFa0cY0YU288"
                    }
                    target="_blank"
                  >
                    <PrimaryButton>Manage Subscription</PrimaryButton>
                  </Link>
                ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Profile;
