import Navbar from "@/components/Navbar";
import PrimaryButton from "@/components/PrimaryButton";
import { useAppStore } from "@/store";
import Head from "next/head";
import { useEffect, useState } from "react";

function Profile() {
  const session = useAppStore((state) => state.session);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setMounted(true);
  }, []);

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
          <div className="mt-3 p-5 bg-primary-light rounded-xl border border-primary inline-block">
            Free
          </div>
          <div className="ml-3 mt-3 p-5 bg-primary-light rounded-xl inline-block">
            Pro
          </div>
        </div>

        <div className="mt-5">
          <PrimaryButton>Upgrade to Pro</PrimaryButton>
        </div>
      </main>
    </>
  );
}

export default Profile;
