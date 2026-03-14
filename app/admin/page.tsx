import Link from "next/link"
import { getAllTeamMembers, getAllCaseStudies, getAllBlogPosts, getAnalytics } from "../actions/admin"
import { getSettings, getProjects } from "../actions/public"
import Container from "@/components/ui/Container"
import {
  FolderKanban,
  Users,
  BookOpen,
  FileText,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const [settings, projects, team, caseStudies, blogPosts, analytics] = await Promise.all([
    getSettings(),
    getProjects(),
    getAllTeamMembers(),
    getAllCaseStudies(),
    getAllBlogPosts(),
    getAnalytics(),
  ])

  const stats = [
    {
      label: "PROJECTS",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      sub: null,
    },
    {
      label: "TEAM",
      value: team.length,
      icon: Users,
      href: "/admin/team",
      sub: team.filter((m: any) => m.isOwner).length > 0 ? `${team.filter((m: any) => m.isOwner).length} owner(s)` : null,
    },
    {
      label: "CASE STUDIES",
      value: caseStudies.length,
      icon: BookOpen,
      href: "/admin/cases",
      sub: `${caseStudies.filter((c: any) => c.published).length} published`,
    },
    {
      label: "BLOG POSTS",
      value: blogPosts.length,
      icon: FileText,
      href: "/admin/blog",
      sub: `${blogPosts.filter((p: any) => p.published).length} published`,
    },
  ]

  const quickActions = [
    { label: "NEW PROJECT", href: "/admin/projects", icon: FolderKanban },
    { label: "NEW TEAM MEMBER", href: "/admin/team", icon: Users },
    { label: "NEW CASE STUDY", href: "/admin/cases", icon: BookOpen },
    { label: "NEW BLOG POST", href: "/admin/blog", icon: FileText },
  ]

  const totalViews = (analytics as any)?.totalViews ?? 0

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">DASHBOARD</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">SYSTEM_OVERVIEW // ALL SECTIONS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, sub }) => (
          <Link key={label} href={href}>
            <Container variant="glass" className="p-6 border-t-2 border-t-primary h-full" hoverEffect>
              <div className="flex items-start justify-between mb-3">
                <Icon size={18} className="text-primary" />
                <ArrowRight size={14} className="text-muted" />
              </div>
              <p className="font-display text-3xl font-bold">{value}</p>
              <p className="font-mono text-[10px] text-muted tracking-widest mt-1">{label}</p>
              {sub && <p className="font-mono text-[10px] text-secondary mt-1">{sub}</p>}
            </Container>
          </Link>
        ))}
      </div>

      {/* Views + Quick Actions Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Total Views */}
        <Container variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye size={16} className="text-primary" />
            <h2 className="font-mono font-bold text-sm tracking-wider">TOTAL_VIEWS</h2>
          </div>
          <p className="font-display text-5xl font-bold">{totalViews}</p>
          <p className="font-mono text-[10px] text-muted tracking-widest mt-2">LAST 30 DAYS</p>
          <Link href="/admin/analytics" className="inline-block mt-4">
            <Container variant="outline" className="px-4 py-2" hoverEffect>
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest">
                <TrendingUp size={12} />
                VIEW_ANALYTICS
              </span>
            </Container>
          </Link>
        </Container>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Plus size={16} className="text-primary" />
            <h2 className="font-mono font-bold text-sm tracking-wider">QUICK_ACTIONS</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}>
                <Container variant="ghost" className="p-4 h-full" hoverEffect>
                  <Icon size={18} className="text-primary mb-3" />
                  <p className="font-mono text-xs font-bold tracking-wider">{label}</p>
                </Container>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h2 className="font-mono font-bold text-sm tracking-wider mb-4">SYSTEM_STATUS</h2>
        <Container variant="glass" className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-mono text-[10px] text-muted tracking-widest mb-1">MODE</p>
              <p className="font-mono text-sm font-bold text-primary">
                {settings?.soloMode ? "SOLO" : "PUBLIC"}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted tracking-widest mb-1">CASES_DISPLAY</p>
              <p className="font-mono text-sm font-bold">{settings?.casesDisplayCount ?? 3}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted tracking-widest mb-1">DRAFTS</p>
              <p className="font-mono text-sm font-bold">
                {(caseStudies as any[]).filter(c => !c.published).length + (blogPosts as any[]).filter(p => !p.published).length}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted tracking-widest mb-1">TOTAL_CONTENT</p>
              <p className="font-mono text-sm font-bold">
                {projects.length + team.length + caseStudies.length + blogPosts.length}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
