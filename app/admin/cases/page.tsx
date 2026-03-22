import { getAllCaseStudies } from "@/app/actions/admin"
import type { iCaseStudy } from "@/types"
import CaseStudiesView from "../_components/CaseStudiesView"
import { connection } from "next/server"

export default async function AdminCasesPage() {
  await connection()
  const caseStudies = await getAllCaseStudies()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">CASE STUDIES</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">PORTFOLIO // MANAGE CASE STUDIES</p>
      </div>
      <CaseStudiesView initialCaseStudies={caseStudies as iCaseStudy[]} />
    </div>
  )
}
