"use client"

import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import TeamList from "@/components/TeamList"
import TeamMemberFormEnhanced from "@/components/TeamMemberFormEnhanced"
import EditTeamMemberModal from "@/components/admin/EditTeamMemberModal"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import type { TeamMember } from "@/types"
import { Users, Eye, Search } from "lucide-react"
import { toast } from "sonner"
import { addTeamMember, updateTeamMember, deleteTeamMember, getAllTeamMembers, reorderItem } from "@/app/actions/admin"

interface TeamViewProps {
  initialTeam: TeamMember[]
}

export default function TeamView({ initialTeam }: TeamViewProps) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit modal state
  const [editMember, setEditMember] = useState<TeamMember | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const refreshTeam = async () => {
    const updated = await getAllTeamMembers()
    setTeam(updated as TeamMember[])
  }

  const handleAddTeamMember = async (formData: FormData) => {
    setSubmitting(true)
    try {
      const result = await addTeamMember(formData)
      if (result.error) throw new Error(result.error)
      await refreshTeam()
      toast.success("TEAM_MEMBER_ADDED")
    } catch (err: any) {
      toast.error(err.message || "Failed to add team member")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditMember(member)
    setEditModalOpen(true)
  }

  const handleSaveMember = async (id: string, formData: FormData) => {
    const result = await updateTeamMember(id, formData)
    if (result.error) {
      toast.error(result.error)
      return
    }
    await refreshTeam()
    toast.success("MEMBER UPDATED")
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderItem("team", id, direction)
    await refreshTeam()
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const oldTeam = team
    setTeam(team.filter(m => m._id !== deleteTarget))
    setConfirmOpen(false)

    try {
      await deleteTeamMember(deleteTarget)
      await refreshTeam()
      toast.success("MEMBER_DELETED")
    } catch {
      setTeam(oldTeam)
      toast.error("Failed to delete member")
    }
    setDeleteTarget(null)
  }

  const filteredTeam = searchQuery
    ? team.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : team

  return (
    <>
      {/* Team List */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">ACTIVE_PERSONNEL</h2>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members..."
              className="w-full bg-input border border-border focus:border-primary text-white pl-10 pr-4 py-2.5 outline-none font-mono text-sm placeholder:text-muted transition-colors"
            />
          </div>
        </div>

        <TeamList
          team={filteredTeam}
          onDelete={handleDeleteClick}
          onEdit={handleEditMember}
          onReorder={handleReorder}
        />
      </section>

      {/* Add Team Member Form */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-primary" />
          <h2 className="font-mono font-bold text-lg tracking-wider">ADD_TEAM_MEMBER</h2>
        </div>

        <SkewContainer variant="outline" className="p-8 bg-card mx-6 md:mx-12 lg:mx-22">
          <TeamMemberFormEnhanced onSubmit={handleAddTeamMember} loading={submitting} />
        </SkewContainer>
      </section>

      {/* Edit Modal */}
      <EditTeamMemberModal
        member={editMember}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveMember}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="DELETE MEMBER?"
        description="This team member will be permanently removed from the roster."
        variant="danger"
      />
    </>
  )
}
