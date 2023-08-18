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
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import {
  Pencil1Icon,
  MoonIcon,
  SunIcon,
  Cross1Icon,
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

const grotesk = Space_Grotesk({
  subsets: ["latin"],
});

type Tab = "tour" | "settings";

function WebsiteScript({ project }: { project: any }) {
  return (
    <div className="p-4 col-span-1 self-start border rounded-lg bg-primary-purple overflow-x-auto">
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">Website's Script</h2>
        <div
          className="cursor-pointer"
          onClick={() => {
            copy(`
              <link rel="stylesheet" href="https://esm.sh/gh/untitledlabshq/product-tour-dist/tour.css" />
              <script type="text/javascript"> window.ProductTourID = "${project.id}" </script>
              <script type="module" src="https://esm.sh/gh/untitledlabshq/product-tour-dist/tour.es.js" defer></script>
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
        &lt;link rel="stylesheet"
        href="https://esm.sh/gh/untitledlabshq/product-tour-dist/tour.css" /&gt;
        <br />
        &lt;script type="text/javascript"&gt; window.ProductTourID = "
        {project.id}" &lt;/script&gt;
        <br />
        &lt;script type="module"
        src="https://esm.sh/gh/untitledlabshq/product-tour-dist/tour.es.js"
        defer&gt;&lt;/script&gt;
      </p>
    </div>
  );
}

function TourGrid({
  project,
  tours,
  refresh,
}: {
  project: any;
  tours: any;
  refresh: () => Promise<void>;
}) {
  const [loading, setLoading] = useState({} as Record<string, boolean>);
  const router = useRouter();
  const store = useAppStore();

  async function updateActive(id: string, value: boolean) {
    if (router.query.id && store.session) {
      const key = "enabled-" + id;

      try {
        setLoading({ [key]: true });

        await updateTourActive(id as string, value, store.session.access_token);

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
  updateTheme,
}: {
  project: any;
  formState: Record<string, ThemeOption>;
  updateTheme: () => void;
  setColor: (id: string, color: ColorResult) => void;
  setMode: (value: string) => void;
}) {
  const store = useAppStore()
  const router = useRouter()

  async function deleteProject() {
    try {
      const toastId = toast.info("Deleting...");

      await axios.delete(API_URL + "/project/" + project.id, {
        headers: {
          Authorization: "Bearer " + store.session.access_token,
        },
      });

      router.push("/dashboard")

      toast.dismiss(toastId)
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
                <img
                  src={`https://product-tour-dist.vercel.app/Watermark${
                    formState.colorMode?.value[0].toUpperCase() +
                    formState.colorMode?.value.slice(1)
                  }.png`}
                  alt=""
                  className="max-w-[8rem]"
                />
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

export default function ProjectId() {
  const router = useRouter();
  const store = useAppStore();
  const [project, setProject] = useState(null as any);
  const [tours, setTours] = useState([] as any[]);
  const [error, setError] = useState("");

  const [formState, setFormState] = useState({} as Record<string, ThemeOption>);

  const [tab, setTab] = useState("tour" as Tab);

  useEffect(() => {
    fetchProjectData();
  }, [router.query]);

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

  async function fetchProjectData() {
    if (router.query.id && store.session.access_token) {
      try {
        // Fetch Project Metadata
        const { data } = await axios.get(
          API_URL + "/project/" + router.query.id,
          {
            headers: {
              Authorization: "Bearer " + store.session.access_token,
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
              Authorization: "Bearer " + store.session.access_token,
            },
          }
        );

        console.log({ tourData });

        setTours(tourData.sort((a: any, b: any) => (b.active ? 1 : -1)));
      } catch (e: any) {
        setError("An error occurred. " + e.message);
      }
    }
  }

  async function fetchTheme(id: string) {
    try {
      const { data } = await axios.get(API_URL + "/theme/" + id);
      const details = data[0].details as ThemeOption[];
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
            Authorization: "Bearer " + store.session.access_token,
          },
        }
      );

      toast("Theme updated", { type: "success" });
    } catch (e) {
      console.error(e);
      toast("Error updating theme", { type: "error" });
    }
  }

  return (
    <>
      <Head>
        <title>Project - {project ? project.name : router.query.id}</title>
      </Head>
      <Navbar />
      {project ? (
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
                className={tab === "settings" ? "tab" : "tab-inactive"}
                onClick={() => setTab("settings")}
              >
                <h2>Settings</h2>
              </div>
            </div>

            <TourDialog onCreate={fetchProjectData} />
          </div>

          {tab === "tour" ? (
            <TourGrid
              project={project}
              tours={tours}
              refresh={fetchProjectData}
            />
          ) : (
            <TourSettings
              formState={formState}
              project={project}
              setColor={setColor}
              setMode={setMode}
              updateTheme={updateTheme}
            />
          )}
        </main>
      ) : (
        <main className="p-10">{error || "Loading..."}</main>
      )}
    </>
  );
}
