"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Container from "@/components/ui/Container"
import SearchFilterBar from "@/components/SearchFilterBar"
import type { iBlogPost } from "@/types"
import { Calendar, Eye } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface BlogGridProps {
  posts: iBlogPost[]
  showSearch?: boolean
}

export default function BlogGrid({ posts, showSearch = true }: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { ref: gridRef, isInView } = useInView()

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTag = !activeTag || p.tags.includes(activeTag)

      return matchesSearch && matchesTag
    })
  }, [posts, searchQuery, activeTag])

  return (
    <div>
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="SEARCH_POSTS // title, keywords, tags..."
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        resultCount={filtered.length}
        totalCount={posts.length}
      />

      <div className="max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-muted text-sm">NO_POSTS_FOUND</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => {
              const formattedDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : ''

              return (
                <Link key={post._id} href={`/blog/${post.slug}`} className={`group ${isInView ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <Container variant="ghost" hoverEffect noSkewMobile className="overflow-hidden h-full">
                    <div className="flex flex-col h-full">
                      {post.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200 scale-110 group-hover:scale-100"
                          />
                        </div>
                      )}

                      <div className="p-5 flex-1 flex flex-col">
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 font-mono text-[9px] text-primary border border-primary/30 uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-secondary mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-muted">
                          {formattedDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={11} />
                              <span className="font-mono text-[10px]">{formattedDate}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye size={11} />
                            <span className="font-mono text-[10px]">{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Container>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
