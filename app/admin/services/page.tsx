import { getAdminServices } from "@/app/actions/admin"
import ServicesView from "../_components/ServicesView"

export default async function AdminServicesPage() {
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
