import Navbar from "@/components/Navbar";
import TourDialog from "@/components/TourDialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { API_URL } from "@/constants";
import { useAppStore } from "@/store";
import { ThemeOption } from "@/types";
import { updateTourActive } from "@/utils/api";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import {
  Pencil1Icon,
  MoonIcon,
  SunIcon,
  TriangleLeftIcon,
  Link1Icon,
} from "@radix-ui/react-icons";
import ExampleImage from "@/assets/example-image.png";
import PrimaryButton from "@/components/PrimaryButton";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { Space_Grotesk } from "next/font/google";

import elk from "@/assets/elk.svg";
import clipboard from "@/assets/icons/Clipboard.svg";
import arrow from "@/assets/icons/ArrowRight.svg";
import arrowWhite from "@/assets/icons/ArrowRightWhite.svg";
import DeleteDialog from "@/components/DeleteDialog";
import { siweServer } from "@/constants/siweServer";
import { getEncryptedAddress } from "@/utils/crypto";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import useConnect from "@/hooks/useConnect";
import useUserData from "@/hooks/useUserData";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
});

type Tab = "tour" | "analytics" | "settings";

function WebsiteScript({ project }: { project: any }) {
  return (
    <div className="p-4 col-span-1 self-start border rounded-lg bg-primary-purple overflow-x-auto">
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">Website's Script</h2>
        <div
          className="cursor-pointer"
          onClick={() => {
            copy(`
              <script type="text/javascript"> window.ProductTourID = "${project.id}" </script>
              <script type="module" src="https://product-tour-dist.vercel.app/tour.es.js" defer></script>
              `);
            toast.info("Copied!");
          }}
        >
          <img src={clipboard.src} alt="Clipboard" width={18} />
        </div>
      </div>
      <p className="mt-0.5 text-sm gray-text">
        Include this script in your website to initialize the product tour
      </p>
      <p className="w-auto inline-block text-xs mt-4 mb-1 p-2 bg-gray-300 dark:bg-primary-dark text-gray-400 rounded font-mono overflow-x-auto">
        &lt;script type="text/javascript"&gt; <br />
        window.ProductTourID = "{project.id}" <br />
        &lt;/script&gt;
        <br />
        &lt;script type="module"
        src="https://product-tour-dist.vercel.app/tour.es.js"
        defer&gt;&lt;/script&gt;
      </p>
    </div>
  );
}

function TourGrid({
  project,
  tours,
  refresh,
  encryptedAddress,
}: {
  project: any;
  tours: any;
  encryptedAddress?: string;
  refresh: () => Promise<void>;
}) {
  const [loading, setLoading] = useState({} as Record<string, boolean>);
  const router = useRouter();
  const store = useAppStore();

  const { isWeb3 } = useConnect();

  async function updateActive(id: string, value: boolean) {
    if (router.query.id && (store.session || isWeb3)) {
      const key = "enabled-" + id;

      try {
        setLoading({ [key]: true });

        await updateTourActive(
          id as string,
          value,
          isWeb3 ? encryptedAddress : store.session.access_token,
          isWeb3
        );

        // Fetch tours again
        await refresh();

        setLoading({ [key]: false });
      } catch (e) {
        setLoading({ [key]: false });
        console.error(e);
      }
    }
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-4 gap-3">
        {tours.map((tour: any) => {
          return (
            <div
              key={tour.id}
              className="flex flex-col justify-between border border-gray-800 bg-primary-purple p-4 rounded-lg h-full cursor-pointer"
              onClick={() => router.push("/tour/" + tour.id)}
            >
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold">{tour.name}</h1>
                  <Switch
                    id={"enabled-" + tour.id}
                    checked={tour.active}
                    onCheckedChange={(value) => updateActive(tour.id, value)}
                    disabled={loading["enabled-" + tour.id]}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-sm mt-1 gray-text">{tour.desc}</p>

                <p className="flex items-center space-x-2 text-xs mt-2 mb-1 py-2 px-3 bg-gray-300 dark:bg-primary-dark text-gray-400 rounded-full font-mono overflow-x-auto">
                  <Link1Icon />
                  <span>{tour.url}</span>
                </p>
              </div>

              <div className="mt-4 space-x-1.5">
                {tour.steps ? (
                  <p className="pill">
                    {tour.steps.length} Step
                    {tour.steps.length > 1 && "s"}
                  </p>
                ) : (
                  <p className="pill border-gray-500">No Steps</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {tours.length === 0 && (
        <div className="mt-10 grid place-items-center">
          <img src={elk.src} alt="Elk" />
          <h1 className="font-medium text-2xl">No tours created yet!</h1>
          <p className="mt-2 gray-text">
            Install following script in your website to start with tours
          </p>

          <div className="mt-8 max-w-lg">
            <WebsiteScript project={project} />
          </div>
        </div>
      )}
    </>
  );
}

function TourSettings({
  project,
  formState,
  setColor,
  setMode,
  setOverlay,
  updateTheme,
  encryptedAddress,
}: {
  project: any;
  formState: Record<string, ThemeOption>;
  encryptedAddress?: string;
  updateTheme: () => void;
  setColor: (id: string, color: ColorResult) => void;
  setMode: (value: string) => void;
  setOverlay: (value: boolean) => void;
}) {
  const store = useAppStore();
  const router = useRouter();

  const { isWeb3 } = useConnect();

  const { userData } = useUserData();

  async function deleteProject() {
    try {
      const toastId = toast.info("Deleting...");

      await axios.delete(API_URL + "/project/" + project.id, {
        headers: {
          Authorization: isWeb3
            ? "web3 " + encryptedAddress
            : "web2 " + store.session.access_token,
        },
      });

      router.push("/dashboard");

      toast.dismiss(toastId);
      toast.info("Deleted project");
    } catch (e) {
      console.error(e);
      toast.error("Error deleting project");
    }
  }

  return (
    <div className="mt-5 md:grid grid-cols-3 gap-5 space-y-5 md:space-y-0">
      <div>
        <WebsiteScript project={project} />

        <div className="mt-5 p-5 border border-red-400 rounded-lg bg-red-900/50">
          <h2 className="text-red-300 font-semibold">Delete Project</h2>
          <p className="text-sm text-red-100">Use this option cautiously</p>
          <DeleteDialog callback={() => deleteProject()} />
        </div>
      </div>

      <div className="p-4 col-span-2 border rounded-lg bg-primary-purple">
        <h2 className="font-semibold text-lg">Theme</h2>
        <p className="mt-0.5 text-sm gray-text">
          Reflected in all the tours within this project
        </p>

        <div className="mt-6 w-full md:grid md:grid-cols-3 gap-5">
          {/* Left */}
          <div className="col-span-1 w-full">
            <h2 className="font-medium text-sm">Tooltip Color</h2>
            <Popover>
              <PopoverTrigger>
                <div className="mt-2 flex items-center justify-around p-2 bg-primary-dark w-40">
                  <div
                    className="w-6 h-6 border border-white/50 rounded"
                    style={{
                      background: formState["primaryColor"]
                        ? formState["primaryColor"]?.value
                        : "black",
                    }}
                  ></div>
                  <p className="text-sm">
                    {formState["primaryColor"]
                      ? formState["primaryColor"]?.value
                      : "No color"}
                  </p>
                  <span>
                    <Pencil1Icon />
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <SketchPicker
                  color={formState["primaryColor"]?.value ?? ""}
                  onChange={(color) => setColor("primaryColor", color)}
                  styles={{
                    default: {
                      picker: {
                        backgroundColor: "hsl(222.2 84% 4.9%)",
                        color: "black",
                      },
                    },
                  }}
                />
              </PopoverContent>
            </Popover>

            <h2 className="mt-5 font-medium text-sm">Appearance</h2>
            <div className="mt-2 p-1 bg-primary-dark rounded-lg w-40">
              <div
                className={
                  "p-2 flex items-center space-x-3 rounded-lg border-gray-800 cursor-pointer transition " +
                  (formState["colorMode"]?.value === "dark"
                    ? "border bg-primary-purple"
                    : "text-gray-400 hover:text-gray-300")
                }
                onClick={() => setMode("dark")}
              >
                <MoonIcon />
                <span className="text-sm">Dark Mode</span>
              </div>
              <div
                className={
                  "p-2 flex items-center space-x-3 rounded-lg border-gray-800 cursor-pointer " +
                  (formState["colorMode"]?.value === "light"
                    ? "border bg-primary-purple"
                    : "text-gray-400 hover:text-gray-300")
                }
                onClick={() => setMode("light")}
              >
                <SunIcon />
                <span className="text-sm">Light Mode</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <h2 className="font-medium text-sm">Background Overlay</h2>
              <Switch
                id={"modal-overlay"}
                checked={formState["modalOverlay"]?.value ?? true}
                onCheckedChange={(value) => setOverlay(value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <br />

            <PrimaryButton
              className="mt-5 border text-white"
              onClick={updateTheme}
            >
              Save theme
            </PrimaryButton>
          </div>

          {/* Right */}
          <div
            className={
              "mt-5 md:mt-0 col-span-2 bg-primary-light border rounded-xl p-10 " +
              grotesk.className
            }
            style={{
              backgroundImage: "radial-gradient(#555 1px, transparent 0)",
              backgroundSize: "20px 20px",
              backgroundPosition: "-19px -19px",
              backgroundRepeat: "repeat",
            }}
          >
            <div
              className={
                (formState.colorMode?.value === "light"
                  ? "bg-white text-black"
                  : "bg-[#00000f]") + " p-5 rounded-xl relative gradient-card "
              }
            >
              <div className="absolute -left-3 top-24">
                <TriangleLeftIcon
                  className={
                    formState.colorMode?.value === "light"
                      ? "text-white"
                      : "text-black"
                  }
                  style={{ transform: "scale(3)" }}
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <h1 className="font-medium text-gray-500">Step 1</h1>
                {userData && !userData.is_pro && (
                  <img
                    src={`https://product-tour-dist.vercel.app/Watermark${
                      formState.colorMode?.value[0].toUpperCase() +
                      formState.colorMode?.value.slice(1)
                    }.png`}
                    alt=""
                    className="max-w-[8rem]"
                  />
                )}
              </div>
              <h1 className="mt-1 text-xl font-semibold">Tooltip heading</h1>
              <p className="mt-1 text-sm text-gray-500">
                This is a preview of a short and well-explained description for
                this tooltip
              </p>

              <img src={ExampleImage.src} className="mt-5 w-full" />

              <div className="mt-8 flex justify-end space-x-2">
                <button
                  className={
                    "py-2 px-2 mr-auto rounded-xl font-medium " +
                    (formState.colorMode?.value === "light"
                      ? "text-black"
                      : "text-white")
                  }
                >
                  <span>Skip</span>
                </button>
                <button
                  className={
                    "py-2 px-7 rounded-xl flex items-center space-x-2 font-medium " +
                    (formState.colorMode?.value === "light"
                      ? "text-black"
                      : "text-white")
                  }
                >
                  {formState.colorMode?.value === "light" ? (
                    <img src={arrow.src} alt="" className="w-4 rotate-180" />
                  ) : (
                    <img
                      src={arrowWhite.src}
                      alt=""
                      className="w-4 rotate-180"
                    />
                  )}

                  <span>Prev</span>
                </button>
                <button
                  className={
                    "py-2 px-7 rounded-xl flex items-center space-x-2 font-medium bg-white text-black"
                  }
                  style={{
                    boxShadow:
                      "0px 0px 20px 0px" + formState["primaryColor"]?.value,
                  }}
                >
                  <span>Next</span>
                  <img src={arrow.src} alt="" className="w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TourAnalytics({ project }: { project: any }) {
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project.id && project.id.length > 0) {
      fetchProjectAnalytics();
    }
  }, [project]);

  const fetchProjectAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const [{ data: data0 }, { data: data1 }] = await Promise.all([
        axios.get(API_URL + "/visitor/project/" + project.id),
        axios.get(API_URL + "/visitor/project/" + project.id + "/details"),
      ]);

      setData({ ...data0, ...data1.data });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }, [project.id]);

  return (
    <div className="p-5">
      <h1 className="font-semibold text-xl">Analytics</h1>
      {loading ? (
        <p className="mt-5">Loading...</p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-5">
            <div className="p-4 w-48 rounded-xl border border-gray-700">
              <h3>Views</h3>
              <p className="text-2xl">{data.views_count}</p>
            </div>
            <div className="p-4 w-48 rounded-xl border border-gray-700">
              <h3>Visitors</h3>
              <p className="text-2xl">{data.visitor_count}</p>
            </div>
            <div className="p-4 w-48 rounded-xl border border-gray-700">
              <h3>Completed Tours</h3>
              <p className="text-2xl">{data.completed_tour_count}</p>
            </div>
          </div>

          <div className="mt-5">
            <table className="w-full">
              <tr>
                <th>IP Address</th>
                <th>Location</th>
                <th>Time</th>
                <th>Tour ID</th>
              </tr>
              {data.details && data.details.length === 0 && (
                <p className="p-5 gray-text">No visitor data yet</p>
              )}
              {data.details &&
                data.details
                  .sort((a: any, b: any) => b.start_time - a.start_time)
                  .map((item: any) => (
                    <tr>
                      <td>{item.IP}</td>
                      <td>
                        {item.location &&
                        item.location.city &&
                        item.location.country ? (
                          <>
                            {item.location.city}, {item.location.country}
                          </>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td>
                        {new Date(item.start_time).toDateString() +
                          " " +
                          new Date(item.start_time).toLocaleTimeString("en-IN")}
                      </td>
                      <td className="text-sm">{item.tour_id}</td>
                    </tr>
                  ))}
            </table>
          </div>
        </>
      )}
    </div>
  );
}

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

export default function ProjectId({
  encryptedAddress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const store = useAppStore();

  const { isWeb3 } = useConnect();

  const [project, setProject] = useState(null as any);
  const [tours, setTours] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formState, setFormState] = useState({} as Record<string, ThemeOption>);

  const [tab, setTab] = useState("tour" as Tab);

  useEffect(() => {
    fetchProjectData();
  }, [router.query, isWeb3]);

  function setColor(id: string, color: ColorResult) {
    setFormState({
      ...formState,
      [id]: { id, type: "color", label: "", value: color.hex },
    });
  }

  function setMode(value: string) {
    setFormState({
      ...formState,
      colorMode: {
        id: "colorMode",
        type: "string",
        label: "Color Mode",
        value,
      },
    });
  }

  function setOverlay(value: boolean) {
    setFormState({
      ...formState,
      modalOverlay: {
        id: "modalOverlay",
        type: "boolean",
        label: "Modal Overlay",
        value,
      },
    });
  }

  async function fetchProjectData() {
    if (
      router.query.id &&
      ((store.session && store.session.access_token) || isWeb3)
    ) {
      try {
        setLoading(true);
        // Fetch Project Metadata
        const { data } = await axios.get(
          API_URL + "/project/" + router.query.id,
          {
            headers: {
              Authorization: isWeb3
                ? "web3 " + encryptedAddress
                : "web2 " + store.session.access_token,
            },
          }
        );

        setProject(data[0]);
        fetchTheme(data[0].theme_id);

        // Fetch Project's Tours
        const { data: tourData } = await axios.get(
          API_URL + "/tour/project/" + router.query.id,
          {
            headers: {
              Authorization: isWeb3
                ? "web3 " + encryptedAddress
                : "web2 " + store.session.access_token,
            },
          }
        );

        setTours(tourData.sort((a: any, b: any) => (b.active ? 1 : -1)));

        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        setError("An error occurred. " + e.message);
      }
    }
  }

  async function fetchTheme(id: string) {
    try {
      const { data } = await axios.get(API_URL + "/theme/" + id);
      const details = JSON.parse(data[0].details) as ThemeOption[];
      const tempForm = {} as Record<string, ThemeOption>;

      details.map((item) => {
        tempForm[item.id] = item;
      });
      // Can be removed later when all is synced up
      if (!tempForm["colorMode"])
        tempForm["colorMode"] = {
          id: "colorMode",
          label: "Color Mode",
          type: "string",
          value: "dark",
        };

      setFormState(tempForm);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateTheme() {
    try {
      await axios.patch(
        API_URL + "/theme/" + project.theme_id,
        { details: Object.values(formState) }, // Keys don't matter, storing an array of ThemeOptions in the database
        {
          headers: {
            Authorization: isWeb3
              ? "web3 " + encryptedAddress
              : "web2 " + store.session.access_token,
          },
        }
      );

      toast("Theme updated", { type: "success" });
    } catch (e) {
      console.error(e);
      toast("Error updating theme", { type: "error" });
    }
  }

  function renderTab(tab: string) {
    switch (tab) {
      case "tour":
        return (
          <TourGrid
            project={project}
            tours={tours}
            refresh={fetchProjectData}
            encryptedAddress={encryptedAddress}
          />
        );
      case "analytics":
        return <TourAnalytics project={project} />;
      case "settings":
        return (
          <TourSettings
            formState={formState}
            project={project}
            setColor={setColor}
            setMode={setMode}
            updateTheme={updateTheme}
            setOverlay={setOverlay}
            encryptedAddress={encryptedAddress}
          />
        );
      default:
        return <></>;
    }
  }

  return (
    <>
      <Head>
        <title>{project ? project.name : router.query.id} | Project</title>
      </Head>
      <Navbar />
      {project && !loading && !error ? (
        <main className="p-10">
          <div className="flex items-center space-x-1">
            <ArrowLeft
              width={24}
              onClick={() => window.history.back()}
              className="cursor-pointer"
            />
            <h1 className="font-bold text-xl">{project.name}</h1>
          </div>

          <p className="mt-2 text-sm gray-text">{project.desc}</p>

          <div className="mt-5 flex justify-between items-center">
            {/* Tabs */}
            <div className="flex items-center font-semibold">
              <div
                className={tab === "tour" ? "tab" : "tab-inactive"}
                onClick={() => setTab("tour")}
              >
                <h2>Tour</h2>
              </div>
              <div
                className={tab === "analytics" ? "tab" : "tab-inactive"}
                onClick={() => setTab("analytics")}
              >
                <h2>Analytics</h2>
              </div>
              <div
                className={tab === "settings" ? "tab" : "tab-inactive"}
                onClick={() => setTab("settings")}
              >
                <h2>Settings</h2>
              </div>
            </div>

            <TourDialog
              onCreate={fetchProjectData}
              encryptedAddress={encryptedAddress}
            />
          </div>

          {renderTab(tab)}
        </main>
      ) : (
        <main className="p-10">
          {error} {loading && "Loading..."}
        </main>
      )}
    </>
  );
}
