import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Button from "@/components/ui/button";
import { getServices } from "@/app/actions/public";
import { iService } from "@/types";
import { connection } from "next/server";

const ServicesSection = async () => {
  await connection();
  let services: iService[] = [];
  try {
    services = await getServices();
  } catch (error) {
    console.error("Error fetching services:", error);
  }
  // console.log("Fetched services:", services);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading
          label="Our Arsenal"
          title="What We Do"
          subtitle="Enterprise-grade capabilities that scale with your ambitions"
          align="center"
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.slice(0, 4).map((service, i) => (
            <ServiceCard key={service._id} index={i + 1} {...service} />
          ))}
        </div>

        <div className="text-center">
          <Button href="/services">VIEW ALL SERVICES</Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
