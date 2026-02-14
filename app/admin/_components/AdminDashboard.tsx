"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import SettingsPanel from "./SettingsPanel"
import ProjectsView from "./ProjectsView"
import TeamView from "./TeamView"
import type { GlobalSettings, Project, TeamMember } from "@/types"
import { ArrowLeft } from "lucide-react"
import { toggleSoloMode, logoutAdmin } from "@/app/actions/admin"
import { getSettings } from "@/app/actions/public"
import { toast } from "sonner"

interface AdminDashboardProps {
  initialSettings: GlobalSettings
  initialProjects: Project[]
  initialTeam: TeamMember[]
}

export default function AdminDashboard({
  initialSettings,
  initialProjects,
  initialTeam,
}: AdminDashboardProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [activeView, setActiveView] = useState<"PROJECTS" | "TEAM">("PROJECTS")

  const handleToggleSoloMode = async () => {
    const newState = !settings.soloMode
    setSettings({ ...settings, soloMode: newState })

    await toggleSoloMode()
    toast.success(`SOLO_MODE: ${newState ? "ENABLED" : "DISABLED"}`)

    const s = await getSettings()
    if (s) setSettings(s)
  }

  const handleLogout = async () => {
    await logoutAdmin()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft />
          </Link>
        </div>

        <AdminHeader onLogout={handleLogout} />

        {/* View Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#333]">
          <button
            onClick={() => setActiveView("PROJECTS")}
            className={`px-6 py-3 font-mono font-bold tracking-wider transition-all border-b-2 ${
              activeView === "PROJECTS"
                ? "border-[#FF5F1F] text-[#FF5F1F]"
                : "border-transparent text-[#666] hover:text-white"
            }`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => setActiveView("TEAM")}
            className={`px-6 py-3 font-mono font-bold tracking-wider transition-all border-b-2 ${
              activeView === "TEAM"
                ? "border-[#FF5F1F] text-[#FF5F1F]"
                : "border-transparent text-[#666] hover:text-white"
            }`}
          >
            TEAM
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SettingsPanel
              settings={settings}
              projects={projects}
              team={team}
              onToggleSoloMode={handleToggleSoloMode}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {activeView === "PROJECTS" && (
              <ProjectsView projects={projects} setProjects={setProjects} />
            )}

            {activeView === "TEAM" && (
              <TeamView team={team} setTeam={setTeam} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
