import { fetchExperiences, fetchProjects } from "@/backend/lib/apii";
import StarfieldBackground from "@/components/background-layout";
import HomePage from "@/components/home/home";
import Typewriter from "@/components/typer";
import Image from "next/image";

export default async function Home() {
  const experiences = await fetchExperiences();
  const projects = await fetchProjects();
  return (
    <div className="relative min-h-screen font-sans">
      {/* 2) Content above stars */}
      <main className="relative z-10 flex min-h-screen w-full  flex-col items-center justify-between  sm:items-start font-sans">
        <HomePage projects={projects} experiences={experiences} />
      </main>
    </div>
  );
}
