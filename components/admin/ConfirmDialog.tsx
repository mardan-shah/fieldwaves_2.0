"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description?: string
  variant?: "danger" | "warning"
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  variant = "danger",
}: ConfirmDialogProps) {
  const accentColor = variant === "danger" ? "#ef4444" : "#FF5F1F"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#141414] border border-[#333] rounded-none max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="font-display text-lg font-bold tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="font-mono text-sm text-[#B0B0B0]">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="bg-[#0a0a0a] border border-[#333] text-[#B0B0B0] hover:bg-[#1a1a1a] hover:text-white rounded-none font-mono text-xs tracking-wider">
            CANCEL
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="border-none rounded-none font-mono text-xs tracking-wider font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            CONFIRM
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
