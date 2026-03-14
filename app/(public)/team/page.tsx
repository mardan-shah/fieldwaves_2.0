import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import Button from "@/components/ui/SkewButton"
import TeamGrid from "@/components/TeamGrid"
import { getTeam } from "@/app/actions/public"
import GridBackground from "@/components/ui/GridBackground"

export const metadata: Metadata = {
  title: "Team | FieldWaves",
  description: "Meet the senior engineers behind FieldWaves — dedicated operatives building enterprise-grade solutions.",
}

export default async function TeamPage() {
  const team = await getTeam()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <GridBackground />

        <div className="relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-14 md:px-6 w-full">
          <SectionHeading
            label="Our Team"
            title="OPERATIVES"
            subtitle="Senior engineers dedicated to engineering excellence"
          />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-14 md:px-6">
          <TeamGrid team={team} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Join Our Team</h2>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
            We're always looking for talented engineers who share our values.
          </p>
          <Button href="/contact">GET IN TOUCH</Button>
        </div>
      </section>
    </>
  )
}
