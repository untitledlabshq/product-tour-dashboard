import Navbar from "@/components/Navbar";
import PrimaryButton from "@/components/PrimaryButton";
import { API_URL } from "@/constants";
import { useAppStore } from "@/store";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

function Profile() {
  const session = useAppStore((state) => state.session);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({} as any);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);

      getUser();
    }
  }, []);

  async function getUser() {
    if (!session.access_token) return;

    // Fetch user's UUID from custom table
    const userData = (
      await axios.get(API_URL + "/user", {
        headers: {
          Authorization: "web2 " + session.access_token,
        },
      })
    ).data;

    setUser(userData);
  }

  function checkout() {
    if (!session.access_token) return;

    const baseURL = API_URL + "/checkout";
    const params = new URLSearchParams();
    params.set("success_url", window.location.href);
    params.set("typeOfAuthorization", "web2");
    params.set("identity", session.access_token);

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
                className="border rounded-full w-10"
              />
              <div>
                <h3>{session.user.user_metadata.name}</h3>
                <p className="text-sm text-gray-400">{session.user.email}</p>
              </div>
            </div>
          )}
        </div>

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
          {mounted && (
            <PrimaryButton onClick={checkout}>Upgrade to Pro</PrimaryButton>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;
