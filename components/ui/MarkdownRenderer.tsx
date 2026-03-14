"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
  withIds?: boolean
}

function textToId(children: React.ReactNode): string {
  const text = typeof children === "string"
    ? children
    : Array.isArray(children)
    ? children.map(c => (typeof c === "string" ? c : "")).join("")
    : ""
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function createComponents(withIds: boolean): Components {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-3xl md:text-4xl font-bold uppercase text-white mb-4 mt-10 first:mt-0 border-b border-border pb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = withIds ? textToId(children) : undefined
      return (
        <h2 id={id} className="font-display text-2xl font-bold uppercase text-white mb-3 mt-10 first:mt-0 scroll-mt-24 flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-primary  shrink-0" />
          <span>{children}</span>
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = withIds ? textToId(children) : undefined
      return (
        <h3 id={id} className="font-display text-xl font-bold uppercase text-white mb-2 mt-8 first:mt-0 scroll-mt-24">
          <span className="text-primary font-mono mr-2">//</span>
          {children}
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="font-display text-lg font-bold text-white mb-2 mt-6 first:mt-0">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-base text-secondary leading-relaxed mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline underline-offset-4 decoration-primary/50 transition-colors font-medium"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="w-full border-2 border-border my-6"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none"
        }}
      />
    ),
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-")
      if (isBlock) {
        return (
          <code className={`${className} text-sm`}>{children}</code>
        )
      }
      return (
        <code className="bg-input border border-border px-1.5 py-0.5 text-sm font-mono text-primary">
          {children}
        </code>
      )
    },
    pre: ({ children }) => {
      const codeEl = children as React.ReactElement<{ className?: string }>
      const lang = codeEl?.props?.className?.replace("language-", "") || "code"
      return (
        <div className="my-6 border-l-4 border-primary bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-widest uppercase">{lang}</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-border  shrink-0" />
              <div className="w-2 h-2 bg-border  shrink-0" />
              <div className="w-2 h-2 bg-primary  shrink-0" />
            </div>
          </div>
          <pre className="bg-input p-4 overflow-x-auto font-mono text-sm text-secondary">
            {children}
          </pre>
        </div>
      )
    },
    ul: ({ children }) => (
      <ul className="list-none space-y-2 mb-4 pl-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-none space-y-2 mb-4 pl-0">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-base text-secondary leading-relaxed flex items-start gap-3">
        <span className="inline-block w-1.5 h-1.5 bg-primary  mt-2.5 shrink-0" />
        <div className="flex-1">{children}</div>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary bg-card/50 px-6 py-4">
        {children}
      </blockquote>
    ),
    hr: () => (
      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <div className="w-4 h-4 bg-primary  shrink-0" />
        <div className="flex-1 h-px bg-border" />
      </div>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="text-secondary italic">{children}</em>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-card border-b-2 border-primary">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-mono text-xs text-primary uppercase tracking-wider font-bold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-secondary border-t border-border">{children}</td>
    ),
  }
}

export default function MarkdownRenderer({ content, className = "", withIds = false }: MarkdownRendererProps) {
  if (!content?.trim()) {
    return (
      <p className="text-sm text-muted font-mono italic">NO_DESCRIPTION_PROVIDED</p>
    )
  }

  const components = createComponents(withIds)

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
