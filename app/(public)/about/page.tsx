import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import Container from "@/components/ui/Container"
import Button from "@/components/ui/SkewButton"
import { Code2, Users, Zap, Shield, TrendingUp, Award } from "lucide-react"
import GridBackground from "@/components/ui/GridBackground"

export const metadata: Metadata = {
  title: "About | FieldWaves",
  description: "Learn about FieldWaves — a collective of senior engineers dedicated to engineering excellence, clean code, and enterprise-grade security.",
}

export default function AboutPage() {
  const values = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Production-grade code that scales. No shortcuts, no tech debt.",
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Enterprise-grade security patterns from day one.",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "O(n) optimization thinking. Every millisecond matters.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We transfer knowledge, not just code. Your team grows with us.",
    },
    {
      icon: TrendingUp,
      title: "Scalability",
      description: "Systems built for growth from inception.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We don't just meet requirements. We exceed them.",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <GridBackground />
       

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="WHO_WE_ARE"
            title="Engineered Aesthetics"
            subtitle="FieldWaves is a collective of senior engineers who believe that high-end design and architectural rigor are not mutually exclusive."
            align="center"
            className="mb-0"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="-skew-x-12">
              <div className="skew-x-12">
                <h2 className="font-display text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-secondary mb-4 leading-relaxed">
                  Founded by engineers who were tired of compromising on quality, FieldWaves started with a simple
                  mission: prove that you don't have to choose between speed and excellence.
                </p>
                <p className="text-secondary mb-4 leading-relaxed">
                  We've worked with FinTech companies and ambitious startups. In every project, we bring the same
                  level of rigor, security thinking, and performance obsession.
                </p>
                <p className="text-secondary leading-relaxed">
                  Your success is our success. We don't disappear after launch — we build sustainable systems that your team
                  can maintain and scale.
                </p>
              </div>
            </div>

            <Container variant="glass" className="p-8 relative overflow-hidden group">
              <div className="absolute top-2 right-4 font-mono text-[8px] opacity-30 select-none">
                CORP_ID_FW_2023_001
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6 hover:bg-white/5 transition-colors py-1">
                  <h3 className="font-mono text-xs font-bold mb-1 tracking-widest uppercase">ESTABLISHED</h3>
                  <p className="text-secondary text-sm">2023_Q1 // MISSION: HIGH_FIDELITY_ENG</p>
                </div>
                <div className="border-l-4 border-primary pl-6 hover:bg-white/5 transition-colors py-1">
                  <h3 className="font-mono text-xs font-bold mb-1 tracking-widest uppercase">UNIT_STRENGTH</h3>
                  <p className="text-secondary text-sm">SENIOR_ONLY // 05_OPERATIVES</p>
                </div>
                <div className="border-l-4 border-primary pl-6 hover:bg-white/5 transition-colors py-1">
                  <h3 className="font-mono text-xs font-bold mb-1 tracking-widest uppercase">OPERATIONS</h3>
                  <p className="text-secondary text-sm">10+ ENTERPRISE_DEPLOYMENTS</p>
                </div>
                <div className="border-l-4 border-primary pl-6 hover:bg-white/5 transition-colors py-1">
                  <h3 className="font-mono text-xs font-bold mb-1 tracking-widest uppercase">KPI_TARGET</h3>
                  <p className="text-secondary text-sm">ZERO_DEBT // ARCHITECTURAL_RIGOR</p>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Core Values"
            title="What We Stand For"
            subtitle="These principles guide every decision we make"
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-3 gap-x-14 gap-y-8">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <Container key={i} variant="ghost" className="p-8 group" hoverEffect>
                  <div>
                    <Icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-secondary">{value.description}</p>
                  </div>
                </Container>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 uppercase">
            Let's Build Something Extraordinary
          </h2>
          <p className="text-lg text-secondary mb-12 max-w-2xl mx-auto">
            Whether you're scaling infrastructure, launching a new product, or need a security overhaul, our team is
            ready to transform your vision into production-grade reality.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button href="/contact">START A PROJECT</Button>
            <Button variant="outline" href="/">
              BACK TO HOME
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
