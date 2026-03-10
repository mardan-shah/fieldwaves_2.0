"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import EditBlogModal from "@/components/admin/EditBlogModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { BlogPost } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { FileText, Eye, Save, Loader2, Search, Trash2, Pencil, Plus, Star, ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { addBlogPost, updateBlogPost, deleteBlogPost, getAllBlogPosts, toggleBlogPostFeatured, reorderItem } from "@/app/actions/admin"

interface BlogsViewProps {
  initialBlogPosts: BlogPost[]
}

export default function BlogsView({ initialBlogPosts }: BlogsViewProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts)
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
    order: "0",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
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
    setBlogPosts(updated as BlogPost[])
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
      setCoverPreview(null)
      setErrors({})
    } catch (err: any) {
      toast.error(err.message || "Failed to add blog post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditPost = (post: BlogPost) => {
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

  const handleCoverUpload = (file: File) => {
    setCoverFile(file)
  }

  const filteredPosts = searchQuery
    ? blogPosts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : blogPosts

  return (
    <>
      {/* Add Blog Post Form */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">CREATE_BLOG_POST</h2>
        </div>

        <SkewContainer variant="outline" className="p-8 bg-card">
          <form onSubmit={handleAddPost} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                label="TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                label="AUTHOR"
                placeholder="Author name"
              />
            </div>

            <MarkdownEditor
              value={newPost.excerpt}
              onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
              label="EXCERPT"
              placeholder="Short summary for cards (max 500 chars)"
              rows={2}
            />

            <ImageCropUpload
              onCropped={handleCoverUpload}
              label="COVER_IMAGE"
              aspect={16 / 9}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                label="TAGS"
                placeholder="engineering, react, tutorial (comma separated)"
              />
              <FormInput
                type="text"
                value={newPost.keywords}
                onChange={(e) => setNewPost(prev => ({ ...prev, keywords: e.target.value }))}
                label="SEO KEYWORDS"
                placeholder="nextjs, web dev (comma separated)"
              />
            </div>

            <MarkdownEditor
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              label="FULL CONTENT"
              placeholder="Full blog post content (markdown supported)"
              rows={10}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                type="number"
                value={newPost.order}
                onChange={(e) => setNewPost(prev => ({ ...prev, order: e.target.value }))}
                label="ORDER"
              />
              <div className="group">
                <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">PUBLISHED</label>
                <button
                  type="button"
                  onClick={() => setNewPost(prev => ({ ...prev, published: !prev.published }))}
                  className={`relative w-14 h-7 transition-colors duration-300 ${
                    newPost.published ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${
                    newPost.published ? "translate-x-7" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full group">
              <SkewContainer
                variant="primary"
                className="py-3 text-center flex items-center justify-center gap-2"
                hoverEffect
              >
                <div className="flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  <span className="font-bold tracking-widest">PUBLISH_POST</span>
                </div>
              </SkewContainer>
            </button>
          </form>
        </SkewContainer>
      </section>

      {/* Blog Post List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">ALL_POSTS</h2>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-muted transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-mono text-sm text-muted">
                {searchQuery ? "NO_MATCHES_FOUND" : "NO_BLOG_POSTS_YET"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post, i) => (
              <div
                key={post._id}
                className="border border-border bg-input p-4 flex items-center gap-4 hover:border-primary/30 transition-colors"
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => handleReorder(post._id, "up")}
                    disabled={i === 0}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReorder(post._id, "down")}
                    disabled={i === filteredPosts.length - 1}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {post.coverImage && (
                  <div className="w-16 h-16 shrink-0 overflow-hidden border border-border">
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm truncate">{post.title}</h3>
                    <span className={`px-2 py-0.5 font-mono text-[10px] ${
                      post.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {post.published ? "LIVE" : "DRAFT"}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-primary/20 text-primary">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {post.author && <p className="font-mono text-[10px] text-primary">{post.author}</p>}
                    <p className="font-mono text-[10px] text-muted">{post.views} views</p>
                    {post.tags.length > 0 && (
                      <p className="text-[10px] text-muted truncate">{post.tags.join(', ')}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(post._id)}
                    className={`p-2 transition-colors ${
                      post.featured ? "text-primary hover:text-white" : "text-muted hover:text-primary"
                    }`}
                    title={post.featured ? "Remove featured" : "Mark featured"}
                  >
                    <Star size={14} fill={post.featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 border border-border hover:border-primary text-secondary hover:text-primary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post._id)}
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

      <EditBlogModal
        post={editPost}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSavePost}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="DELETE BLOG POST?"
        description="This action cannot be undone. The blog post will be permanently removed."
        variant="danger"
      />
    </>
  )
}
