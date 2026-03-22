import type { Metadata } from "next"
import Link from "next/link"
import SectionHeading from "@/components/ui/SectionHeading"
import Container from "@/components/ui/Container"
import { getBlogPosts, getFeaturedBlogPosts } from "@/app/actions/public"
import { Star, ArrowRight, Calendar, Eye } from "lucide-react"
import GridBackground from "@/components/ui/GridBackground"
import { connection } from "next/server"

export const metadata: Metadata = {
  title: "Blog | FieldWaves",
  description: "Technical deep-dives, industry perspectives, and engineering culture from the FieldWaves team.",
}

export default async function BlogPage() {
  await connection()
  const [allPosts, featured] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPosts(),
  ])

  // Latest posts = non-featured, limited to 6
  const featuredIds = new Set(featured.map(p => p._id))
  const latest = allPosts.filter(p => !featuredIds.has(p._id)).slice(0, 6)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-12">
              <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Engineering Insights"
            title="The Blog"
            subtitle="Technical deep-dives, industry perspectives, and engineering culture."
          />
        </div>
      </section>

      {/* Featured / Top Picks */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <Star size={16} className="text-primary" />
            <h2 className="font-mono font-bold text-sm tracking-widest">TOP_PICKS</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <Container variant="glass" className="h-full p-0 group" noSkewMobile hoverEffect>
                  <div className="flex flex-col h-full">
                    {post.coverImage && (
                      <div className="h-[200px] w-full bg-black overflow-hidden border-b-2 border-border group-hover:border-primary transition-colors">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200 scale-110 group-hover:scale-100"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col grow bg-background">
                      <div className="flex items-center gap-2 mb-3">
                        <Container variant="primary" className="px-2 py-0.5">
                          <span className="font-mono text-[10px] tracking-widest flex items-center gap-1">
                            <Star size={8} /> FEATURED
                          </span>
                        </Container>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-secondary mb-4 grow line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 mt-auto">
                        {post.author && (
                          <span className="font-mono text-[10px] text-muted">{post.author}</span>
                        )}
                        <span className="font-mono text-[10px] text-muted flex items-center gap-1">
                          <Eye size={10} /> {post.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </Container>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {latest.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-primary" />
              <h2 className="font-mono font-bold text-sm tracking-widest">LATEST</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <Container variant="ghost" className="h-full p-0 group" noSkewMobile hoverEffect>
                  <div className="flex flex-col h-full">
                    {post.coverImage && (
                      <div className="h-[180px] w-full bg-black overflow-hidden border-b border-border group-hover:border-primary transition-colors">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200 scale-110 group-hover:scale-100"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col grow">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="font-mono text-[10px] text-muted border border-border px-1.5 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-secondary mb-3 grow line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-auto">
                        {post.author && (
                          <span className="font-mono text-[10px] text-muted">{post.author}</span>
                        )}
                        <span className="font-mono text-[10px] text-muted flex items-center gap-1">
                          <Eye size={10} /> {post.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </Container>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {allPosts.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-muted text-sm">NO_POSTS_PUBLISHED_YET</p>
          <p className="text-sm text-secondary mt-2">Check back soon for engineering insights.</p>
        </section>
      )}

      {/* View All CTA */}
      {allPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
          <Link href="/blog/all">
            <Container variant="outline" className="px-8 py-3 inline-block" hoverEffect>
              <span className="flex items-center gap-2 font-mono font-bold tracking-widest text-sm">
                VIEW ALL POSTS
                <ArrowRight size={14} />
              </span>
            </Container>
          </Link>
        </section>
      )}
    </>
  )
}
