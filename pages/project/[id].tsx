import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function ProjectId() {
  return (
    <>
      <Navbar />
      <main className="p-10">
        <h1 className="font-bold text-xl">Untitled Project</h1>
        <p className="mt-2 text-sm text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>

        <div className="mt-5 flex justify-between items-center">
          <h1 className="text-3xl">Tours</h1>
          <Button variant={"secondary"}>+ Add New</Button>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {Array.from(new Array(10).keys()).map((n) => {
            return (
              <div key={n} className="border border-gray-600 p-5 rounded-lg">
                <h1 className="text-lg font-bold">Tour {n}</h1>
                <p className="text-sm mt-1 text-gray-300">
                    Home Page
                </p>

                <p className="text-xs mt-2 mb-1 p-2 bg-gray-600 rounded font-mono overflow-x-auto">https://www.untitledlabs.io/homehttps://www.untitledlabs.io/home</p>

                <p className="text-sm mt-3">8 Steps</p>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
