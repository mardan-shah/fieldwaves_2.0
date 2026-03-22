import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import ServiceCard from "@/components/ServiceCard"
import Button from "@/components/ui/SkewButton"
import Container from "@/components/ui/Container"
import { getServices } from "@/app/actions/public"
import GridBackground from "@/components/ui/GridBackground"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Services | FieldWaves",
  description: "Full-stack architecture, security hardening, performance optimization, AI-powered development, and DevOps automation.",
}

export default async function ServicesPage() {
  await connection()
  const services = await getServices()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <GridBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Our Arsenal"
            title="Capabilities That Scale"
            subtitle="We don't just build—we engineer solutions designed for enterprise-level performance, security, and reliability."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, i) => (
              <ServiceCard key={service._id} index={i + 1} {...service} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="font-mono text-sm text-secondary mb-6">Ready to transform your infrastructure?</p>
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
              <Container key={i} variant="glass" className="p-8 text-center">
                <div className="text-4xl font-display font-bold text-primary mb-4">{i + 1}</div>
                <h3 className="font-display text-lg font-bold">{step}</h3>
              </Container>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
