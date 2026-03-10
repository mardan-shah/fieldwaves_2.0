"use client"

import { Trash2, Pencil, Crown, ChevronUp, ChevronDown } from "lucide-react"
import type { TeamMember } from "@/types"

interface TeamListProps {
  team: TeamMember[]
  onDelete: (id: string) => void
  onEdit?: (member: TeamMember) => void
  onReorder?: (id: string, direction: "up" | "down") => void
}

export default function TeamList({ team, onDelete, onEdit, onReorder }: TeamListProps) {
  if (team.length === 0) {
    return (
      <div className="bg-input border border-border p-8 text-center">
        <p className="font-mono text-muted">NO_TEAM_MEMBERS_DEPLOYED</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {team.map((member, i) => (
        <div key={member._id} className="relative group bg-input border border-border p-4 flex gap-4 items-center -skew-x-12">

          {/* Reorder */}
          {onReorder && (
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => onReorder(member._id, "up")}
                disabled={i === 0}
                className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => onReorder(member._id, "down")}
                disabled={i === team.length - 1}
                className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}

          {/* Avatar Preview */}
          <div
            className="w-16 h-16 shrink-0 relative overflow-hidden border border-border"
            style={{ backgroundColor: member.backgroundColor || 'transparent' }}
          >
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white truncate">{member.name}</h3>
              {member.isOwner && (
                <span className="flex items-center gap-1 bg-primary/20 text-primary text-[10px] font-mono font-bold px-1.5 py-0.5 tracking-wider shrink-0">
                  <Crown size={10} />
                  OWNER
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-primary truncate">{member.role}</p>
            <p className="text-[10px] font-mono text-muted">ORDER: {member.order || 0}</p>
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(member)}
                className="p-2 bg-primary/10 text-primary hover:bg-primary/30 transition-colors"
                title="EDIT MEMBER"
              >
                <Pencil size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(member._id)}
              className="p-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors"
              title="DELETE MEMBER"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
