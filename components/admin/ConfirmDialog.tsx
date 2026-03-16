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
  const accentColor = variant === "danger" ? "var(--destructive)" : "var(--primary)"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border border-border rounded-none max-w-md" aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle
            className="font-display text-lg font-bold tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="font-mono text-sm text-secondary">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="bg-input border border-border text-secondary hover:bg-background hover:text-white rounded-none font-mono text-xs tracking-wider">
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
