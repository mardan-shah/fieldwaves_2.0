import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import CaseStudyGrid from "@/components/CaseStudyGrid"
import { getCaseStudies } from "@/app/actions/public"

export const metadata: Metadata = {
  title: "All Case Studies | FieldWaves",
  description: "Browse our complete portfolio of engineering solutions and case studies.",
}

export default async function AllCaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-12">
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
            label="Complete Archive"
            title="All Case Studies"
            subtitle="Browse our complete portfolio of engineering solutions."
          />
        </div>
      </section>

      {/* Grid with Search/Filter */}
      <section className="py-12 pb-24">
        <CaseStudyGrid caseStudies={caseStudies} />
      </section>
    </>
  )
}
