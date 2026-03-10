"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import SkewContainer from "@/components/ui/SkewContainer"
import SearchFilterBar from "@/components/SearchFilterBar"
import type { CaseStudy } from "@/types"
import { Eye } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface CaseStudyGridProps {
  caseStudies: CaseStudy[]
}

export default function CaseStudyGrid({ caseStudies }: CaseStudyGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const { ref: gridRef, isInView } = useInView()

  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    caseStudies.forEach(c => c.techStack.forEach(t => techSet.add(t)))
    return Array.from(techSet).sort()
  }, [caseStudies])

  const filtered = useMemo(() => {
    return caseStudies.filter(c => {
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTech = !activeTech || c.techStack.includes(activeTech)

      return matchesSearch && matchesTech
    })
  }, [caseStudies, searchQuery, activeTech])

  return (
    <div>
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="SEARCH_CASES // title, tech stack, overview..."
        tags={allTechs}
        activeTag={activeTech}
        onTagChange={setActiveTech}
        resultCount={filtered.length}
        totalCount={caseStudies.length}
      />

      <div className="max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-muted text-sm">NO_RESULTS_FOUND</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <Link key={c._id} href={`/cases/${c.slug}`} className={`group ${isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${i * 0.05}s` }}>
                <SkewContainer variant="ghost" hoverEffect noSkewMobile className="overflow-hidden h-full">
                  <div className="flex flex-col h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={c.coverImage || "https://picsum.photos/seed/case/600/400"}
                        alt={c.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200 scale-110 group-hover:scale-100"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      {c.subtitle && (
                        <p className="font-mono text-[10px] text-primary tracking-widest uppercase mb-1">
                          {c.subtitle}
                        </p>
                      )}
                      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-sm text-secondary mb-4 line-clamp-2 flex-1">
                        {c.overview}
                      </p>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 font-mono text-[10px] text-muted">
                          <Eye size={10} />
                          {c.views ?? 0}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {c.techStack.slice(0, 4).map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 border border-border font-mono text-[10px] text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                        {c.techStack.length > 4 && (
                          <span className="px-2 py-0.5 font-mono text-[10px] text-muted">
                            +{c.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SkewContainer>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
