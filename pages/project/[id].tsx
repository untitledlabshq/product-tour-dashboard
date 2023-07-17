import Navbar from "@/components/Navbar";
import TourDialog from "@/components/TourDialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { API_URL, themeOptions } from "@/constants";
import { useAppStore } from "@/store";
import { ThemeOption } from "@/types";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";

type Tab = "tour" | "settings";

function TourGrid({ tours }: { tours: any }) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-4 gap-3">
      {tours.map((tour: any) => {
        return (
          <Link key={tour.id} href={"/tour/" + tour.id}>
            <div className="flex flex-col justify-between border border-gray-800 bg-primary-purple p-5 rounded-lg h-full">
              <div>
                <h1 className="text-lg font-bold">{tour.name}</h1>
                <p className="text-sm mt-1 gray-text">{tour.desc}</p>

                <p className="text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-primary-dark text-gray-400 rounded-full font-mono overflow-x-auto">
                  {tour.url}
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
                {tour.active ? (
                  <p className="pill pill-success">Enabled</p>
                ) : (
                  <p className="pill pill-warning">Disabled</p>
                )}
              </div>
            </div>
          </Link>
        );
      })}

      {tours.length === 0 && (
        <span className="gray-text">No tours created yet.</span>
      )}
    </div>
  );
}

function TourSettings({
  project,
  formState,
  setColor,
  updateTheme,
}: {
  project: any;
  formState: Record<string, ThemeOption>;
  setColor: (id: string, color: ColorResult) => void;
  updateTheme: () => void;
}) {
  return (
    <>
      <div className="mt-5 p-5 border rounded-lg">
        <h2 className="font-semibold">Website's Script</h2>
        <p className="text-sm gray-text">
          Include this script in your website to initialize the product tour
        </p>
        <pre className="w-auto inline-block text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
          &lt;script type="text/javascript"
          src="https://untitledlabs.io/productTour.js"&gt;&lt;/script&gt;
          <br />
          &lt;script type="text/javascript"&gt;
          <br />
          ProductTour.init("{project.id}") <br />
          &lt;/script&gt; <br />
        </pre>
      </div>

      <div className="mt-5 p-5 border rounded-lg">
        <h2 className="font-semibold">Theme</h2>
        <p className="text-sm gray-text">
          Reflected in all the tours within this project
        </p>

        <div className="mt-5 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 gap-10">
          {themeOptions.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <label className="font-medium text-sm mb-1">{item.label}</label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    className="font-semibold"
                    style={{
                      background: formState[item.id]
                        ? formState[item.id].value
                        : "black",
                      minWidth: "10rem",
                      textShadow: "0px 0px 1.5px black",
                    }}
                  >
                    {formState[item.id] ? formState[item.id].value : "No color"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <SketchPicker
                    color={formState[item.id]?.value ?? ""}
                    onChange={(color) => setColor(item.id, color)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>

        <Button className="mt-5" onClick={updateTheme}>
          Save theme
        </Button>
      </div>
    </>
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

        setTours(tourData);
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

      setFormState(tempForm);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateTheme() {
    try {
      console.log("Values", Object.values(formState));
      const { data } = await axios.patch(
        API_URL + "/theme/" + project.theme_id,
        { details: Object.values(formState) }, // Keys don't matter, storing an array of ThemeOptions in the database
        {
          headers: {
            Authorization: "Bearer " + store.session.access_token,
          },
        }
      );
      console.log("Updated theme", data);
    } catch (e) {
      console.error(e);
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
            <TourGrid tours={tours} />
          ) : (
            <TourSettings
              formState={formState}
              project={project}
              setColor={setColor}
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
