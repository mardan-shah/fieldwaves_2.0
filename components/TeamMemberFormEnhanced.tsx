"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "./ui/SkewContainer"
import SocialIconPicker, { SOCIAL_PLATFORMS } from "./ui/SocialIconPicker"
import FormInput from "./ui/FormInput"
import FormTextarea from "./ui/FormTextarea"
import { Plus, Loader2, Check, X } from "lucide-react"

interface TeamMemberFormEnhancedProps {
  onSubmit?: (data: any) => Promise<void>
  loading?: boolean
}

interface SocialLink {
  platform: string
  url: string
}

interface Project {
  id: string
  title: string
  description: string
  url: string
}

export default function TeamMemberFormEnhanced({ onSubmit, loading }: TeamMemberFormEnhancedProps) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    avatarUrl: "",
  })

  const [socials, setSocials] = useState<SocialLink[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newSocial, setNewSocial] = useState({ platform: "github", url: "" })
  const [newProject, setNewProject] = useState({ title: "", description: "", url: "" })
  const [activeTab, setActiveTab] = useState<"basics" | "socials" | "projects">("basics")

  const handleAddSocial = () => {
    if (newSocial.url.trim()) {
      setSocials([...socials, { ...newSocial }])
      setNewSocial({ platform: "github", url: "" })
    }
  }

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index))
  }

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setProjects([...projects, { id: Date.now().toString(), ...newProject }])
      setNewProject({ title: "", description: "", url: "" })
    }
  }

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      const payload = {
        ...formData,
        socialLinks: socials,
        projects,
      }
      await onSubmit(payload)
      setSubmitted(true)
      // Reset form
      setFormData({ name: "", role: "", bio: "", avatarUrl: "" })
      setSocials([])
      setProjects([])
      setActiveTab("basics")
      setTimeout(() => setSubmitted(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#333]">
        <button
          type="button"
          onClick={() => setActiveTab("basics")}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === "basics" ? "border-b-2 border-[#FF5F1F] text-[#FF5F1F]" : "text-[#B0B0B0] hover:text-white"
          }`}
        >
          BASICS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("socials")}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === "socials" ? "border-b-2 border-[#FF5F1F] text-[#FF5F1F]" : "text-[#B0B0B0] hover:text-white"
          }`}
        >
          SOCIALS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === "projects" ? "border-b-2 border-[#FF5F1F] text-[#FF5F1F]" : "text-[#B0B0B0] hover:text-white"
          }`}
        >
          PROJECTS
        </button>
      </div>

      {/* Basics Tab */}
      {activeTab === "basics" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              label="NAME"
              placeholder="Full name"
              required
            />
            <FormInput
              type="text"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              label="ROLE"
              placeholder="Job title"
              required
            />
          </div>

          <FormTextarea
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            label="BIO"
            placeholder="Brief bio or description"
            rows={3}
          />

          <FormInput
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))}
            label="AVATAR_URL"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Socials Tab */}
      {activeTab === "socials" && (
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-[#B0B0B0] mb-4 tracking-widest">SELECT PLATFORM</label>
            <SocialIconPicker
              selected={newSocial.platform}
              onChange={(p) => setNewSocial({ ...newSocial, platform: p })}
            />
          </div>

          <FormInput
            type="url"
            value={newSocial.url}
            onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
            label="URL"
            placeholder={SOCIAL_PLATFORMS.find((s) => s.name === newSocial.platform)?.placeholder}
          />

          <button type="button" onClick={handleAddSocial} className="w-full group">
            <SkewContainer
              variant="secondary"
              className="py-2 text-center flex items-center justify-center gap-2"
              hoverEffect
            >
              <Plus size={16} />
              <span className="font-bold text-sm">ADD SOCIAL</span>
            </SkewContainer>
          </button>

          {/* Social Links List */}
          <div className="space-y-2 mt-6">
            <p className="font-mono text-xs text-[#B0B0B0] tracking-widest">ADDED ({socials.length})</p>
            {socials.map((social, i) => {
              const platform = SOCIAL_PLATFORMS.find((s) => s.name === social.platform)
              const Icon = platform?.icon
              return (
                <div key={i} className="flex items-center justify-between bg-[#0a0a0a] border border-[#333] p-3">
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={16} className="text-[#FF5F1F]" />}
                    <span className="text-sm text-[#B0B0B0] truncate">{social.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(i)}
                    className="text-[#FF5F1F] hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <FormInput
            type="text"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            label="PROJECT_TITLE"
            placeholder="Project name"
          />

          <FormTextarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            label="DESCRIPTION"
            placeholder="What did you build?"
            rows={3}
          />

          <FormInput
            type="url"
            value={newProject.url}
            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
            label="PROJECT_URL"
            placeholder="https://..."
          />

          <button type="button" onClick={handleAddProject} className="w-full group">
            <SkewContainer
              variant="secondary"
              className="py-2 text-center flex items-center justify-center gap-2"
              hoverEffect
            >
              <Plus size={16} />
              <span className="font-bold text-sm">ADD PROJECT</span>
            </SkewContainer>
          </button>

          {/* Projects List */}
          <div className="space-y-2 mt-6">
            <p className="font-mono text-xs text-[#B0B0B0] tracking-widest">PROJECTS ({projects.length})</p>
            {projects.map((project) => (
              <div key={project.id} className="bg-[#0a0a0a] border border-[#333] p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-sm">{project.title}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(project.id)}
                    className="text-[#FF5F1F] hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-[#B0B0B0]">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={loading || submitted} className="w-full group">
        <SkewContainer
          variant="primary"
          className="py-3 text-center flex items-center justify-center gap-2"
          hoverEffect
        >
          {submitted ? (
            <>
              <Check size={18} />
              <span className="font-bold tracking-widest">MEMBER_ADDED</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span className="font-bold tracking-widest">ADDING...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span className="font-bold tracking-widest">ADD_MEMBER</span>
            </>
          )}
        </SkewContainer>
      </button>
    </form>
  )
}
