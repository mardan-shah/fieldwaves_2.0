import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";
import { ShieldCheck, Clock, Users, Target } from "lucide-react";


const whyUs = [
  {
    icon: ShieldCheck,
    title: "Security-First",
    description: "Every line of code is written with security in mind. No shortcuts, no exceptions.",
  },
  {
    icon: Clock,
    title: "Rapid Delivery",
    description: "AI-accelerated workflows mean enterprise quality at startup speed.",
  },
  {
    icon: Users,
    title: "Senior-Only Team",
    description: "No juniors, no handoffs. Every project gets direct access to senior engineers.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We measure success in uptime, performance metrics, and business impact — not hours billed.",
  },
]


const WhyUs = () => {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6">
        <SectionHeading
          label="The Difference"
          title="Why FieldWaves"
          subtitle="We don't just write code — we engineer systems that last"
          align="center"
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8">
          {whyUs.map((item, i) => {
            const Icon = item.icon;
            return (
              <Container
                key={i}
                variant="ghost"
                className="p-8 group"
                hoverEffect
              >
                <div>
                  <Icon
                    className="text-primary mb-6 group-hover:scale-110 transition-transform"
                    size={36}
                  />
                  <h3 className="font-display text-lg font-bold mb-3 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Container>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
