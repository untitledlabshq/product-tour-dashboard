import Navbar from "@/components/Navbar";
import { Switch } from "@/components/ui/switch";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants";
import axios from "axios";
import * as DOMPurify from "dompurify";

export default function TourId() {
  const router = useRouter();
  const store = useAppStore();

  const [tour, setTour] = useState(null as any);

  // Loading State Mapping for form controls
  const [loading, setLoading] = useState({} as any);

  function editSite() {
    // Open Site for Editing
    const access_token = store.session.access_token;

    if (!access_token) {
      router.push("/");
    }

    const adminUrl =
      tour.url +
      (!(tour.url as string).endsWith("/") ? "/" : "") +
      "?tourToken=" +
      access_token +
      "&tourId=" +
      router.query.id;

    window.open(adminUrl, "_blank");
  }

  useEffect(() => {
    fetchTourData();
  }, [router.query]);

  async function fetchTourData() {
    if (router.query.id)
      try {
        const { data } = await axios.get(API_URL + "/tour/" + router.query.id);
        console.log(data);

        setTour(data[0]);
      } catch (e) {
        console.error(e);
      }
  }

  async function updateActive(value: boolean) {
    if (router.query.id && store.session) {
      try {
        setLoading({ enabled: true });
        await axios.patch(
          API_URL + "/tour/" + router.query.id,
          {
            active: value,
          },
          {
            headers: {
              Authorization: "Bearer " + store.session.access_token,
            },
          }
        );

        setTour({ ...tour, active: value });
        setLoading({ enabled: false });
      } catch (e) {
        setLoading({ enabled: false });
        console.error(e);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Tour - {tour ? tour.name : router.query.id}</title>
      </Head>
      <Navbar />
      {tour ? (
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
              <div className="mt-4">
                {tour.active ? (
                  <p className="pill pill-success">Enabled</p>
                ) : (
                  <p className="pill pill-warning">Disabled</p>
                )}
              </div>
              <h1 className="mt-2 font-semibold text-2xl">{tour.name}</h1>
              <p className="mt-1 text-sm gray-text">{tour.desc}</p>
              <p className="text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
                {tour.url}
              </p>
            </div>

            <div>
              <Button onClick={() => editSite()}>Edit Steps</Button>
            </div>
          </div>

          <div className="mt-5 p-5 border rounded-lg">
            <h1 className="font-semibold">Steps</h1>
            {tour.steps ? (
              <div className="steps mt-3">
                {tour.steps.map((step: any) => (
                  <div className="step-card">
                    <h2>{step.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(step.text),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              <>No steps found yet. Add some!</>
            )}
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
                <Switch
                  id="dev-tooltip"
                  checked={tour.active}
                  onCheckedChange={(value) => updateActive(value)}
                  disabled={loading.enabled}
                />
              </div>

              {/* <div className="flex justify-between">
                <div>
                  <label htmlFor="dev-tooltip" className="font-semibold">
                    Developer-friendly element names
                  </label>
                  <p className="text-sm gray-text">In Admin mode, show </p>
                </div>
                <Switch id="dev-tooltip" />
              </div> */}
            </div>
          </div>
        </main>
      ) : (
        <main className="p-10">Loading...</main>
      )}
    </>
  );
}
