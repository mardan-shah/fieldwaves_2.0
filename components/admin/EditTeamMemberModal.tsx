"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormInput from "@/components/ui/FormInput"
import MarkdownEditor from "@/components/ui/MarkdownEditor"
import SocialIconPicker, { SOCIAL_PLATFORMS } from "@/components/ui/SocialIconPicker"
import SkewContainer from "@/components/ui/SkewContainer"
import type { TeamMember } from "@/types"
import ImageCropUpload from "@/components/admin/ImageCropUpload"
import { Loader2, Save, Plus, X } from "lucide-react"

interface EditTeamMemberModalProps {
  member: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, formData: FormData) => Promise<void>
}

interface SocialLink {
  platform: string
  url: string
}

export default function EditTeamMemberModal({ member, open, onOpenChange, onSave }: EditTeamMemberModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    backgroundColor: "#000000",
    isOwner: false,
    order: "0",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [newSocial, setNewSocial] = useState({ platform: "github", url: "" })
  const [activeTab, setActiveTab] = useState<"basics" | "socials">("basics")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && member) {
      setForm({
        name: member.name,
        role: member.role,
        bio: member.bio || "",
        backgroundColor: member.backgroundColor || "#000000",
        isOwner: member.isOwner,
        order: String(member.order || 0),
      })
      // Convert socialLinks object to array
      const socialArray: SocialLink[] = []
      if (member.socialLinks) {
        Object.entries(member.socialLinks).forEach(([platform, url]) => {
          if (url) socialArray.push({ platform, url })
        })
      }
      setSocials(socialArray)
      setAvatarFile(null)
      setActiveTab("basics")
      setErrors({})
    }
    onOpenChange(isOpen)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters"
    if (form.role.length < 2) newErrors.role = "Role must be at least 2 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddSocial = () => {
    if (newSocial.url.trim()) {
      setSocials([...socials, { ...newSocial }])
      setNewSocial({ platform: "github", url: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!member || !validate()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("role", form.role)
      formData.append("bio", form.bio)
      formData.append("backgroundColor", form.backgroundColor)
      formData.append("isOwner", String(form.isOwner))
      formData.append("order", form.order)
      formData.append("socialLinks", JSON.stringify(socials))
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }
      await onSave(member._id, formData)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  // Initialize form when dialog opens
  if (open && member && form.name === "" && form.role === "") {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      backgroundColor: member.backgroundColor || "#000000",
      isOwner: member.isOwner,
      order: String(member.order || 0),
    })
    const socialArray: SocialLink[] = []
    if (member.socialLinks) {
      Object.entries(member.socialLinks).forEach(([platform, url]) => {
        if (url) socialArray.push({ platform, url })
      })
    }
    setSocials(socialArray)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border border-border rounded-none max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-primary tracking-wider uppercase">
            EDIT TEAM MEMBER
          </DialogTitle>
        </DialogHeader>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "basics" && (
            <div className="space-y-4">
              <ImageCropUpload
                currentImage={member?.avatarUrl || null}
                onCropped={(file) => setAvatarFile(file)}
                label="AVATAR"
                aspect={1}
                height="h-40"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  label="NAME"
                  required
                  error={errors.name}
                />
                <FormInput
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  label="ROLE"
                  required
                  error={errors.role}
                />
              </div>

              <MarkdownEditor
                value={form.bio}
                onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                label="BIO"
                placeholder="Brief bio (supports markdown)"
                rows={4}
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="group">
                  <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">BG_COLOR</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.backgroundColor}
                      onChange={(e) => setForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="h-10 w-full bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <FormInput
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm(prev => ({ ...prev, order: e.target.value }))}
                  label="ORDER"
                />

                <div className="group">
                  <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">IS_OWNER</label>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, isOwner: !prev.isOwner }))}
                    className={`w-full h-10 border font-mono text-xs tracking-wider transition-colors ${
                      form.isOwner
                        ? "bg-primary border-primary text-white"
                        : "bg-input border-border text-muted"
                    }`}
                  >
                    {form.isOwner ? "YES" : "NO"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs text-secondary tracking-widest">SELECT PLATFORM</label>
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
                placeholder={SOCIAL_PLATFORMS.find(s => s.name === newSocial.platform)?.placeholder}
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

              <div className="space-y-2">
                {socials.map((social, i) => {
                  const platform = SOCIAL_PLATFORMS.find(s => s.name === social.platform)
                  const Icon = platform?.icon
                  return (
                    <div key={i} className="flex items-center justify-between bg-input border border-border p-3">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon size={16} className="text-primary" />}
                        <span className="text-sm text-secondary truncate">{social.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSocials(socials.filter((_, idx) => idx !== i))}
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 bg-input border border-border text-secondary hover:text-white font-mono text-xs tracking-wider transition-colors"
            >
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="flex-1 group">
              <SkewContainer variant="primary" className="py-3 text-center flex items-center justify-center gap-2" hoverEffect>
                <div className="flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span className="font-bold tracking-widest text-xs">SAVE</span>
                </div>
              </SkewContainer>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
