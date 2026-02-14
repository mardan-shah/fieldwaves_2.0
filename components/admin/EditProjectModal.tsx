"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import SkewContainer from "@/components/ui/SkewContainer"
import type { Project } from "@/types"
import { Loader2, Save, Upload, RefreshCw, X } from "lucide-react"

interface EditProjectModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, formData: FormData) => Promise<void>
}

export default function EditProjectModal({ project, open, onOpenChange, onSave }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    techStack: "",
    order: "0",
  })
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && project) {
      setForm({
        title: project.title,
        url: project.liveUrl,
        description: project.description || "",
        techStack: project.techStack.join(", "),
        order: String(project.order || 0),
      })
      setScreenshotFile(null)
      setPreviewUrl(project.screenshotUrl || null)
      setPreviewError(false)
      setPreviewLoading(false)
      setErrors({})
    }
    onOpenChange(isOpen)
  }

  const fetchPreview = (url: string) => {
    try { new URL(url) } catch { return }
    setPreviewLoading(true)
    setPreviewError(false)
    setScreenshotFile(null)
    setPreviewUrl(`https://image.thum.io/get/wait/3000/width/600/crop/800/${url}`)
  }

  const handleUrlBlur = () => {
    // Only re-fetch if URL changed from the original
    if (form.url && form.url !== project?.liveUrl && !screenshotFile) {
      fetchPreview(form.url)
    }
  }

  const handleUseCustomScreenshot = (file: File) => {
    setScreenshotFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setPreviewError(false)
  }

  const handleClearCustomScreenshot = () => {
    setScreenshotFile(null)
    // Show current or re-fetch
    if (form.url === project?.liveUrl) {
      setPreviewUrl(project?.screenshotUrl || null)
    } else if (form.url) {
      fetchPreview(form.url)
    } else {
      setPreviewUrl(null)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (form.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    try { new URL(form.url) } catch { newErrors.url = "Must be a valid URL" }
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

  // Initialize form when dialog opens
  if (open && project && form.title === "" && form.url === "") {
    setForm({
      title: project.title,
      url: project.liveUrl,
      description: project.description || "",
      techStack: project.techStack.join(", "),
      order: String(project.order || 0),
    })
    setPreviewUrl(project.screenshotUrl || null)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#141414] border border-[#333] rounded-none max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-[#FF5F1F] tracking-wider uppercase">
            EDIT PROJECT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Screenshot Preview */}
          {previewUrl ? (
            <div className="space-y-2">
              <div className="relative h-36 w-full bg-black border border-[#333] overflow-hidden">
                {previewLoading && !previewError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                    <div className="flex items-center gap-2 text-[#B0B0B0] font-mono text-xs">
                      <RefreshCw size={14} className="animate-spin" />
                      FETCHING...
                    </div>
                  </div>
                )}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onLoad={() => setPreviewLoading(false)}
                  onError={() => { setPreviewLoading(false); setPreviewError(true) }}
                />
              </div>
              {previewError && (
                <p className="text-xs text-red-500 font-mono">PREVIEW_FAILED</p>
              )}
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-mono text-[#666] flex-1">
                  {screenshotFile ? `CUSTOM: ${screenshotFile.name}` : "CURRENT SCREENSHOT"}
                </p>
                {screenshotFile && (
                  <button type="button" onClick={handleClearCustomScreenshot} className="flex items-center gap-1 text-xs font-mono text-[#FF5F1F] hover:text-red-500 transition-colors">
                    <X size={12} /> REMOVE
                  </button>
                )}
                <label className="cursor-pointer flex items-center gap-1 text-xs font-mono text-[#B0B0B0] hover:text-[#FF5F1F] transition-colors">
                  <Upload size={12} /> {screenshotFile ? "REPLACE" : "UPLOAD_CUSTOM"}
                  <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUseCustomScreenshot(f) }} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          ) : null}

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
            onBlur={handleUrlBlur}
            label="LIVE_URL"
            placeholder="https://..."
            required
            error={errors.url}
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
              className="flex-1 py-3 bg-[#0a0a0a] border border-[#333] text-[#B0B0B0] hover:text-white font-mono text-xs tracking-wider transition-colors"
            >
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="flex-1 group">
              <SkewContainer variant="primary" className="py-3 text-center flex items-center justify-center gap-2 skew-x-0" hoverEffect>
                <div className="flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span className="font-bold tracking-widest text-xs">SAVE</span>
                </div>
              </SkewContainer>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
