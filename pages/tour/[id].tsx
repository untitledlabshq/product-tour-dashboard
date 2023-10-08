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
import DeleteDialog from "@/components/DeleteDialog";
import { toast } from "react-toastify";
import useConnect from "@/hooks/useConnect";
import { siweServer } from "@/constants/siweServer";
import { getEncryptedAddress } from "@/utils/crypto";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { address } = await siweServer.getSession(req, res);

  let encryptedAddress = null;
  if (address) {
    encryptedAddress = getEncryptedAddress(address);
  }

  return {
    props: {
      encryptedAddress,
    },
  };
};

export default function TourId({
  encryptedAddress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const store = useAppStore();

  const { isWeb3 } = useConnect();

  const [tour, setTour] = useState(null as any);
  const [analytics, setAnalytics] = useState(null as any);

  // Loading State Mapping for form controls
  const [loading, setLoading] = useState({} as any);

  function editSite() {
    // Open Site for Editing
    const access_token = isWeb3 ? encryptedAddress : store.session.access_token;

    if (!access_token) {
      router.push("/");
    }

    const adminUrl =
      tour.url +
      (!(tour.url as string).endsWith("/") ? "/" : "") +
      "?tourToken=" +
      access_token +
      "&tourId=" +
      router.query.id +
      "&is_web3=" +
      isWeb3;
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

        const { data: details } = await axios.get(
          API_URL + "/visitor/tour/" + router.query.id + "/details"
        );
        console.log("Detailed Visitor data", details.data);

        setAnalytics({ ...data, ipList: details.data });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function updateActive(value: boolean) {
    if (router.query.id && (store.session || isWeb3)) {
      try {
        setLoading({ enabled: true });

        await updateTourActive(
          router.query.id as string,
          value,
          isWeb3 ? encryptedAddress : store.session.access_token,
          isWeb3
        );

        setTour({ ...tour, active: value });
        setLoading({ enabled: false });
      } catch (e) {
        setLoading({ enabled: false });
        console.error(e);
      }
    }
  }

  async function deleteTour() {
    try {
      const toastId = toast.info("Deleting...");

      console.log("deleting tour. encryptedAddress", encryptedAddress);

      await axios.delete(API_URL + "/tour/" + tour.id, {
        headers: {
          Authorization: isWeb3
            ? "web3 " + encryptedAddress
            : "web2 " + store.session.access_token,
        },
      });

      router.push("/project/" + tour.project_id);

      toast.dismiss(toastId);
      toast.info("Deleted Tour");
    } catch (e) {
      console.error(e);
      toast.error("Error deleting Tour");
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
              <div className="flex items-center space-x-1">
                <ArrowLeft
                  width={24}
                  onClick={() => window.history.back()}
                  className="cursor-pointer"
                />
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
              <p className="mt-3">No steps found yet. Add some!</p>
            )}
          </div>

          {analytics && (
            <>
              <h1 className="mt-5 font-semibold text-2xl">Analytics</h1>
              <div className="mt-5 gap-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                <div className="border border-gray-600 p-5 rounded-xl">
                  <h3 className="gray-text">Visitors</h3>
                  <h2 className="text-2xl md:text-3xl">
                    {analytics.visitor_count}
                  </h2>
                </div>
                {/* <div className="border border-gray-600 p-5 rounded-xl">
                  <h3 className="gray-text">Only Viewed</h3>
                  <h2 className="text-2xl md:text-3xl">
                    {analytics.views_count}
                  </h2>
                </div> */}
                {/* <div className="border border-gray-600 p-5 rounded-xl">
                <h3 className="gray-text">Completed</h3>
                <h2 className="text-2xl md:text-3xl">{analytics.completed_tour_count}</h2>
              </div> */}
              </div>

              <div className="mt-5">
                {analytics.ipList.length === 0 && (
                  <p className="gray-text">No visitor data yet</p>
                )}
                <table className="w-full">
                  <tr>
                    <th>IP Address</th>
                    <th>Location</th>
                    <th>Time</th>
                  </tr>
                  {analytics.ipList.map((item: any) => (
                    <tr>
                      <td>{item.IP}</td>
                      <td>{item.location || "None"}</td>
                      <td>
                        {new Date(item.start_time).toDateString() +
                          " " +
                          new Date(item.start_time).toLocaleTimeString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </>
          )}

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

          <div className="mt-5 max-w-sm p-5 border border-red-400 rounded-lg bg-red-900/50">
            <h2 className="text-red-300 font-semibold">Delete Tour</h2>
            <p className="text-sm text-red-100">Use this option cautiously</p>
            <DeleteDialog callback={() => deleteTour()} />
          </div>
        </main>
      ) : (
        <main className="p-10">Loading...</main>
      )}
    </>
  );
}
