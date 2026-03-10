import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import SkewContainer from "@/components/ui/SkewContainer"
import Button from "@/components/ui/SkewButton"
import { Code2, Users, Zap, Shield, TrendingUp, Award } from "lucide-react"

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
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Who We Are"
            title="Engineering as an Art Form"
            subtitle="FieldWaves is more than a software agency. We're a collective of senior engineers who believe that great code is an investment in the future."
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

            <SkewContainer variant="glass" className="p-8">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-bold text-lg mb-2">Founded</h3>
                  <p className="text-secondary">2023 with a vision to revolutionize enterprise development</p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-bold text-lg mb-2">Team</h3>
                  <p className="text-secondary">5+ senior engineers with unparallel experience as software</p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-bold text-lg mb-2">Projects</h3>
                  <p className="text-secondary">10+ enterprise solutions in production</p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-bold text-lg mb-2">Commitment</h3>
                  <p className="text-secondary">100% focus on your success and code quality</p>
                </div>
              </div>
            </SkewContainer>
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
                <SkewContainer key={i} variant="ghost" className="p-8 group" hoverEffect>
                  <div>
                    <Icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-secondary">{value.description}</p>
                  </div>
                </SkewContainer>
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
