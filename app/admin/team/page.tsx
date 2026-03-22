import { getAllTeamMembers } from "@/app/actions/admin"
import type { iTeamMember } from "@/types"
import TeamView from "../_components/TeamView"
import { connection } from "next/server"

export default async function AdminTeamPage() {
  await connection()
  const team = await getAllTeamMembers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">TEAM</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">PERSONNEL // MANAGE TEAM MEMBERS</p>
      </div>
      <TeamView initialTeam={team as iTeamMember[]} />
    </div>
  )
}
