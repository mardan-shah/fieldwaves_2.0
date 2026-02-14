"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display text-2xl font-bold uppercase text-white mb-3 mt-6 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-xl font-bold uppercase text-white mb-2 mt-5 first:mt-0">
      <span className="text-[#FF5F1F]">// </span>{children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-lg font-bold uppercase text-white mb-2 mt-4 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-[#B0B0B0] leading-relaxed mb-3">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#FF5F1F] hover:underline transition-colors"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <span className="block my-3">
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="max-w-full border border-[#333]"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none"
        }}
      />
    </span>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return (
        <code className={`${className} text-sm`}>{children}</code>
      )
    }
    return (
      <code className="bg-[#0a0a0a] border border-[#333] px-1.5 py-0.5 text-xs font-mono text-[#FF5F1F]">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-[#0a0a0a] border border-[#333] p-4 overflow-x-auto my-3 font-mono text-sm text-[#B0B0B0]">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="list-none space-y-1.5 mb-3 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 mb-3 pl-6 text-sm text-[#B0B0B0] marker:text-[#FF5F1F]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-[#B0B0B0] relative before:content-['//'] before:text-[#FF5F1F] before:font-mono before:mr-2 before:text-xs">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#FF5F1F] bg-[#0a0a0a] pl-4 py-2 my-3 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-[#333] my-6" />,
  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-[#B0B0B0] italic">{children}</em>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border border-[#333]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#0a0a0a] border-b border-[#333]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-mono text-xs text-[#FF5F1F] uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-[#B0B0B0] border-t border-[#333]">{children}</td>
  ),
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content?.trim()) {
    return (
      <p className="text-sm text-[#666] font-mono italic">NO_DESCRIPTION_PROVIDED</p>
    )
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
