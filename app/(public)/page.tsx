import type { Metadata } from "next"
import SkewContainer from "@/components/ui/SkewContainer"
import Button from "@/components/ui/SkewButton"
import StatCard from "@/components/ui/StatCard"
import SectionHeading from "@/components/ui/SectionHeading"
import ProjectGrid from "@/components/ProjectGrid"
import ServiceCard from "@/components/ServiceCard"
import { getProjects } from "@/app/actions/public"
import { Lightbulb, Cpu, Lock, Zap, Code, ShieldCheck, Clock, Users, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "FieldWaves | Engineering Over Vibe",
  description: "Enterprise-grade full-stack development with AI-accelerated senior-level security and architectural rigor.",
}

const services = [
  {
    icon: Cpu,
    title: "Full-Stack Architecture",
    description: "Enterprise-grade systems built for scale, security, and performance.",
    features: ["Microservices design", "API optimization", "Database sharding", "Load balancing"],
  },
  {
    icon: Lock,
    title: "Security Hardening",
    description: "Comprehensive security audits and hardening from the ground up.",
    features: ["Penetration testing", "Vulnerability assessment", "Compliance audit", "Security protocols"],
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Extract maximum efficiency from your infrastructure.",
    features: ["Code profiling", "CDN integration", "Caching strategy", "Query optimization"],
  },
  {
    icon: Code,
    title: "AI-Powered Development",
    description: "Accelerate development with AI-assisted code generation and review.",
    features: ["Code generation", "Automated testing", "Performance analysis", "Best practices"],
  },
]

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

export default async function Home() {
  const projects = await getProjects()

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-14 md:px-6 w-full">
          <div className="flex flex-col items-start gap-4">
            <SkewContainer variant="secondary" className="px-3 py-1 mb-4">
              <span className="font-mono text-xs font-bold tracking-widest">SYS_ONLINE // V.2.5.0</span>
            </SkewContainer>

            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter uppercase mb-6 max-w-5xl">
              Engineering <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--primary)" }}>
                Over Vibe
              </span>{" "}
              <br />
              Coding
            </h1>

            <div className="max-w-2xl bg-background/80 backdrop-blur-sm border-l-4 border-primary pl-6 py-2 -skew-x-12">
              <div>
                <p className="text-xl md:text-2xl text-secondary font-light">
                  We use AI not to copy-paste, but to accelerate{" "}
                  <span className="text-white font-bold">senior-level security</span> and{" "}
                  <span className="text-white font-bold">architectural rigor</span>.
                </p>
              </div>
            </div>

            <div className="mt-12 flex gap-6 flex-wrap">
              <Button href="/projects">EXPLORE WORK</Button>
              <Button variant="outline" href="/services">
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard
              label="Projects Delivered"
              value={`${projects.length}+`}
              description="Enterprise-scale solutions"
            />
            <StatCard label="Uptime" value="99.99%" description="Average reliability" />
            <StatCard label="Performance" value="89%" description="Average improvement" />
            <StatCard
              label="Services"
              value="6+"
              description="Core capabilities"
            />
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS PREVIEW --- */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
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

      {/* --- SERVICES PREVIEW --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-14 md:px-6 relative z-10">
          <SectionHeading
            label="Our Arsenal"
            title="What We Do"
            subtitle="Enterprise-grade capabilities that scale with your ambitions"
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>

          <div className="text-center">
            <Button href="/services">VIEW ALL SERVICES</Button>
          </div>
        </div>
      </section>

      {/* --- WHY US --- */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <SectionHeading
            label="The Difference"
            title="Why FieldWaves"
            subtitle="We don't just write code — we engineer systems that last"
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-8">
            {whyUs.map((item, i) => {
              const Icon = item.icon
              return (
                <SkewContainer key={i} variant="ghost" className="p-8 group" hoverEffect>
                  <div>
                    <Icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={36} />
                    <h3 className="font-display text-lg font-bold mb-3 uppercase">{item.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{item.description}</p>
                  </div>
                </SkewContainer>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <Lightbulb className="mx-auto text-primary mb-8" size={48} />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Ready to Transform?</h2>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
            Let's engineer your next breakthrough. Whether it's scaling infrastructure, enhancing security, or launching
            a new product, we're ready to help.
          </p>
          <Button href="/contact">INITIATE PROJECT</Button>
        </div>
      </section>
    </>
  )
}
