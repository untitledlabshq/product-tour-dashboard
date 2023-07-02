import Navbar from "@/components/Navbar";
import TourDialog from "@/components/TourDialog";
import { API_URL } from "@/constants";
import { useAppStore } from "@/store";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProjectId() {
  const router = useRouter();
  const store = useAppStore();
  const [project, setProject] = useState(null as any);
  const [tours, setTours] = useState([] as any[]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjectData();
  });

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

  return (
    <>
      <Head>
        <title>Project - {project ? project.name : router.query.id}</title>
      </Head>
      <Navbar />
      {project ? (
        <main className="p-10">
          <div
            className="flex space-x-1 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <ArrowLeft width={16} />
            <span>Back</span>
          </div>

          <h1 className="mt-5 font-bold text-xl">{project.name}</h1>
          <p className="mt-2 text-sm gray-text">{project.desc}</p>

          <h2 className="mt-5 font-semibold">Website's Script</h2>
          <p className="text-sm gray-text">Include this script in your website to initialize the product tour</p>
          <pre className="w-auto inline-block text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
              &lt;script type="text/javascript" src="https://untitledlabs.io/productTour.js"&gt;&lt;/script&gt;
            <br />
              &lt;script type="text/javascript"&gt;<br />
                UntitledProductTour.init("KEY_abcxyz123789") <br />
              &lt;/script&gt; <br />
          </pre>

          <div className="mt-5 flex justify-between items-center">
            <h1 className="text-3xl">Tours</h1>
            <TourDialog onCreate={fetchProjectData} />
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
            {tours.map((tour) => {
              return (
                <Link key={tour.id} href={"/tour/" + tour.id}>
                  <div className="border border-gray-600 p-5 rounded-lg h-full">
                    <h1 className="text-lg font-bold">{tour.name}</h1>
                    <p className="text-sm mt-1 gray-text">{tour.desc}</p>

                    <p className="text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
                      {tour.url}
                    </p>

                    <div className="mt-4 space-x-1.5">
                      <p className="pill">8 Steps</p>
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

          <h1 className="mt-10 text-3xl">Theme</h1>
        </main>
      ) : (
        <main className="p-10">{error || "Loading..."}</main>
      )}
    </>
  );
}
