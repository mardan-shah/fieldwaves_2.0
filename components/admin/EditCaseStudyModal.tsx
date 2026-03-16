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
import type { iCaseStudy } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import GalleryUploader from "@/components/admin/GalleryUploader"
import { Loader2, Save, X, Plus, Trash2 } from "lucide-react"

interface EditCaseStudyModalProps {
  caseStudy: iCaseStudy | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, formData: FormData) => Promise<void>
}

type Tab = "DETAILS" | "METRICS" | "CONTENT" | "GALLERY"

export default function EditCaseStudyModal({ caseStudy, open, onOpenChange, onSave }: EditCaseStudyModalProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("DETAILS")
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    techStack: "",
    published: false,
    order: "0",
    overview: "",
    description: "",
  })
  const [metricCards, setMetricCards] = useState<{ label: string; value: string; unit: string }[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form when caseStudy or open state changes
  useEffect(() => {
    if (open && caseStudy) {
      setForm({
        title: caseStudy.title || "",
        subtitle: caseStudy.subtitle || "",
        techStack: caseStudy.techStack?.join(", ") || "",
        published: caseStudy.published || false,
        order: String(caseStudy.order || 0),
        overview: caseStudy.overview || "",
        description: caseStudy.description || "",
      })
      setMetricCards(caseStudy.metricCards?.length ? [...caseStudy.metricCards] : [])
      setCoverFile(null)
      setCoverPreview(caseStudy.coverImage || null)
      setErrors({})
      setActiveTab("DETAILS")
    }
  }, [open, caseStudy])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (form.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseStudy || !validate()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("subtitle", form.subtitle)
      formData.append("overview", form.overview)
      formData.append("description", form.description)
      formData.append("techStack", form.techStack)
      formData.append("metricCards", JSON.stringify(metricCards))
      formData.append("published", String(form.published))
      formData.append("order", form.order)
      if (coverFile) formData.append("coverImage", coverFile)
      await onSave(caseStudy._id, formData)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCoverUpload = (file: File) => {
    setCoverFile(file)
  }

  const addMetricCard = () => {
    setMetricCards([...metricCards, { label: "", value: "", unit: "" }])
  }

  const removeMetricCard = (index: number) => {
    setMetricCards(metricCards.filter((_, i) => i !== index))
  }

  const updateMetricCard = (index: number, field: string, value: string) => {
    const updated = [...metricCards]
    updated[index] = { ...updated[index], [field]: value }
    setMetricCards(updated)
  }

  const tabs: Tab[] = ["DETAILS", "METRICS", "CONTENT", "GALLERY"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border rounded-none max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-primary tracking-wider uppercase">
            EDIT CASE STUDY
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-mono text-xs tracking-wider transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DETAILS Tab */}
          {activeTab === "DETAILS" && (
            <div className="space-y-4">
              <FormInput
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                label="TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                label="SUBTITLE"
                placeholder="e.g. Client Name"
              />

              <ImageCropUpload
                currentImage={coverPreview}
                onCropped={handleCoverUpload}
                label="COVER_IMAGE"
                aspect={16 / 9}
              />

              <FormInput
                type="text"
                value={form.techStack}
                onChange={(e) => setForm(prev => ({ ...prev, techStack: e.target.value }))}
                label="TECH_STACK"
                placeholder="Next.js, React, MongoDB (comma separated)"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm(prev => ({ ...prev, order: e.target.value }))}
                  label="ORDER"
                />
                <div className="group">
                  <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">PUBLISHED</label>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                    className={`relative w-14 h-7 transition-colors duration-300 ${
                      form.published ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${
                      form.published ? "translate-x-7" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* METRICS Tab */}
          {activeTab === "METRICS" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-secondary tracking-widest">METRIC CARDS</p>
                <button
                  type="button"
                  onClick={addMetricCard}
                  className="flex items-center gap-1 text-xs font-mono text-primary hover:text-white transition-colors"
                >
                  <Plus size={14} /> ADD METRIC
                </button>
              </div>

              {metricCards.length === 0 && (
                <p className="text-xs font-mono text-muted text-center py-6">No metric cards. Click ADD METRIC to add one.</p>
              )}

              {metricCards.map((card, idx) => (
                <div key={idx} className="border border-border bg-input p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-mono text-[10px] text-muted">METRIC #{idx + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeMetricCard(idx)}
                      className="text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={card.label}
                      onChange={(e) => updateMetricCard(idx, "label", e.target.value)}
                      placeholder="Label"
                      className="bg-card border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                    />
                    <input
                      type="text"
                      value={card.value}
                      onChange={(e) => updateMetricCard(idx, "value", e.target.value)}
                      placeholder="Value"
                      className="bg-card border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                    />
                    <input
                      type="text"
                      value={card.unit}
                      onChange={(e) => updateMetricCard(idx, "unit", e.target.value)}
                      placeholder="Unit"
                      className="bg-card border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CONTENT Tab */}
          {activeTab === "CONTENT" && (
            <div className="space-y-4">
              <MarkdownEditor
                value={form.overview}
                onChange={(e) => setForm(prev => ({ ...prev, overview: e.target.value }))}
                label="OVERVIEW"
                placeholder="Short description shown on cards (plain text recommended)"
                rows={3}
              />
              <MarkdownEditor
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                label="FULL DESCRIPTION"
                placeholder="Full case study content (markdown supported)"
                rows={12}
              />
            </div>
          )}

          {/* GALLERY Tab */}
          {activeTab === "GALLERY" && (
            <div className="space-y-4 pt-2">
              <GalleryUploader type="cases" />
            </div>
          )}

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
