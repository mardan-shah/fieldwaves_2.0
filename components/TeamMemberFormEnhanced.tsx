"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "./ui/SkewContainer"
import SocialIconPicker, { SOCIAL_PLATFORMS } from "./ui/SocialIconPicker"
import FormInput from "./ui/FormInput"
import MarkdownEditor from "./ui/MarkdownEditor"
import { Plus, Loader2, Check, X, Upload } from "lucide-react"

interface TeamMemberFormEnhancedProps {
  onSubmit?: (data: FormData) => Promise<void>
  loading?: boolean
}

interface SocialLink {
  platform: string
  url: string
}

export default function TeamMemberFormEnhanced({ onSubmit, loading }: TeamMemberFormEnhancedProps) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    backgroundColor: "#000000",
    order: "0",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [newSocial, setNewSocial] = useState({ platform: "github", url: "" })
  const [activeTab, setActiveTab] = useState<"basics" | "socials">("basics")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAddSocial = () => {
    if (newSocial.url.trim()) {
      setSocials([...socials, { ...newSocial }])
      setNewSocial({ platform: "github", url: "" })
    }
  }

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters"
    if (formData.role.length < 2) newErrors.role = "Role must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (onSubmit) {
      const payload = new FormData()
      payload.append("name", formData.name)
      payload.append("role", formData.role)
      payload.append("bio", formData.bio)
      payload.append("backgroundColor", formData.backgroundColor)
      if (avatarFile) {
        payload.append("avatar", avatarFile)
      }
      payload.append("socialLinks", JSON.stringify(socials))
      payload.append("order", formData.order)

      await onSubmit(payload)
      setSubmitted(true)

      if (previewUrl) URL.revokeObjectURL(previewUrl)

      setFormData({ name: "", role: "", bio: "", backgroundColor: "#000000", order: "0" })
      setAvatarFile(null)
      setPreviewUrl(null)
      setSocials([])
      setActiveTab("basics")
      setErrors({})
      setTimeout(() => setSubmitted(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("basics")}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === "basics" ? "border-b-2 border-primary text-primary" : "text-secondary hover:text-white"
          }`}
        >
          BASICS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("socials")}
          className={`px-4 py-2 font-mono text-sm transition-colors ${
            activeTab === "socials" ? "border-b-2 border-primary text-primary" : "text-secondary hover:text-white"
          }`}
        >
          SOCIALS ({socials.length})
        </button>
      </div>

      {/* Basics Tab */}
      {activeTab === "basics" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              label="NAME"
              placeholder="Full name"
              required
              error={errors.name}
            />
            <FormInput
              type="text"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              label="ROLE"
              placeholder="Job title"
              required
              error={errors.role}
            />
          </div>

          <MarkdownEditor
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            label="BIO"
            placeholder="Brief bio or description (supports markdown)"
            rows={4}
          />

          <div className="grid md:grid-cols-3 gap-4">
            {/* File Upload */}
            <div className="group">
              <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">AVATAR_IMAGE</label>
              <div className="relative transform border border-border bg-input transition-colors group-hover:border-primary p-1">
                <div className="transform flex items-center gap-3 p-2">
                  <label className="cursor-pointer bg-border hover:bg-primary text-white px-4 py-2 text-xs font-bold font-mono transition-colors flex items-center gap-2">
                    <Upload size={14} />
                    CHOOSE_FILE
                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                  </label>
                  <span className="text-xs text-muted font-mono truncate max-w-[200px]">
                    {avatarFile ? avatarFile.name : "NO_FILE_CHOSEN"}
                  </span>
                </div>
              </div>
            </div>

            {/* Background Color Control */}
            <div className="group">
              <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">BG_COLOR (HEX)</label>
              <div className="flex gap-2">
                <div className="flex-1 relative border border-border bg-input transition-colors focus-within:border-primary">
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-full bg-transparent text-white p-3 outline-none placeholder:text-muted font-mono"
                    placeholder="#000000"
                  />
                </div>
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="h-full w-12 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            {/* Order */}
            <FormInput
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              label="ORDER"
              placeholder="0"
            />
          </div>

          {/* Preview Area */}
          {previewUrl && (
            <div className="mt-4">
              <p className="font-mono text-xs text-secondary mb-2 tracking-widest">PREVIEW</p>
              <div className="flex gap-4">
                <div
                  className="w-24 h-24 border border-border overflow-hidden"
                  style={{ backgroundColor: formData.backgroundColor }}
                >
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted font-mono">
                    Check if the background color matches the image transparency properly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Socials Tab */}
      {activeTab === "socials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs text-secondary mb-4 tracking-widest">SELECT PLATFORM</label>
            <SocialIconPicker
              selected={newSocial.platform}
              onChange={(p) => setNewSocial({ ...newSocial, platform: p })}
            />
          </div>

          <FormInput
            type="url"
            value={newSocial.url}
            onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
            label="URL"
            placeholder={SOCIAL_PLATFORMS.find((s) => s.name === newSocial.platform)?.placeholder}
          />

          <button type="button" onClick={handleAddSocial} className="w-full group">
            <SkewContainer
              variant="secondary"
              className="py-2 text-center flex items-center justify-center gap-2"
              hoverEffect
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={16} />
                <span className="font-bold text-sm">ADD SOCIAL</span>
              </div>
            </SkewContainer>
          </button>

          {/* Social Links List */}
          <div className="space-y-2 mt-6">
            <p className="font-mono text-xs text-secondary tracking-widest">ADDED ({socials.length})</p>
            {socials.map((social, i) => {
              const platform = SOCIAL_PLATFORMS.find((s) => s.name === social.platform)
              const Icon = platform?.icon
              return (
                <div key={i} className="flex items-center justify-between bg-input border border-border p-3">
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={16} className="text-primary" />}
                    <span className="text-sm text-secondary truncate">{social.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(i)}
                    className="text-primary hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={loading || submitted} className="w-full group">
        <SkewContainer
          variant="primary"
          className="py-3 text-center flex items-center justify-center gap-2"
          hoverEffect
        >
          <div className="flex items-center justify-center gap-2">
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
          </div>
        </SkewContainer>
      </button>
    </form>
  )
}
