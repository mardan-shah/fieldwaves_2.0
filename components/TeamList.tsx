"use client"

import { Trash2 } from "lucide-react"

interface TeamMember {
  _id: string
  name: string
  role: string
  avatarUrl: string
  backgroundColor?: string
}

interface TeamListProps {
  team: TeamMember[]
  onDelete: (id: string) => void
}

export default function TeamList({ team, onDelete }: TeamListProps) {
  if (team.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-[#333] p-8 text-center">
        <p className="font-mono text-[#666]">NO_TEAM_MEMBERS_DEPLOYED</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {team.map((member) => (
        <div key={member._id} className="relative group bg-[#0a0a0a] border border-[#333] p-4 flex gap-4 items-center -skew-x-12">
          
          {/* Avatar Preview */}
          <div 
            className="w-16 h-16 shrink-0 relative overflow-hidden border border-[#333]"
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
            <h3 className="font-bold text-white truncate">{member.name}</h3>
            <p className="text-xs font-mono text-[#FF5F1F] truncate">{member.role}</p>
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDelete(member._id)}
              className="p-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded transition-colors"
              title="DELETE MEMBER"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
