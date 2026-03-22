import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import BlogGrid from "@/components/BlogGrid"
import { getBlogPosts } from "@/app/actions/public"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "All Posts | FieldWaves Blog",
  description: "Browse all blog posts from the FieldWaves engineering team.",
}

export default async function AllBlogPostsPage() {
  await connection()
  const posts = await getBlogPosts()

  return (
    <>
      <section className="relative min-h-[30vh] flex items-center justify-center pt-32 pb-8">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="All Posts"
            title="Blog Archive"
            subtitle="Every post we've published, searchable and filterable."
          />
        </div>
      </section>

      <section className="py-12 pb-24">
        <BlogGrid posts={posts} showSearch />
      </section>
    </>
  )
}
