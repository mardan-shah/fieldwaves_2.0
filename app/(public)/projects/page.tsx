import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import Button from "@/components/ui/SkewButton"
import ProjectGrid from "@/components/ProjectGrid"
import { getProjects } from "@/app/actions/public"
import GridBackground from "@/components/ui/GridBackground"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Projects | FieldWaves",
  description: "Browse our portfolio of enterprise-grade deployments and production solutions.",
}

export default async function ProjectsPage() {
  await connection()
  const projects = await getProjects()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <GridBackground />

        <div className="relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-14 md:px-6 w-full">
          <SectionHeading label="Recent Work" title="DEPLOYMENTS" subtitle="Enterprise solutions in production" />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-14 md:px-6">
          <ProjectGrid projects={projects} showSearch />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Impressed?</h2>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
            Let's talk about bringing your next vision to life.
          </p>
          <Button href="/contact">SCHEDULE A CALL</Button>
        </div>
      </section>
    </>
  )
}
