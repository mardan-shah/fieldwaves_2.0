import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/SkewButton"
import TeamGrid from "../../components/TeamGrid"
import { getTeam } from "../actions/public"

export default async function TeamPage() {
  const team = await getTeam()

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
          <SectionHeading
            label="Our Team"
            title="OPERATIVES"
            subtitle="Senior engineers dedicated to engineering excellence"
          />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <TeamGrid team={team} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Join Our Team</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            We're always looking for talented engineers who share our values.
          </p>
          <Button href="/contact">GET IN TOUCH</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
