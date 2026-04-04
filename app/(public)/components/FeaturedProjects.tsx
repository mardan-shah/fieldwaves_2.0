import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/button";
import { getProjects } from "@/app/actions/public";
import { iProject } from "@/types";
import { connection } from "next/server";

const FeaturedProjects = async () => {
  await connection();
  let projects: iProject[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Error fetching projects for stats:", error);
  }

  // console.log("Fetched projects for FeaturedProjects:", projects);
  return (
    <section className="py-24 bg-card">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Recent Work"
          title="Featured Deployments"
          subtitle="A selection of our latest enterprise solutions"
          align="right"
          className="mb-16"
        />

        <div className="mb-12">
          <ProjectGrid projects={projects.slice(0, 3)} />
        </div>

        <div className="text-center">
          <Button href="/projects">VIEW ALL PROJECTS</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
