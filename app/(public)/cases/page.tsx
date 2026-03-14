import type { Metadata } from "next"
import Link from "next/link"
import SectionHeading from "@/components/ui/SectionHeading"
import Button from "@/components/ui/SkewButton"
import CaseStudyCard from "@/components/CaseStudyCard"
import CaseStudyGrid from "@/components/CaseStudyGrid"
import { getCaseStudies, getFeaturedCaseStudies } from "@/app/actions/public"
import { Star } from "lucide-react"
import GridBackground from "@/components/ui/GridBackground"

export const metadata: Metadata = {
  title: "Case Studies | FieldWaves",
  description: "Real projects, real metrics, real impact. Explore our proven track record of engineering excellence.",
}

export default async function CaseStudiesPage() {
  const [allCases, featured] = await Promise.all([
    getCaseStudies(),
    getFeaturedCaseStudies(),
  ])

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

      {/* Featured Work */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-3 mb-10">
            <Star size={16} className="text-primary" />
            <h2 className="font-mono font-bold text-sm tracking-widest">FEATURED_WORK</h2>
          </div>

          <div className="space-y-24">
            {featured.map((caseStudy, i) => (
              <CaseStudyCard
                key={caseStudy._id}
                caseStudy={caseStudy}
                imagePosition={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Cases with Search */}
      {allCases.length > 0 ? (
        <section className="py-12 pb-24">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <h2 className="font-mono font-bold text-sm tracking-widest">ALL_CASES</h2>
          </div>
          <CaseStudyGrid caseStudies={allCases} />
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-muted text-sm">NO_CASE_STUDIES_PUBLISHED</p>
          <p className="text-sm text-secondary mt-2">Check back soon for our latest work.</p>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Your Success Story Starts Here</h2>
          <p className="text-lg text-secondary mb-8">Let&apos;s engineer something extraordinary together.</p>
          <Link href="/contact">
            <Button>Schedule a Discovery Call</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
