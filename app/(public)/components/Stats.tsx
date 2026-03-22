import StatCard from "@/components/ui/StatCard";
import { getProjects } from "@/app/actions/public";
import { connection } from "next/server";

const Stats = async () => {
  await connection();
  let projects = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Error fetching projects for stats:", error);
  }

  return (
    <section className="py-24 bg-card">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            index={1}
            label="Projects Delivered"
            value={`${projects.length}+`}
            description="Enterprise-scale solutions"
          />
          <StatCard
            index={2}
            label="Uptime"
            value="99.99%"
            description="Average reliability"
          />
          <StatCard
            index={3}
            label="Performance"
            value="89%"
            description="Average improvement"
          />
          <StatCard
            index={4}
            label="Services"
            value="10+"
            description="Core capabilities"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
