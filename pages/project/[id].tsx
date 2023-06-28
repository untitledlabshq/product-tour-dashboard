import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProjectId() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Project {router.query.id}</title>
      </Head>
      <Navbar />
      <main className="p-10">
        <h1 className="font-bold text-xl">Untitled Project</h1>
        <p className="mt-2 text-sm gray-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>

        <div className="mt-5 flex justify-between items-center">
          <h1 className="text-3xl">Tours</h1>
          <Button variant={"secondary"}>+ Add New</Button>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {Array.from(new Array(10).keys()).map((n) => {
            return (
              <Link key={n} href="/tour/1">
                <div className="border border-gray-600 p-5 rounded-lg">
                  <h1 className="text-lg font-bold">Tour {n}</h1>
                  <p className="text-sm mt-1 gray-text">Home Page</p>

                  <p className="text-xs mt-2 mb-1 p-2 bg-gray-300 dark:bg-gray-600 rounded font-mono overflow-x-auto">
                    https://www.untitledlabs.io/home
                  </p>

                  <div className="mt-4 space-x-1.5">
                    <p className="pill">8 Steps</p>
                    <p className="pill pill-success">Enabled</p>
                    <p className="pill pill-warning">Disabled</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
