import type { Metadata } from "next"
import Link from "next/link"
import SectionHeading from "@/components/ui/SectionHeading"
import Button from "@/components/ui/SkewButton"
import CaseStudyList from "@/components/CaseStudyList"
import { getCaseStudies, getSettings } from "@/app/actions/public"
import GridBackground from "@/components/ui/GridBackground"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Case Studies | FieldWaves",
  description: "Real projects, real metrics, real impact. Explore our proven track record of engineering excellence.",
}

export default async function CaseStudiesPage() {
  await connection()
  const [allCases, settings] = await Promise.all([
    getCaseStudies(),
    getSettings(),
  ])

  const displayCount = settings?.casesDisplayCount ?? 3

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Proven Track Record"
            title="Results That Speak"
            subtitle="Real projects. Real metrics. Real impact."
          />
        </div>
      </section>

      {/* Main Content: Search + Alternating Case Studies List */}
      <section className="pb-24">
        {allCases.length > 0 ? (
          <CaseStudyList 
            caseStudies={allCases} 
            initialDisplayCount={displayCount} 
          />
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <p className="font-mono text-muted text-sm">NO_CASE_STUDIES_PUBLISHED</p>
            <p className="text-sm text-secondary mt-2">Check back soon for our latest work.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 uppercase">Your Success Story Starts Here</h2>
          <p className="text-lg text-secondary mb-8">Let&apos;s engineer something extraordinary together.</p>
          <Link href="/contact">
            <Button>Schedule a Discovery Call</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
