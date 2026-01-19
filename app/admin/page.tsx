"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import SkewContainer from "../../components/ui/SkewContainer"
import AdminHeader from "../../components/AdminHeader"
import ProjectList from "../../components/ProjectList"
import TeamMemberFormEnhanced from "../../components/TeamMemberFormEnhanced"
import TeamList from "../../components/TeamList"
import FormInput from "../../components/ui/FormInput"
import { toggleSoloMode, addProject, deleteProject, addTeamMember, getAllTeamMembers, deleteTeamMember, checkAdminExists, createAdmin, verifyAdmin } from "../actions/admin"
import { getSettings, getProjects } from "../actions/public"
import type { GlobalSettings, Project } from "../../../types"
import { Terminal, Save, Power, Eye, Loader2, ArrowLeft, Users, Boxes, Lock } from "lucide-react"

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [needsSetup, setNeedsSetup] = useState(false)
  
  // Auth State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)

  // Dashboard State
  const [settings, setSettings] = useState<GlobalSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [newProjectTechStack, setNewProjectTechStack] = useState("")
  
  const [activeView, setActiveView] = useState<"PROJECTS" | "TEAM">("PROJECTS")
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Initial Load
  useEffect(() => {
    const init = async () => {
      // Check session
      if (sessionStorage.getItem("fw_admin_auth") === "true") {
        setAuthorized(true)
        loadData()
      } else {
        // Check if setup is needed
        const status = await checkAdminExists()
        setNeedsSetup(!status.exists)
      }
      setLoading(false)
    }
    init()
  }, [])

  const loadData = async () => {
    const [s, p, t] = await Promise.all([
      getSettings(), 
      getProjects(),
      getAllTeamMembers()
    ])
    // @ts-ignore
    setSettings(s)
    // @ts-ignore
    setProjects(p)
    setTeam(t)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsAuthSubmitting(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      if (needsSetup) {
        // Create Admin
        const result = await createAdmin(formData)
        if (result.error) throw new Error(result.error)
        
        // Auto login
        setAuthorized(true)
        sessionStorage.setItem("fw_admin_auth", "true")
        loadData()
      } else {
        // Login
        const result = await verifyAdmin(formData)
        if (result.error) throw new Error(result.error)

        setAuthorized(true)
        sessionStorage.setItem("fw_admin_auth", "true")
        loadData()
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed")
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleLogout = () => {
    setAuthorized(false)
    sessionStorage.removeItem("fw_admin_auth")
    setEmail("")
    setPassword("")
  }

  const handleToggleSoloMode = async () => {
    if (!settings) return
    const newState = !settings.soloMode
    // Optimistic update
    setSettings({ ...settings, soloMode: newState })

    await toggleSoloMode()
    setSuccessMsg(`SOLO_MODE: ${newState ? "ENABLED" : "DISABLED"}`)
    setTimeout(() => setSuccessMsg(""), 2000)
    // Refresh to ensure sync
    const s = await getSettings()
    // @ts-ignore
    setSettings(s)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newProjectTitle)
      formData.append("url", newProjectUrl)
      formData.append("techStack", newProjectTechStack)

      const result = await addProject(formData)
      if (result.error) {
        throw new Error(result.error)
      }

      const updated = await getProjects()
      // @ts-ignore
      setProjects(updated)
      setSuccessMsg(`PROJECT "${newProjectTitle}" DEPLOYED SUCCESSFULLY`)
      setNewProjectTitle("")
      setNewProjectUrl("")
      setNewProjectTechStack("")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to add project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("DELETE_PROJECT?")) {
      // Optimistic update
      const oldProjects = projects
      setProjects(projects.filter((p) => p._id !== id))

      try {
        await deleteProject(id)
        setSuccessMsg("PROJECT_DELETED")
        const updated = await getProjects()
        // @ts-ignore
        setProjects(updated)
        setTimeout(() => setSuccessMsg(""), 2000)
      } catch (err) {
        console.error(err)
        setProjects(oldProjects) // Revert
        alert("Failed to delete project")
      }
    }
  }

  const handleAddTeamMember = async (formData: FormData) => {
    setSubmitting(true)
    try {
      const result = await addTeamMember(formData)
      if (result.error) throw new Error(result.error)
      
      const updated = await getAllTeamMembers()
      setTeam(updated)
      setSuccessMsg("TEAM_MEMBER_ADDED")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to add team member")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTeamMember = async (id: string) => {
    if (confirm("DELETE_MEMBER?")) {
      const oldTeam = team
      setTeam(team.filter(m => m._id !== id))

      try {
        await deleteTeamMember(id)
        setSuccessMsg("MEMBER_DELETED")
        const updated = await getAllTeamMembers()
        setTeam(updated)
        setTimeout(() => setSuccessMsg(""), 2000)
      } catch (err) {
        console.error(err)
        setTeam(oldTeam)
        alert("Failed to delete member")
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 text-[#B0B0B0] font-mono">INITIALIZING...</div>
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <SkewContainer variant="outline" className="w-full max-w-md p-10 bg-[#141414]">
          <div className="mb-8 text-center ">
            <Terminal size={48} className="mx-auto text-[#FF5F1F] mb-4" />
            <h1 className="font-display text-3xl font-bold">
              {needsSetup ? "SYSTEM_INIT" : "SECURE_GATE"}
            </h1>
            <p className="font-mono text-xs text-[#B0B0B0]">
              {needsSetup ? "CREATE ROOT CREDENTIALS" : "RESTRICTED ACCESS ONLY"}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6 -skew-x-12">
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="ADMIN_EMAIL"
              placeholder="admin@fieldwaves.io"
              required
            />
            
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label={needsSetup ? "SET_PASSWORD" : "PASSWORD"}
              placeholder="••••••••"
              required
            />

            {authError && (
              <div className="p-3 bg-red-900/20 border border-red-500 text-red-500 text-xs font-mono">
                ERROR: {authError}
              </div>
            )}

            <button type="submit" disabled={isAuthSubmitting} className="w-full group">
              <SkewContainer variant="primary" className="py-3 text-center flex items-center justify-center gap-2 skew-x-0" hoverEffect>
                <div className="flex items-center justify-center gap-2">
                  {isAuthSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                  <span className="font-bold tracking-widest">
                    {needsSetup ? "INITIALIZE_SYSTEM" : "AUTHENTICATE"}
                  </span>
                </div>
              </SkewContainer>
            </button>
          </form>
        </SkewContainer>
      </div>
    )
  }

  if (!settings) return <div className="p-10 text-white font-mono">LOADING_SYS...</div>

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft />
          </Link>
        </div>

        <AdminHeader onLogout={handleLogout} />

        {/* Status Message */}
        {successMsg && (
          <div className="mb-8 bg-green-900/20 border border-green-500 text-green-500 p-4 text-center font-mono text-sm">
            {successMsg}
          </div>
        )}

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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Settings & Config */}
          <div className="lg:col-span-1 space-y-8">
            {/* Global Config */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Power className="text-[#FF5F1F]" />
                <h2 className="font-mono font-bold text-lg tracking-wider">GLOBAL_CONFIG</h2>
              </div>

              <SkewContainer variant="glass" className="p-6 border-t-4 border-t-[#FF5F1F]">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm">SOLO MODE</h3>
                        <p className="text-xs text-[#B0B0B0] max-w-xs">Filter team to owner only.</p>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={handleToggleSoloMode}
                        className={`relative w-14 h-7 transition-colors duration-300 shrink-0 ${
                          settings.soloMode ? "bg-[#FF5F1F]" : "bg-[#333]"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${
                            settings.soloMode ? "translate-x-7" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-[#666]">Status: {settings.soloMode ? "ACTIVE" : "INACTIVE"}</p>
                  </div>
                </div>
              </SkewContainer>
            </section>

            {/* Quick Stats */}
            <section>
              <h2 className="font-mono font-bold text-lg tracking-wider mb-6">SYSTEM_STATS</h2>
              <div className="space-y-3">
                <SkewContainer variant="glass" className="p-4 text-center">
                  <p className="font-mono text-xs text-[#B0B0B0] mb-1">PROJECTS</p>
                  <p className="font-display text-2xl font-bold">{projects.length}</p>
                </SkewContainer>
                <SkewContainer variant="glass" className="p-4 text-center">
                  <p className="font-mono text-xs text-[#B0B0B0] mb-1">MODE</p>
                  <p className="font-mono text-sm text-[#FF5F1F]">{settings.soloMode ? "SOLO" : "PUBLIC"}</p>
                </SkewContainer>
              </div>
            </section>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROJECTS VIEW */}
            {activeView === "PROJECTS" && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Boxes className="text-[#FF5F1F]" />
                    <h2 className="font-mono font-bold text-lg tracking-wider">DEPLOY_PROJECT</h2>
                  </div>

                  <SkewContainer variant="outline" className="p-8 bg-[#141414]">
                    <form onSubmit={handleAddProject} className="space-y-6 -skew-x-12">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormInput
                          type="text"
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          label="PROJECT_TITLE"
                          required
                        />
                        <FormInput
                          type="url"
                          value={newProjectUrl}
                          onChange={(e) => setNewProjectUrl(e.target.value)}
                          label="LIVE_URL"
                          placeholder="https://..."
                          required
                        />
                      </div>
                      
                      <FormInput
                        type="text"
                        value={newProjectTechStack}
                        onChange={(e) => setNewProjectTechStack(e.target.value)}
                        label="TECH_STACK"
                        placeholder="Next.js, React, Tailwind (comma separated)"
                      />

                      <button type="submit" disabled={submitting} className="w-full group">
                        <SkewContainer
                          variant="primary"
                          className="py-3 text-center flex items-center skew-x-0 justify-center gap-2"
                          hoverEffect
                        >
                          <div className="flex items-center justify-center gap-2">
                            {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            <span className="font-bold tracking-widest">COMMIT_TO_DB</span>
                          </div>
                        </SkewContainer>
                      </button>
                    </form>
                  </SkewContainer>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="text-[#FF5F1F]" />
                    <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_DEPLOYMENTS</h2>
                  </div>

                  <ProjectList projects={projects} onDelete={handleDeleteProject} />
                </section>
              </>
            )}

            {/* TEAM VIEW */}
            {activeView === "TEAM" && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="text-[#FF5F1F]" />
                    <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_PERSONNEL</h2>
                  </div>

                  <TeamList team={team} onDelete={handleDeleteTeamMember} />
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="text-[#FF5F1F]" />
                    <h2 className="font-mono font-bold text-lg tracking-wider">ADD_TEAM_MEMBER</h2>
                  </div>

                  <SkewContainer variant="outline" className="p-8 bg-[#141414]">
                    <TeamMemberFormEnhanced onSubmit={handleAddTeamMember} loading={submitting} />
                  </SkewContainer>
                </section>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}