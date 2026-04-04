"use client"

import type React from "react"
import { useState } from "react"
import Container from "@/components/ui/Container"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import ProjectList from "@/components/ProjectList"
import EditProjectModal from "@/components/admin/EditProjectModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { iProject } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { Boxes, Eye, Save, Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"
import { addProject, updateProject, deleteProject, toggleProjectFeatured, reorderItem } from "@/app/actions/admin"
import { getProjects } from "@/app/actions/public"

interface ProjectsViewProps {
  initialProjects: iProject[]
}

export default function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [projects, setProjects] = useState<iProject[]>(initialProjects)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    url: "",
    description: "",
    techStack: "",
    githubUrl: "",
  })
  
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([])
  const [uploaderKey, setUploaderKey] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Edit modal state
  const [editProject, setEditProject] = useState<iProject | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    setProjects(updated as iProject[])
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
      formData.append("githubUrl", newProject.githubUrl)
      
      screenshotFiles.forEach(file => {
        formData.append("screenshots", file)
      })

      const result = await addProject(formData)
      if (result.error) throw new Error(result.error)

      await refreshProjects()
      toast.success(`PROJECT "${newProject.title}" DEPLOYED SUCCESSFULLY`)
      setNewProject({ title: "", url: "", description: "", techStack: "", githubUrl: "" })
      setScreenshotFiles([])
      setErrors({})
      setUploaderKey(prev => prev + 1)
    } catch (err: any) {
      toast.error(err.message || "Failed to add project")
    } finally {
      setSubmitting(false)
    }
  }

  const removeNewScreenshot = (index: number) => {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditProject = (project: iProject) => {
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

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderItem("project", id, direction)
    await refreshProjects()
  }

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleProjectFeatured(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshProjects()
    toast.success(result.featured ? "FEATURED" : "UNFEATURED")
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
          <Boxes className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">DEPLOY_PROJECT</h2>
        </div>

        <Container variant="outline" className="p-8 bg-card mx-6 md:mx-12 lg:mx-22">
          <form onSubmit={handleAddProject} className="space-y-6">
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
                label="LIVE_URL"
                placeholder="https://..."
                required
                error={errors.url}
              />
            </div>
              <FormInput
                type="url"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                label="GITHUB_URL"
                placeholder="https://..."
              />


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

            <div className="space-y-4">
              <label className="block font-mono text-xs text-secondary tracking-widest uppercase">Screenshots (Multi-upload)</label>
              
              {screenshotFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {screenshotFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-[21/9] border border-primary overflow-hidden group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-contain bg-black" />
                      <button 
                        type="button" 
                        onClick={() => removeNewScreenshot(idx)}
                        className="absolute top-1 right-1 bg-black/80 p-1 text-white hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <ImageCropUpload
                key={uploaderKey}
                onCropped={(file) => {
                  setScreenshotFiles(prev => [...prev, file])
                  setUploaderKey(prev => prev + 1)
                }}
                label="ADD_SCREENSHOT"
                aspect={21 / 9}
              />
            </div>

            <button type="submit" disabled={submitting} className="w-full group">
              <Container
                variant="primary"
                className="py-3 text-center flex items-center justify-center gap-2"
                hoverEffect
              >
                <div className="flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  <span className="font-bold tracking-widest">COMMIT_TO_DB</span>
                </div>
              </Container>
            </button>
          </form>
        </Container>
      </section>

      {/* Project List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_DEPLOYMENTS</h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-muted transition-colors"
            />
          </div>
        </div>

        <ProjectList
          projects={filteredProjects}
          onDelete={handleDeleteClick}
          onEdit={handleEditProject}
          onReorder={handleReorder}
          onToggleFeatured={handleToggleFeatured}
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
