"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import CaseStudyCard from "@/components/CaseStudyCard"
import SearchFilterBar from "@/components/SearchFilterBar"
import SkewContainer from "@/components/ui/SkewContainer"
import Button from "@/components/ui/SkewButton"
import type { CaseStudy } from "@/types"

interface CaseStudyListProps {
  caseStudies: CaseStudy[]
  initialDisplayCount: number
}

export default function CaseStudyList({ caseStudies, initialDisplayCount }: CaseStudyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(initialDisplayCount)

  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    caseStudies.forEach(c => c.techStack.forEach(t => techSet.add(t)))
    return Array.from(techSet).sort()
  }, [caseStudies])

  const [activeTech, setActiveTech] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return caseStudies.filter(c => {
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTech = !activeTech || c.techStack.includes(activeTech)

      return matchesSearch && matchesTech
    })
  }, [caseStudies, searchQuery, activeTech])

  const visible = filtered.slice(0, displayCount)
  const hasMore = filtered.length > displayCount

  return (
    <>
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          setDisplayCount(initialDisplayCount)
        }}
        placeholder="SEARCH_CASES // title, tech stack, overview..."
        tags={allTechs}
        activeTag={activeTech}
        onTagChange={setActiveTech}
        resultCount={filtered.length}
        totalCount={caseStudies.length}
      />

      {/* Case Studies */}
      <section className="py-4 space-y-24">
        {visible.length > 0 ? (
          visible.map((caseStudy, i) => (
            <CaseStudyCard
              key={caseStudy._id}
              caseStudy={caseStudy}
              imagePosition={i % 2 === 0 ? "left" : "right"}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="font-mono text-muted text-sm">
              {searchQuery || activeTech ? "NO_RESULTS_FOUND" : "NO_CASE_STUDIES_PUBLISHED"}
            </p>
            {!searchQuery && !activeTech && (
              <p className="text-sm text-secondary mt-2">Check back soon for our latest work.</p>
            )}
          </div>
        )}
      </section>

      {/* Show More / View All */}
      {visible.length > 0 && (
        <section className="py-12 text-center flex items-center justify-center gap-4">
          {hasMore && (
            <button onClick={() => setDisplayCount(prev => prev + initialDisplayCount)}>
              <SkewContainer variant="outline" className="px-8 py-3" hoverEffect>
                <span className="font-mono font-bold tracking-widest text-sm">SHOW MORE</span>
              </SkewContainer>
            </button>
          )}
          <Link href="/cases/all">
            <Button variant="outline">VIEW ALL</Button>
          </Link>
        </section>
      )}
    </>
  )
}
