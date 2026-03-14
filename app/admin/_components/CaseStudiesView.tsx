"use client"

import type React from "react"
import { useState } from "react"
import Container from "@/components/ui/Container"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import EditCaseStudyModal from "@/components/admin/EditCaseStudyModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { iCaseStudy } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { BookOpen, Eye, Save, Loader2, Search, Plus, Trash2, Pencil, Star, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { addCaseStudy, updateCaseStudy, deleteCaseStudy, getAllCaseStudies, toggleCaseStudyFeatured, reorderItem } from "@/app/actions/admin"

interface CaseStudiesViewProps {
  initialCaseStudies: iCaseStudy[]
}

export default function CaseStudiesView({ initialCaseStudies }: CaseStudiesViewProps) {
  const [caseStudies, setCaseStudies] = useState<iCaseStudy[]>(initialCaseStudies)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCase, setNewCase] = useState({
    title: "",
    subtitle: "",
    overview: "",
    description: "",
    techStack: "",
    published: false,
    order: "0",
  })
  const [metricCards, setMetricCards] = useState<{ label: string; value: string; unit: string }[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Edit modal state
  const [editCase, setEditCase] = useState<iCaseStudy | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (newCase.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const refreshCases = async () => {
    const updated = await getAllCaseStudies()
    setCaseStudies(updated as iCaseStudy[])
  }

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newCase.title)
      formData.append("subtitle", newCase.subtitle)
      formData.append("overview", newCase.overview)
      formData.append("description", newCase.description)
      formData.append("techStack", newCase.techStack)
      formData.append("metricCards", JSON.stringify(metricCards))
      formData.append("published", String(newCase.published))
      formData.append("order", newCase.order)
      if (coverFile) formData.append("coverImage", coverFile)

      const result = await addCaseStudy(formData)
      if (result.error) throw new Error(result.error)

      await refreshCases()
      toast.success(`CASE STUDY "${newCase.title}" CREATED`)
      setNewCase({ title: "", subtitle: "", overview: "", description: "", techStack: "", published: false, order: "0" })
      setMetricCards([])
      setCoverFile(null)
      setCoverPreview(null)
      setErrors({})
    } catch (err: any) {
      toast.error(err.message || "Failed to add case study")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCase = (cs: iCaseStudy) => {
    setEditCase(cs)
    setEditModalOpen(true)
  }

  const handleSaveCase = async (id: string, formData: FormData) => {
    const result = await updateCaseStudy(id, formData)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshCases()
    toast.success("CASE STUDY UPDATED")
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderItem("case_study", id, direction)
    await refreshCases()
  }

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleCaseStudyFeatured(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshCases()
    toast.success(result.featured ? "FEATURED" : "UNFEATURED")
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const old = caseStudies
    setCaseStudies(caseStudies.filter(c => c._id !== deleteTarget))
    setConfirmOpen(false)

    try {
      await deleteCaseStudy(deleteTarget)
      await refreshCases()
      toast.success("CASE_STUDY_DELETED")
    } catch {
      setCaseStudies(old)
      toast.error("Failed to delete case study")
    }
    setDeleteTarget(null)
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

  const filteredCases = searchQuery
    ? caseStudies.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : caseStudies

  return (
    <>
      {/* Add Case Study Form */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">CREATE_CASE_STUDY</h2>
        </div>

        <Container variant="outline" className="p-8 bg-card mx-6 md:mx-12 lg:mx-22">
          <form onSubmit={handleAddCase} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newCase.title}
                onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                label="TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="text"
                value={newCase.subtitle}
                onChange={(e) => setNewCase(prev => ({ ...prev, subtitle: e.target.value }))}
                label="SUBTITLE"
                placeholder="e.g. Client Name"
              />
            </div>

            <MarkdownEditor
              value={newCase.overview}
              onChange={(e) => setNewCase(prev => ({ ...prev, overview: e.target.value }))}
              label="OVERVIEW"
              placeholder="Short description for cards (max 500 chars)"
              rows={2}
            />

            <ImageCropUpload
              onCropped={handleCoverUpload}
              label="COVER_IMAGE"
              aspect={16 / 9}
            />

            <FormInput
              type="text"
              value={newCase.techStack}
              onChange={(e) => setNewCase(prev => ({ ...prev, techStack: e.target.value }))}
              label="TECH_STACK"
              placeholder="Next.js, React, MongoDB (comma separated)"
            />

            {/* Metric Cards Builder */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-mono text-xs text-secondary tracking-widest">METRIC_CARDS</label>
                <button
                  type="button"
                  onClick={addMetricCard}
                  className="flex items-center gap-1 text-xs font-mono text-primary hover:text-white transition-colors"
                >
                  <Plus size={14} /> ADD
                </button>
              </div>
              {metricCards.map((card, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={card.label}
                    onChange={(e) => updateMetricCard(idx, "label", e.target.value)}
                    placeholder="Label"
                    className="flex-1 bg-input border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={card.value}
                    onChange={(e) => updateMetricCard(idx, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 bg-input border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={card.unit}
                    onChange={(e) => updateMetricCard(idx, "unit", e.target.value)}
                    placeholder="Unit"
                    className="flex-1 bg-input border border-border focus:border-primary text-white p-2 text-xs font-mono outline-none"
                  />
                  <button type="button" onClick={() => removeMetricCard(idx)} className="text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <MarkdownEditor
              value={newCase.description}
              onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
              label="FULL DESCRIPTION"
              placeholder="Full case study content (markdown supported)"
              rows={8}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                type="number"
                value={newCase.order}
                onChange={(e) => setNewCase(prev => ({ ...prev, order: e.target.value }))}
                label="ORDER"
              />
              <div className="group">
                <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">PUBLISHED</label>
                <button
                  type="button"
                  onClick={() => setNewCase(prev => ({ ...prev, published: !prev.published }))}
                  className={`relative w-14 h-7 transition-colors duration-300 ${newCase.published ? "bg-primary" : "bg-border"
                    }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${newCase.published ? "translate-x-7" : "translate-x-0"
                    }`} />
                </button>
              </div>
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

      {/* Case Study List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_CASES</h2>
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
              placeholder="Search case studies..."
              className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-muted transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredCases.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-mono text-sm text-muted">
                {searchQuery ? "NO_MATCHES_FOUND" : "NO_CASE_STUDIES_YET"}
              </p>
            </div>
          ) : (
            filteredCases.map((cs, i) => (
              <div
                key={cs._id}
                className="border border-border bg-input p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => handleReorder(cs._id, "up")}
                    disabled={i === 0}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReorder(cs._id, "down")}
                    disabled={i === filteredCases.length - 1}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Thumbnail */}
                {cs.coverImage && (
                  <div className="w-16 h-16 shrink-0 overflow-hidden border border-border">
                    <img src={cs.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm truncate">{cs.title}</h3>
                    <span className={`px-2 py-0.5 font-mono text-[10px] ${cs.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                      {cs.published ? "LIVE" : "DRAFT"}
                    </span>
                    {cs.featured && (
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-primary/20 text-primary">
                        FEATURED
                      </span>
                    )}
                  </div>
                  {cs.subtitle && (
                    <p className="font-mono text-[10px] text-primary truncate">{cs.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted truncate">{cs.overview || "No overview"}</p>
                    <span className="font-mono text-[10px] text-muted shrink-0">{cs.views} views</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(cs._id)}
                    className={`p-2 transition-colors ${cs.featured ? "text-primary hover:text-white" : "text-muted hover:text-primary"
                      }`}
                    title={cs.featured ? "Remove featured" : "Mark featured"}
                  >
                    <Star size={14} fill={cs.featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleEditCase(cs)}
                    className="p-2 border border-border hover:border-primary text-secondary hover:text-primary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cs._id)}
                    className="p-2 border border-border hover:border-red-500 text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditCaseStudyModal
        caseStudy={editCase}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveCase}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="DELETE CASE STUDY?"
        description="This action cannot be undone. The case study will be permanently removed."
        variant="danger"
      />
    </>
  )
}
