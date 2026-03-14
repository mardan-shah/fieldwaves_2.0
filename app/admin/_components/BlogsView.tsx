"use client"

import type React from "react"
import { useState } from "react"
import Container from "@/components/ui/Container"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import EditBlogModal from "@/components/admin/EditBlogModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { iBlogPost } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { FileText, Eye, Save, Loader2, Search, Trash2, Pencil, Plus, Star, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { addBlogPost, updateBlogPost, deleteBlogPost, getAllBlogPosts, toggleBlogPostFeatured, reorderItem } from "@/app/actions/admin"

interface BlogsViewProps {
  initialBlogPosts: iBlogPost[]
}

export default function BlogsView({ initialBlogPosts }: BlogsViewProps) {
  const [blogPosts, setBlogPosts] = useState<iBlogPost[]>(initialBlogPosts)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "",
    keywords: "",
    published: false,
    order: "0"
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Edit modal state
  const [editPost, setEditPost] = useState<iBlogPost | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (newPost.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const refreshPosts = async () => {
    const updated = await getAllBlogPosts()
    setBlogPosts(updated as iBlogPost[])
  }

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newPost.title)
      formData.append("excerpt", newPost.excerpt)
      formData.append("content", newPost.content)
      formData.append("tags", newPost.tags)
      formData.append("author", newPost.author)
      formData.append("keywords", newPost.keywords)
      formData.append("published", String(newPost.published))
      formData.append("order", newPost.order)
      if (coverFile) formData.append("coverImage", coverFile)

      const result = await addBlogPost(formData)
      if (result.error) throw new Error(result.error)

      await refreshPosts()
      toast.success(`BLOG POST "${newPost.title}" CREATED`)
      setNewPost({ title: "", excerpt: "", content: "", tags: "", author: "", keywords: "", published: false, order: "0" })
      setCoverFile(null)
      setErrors({})
    } catch (err: any) {
      toast.error(err.message || "Failed to add post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditPost = (post: iBlogPost) => {
    setEditPost(post)
    setEditModalOpen(true)
  }

  const handleSavePost = async (id: string, formData: FormData) => {
    const result = await updateBlogPost(id, formData)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshPosts()
    toast.success("BLOG POST UPDATED")
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderItem("blog", id, direction)
    await refreshPosts()
  }

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleBlogPostFeatured(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshPosts()
    toast.success(result.featured ? "FEATURED" : "UNFEATURED")
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const old = blogPosts
    setBlogPosts(blogPosts.filter(p => p._id !== deleteTarget))
    setConfirmOpen(false)

    try {
      await deleteBlogPost(deleteTarget)
      await refreshPosts()
      toast.success("POST_DELETED")
    } catch {
      setBlogPosts(old)
      toast.error("Failed to delete post")
    }
    setDeleteTarget(null)
  }

  const filteredPosts = searchQuery
    ? blogPosts.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : blogPosts

  return (
    <>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">COMPOSE_POST</h2>
        </div>

        <Container variant="outline" className="p-8 bg-card mx-6 md:mx-12 lg:mx-22">
          <form onSubmit={handleAddPost} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                label="POST_TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                label="AUTHOR"
              />
            </div>

            <FormInput
              type="text"
              value={newPost.excerpt}
              onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
              label="EXCERPT"
              placeholder="Short summary for preview"
            />

            <MarkdownEditor
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              label="CONTENT"
              placeholder="Write your post here (supports markdown)"
              rows={10}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                label="TAGS"
                placeholder="Next.js, Security, Web Dev"
              />
              <FormInput
                type="text"
                value={newPost.keywords}
                onChange={(e) => setNewPost(prev => ({ ...prev, keywords: e.target.value }))}
                label="SEO_KEYWORDS"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-input/30 p-4 border border-border">
                <input
                  type="checkbox"
                  id="published"
                  checked={newPost.published}
                  onChange={(e) => setNewPost(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="published" className="font-mono text-sm cursor-pointer">PUBLISH_IMMEDIATELY</label>
              </div>
              <FormInput
                type="number"
                value={newPost.order}
                onChange={(e) => setNewPost(prev => ({ ...prev, order: e.target.value }))}
                label="ORDER"
              />
            </div>

            <ImageCropUpload
              onCropped={(file) => setCoverFile(file)}
              label="COVER_IMAGE"
              aspect={16 / 9}
            />

            <button type="submit" disabled={submitting} className="w-full group">
              <Container variant="primary" className="py-3 text-center flex items-center justify-center gap-2" hoverEffect>
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                <span className="font-bold tracking-widest uppercase">SAVE_DRAFT</span>
              </Container>
            </button>
          </form>
        </Container>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">POST_ARCHIVE</h2>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm transition-colors"
          />
        </div>

        <div className="space-y-3">
          {filteredPosts.map((post, i) => (
            <Container key={post._id} variant="ghost" className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleReorder(post._id, "up")} disabled={i === 0} className="p-0.5 text-muted hover:text-white disabled:opacity-20"><ChevronUp size={14} /></button>
                  <button onClick={() => handleReorder(post._id, "down")} disabled={i === filteredPosts.length - 1} className="p-0.5 text-muted hover:text-white disabled:opacity-20"><ChevronDown size={14} /></button>
                </div>

                {post.coverImage && (
                  <div className="w-20 h-14 bg-black border border-border overflow-hidden hidden sm:block">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-bold text-lg truncate">{post.title}</h4>
                    {post.featured && <span className="text-[10px] font-mono font-bold bg-primary/20 text-primary px-2 py-0.5">FEATURED</span>}
                    {!post.published && <span className="text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5">DRAFT</span>}
                  </div>
                  <p className="text-xs text-secondary line-clamp-1">{post.excerpt}</p>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => handleToggleFeatured(post._id)} className={`p-2 ${post.featured ? "text-primary" : "text-muted"}`}><Star size={16} fill={post.featured ? "currentColor" : "none"} /></button>
                  <button onClick={() => handleEditPost(post)} className="p-2 text-muted hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteClick(post._id)} className="p-2 text-muted hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </Container>
          ))}
        </div>
      </section>

      <EditBlogModal post={editPost} open={editModalOpen} onOpenChange={setEditModalOpen} onSave={handleSavePost} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirmDelete} title="DELETE_POST?" description="Irreversible action. This content will be purged from the system." variant="danger" />
    </>
  )
}
