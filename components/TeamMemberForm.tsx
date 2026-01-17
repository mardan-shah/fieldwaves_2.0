"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "./ui/SkewContainer"
import { Plus, Loader2, Check } from "lucide-react"

interface TeamMemberFormProps {
  onSubmit?: (data: any) => Promise<void>
  loading?: boolean
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit, loading }) => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    avatarUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit(formData)
      setSubmitted(true)
      setFormData({ name: "", role: "", bio: "", avatarUrl: "" })
      setTimeout(() => setSubmitted(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs text-[#B0B0B0] mb-2">NAME</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none"
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-[#B0B0B0] mb-2">ROLE</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-xs text-[#B0B0B0] mb-2">BIO</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none h-24"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-[#B0B0B0] mb-2">AVATAR_URL</label>
        <input
          type="url"
          value={formData.avatarUrl}
          onChange={(e) => setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 focus:border-[#FF5F1F] outline-none"
        />
      </div>

      <button type="submit" disabled={loading || submitted} className="w-full group">
        <SkewContainer
          variant="primary"
          className="py-3 text-center flex items-center justify-center gap-2"
          hoverEffect
        >
          {submitted ? (
            <>
              <Check size={18} />
              <span className="font-bold tracking-widest">MEMBER_ADDED</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span className="font-bold tracking-widest">ADDING...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span className="font-bold tracking-widest">ADD_MEMBER</span>
            </>
          )}
        </SkewContainer>
      </button>
    </form>
  )
}

export default TeamMemberForm
