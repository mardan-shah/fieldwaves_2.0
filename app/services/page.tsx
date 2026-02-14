import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import ServiceCard from "../../components/ServiceCard"
import Button from "../../components/ui/SkewButton"
import SkewContainer from "../../components/ui/SkewContainer"
import { Cpu, Lock, Zap, Code, BarChart3, Wrench } from "lucide-react"

export default function ServicesPage() {
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
    {
      icon: BarChart3,
      title: "Analytics & Monitoring",
      description: "Real-time insights into system performance and user behavior.",
      features: ["Real-time dashboards", "Alert systems", "Trend analysis", "Custom metrics"],
    },
    {
      icon: Wrench,
      title: "DevOps & Automation",
      description: "Streamlined deployment pipelines and infrastructure automation.",
      features: ["CI/CD setup", "Container orchestration", "Infrastructure as code", "Disaster recovery"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden selection:bg-[#FF5F1F] selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Our Arsenal"
            title="Capabilities That Scale"
            subtitle="We don't just build—we engineer solutions designed for enterprise-level performance, security, and reliability."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="font-mono text-sm text-[#B0B0B0] mb-6">Ready to transform your infrastructure?</p>
            <Button href="#contact">Start A Project</Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Our Method"
            title="A Systematic Approach"
            subtitle="We follow a rigorous process to ensure every solution exceeds expectations."
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-4 gap-4">
            {["Discovery", "Strategy", "Implementation", "Optimization"].map((step, i) => (
              <SkewContainer key={i} variant="glass" className="p-8 text-center">
                <div className="text-4xl font-display font-bold text-[#FF5F1F] mb-4">{i + 1}</div>
                <h3 className="font-display text-lg font-bold">{step}</h3>
              </SkewContainer>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
