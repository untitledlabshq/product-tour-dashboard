import Navbar from "@/components/Navbar";
import { Switch } from "@/components/ui/switch";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";

export default function TourId() {
  const router = useRouter();
  const store = useAppStore();

  function editSite() {
    // Open Site for Editing
    const access_token = store.session.access_token;

    if (!access_token) {
      router.push("/");
    }

    window.open("http://localhost:5173/?token=" + access_token, "_blank");
  }

  return (
    <>
      <Head>
        <title>Tour {router.query.id}</title>
      </Head>
      <Navbar />

      <main className="p-10">
        <div className="flex justify-between items-center">
          <div>
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <ArrowLeft width={16} />
              <span>Back</span>
            </div>
            <h1 className="mt-4 font-semibold text-2xl">Tour Name</h1>
            <p className="mt-1 text-sm gray-text">Tour description</p>
            <p className="text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
              https://www.untitledlabs.io/home
            </p>
          </div>

          <div>
            <Button onClick={() => editSite()}>Edit</Button>
          </div>
        </div>

        <div className="mt-5 p-5 border rounded-lg">
          <h1 className="font-semibold">Steps</h1>
          <div className="steps mt-3">
            <div className="step-card">
              <h3>title</h3>
              <p>text</p>
            </div>
            <div className="step-card">
              <h3>title</h3>
              <p>text</p>
            </div>
          </div>
        </div>

        <div className="mt-5 p-5 border rounded-lg">
          <h1 className="mb-5 font-semibold">Settings</h1>

          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 gap-10">
            <div className="flex justify-between">
              <div>
                <label htmlFor="dev-tooltip" className="font-semibold">
                  Enabled
                </label>
                <p className="text-sm gray-text">For site visitors</p>
              </div>
              <Switch id="dev-tooltip" />
            </div>

            <div className="flex justify-between">
              <div>
                <label htmlFor="dev-tooltip" className="font-semibold">
                  Developer-friendly element names
                </label>
                <p className="text-sm gray-text">In Admin mode, show </p>
              </div>
              <Switch id="dev-tooltip" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
