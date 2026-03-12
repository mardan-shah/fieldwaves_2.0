"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import FormInput from "@/components/ui/FormInput"
import EditServiceModal from "@/components/admin/EditServiceModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import { LayoutGrid, Eye, Save, Loader2, Search, Trash2, Pencil, Plus, ChevronUp, ChevronDown, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { saveService, deleteService, reorderItem } from "@/app/actions/admin"
import LucideIcon from "@/components/ui/LucideIcon"

interface ServicesViewProps {
  initialServices: any[]
}

export default function ServicesView({ initialServices }: ServicesViewProps) {
  const [services, setServices] = useState<any[]>(initialServices)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newService, setNewPost] = useState({
    title: "",
    description: "",
    iconName: "Cpu",
    features: "",
    order: "0",
    active: "true",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [editService, setEditService] = useState<any | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (newService.title.length < 2) newErrors.title = "Title must be at least 2 characters"
    if (newService.description.length < 10) newErrors.description = "Description too short"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newService.title)
      formData.append("description", newService.description)
      formData.append("iconName", newService.iconName)
      formData.append("features", newService.features)
      formData.append("order", newService.order)
      formData.append("active", newService.active)

      const result = await saveService(formData)
      if (result.error) throw new Error(typeof result.error === 'string' ? result.error : "Validation failed")

      toast.success(`SERVICE "${newService.title}" CREATED`)
      setNewPost({ title: "", description: "", iconName: "Cpu", features: "", order: "0", active: "true" })
      setErrors({})
      // Note: Ideally refresh from server, but for UX we can let user refresh or use a router.refresh() pattern
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to add service")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditService = (service: any) => {
    setEditService(service)
    setEditModalOpen(true)
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderItem("service", id, direction)
    window.location.reload();
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setConfirmOpen(false)

    try {
      const result = await deleteService(deleteTarget)
      if (result.error) throw new Error(result.error)
      toast.success("SERVICE_DELETED")
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service")
    }
    setDeleteTarget(null)
  }

  const filteredServices = searchQuery
    ? services.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : services

  return (
    <>
      {/* Add Service Form */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">ADD_NEW_SERVICE</h2>
        </div>

        <SkewContainer variant="outline" className="  p-8 bg-card mx-6 md:mx-12 lg:mx-22">
          <form onSubmit={handleAddService} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                value={newService.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                label="SERVICE_TITLE"
                required
                error={errors.title}
              />
              <FormInput
                type="text"
                value={newService.iconName}
                onChange={(e) => setNewPost(prev => ({ ...prev, iconName: e.target.value }))}
                label="LUCIDE_ICON_NAME"
                placeholder="Cpu, Shield, Zap, etc."
                required
              />
            </div>

            <FormInput
              type="text"
              value={newService.description}
              onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
              label="DESCRIPTION"
              required
              error={errors.description}
            />

            <div className="group">
              <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">FEATURES (ONE_PER_LINE)</label>
              <textarea
                value={newService.features}
                onChange={(e) => setNewPost(prev => ({ ...prev, features: e.target.value }))}
                className="w-full bg-input border border-border focus:border-primary text-white p-4 outline-none font-mono text-sm min-h-[100px] transition-colors"
                placeholder="Feature 1\nFeature 2..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                type="number"
                value={newService.order}
                onChange={(e) => setNewPost(prev => ({ ...prev, order: e.target.value }))}
                label="DISPLAY_ORDER"
              />
              <div className="group">
                <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">STATUS_ACTIVE</label>
                <button
                  type="button"
                  onClick={() => setNewPost(prev => ({ ...prev, active: prev.active === "true" ? "false" : "true" }))}
                  className={`relative w-14 h-7 transition-colors duration-300 ${newService.active === "true" ? "bg-primary" : "bg-border"
                    }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${newService.active === "true" ? "translate-x-7" : "translate-x-0"
                    }`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full group">
              <SkewContainer
                variant="primary"
                className="py-3 text-center flex items-center justify-center gap-2 skew-x-0"
                hoverEffect
              >
                <div className="flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  <span className="font-bold tracking-widest">SAVE_SERVICE</span>
                </div>
              </SkewContainer>
            </button>
          </form>
        </SkewContainer>
      </section>

      {/* Service List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_SERVICES</h2>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-muted transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-mono text-sm text-muted">
                {searchQuery ? "NO_MATCHES_FOUND" : "NO_SERVICES_CONFIGURED"}
              </p>
            </div>
          ) : (
            filteredServices.map((service, i) => (
              <div
                key={service._id}
                className={`border border-border bg-input p-4 flex items-center gap-4 hover:border-primary/30 transition-colors ${!service.active && 'opacity-60'}`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => handleReorder(service._id, "up")}
                    disabled={i === 0}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReorder(service._id, "down")}
                    disabled={i === filteredServices.length - 1}
                    className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-card border border-border">
                  <LucideIcon name={service.iconName} size={24} className="text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm truncate uppercase tracking-tight">{service.title}</h3>
                    {service.active ? (
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-green-500/20 text-green-400">ACTIVE</span>
                    ) : (
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-red-500/20 text-red-400">INACTIVE</span>
                    )}
                  </div>
                  <p className="text-[10px] text-secondary truncate">{service.description}</p>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 border border-border hover:border-primary text-secondary hover:text-primary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service._id)}
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

      <EditServiceModal
        service={editService}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={() => window.location.reload()}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="DELETE SERVICE?"
        description="This action cannot be undone. This service will be removed from all public pages."
        variant="danger"
      />
    </>
  )
}
