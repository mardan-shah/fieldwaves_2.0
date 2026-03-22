import AnalyticsView from "../_components/AnalyticsView"
import { connection } from "next/server"

export default async function AdminAnalyticsPage() {
  await connection()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">ANALYTICS</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">METRICS // TRAFFIC & ENGAGEMENT</p>
      </div>
      <AnalyticsView />
    </div>
  )
}
