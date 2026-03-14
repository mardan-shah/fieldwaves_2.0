"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import Container from "@/components/ui/Container"
import type { iProject } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { Loader2, Save } from "lucide-react"

interface EditProjectModalProps {
  project: iProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, formData: FormData) => Promise<void>
}

export default function EditProjectModal({ project, open, onOpenChange, onSave }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    url: "",
    githubUrl: "",
    description: "",
    techStack: "",
    order: "0",
  })
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [initialPreview, setInitialPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form when project or open state changes
  useEffect(() => {
    if (open && project) {
      setForm({
        title: project.title || "",
        url: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        description: project.description || "",
        techStack: project.techStack?.join(", ") || "",
        order: String(project.order || 0),
      })
      setScreenshotFile(null)
      setInitialPreview(project.screenshotUrl || null)
      setErrors({})
    }
  }, [open, project])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (form.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    try {
      new URL(form.url)
    } catch {
      newErrors.url = "Must be a valid URL"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !validate()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("url", form.url)
      formData.append("githubUrl", form.githubUrl)
      formData.append("description", form.description)
      formData.append("techStack", form.techStack)
      formData.append("order", form.order)
      if (screenshotFile) {
        formData.append("screenshot", screenshotFile)
      }
      await onSave(project._id, formData)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border rounded-none max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-primary tracking-wider uppercase">
            EDIT PROJECT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageCropUpload
            currentImage={initialPreview}
            onCropped={(file) => setScreenshotFile(file)}
            label="SCREENSHOT"
            aspect={16 / 9}
          />

          <FormInput
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            label="PROJECT_TITLE"
            required
            error={errors.title}
          />

          <FormInput
            type="url"
            value={form.url}
            onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
            label="LIVE_URL"
            placeholder="https://..."
            required
            error={errors.url}
          />
          <FormInput
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm(prev => ({ ...prev, githubUrl: e.target.value }))}
            label="GITHUB_URL"
            placeholder="https://..."
          />

          <MarkdownEditor
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            label="DESCRIPTION"
            placeholder="Brief project description (supports markdown)"
            rows={4}
          />

          <FormInput
            type="text"
            value={form.techStack}
            onChange={(e) => setForm(prev => ({ ...prev, techStack: e.target.value }))}
            label="TECH_STACK"
            placeholder="Next.js, React, Tailwind (comma separated)"
          />

          <FormInput
            type="number"
            value={form.order}
            onChange={(e) => setForm(prev => ({ ...prev, order: e.target.value }))}
            label="ORDER"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 bg-input border border-border text-secondary hover:text-white font-mono text-xs tracking-wider transition-colors"
            >
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="flex-1 group">
              <Container variant="primary" className="py-3 text-center flex items-center justify-center gap-2" hoverEffect>
                <div className="flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span className="font-bold tracking-widest text-xs">SAVE</span>
                </div>
              </Container>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
