import Navbar from "@/components/Navbar";
import ProjectDialog from "@/components/ProjectDialog";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Navbar />
      <div className="pt-12 px-8 md:px-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Your Projects</h1>
          {mounted && <ProjectDialog />}
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3">
          {Array.from(new Array(10).keys()).map((n) => {
            return (
              <Link key={n} href="/project/1">
                <div className="border border-gray-600 bg-white dark:bg-neutral-600 p-5 rounded-lg">
                  <h1 className="text-lg font-bold">Untitled Labs</h1>
                  <p className="text-sm mt-1 gray-text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>

                  <p className="mt-3 pill">8 tours</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
