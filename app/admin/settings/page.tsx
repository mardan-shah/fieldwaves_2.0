import { getAllTeamMembers, getAllCaseStudies, getAllBlogPosts } from "@/app/actions/admin"
import { getSettings, getProjects } from "@/app/actions/public"
import type { GlobalSettings, Project, TeamMember, CaseStudy, BlogPost } from "@/types"
import SettingsPanel from "../_components/SettingsPanel"

export default async function AdminSettingsPage() {
  const [settings, projects, team, caseStudies, blogPosts] = await Promise.all([
    getSettings(),
    getProjects(),
    getAllTeamMembers(),
    getAllCaseStudies(),
    getAllBlogPosts(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">SETTINGS</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">CONFIG // GLOBAL SETTINGS & CONTROLS</p>
      </div>
      <SettingsPanel
        initialSettings={settings as GlobalSettings}
        initialProjects={projects as Project[]}
        initialTeam={team as TeamMember[]}
        initialCaseStudies={caseStudies as CaseStudy[]}
        initialBlogPosts={blogPosts as BlogPost[]}
      />
    </div>
  )
}
