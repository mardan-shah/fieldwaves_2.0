import { getSession } from "@/lib/session"
import { checkAdminExists } from "../actions/admin"
import AdminLoginForm from "./_components/AdminLoginForm"
import AdminSidebar from "./_components/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    const { exists } = await checkAdminExists()
    return <AdminLoginForm needsSetup={!exists} />
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-6 pt-16 lg:pt-6 md:p-10 lg:p-12 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
