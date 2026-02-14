import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/SkewButton"
import ProjectGrid from "../../components/ProjectGrid"
import { getProjects } from "../actions/public"

export default async function ProjectsPage() {
  const projects = await getProjects()

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

        <div className="relative z-10 max-w-7xl mx-auto px-14 md:px-6 w-full">
          <SectionHeading label="Recent Work" title="DEPLOYMENTS" subtitle="Enterprise solutions in production" />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Impressed?</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            Let's talk about bringing your next vision to life.
          </p>
          <Button href="/contact">SCHEDULE A CALL</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
