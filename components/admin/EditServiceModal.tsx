"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { saveService } from "@/app/actions/admin"
import { Loader2 } from "lucide-react"

interface EditServiceModalProps {
  service: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function EditServiceModal({
  service,
  open,
  onOpenChange,
  onSuccess,
}: EditServiceModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "Cpu",
    features: "",
    order: 0,
    active: "true",
  })

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        iconName: service.iconName || "Cpu",
        features: service.features || "",
        order: service.order || 0,
        active: service.active ? "true" : "false",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        iconName: "Cpu",
        features: "",
        order: 0,
        active: "true",
      })
    }
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      if (service?._id) data.append("id", service._id)
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("iconName", formData.iconName)
      data.append("features", formData.features)
      data.append("order", formData.order.toString())
      data.append("active", formData.active)

      const result = await saveService(data)

      if (result.success) {
        toast.success(service ? "Service updated" : "Service created")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(typeof result.error === "string" ? result.error : "Validation failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card text-white border-border">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-widest text-primary">
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-mono text-xs uppercase tracking-widest text-secondary">
              Service Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border-border"
              placeholder="e.g. Enterprise Hardening"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="iconName" className="font-mono text-xs uppercase tracking-widest text-secondary">
              Lucide Icon Name
            </Label>
            <Input
              id="iconName"
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className="bg-background border-border"
              placeholder="e.g. Shield, Cpu, Zap, Code"
              required
            />
            <p className="text-[10px] text-muted-foreground font-mono">Use any valid Lucide icon name.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="font-mono text-xs uppercase tracking-widest text-secondary">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border min-h-[100px]"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="features" className="font-mono text-xs uppercase tracking-widest text-secondary">
              Features (One per line)
            </Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="bg-background border-border min-h-[100px]"
              placeholder="Feature 1\nFeature 2..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="order" className="font-mono text-xs uppercase tracking-widest text-secondary">
                Order
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="active" className="font-mono text-xs uppercase tracking-widest text-secondary">
                Status
              </Label>
              <select
                id="active"
                value={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary text-background hover:bg-primary/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
