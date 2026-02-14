"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import ProjectList from "@/components/ProjectList"
import EditProjectModal from "@/components/admin/EditProjectModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { Project } from "@/types"
import { Boxes, Eye, Save, Loader2, Search, Upload, RefreshCw, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { addProject, updateProject, deleteProject } from "@/app/actions/admin"
import { getProjects } from "@/app/actions/public"

interface ProjectsViewProps {
  projects: Project[]
  setProjects: (projects: Project[]) => void
}

export default function ProjectsView({ projects, setProjects }: ProjectsViewProps) {
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    url: "",
    description: "",
    techStack: "",
  })
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Edit modal state
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const fetchPreview = (url: string) => {
    try {
      new URL(url)
    } catch {
      return
    }
    setPreviewLoading(true)
    setPreviewError(false)
    setScreenshotPreview(`https://image.thum.io/get/wait/3000/width/600/crop/800/${url}`)
  }

  const handleUrlBlur = () => {
    if (newProject.url && !screenshotFile) {
      fetchPreview(newProject.url)
    }
  }

  const handleUseCustomScreenshot = (file: File) => {
    setScreenshotFile(file)
    // Show local file preview instead of thum.io
    const localUrl = URL.createObjectURL(file)
    setScreenshotPreview(localUrl)
    setPreviewError(false)
  }

  const handleClearCustomScreenshot = () => {
    setScreenshotFile(null)
    // Re-fetch auto preview if URL exists
    if (newProject.url) {
      fetchPreview(newProject.url)
    } else {
      setScreenshotPreview(null)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (newProject.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    try {
      new URL(newProject.url)
    } catch {
      newErrors.url = "Must be a valid URL"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const refreshProjects = async () => {
    const updated = await getProjects()
    setProjects(updated as Project[])
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newProject.title)
      formData.append("url", newProject.url)
      formData.append("description", newProject.description)
      formData.append("techStack", newProject.techStack)
      if (screenshotFile) {
        formData.append("screenshot", screenshotFile)
      }

      const result = await addProject(formData)
      if (result.error) throw new Error(result.error)

      await refreshProjects()
      toast.success(`PROJECT "${newProject.title}" DEPLOYED SUCCESSFULLY`)
      setNewProject({ title: "", url: "", description: "", techStack: "" })
      setScreenshotFile(null)
      setScreenshotPreview(null)
      setPreviewError(false)
      setErrors({})
    } catch (err: any) {
      toast.error(err.message || "Failed to add project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditProject(project)
    setEditModalOpen(true)
  }

  const handleSaveProject = async (id: string, formData: FormData) => {
    const result = await updateProject(id, formData)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshProjects()
    toast.success("PROJECT UPDATED")
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const oldProjects = projects
    setProjects(projects.filter(p => p._id !== deleteTarget))
    setConfirmOpen(false)

    try {
      await deleteProject(deleteTarget)
      await refreshProjects()
      toast.success("PROJECT_DELETED")
    } catch {
      setProjects(oldProjects)
      toast.error("Failed to delete project")
    }
    setDeleteTarget(null)
  }

  const filteredProjects = searchQuery
    ? projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects

  return (
    <>
      {/* Add Project Form */}
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
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                label="PROJECT_TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="url"
                value={newProject.url}
                onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                onBlur={handleUrlBlur}
                label="LIVE_URL"
                placeholder="https://..."
                required
                error={errors.url}
              />
            </div>

            <MarkdownEditor
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              label="DESCRIPTION"
              placeholder="Brief project description (supports markdown)"
              rows={3}
            />

            <FormInput
              type="text"
              value={newProject.techStack}
              onChange={(e) => setNewProject(prev => ({ ...prev, techStack: e.target.value }))}
              label="TECH_STACK"
              placeholder="Next.js, React, Tailwind (comma separated)"
            />

            {/* Screenshot Preview */}
            <div>
              <label className="block font-mono text-xs text-[#B0B0B0] mb-2 tracking-widest">SCREENSHOT_PREVIEW</label>

              {screenshotPreview ? (
                <div className="space-y-3">
                  <div className="relative border border-[#333] bg-black overflow-hidden" style={{ maxHeight: 200 }}>
                    {previewLoading && !previewError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                        <div className="flex items-center gap-2 text-[#B0B0B0] font-mono text-xs">
                          <RefreshCw size={14} className="animate-spin" />
                          FETCHING_PREVIEW...
                        </div>
                      </div>
                    )}
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full object-cover"
                      onLoad={() => setPreviewLoading(false)}
                      onError={() => { setPreviewLoading(false); setPreviewError(true) }}
                    />
                  </div>

                  {previewError && (
                    <p className="text-xs text-red-500 font-mono">PREVIEW_FAILED — upload a custom screenshot instead</p>
                  )}

                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-mono text-[#666] flex-1">
                      {screenshotFile ? `CUSTOM: ${screenshotFile.name}` : "AUTO-GENERATED via thum.io"}
                    </p>

                    {screenshotFile ? (
                      <button
                        type="button"
                        onClick={handleClearCustomScreenshot}
                        className="flex items-center gap-1 text-xs font-mono text-[#FF5F1F] hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                        REMOVE
                      </button>
                    ) : null}

                    <label className="cursor-pointer flex items-center gap-1 text-xs font-mono text-[#B0B0B0] hover:text-[#FF5F1F] transition-colors">
                      <Upload size={12} />
                      {screenshotFile ? "REPLACE" : "UPLOAD_CUSTOM"}
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUseCustomScreenshot(file)
                        }}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-[#333] bg-[#0a0a0a] p-6 flex flex-col items-center gap-3">
                  <ImageIcon size={24} className="text-[#666]" />
                  <p className="text-xs font-mono text-[#666] text-center">
                    Enter a URL above to auto-fetch a preview,<br />or upload a custom screenshot
                  </p>
                  <label className="cursor-pointer bg-[#333] hover:bg-[#FF5F1F] text-white px-4 py-2 text-xs font-bold font-mono transition-colors flex items-center gap-2">
                    <Upload size={14} />
                    UPLOAD
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUseCustomScreenshot(file)
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>

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

      {/* Project List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-[#FF5F1F]" />
            <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_DEPLOYMENTS</h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#FF5F1F] text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-[#666] transition-colors"
            />
          </div>
        </div>

        <ProjectList
          projects={filteredProjects}
          onDelete={handleDeleteClick}
          onEdit={handleEditProject}
        />
      </section>

      {/* Edit Modal */}
      <EditProjectModal
        project={editProject}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveProject}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="DELETE PROJECT?"
        description="This action cannot be undone. The project will be permanently removed."
        variant="danger"
      />
    </>
  )
}
