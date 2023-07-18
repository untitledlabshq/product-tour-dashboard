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
import { updateTourActive } from "@/utils/api";
import {
  ArrowTopRightIcon,
  Link1Icon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import PrimaryButton from "@/components/PrimaryButton";

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

        fetchAnalytics();
      } catch (e) {
        console.error(e);
      }
  }

  async function fetchAnalytics() {
    if (router.query.id) {
      try {
        const { data } = await axios.get(
          API_URL + "/visitor/tour/" + router.query.id
        );
        console.log("Visitor data", data);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function updateActive(value: boolean) {
    if (router.query.id && store.session) {
      try {
        setLoading({ enabled: true });

        await updateTourActive(
          router.query.id as string,
          value,
          store.session.access_token
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
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => window.history.back()}
              >
                <ArrowLeft width={24} />
                <div className="flex items-center space-x-3">
                  <h1 className="font-semibold text-2xl">{tour.name}</h1>
                  <p className="flex items-center space-x-2 text-xs mt-2 mb-1 py-2 px-3 pr-4 bg-gray-300 dark:bg-primary-light text-gray-400 rounded-full font-mono overflow-x-auto">
                    <Link1Icon />
                    <span>{tour.url}</span>
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm gray-text">{tour.desc}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div>
                  <label htmlFor="dev-tooltip" className="font-medium text-sm">
                    Enabled
                  </label>
                </div>
                <Switch
                  id="dev-tooltip"
                  checked={tour.active}
                  onCheckedChange={(value) => updateActive(value)}
                  disabled={loading.enabled}
                />
              </div>
              <Button
                variant={"outline"}
                className="border-primary text-xs py-4"
                onClick={() => window.open(tour.url, "_blank")}
              >
                Visit Page &nbsp; <ArrowTopRightIcon />
              </Button>
              <PrimaryButton variant={"default"} onClick={() => editSite()}>
                Edit steps &nbsp; <Pencil1Icon />
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="font-semibold text-2xl">Steps</h1>
            {tour.steps ? (
              <div className="steps mt-3">
                {tour.steps.map((step: any) => (
                  <div className="step-card">
                    <h2>{step.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          step.text.replace("autoplay", "")
                        ),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              <>No steps found yet. Add some!</>
            )}
          </div>

          {/* <div className="mt-5 p-5 border rounded-lg">
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
            </div>
          </div> */}
        </main>
      ) : (
        <main className="p-10">Loading...</main>
      )}
    </>
  );
}
