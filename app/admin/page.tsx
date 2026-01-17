"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import SkewContainer from "../../components/ui/SkewContainer"
import AdminHeader from "../../components/AdminHeader"
import ProjectList from "../../components/ProjectList"
import TeamMemberFormEnhanced from "../../components/TeamMemberFormEnhanced"
import { toggleSoloMode, addProject, deleteProject } from "../actions/admin"
import { getSettings, getProjects } from "../actions/public"
import type { GlobalSettings, Project } from "../../../types"
import { Terminal, Save, Power, Eye, Loader2, ArrowLeft, Users, Boxes } from "lucide-react"

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState("")

  const [settings, setSettings] = useState<GlobalSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Initial Load
  useEffect(() => {
    if (sessionStorage.getItem("fw_admin_auth") === "true") {
      setAuthorized(true)
      loadData()
    }
  }, [])

  const loadData = async () => {
    const [s, p] = await Promise.all([getSettings(), getProjects()])
    // @ts-ignore
    setSettings(s)
    // @ts-ignore
    setProjects(p)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "admin") {
      setAuthorized(true)
      sessionStorage.setItem("fw_admin_auth", "true")
      loadData()
    } else {
      alert("ACCESS_DENIED")
    }
  }

  const handleLogout = () => {
    setAuthorized(false)
    sessionStorage.removeItem("fw_admin_auth")
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

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <SkewContainer variant="outline" className="w-full max-w-md p-10 bg-[#141414]">
          <div className="mb-8 text-center">
            <Terminal size={48} className="mx-auto text-[#FF5F1F] mb-4" />
            <h1 className="font-display text-3xl font-bold">SECURE_GATE</h1>
            <p className="font-mono text-xs text-[#B0B0B0]">RESTRICTED ACCESS ONLY</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-mono text-xs text-[#FF5F1F] mb-2">ACCESS_KEY</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border-2 border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none font-mono"
                placeholder="Hint: admin"
              />
            </div>
            <button type="submit" className="w-full group">
              <SkewContainer variant="primary" className="py-3 text-center" hoverEffect>
                <span className="font-bold tracking-widest">AUTHENTICATE</span>
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

          {/* Main Content - Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deploy Project Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Boxes className="text-[#FF5F1F]" />
                <h2 className="font-mono font-bold text-lg tracking-wider">DEPLOY_PROJECT</h2>
              </div>

              <SkewContainer variant="outline" className="p-8 bg-[#141414]">
                <form onSubmit={handleAddProject} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#B0B0B0] mb-2">PROJECT_TITLE</label>
                      <input
                        type="text"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-[#B0B0B0] mb-2">LIVE_URL</label>
                      <input
                        type="url"
                        value={newProjectUrl}
                        onChange={(e) => setNewProjectUrl(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full group">
                    <SkewContainer
                      variant="primary"
                      className="py-3 text-center flex items-center justify-center gap-2"
                      hoverEffect
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                      <span className="font-bold tracking-widest">COMMIT_TO_DB</span>
                    </SkewContainer>
                  </button>
                </form>
              </SkewContainer>
            </section>

            {/* Projects List */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="text-[#FF5F1F]" />
                <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_DEPLOYMENTS</h2>
              </div>

              <ProjectList projects={projects} onDelete={handleDeleteProject} />
            </section>

            {/* Team Management */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-[#FF5F1F]" />
                <h2 className="font-mono font-bold text-lg tracking-wider">ADD_TEAM_MEMBER</h2>
              </div>

              <SkewContainer variant="outline" className="p-8 bg-[#141414]">
                <TeamMemberFormEnhanced loading={submitting} />
              </SkewContainer>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
