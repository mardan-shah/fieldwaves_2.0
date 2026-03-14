import { notFound } from "next/navigation"
import Link from "next/link"
import Container from "@/components/ui/Container"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import TableOfContents from "@/components/ui/TableOfContents"
import { getBlogPostBySlug, getBlogPosts } from "@/app/actions/public"
import { trackPageView } from "@/app/actions/admin"
import { ArrowLeft, Calendar, User, Eye, Clock } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: "Not Found" }

  return {
    title: `${post.title} | FieldWaves Blog`,
    description: post.excerpt || post.title,
    keywords: post.keywords.join(', '),
  }
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  await trackPageView(`/blog/${slug}`, 'blog', post._id)

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const readTime = estimateReadTime(post.content)

  return (
    <>
      {/* Cover Image */}
      {post.coverImage && (
        <section className="relative h-[50vh] md:h-[60vh] mt-20">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </section>
      )}

      {/* Title Block */}
      <section className={`max-w-7xl mx-auto px-6 ${post.coverImage ? "-mt-40 relative z-10" : "pt-32"}`}>
        {/* Back link */}
        <Link href="/blog" className="inline-block mb-8">
          <Container variant="ghost" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs text-muted hover:text-white transition-colors">
              <ArrowLeft size={14} />
              BACK_TO_BLOG
            </span>
          </Container>
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Container key={tag} variant="outline" className="px-3 py-1">
                <span className="font-mono text-[10px] uppercase tracking-widest">{tag}</span>
              </Container>
            ))}
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {post.author && (
            <Container variant="glass" className="px-4 py-2">
              <span className="flex items-center gap-2 font-mono text-xs">
                <User size={12} className="text-primary" />
                {post.author}
              </span>
            </Container>
          )}
          {formattedDate && (
            <Container variant="glass" className="px-4 py-2">
              <span className="flex items-center gap-2 font-mono text-xs">
                <Calendar size={12} className="text-primary" />
                {formattedDate}
              </span>
            </Container>
          )}
          <Container variant="glass" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs">
              <Clock size={12} className="text-primary" />
              {readTime} MIN READ
            </span>
          </Container>
          <Container variant="glass" className="px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs">
              <Eye size={12} className="text-primary" />
              {post.views} VIEWS
            </span>
          </Container>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="border-l-4 border-primary bg-card/50 px-6 py-4 mb-10">
            <p className="text-lg text-secondary leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>
        )}
      </section>

      {/* Two-Column: TOC + Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[250px_1fr] gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border-l-2 border-primary pl-4">
              <TableOfContents content={post.content} />
            </div>
          </aside>
          <div className="max-w-3xl">
            <MarkdownRenderer content={post.content} withIds />
          </div>
        </div>
      </section>

      {/* Keywords */}
      {post.keywords.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10 border-t border-border">
          <p className="font-mono text-xs text-primary tracking-widest mb-4">KEYWORDS</p>
          <div className="flex flex-wrap gap-2">
            {post.keywords.map(kw => (
              <Container key={kw} variant="ghost" className="px-3 py-1">
                <span className="font-mono text-xs text-muted">{kw}</span>
              </Container>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-6">More Engineering Insights</h2>
          <p className="text-lg text-secondary mb-8">Explore more from the FieldWaves engineering team.</p>
          <Link href="/blog" className="inline-block">
            <Container variant="primary" hoverEffect className="px-8 py-3">
              <span className="font-mono font-bold tracking-widest text-sm">VIEW ALL POSTS</span>
            </Container>
          </Link>
        </div>
      </section>
    </>
  )
}
