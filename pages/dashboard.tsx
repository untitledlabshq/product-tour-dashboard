import Navbar from "@/components/Navbar";
import ProjectDialog from "@/components/ProjectDialog";
import { API_URL } from "@/constants";
import { useAppStore } from "@/store";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const store = useAppStore();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [store.session]);

  function fetchProjects() {
    if (store.session) {
      axios
        .get(API_URL + "/project/user/" + store.session.user.id, {
          headers: {
            Authorization: "Bearer " + store.session.access_token,
          },
        })
        .then((response) => {
          setProjects(response.data);
        })
        .catch((e) => {
          setError(e.message);
        });
    }
  }

  return (
    <main>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Navbar />
      <div className="pt-12 px-8 md:px-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Your Projects</h1>
          <ProjectDialog onCreate={fetchProjects} />
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3">
          {projects.length === 0 && <span>{error ? error : "Loading..."}</span>}
          {projects.map((project: any) => {
            return (
              <Link key={project.id} href={"/project/" + project.id}>
                <div className="border border-gray-800 bg-white dark:bg-primary-purple p-5 rounded-lg h-full">
                  <h1 className="text-lg font-bold">{project.name}</h1>
                  <p className="text-sm mt-1 gray-text">{project.desc}</p>

                  <div className="mt-3">
                    {project.tour_count ? (
                      <p className="pill">
                        {project.tour_count} Tour
                        {project.tour_count > 1 && "s"}
                      </p>
                    ) : (
                      <p className="pill">No Tours</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
