import { notFound } from "next/navigation"
import Link from "next/link"
import SkewContainer from "@/components/ui/SkewContainer"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import TableOfContents from "@/components/ui/TableOfContents"
import Button from "@/components/ui/SkewButton"
import { getCaseStudyBySlug, getCaseStudies } from "@/app/actions/public"
import { trackPageView } from "@/app/actions/admin"
import { ArrowLeft, Eye, Calendar } from "lucide-react"

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const cases = await getCaseStudies()
  return cases.map((c) => ({
    slug: c.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)
  if (!caseStudy) return { title: "Not Found" }

  return {
    title: `${caseStudy.title} | FieldWaves`,
    description: caseStudy.overview || caseStudy.title,
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) notFound()

  await trackPageView(`/cases/${slug}`, 'case_study', caseStudy._id)

  const formattedDate = new Date(caseStudy.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  })

  return (
    <>
      {/* Cover Image */}
      {caseStudy.coverImage && (
        <section className="relative h-[50vh] md:h-[60vh] mt-20">
          <img
            src={caseStudy.coverImage}
            alt={caseStudy.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </section>
      )}

      {/* Title Block */}
      <section className={`max-w-7xl mx-auto px-6 ${caseStudy.coverImage ? "-mt-40 relative z-10" : "pt-32"}`}>
        {/* Back link */}
        <Link href="/cases" className="inline-block mb-8">
          <SkewContainer variant="ghost" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs text-muted hover:text-white transition-colors">
              <ArrowLeft size={14} />
              BACK_TO_CASES
            </span>
          </SkewContainer>
        </Link>

        {caseStudy.subtitle && (
          <SkewContainer variant="primary" className="px-4 py-1 inline-block mb-4">
            <span className="font-mono text-xs tracking-widest uppercase">{caseStudy.subtitle}</span>
          </SkewContainer>
        )}

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight">
          {caseStudy.title}
        </h1>

        {caseStudy.overview && (
          <p className="text-xl text-secondary max-w-3xl mb-6 leading-relaxed">{caseStudy.overview}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-10">
          <SkewContainer variant="glass" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs">
              <Eye size={12} className="text-primary" />
              {caseStudy.views ?? 0} VIEWS
            </span>
          </SkewContainer>
          <SkewContainer variant="glass" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs">
              <Calendar size={12} className="text-primary" />
              {formattedDate}
            </span>
          </SkewContainer>
        </div>
      </section>

      {/* Metric Cards */}
      {caseStudy.metricCards.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(caseStudy.metricCards.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {caseStudy.metricCards.map((metric, idx) => (
              <SkewContainer key={idx} variant="glass" className="p-6 border-t-2 border-t-primary">
                <p className="font-mono text-xs text-primary mb-2 tracking-widest uppercase">{metric.label}</p>
                <p className="font-display text-4xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm text-secondary">{metric.unit}</p>
              </SkewContainer>
            ))}
          </div>
        </section>
      )}

      {/* Two-Column: TOC + Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[250px_1fr] gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="border-l-2 border-primary pl-4">
                <TableOfContents content={caseStudy.description} />
              </div>

              {/* Tech Stack in sidebar */}
              {caseStudy.techStack.length > 0 && (
                <div>
                  <p className="font-mono text-xs text-primary tracking-widest mb-3">TECH_STACK</p>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.techStack.map((tech) => (
                      <SkewContainer key={tech} variant="outline" className="px-3 py-1">
                        <span className="font-mono text-xs">{tech}</span>
                      </SkewContainer>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="max-w-3xl">
            <MarkdownRenderer content={caseStudy.description} withIds />
          </div>
        </div>
      </section>

      {/* Tech Stack (mobile only) */}
      {caseStudy.techStack.length > 0 && (
        <section className="lg:hidden max-w-7xl mx-auto px-6 py-10 border-t border-border">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">TECHNOLOGIES USED</p>
          <div className="flex flex-wrap gap-2">
            {caseStudy.techStack.map((tech) => (
              <SkewContainer key={tech} variant="outline" className="px-4 py-2">
                <span className="font-mono text-sm">{tech}</span>
              </SkewContainer>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-6">Ready For Similar Results?</h2>
          <p className="text-lg text-secondary mb-8">Let&apos;s engineer your next success story.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button>GET IN TOUCH</Button>
            </Link>
            <Link href="/cases" className="inline-block">
              <SkewContainer variant="ghost" hoverEffect className="px-6 py-3">
                <span className="font-mono font-bold tracking-widest text-sm">MORE CASES</span>
              </SkewContainer>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
