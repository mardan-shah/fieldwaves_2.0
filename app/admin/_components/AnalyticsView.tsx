"use client"

import { useState, useEffect } from "react"
import Container from "@/components/ui/Container"
import { BarChart3, TrendingUp, Eye, FileText, BookOpen, ExternalLink, Loader2 } from "lucide-react"
import { getAnalytics } from "@/app/actions/admin"

interface AnalyticsData {
  totalViews: number
  viewsByDay: Record<string, number>
  topPages: { path: string; views: number }[]
  topCases: { title: string; slug: string; views: number }[]
  topPosts: { title: string; slug: string; views: number }[]
}

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(result => {
      setData(result as AnalyticsData | null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
        <span className="ml-3 font-mono text-sm text-muted">LOADING_ANALYTICS...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="font-mono text-sm text-muted">NO_ANALYTICS_DATA</p>
        <p className="text-xs text-secondary mt-2">Analytics will appear once visitors start browsing your site.</p>
      </div>
    )
  }

  // Build chart bars from last 14 days
  const last14Days: { date: string; count: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    last14Days.push({ date: dateStr, count: data.viewsByDay[dateStr] || 0 })
  }
  const maxViews = Math.max(...last14Days.map(d => d.count), 1)

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">SITE_ANALYTICS</h2>
          <span className="font-mono text-[10px] text-muted">LAST 30 DAYS</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Container variant="glass" className="p-5 text-center border-t-2 border-t-primary">
            <Eye size={18} className="mx-auto text-primary mb-2" />
            <p className="font-display text-3xl font-bold">{data.totalViews}</p>
            <p className="font-mono text-[10px] text-muted mt-1">TOTAL VIEWS</p>
          </Container>
          <Container variant="glass" className="p-5 text-center border-t-2 border-t-primary">
            <BookOpen size={18} className="mx-auto text-primary mb-2" />
            <p className="font-display text-3xl font-bold">
              {data.topCases.reduce((sum, c) => sum + c.views, 0)}
            </p>
            <p className="font-mono text-[10px] text-muted mt-1">CASE STUDY VIEWS</p>
          </Container>
          <Container variant="glass" className="p-5 text-center border-t-2 border-t-primary">
            <FileText size={18} className="mx-auto text-primary mb-2" />
            <p className="font-display text-3xl font-bold">
              {data.topPosts.reduce((sum, p) => sum + p.views, 0)}
            </p>
            <p className="font-mono text-[10px] text-muted mt-1">BLOG VIEWS</p>
          </Container>
        </div>
      </section>

      {/* Views Chart (last 14 days) */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={16} className="text-primary" />
          <h3 className="font-mono font-bold text-sm tracking-wider">DAILY_VIEWS</h3>
        </div>

        <Container variant="glass" className="p-6">
          <div className="flex items-end gap-1 h-32">
            {last14Days.map((day) => {
              const height = maxViews > 0 ? (day.count / maxViews) * 100 : 0
              const dateLabel = day.date.slice(5) // MM-DD
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="font-mono text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  <div
                    className="w-full bg-primary/30 hover:bg-primary transition-colors min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="font-mono text-[8px] text-muted -rotate-45 origin-top-left mt-1 whitespace-nowrap">
                    {dateLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Top Pages */}
      {data.topPages.length > 0 && (
        <section>
          <h3 className="font-mono font-bold text-sm tracking-wider mb-4">TOP_PAGES</h3>
          <div className="space-y-2">
            {data.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center gap-3 border border-border bg-input p-3">
                <span className="font-mono text-xs text-primary w-6">{i + 1}.</span>
                <span className="font-mono text-xs text-secondary flex-1 truncate">{page.path}</span>
                <span className="font-mono text-xs text-white font-bold">{page.views}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Case Studies */}
      {data.topCases.length > 0 && (
        <section>
          <h3 className="font-mono font-bold text-sm tracking-wider mb-4">TOP_CASE_STUDIES</h3>
          <div className="space-y-2">
            {data.topCases.map((cs) => (
              <div key={cs.slug} className="flex items-center gap-3 border border-border bg-input p-3">
                <BookOpen size={14} className="text-primary shrink-0" />
                <span className="text-sm text-secondary flex-1 truncate">{cs.title}</span>
                <span className="font-mono text-xs text-white font-bold">{cs.views} views</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Blog Posts */}
      {data.topPosts.length > 0 && (
        <section>
          <h3 className="font-mono font-bold text-sm tracking-wider mb-4">TOP_BLOG_POSTS</h3>
          <div className="space-y-2">
            {data.topPosts.map((post) => (
              <div key={post.slug} className="flex items-center gap-3 border border-border bg-input p-3">
                <FileText size={14} className="text-primary shrink-0" />
                <span className="text-sm text-secondary flex-1 truncate">{post.title}</span>
                <span className="font-mono text-xs text-white font-bold">{post.views} views</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* External Analytics Link */}
      <section>
        <a
          href="https://vercel.com/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Container variant="ghost" hoverEffect className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-primary mb-1">VERCEL ANALYTICS</p>
                <p className="text-xs text-secondary">View detailed external analytics</p>
              </div>
              <ExternalLink size={16} className="text-muted" />
            </div>
          </Container>
        </a>
      </section>
    </div>
  )
}
