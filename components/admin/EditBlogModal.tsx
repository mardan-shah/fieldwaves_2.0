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
import type { BlogPost } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { Loader2, Save } from "lucide-react"

interface EditBlogModalProps {
  post: BlogPost | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, formData: FormData) => Promise<void>
}

type Tab = "DETAILS" | "CONTENT" | "SEO"

export default function EditBlogModal({ post, open, onOpenChange, onSave }: EditBlogModalProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("DETAILS")
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "",
    keywords: "",
    published: false,
    order: "0",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && post) {
      setForm({
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content || "",
        tags: post.tags.join(", "),
        author: post.author || "",
        keywords: post.keywords.join(", "),
        published: post.published,
        order: String(post.order || 0),
      })
      setCoverFile(null)
      setCoverPreview(post.coverImage || null)
      setErrors({})
      setActiveTab("DETAILS")
    }
    onOpenChange(isOpen)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (form.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !validate()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("excerpt", form.excerpt)
      formData.append("content", form.content)
      formData.append("tags", form.tags)
      formData.append("author", form.author)
      formData.append("keywords", form.keywords)
      formData.append("published", String(form.published))
      formData.append("order", form.order)
      if (coverFile) formData.append("coverImage", coverFile)
      await onSave(post._id, formData)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  // Initialize on open
  if (open && post && form.title === "" && form.content === "") {
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      tags: post.tags.join(", "),
      author: post.author || "",
      keywords: post.keywords.join(", "),
      published: post.published,
      order: String(post.order || 0),
    })
    setCoverPreview(post.coverImage || null)
  }

  const tabs: Tab[] = ["DETAILS", "CONTENT", "SEO"]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border border-border rounded-none max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-primary tracking-wider uppercase">
            EDIT BLOG POST
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
                value={form.author}
                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                label="AUTHOR"
                placeholder="Author name"
              />
              <FormInput
                type="text"
                value={form.tags}
                onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                label="TAGS"
                placeholder="engineering, react, tutorial (comma separated)"
              />

              <ImageCropUpload
                currentImage={coverPreview}
                onCropped={(file) => { setCoverFile(file) }}
                label="COVER_IMAGE"
                aspect={16 / 9}
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

          {activeTab === "CONTENT" && (
            <div className="space-y-4">
              <MarkdownEditor
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                label="EXCERPT"
                placeholder="Short summary shown in cards"
                rows={3}
              />
              <MarkdownEditor
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                label="FULL CONTENT"
                placeholder="Full blog post content (markdown supported)"
                rows={14}
              />
            </div>
          )}

          {activeTab === "SEO" && (
            <div className="space-y-4">
              <FormInput
                type="text"
                value={form.keywords}
                onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                label="SEO KEYWORDS"
                placeholder="nextjs, react, web development (comma separated)"
              />
              <div className="border border-border bg-input p-4">
                <p className="font-mono text-xs text-primary mb-2">SEO PREVIEW</p>
                <p className="text-sm text-white font-bold mb-1">{form.title || "Post Title"}</p>
                <p className="text-xs text-green-500 font-mono mb-1">fieldwaves.com/blog/{form.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'slug'}</p>
                <p className="text-xs text-secondary line-clamp-2">{form.excerpt || "Post excerpt will appear here..."}</p>
              </div>
              {form.keywords && (
                <div>
                  <p className="font-mono text-[10px] text-muted mb-2">PARSED KEYWORDS:</p>
                  <div className="flex flex-wrap gap-1">
                    {form.keywords.split(',').map(k => k.trim()).filter(Boolean).map(k => (
                      <span key={k} className="px-2 py-0.5 bg-input border border-border font-mono text-[10px] text-secondary">{k}</span>
                    ))}
                  </div>
                </div>
              )}
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
              <SkewContainer variant="primary" className="py-3 text-center flex items-center justify-center gap-2" hoverEffect>
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
