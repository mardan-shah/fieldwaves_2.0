import { getAdminServices } from "@/app/actions/admin"
import ServicesView from "../_components/ServicesView"
import { connection } from "next/server"

export default async function AdminServicesPage() {
  await connection()
  const services = await getAdminServices()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider">SERVICES</h1>
        <p className="font-mono text-xs text-muted tracking-widest mt-2">OFFERINGS // MANAGE SERVICE CARDS</p>
      </div>
      <ServicesView initialServices={services} />
    </div>
  )
}
