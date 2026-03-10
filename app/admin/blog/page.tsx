import { getAllBlogPosts } from "@/app/actions/admin"
import type { BlogPost } from "@/types"
import BlogsView from "../_components/BlogsView"

export default async function AdminBlogPage() {
  const blogPosts = await getAllBlogPosts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">BLOG</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">CONTENT // MANAGE BLOG POSTS</p>
      </div>
      <BlogsView initialBlogPosts={blogPosts as BlogPost[]} />
    </div>
  )
}
