"use client"

import { useState, useEffect, useMemo } from "react"

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  content: string
}

function parseHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = markdown.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length as 2 | 3
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      headings.push({ id, text, level })
    }
  }
  return headings
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const headings = useMemo(() => parseHeadings(content), [content])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24">
      <p className="font-mono text-xs text-primary tracking-widest uppercase mb-4">
        TABLE OF CONTENTS
      </p>
      <div className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(heading.id)
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" })
                setActiveId(heading.id)
              }
            }}
            className={`block py-1.5 font-mono text-xs transition-all border-l-2 ${
              heading.level === 3 ? "pl-6" : "pl-3"
            } ${
              activeId === heading.id
                ? "border-primary text-white"
                : "border-transparent text-muted hover:text-secondary hover:border-border"
            }`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  )
}
