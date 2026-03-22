import { getProjects } from "@/app/actions/public"
import type { iProject } from "@/types"
import ProjectsView from "../_components/ProjectsView"
import { connection } from "next/server"

export default async function AdminProjectsPage() {
  await connection()
  const projects = await getProjects()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">PROJECTS</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">MANAGE // CREATE, EDIT, DELETE</p>
      </div>
      <ProjectsView initialProjects={projects as iProject[]} />
    </div>
  )
}
