"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Container from "@/components/ui/Container"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BookOpen,
  FileText,
  LayoutGrid,
  BarChart3,
  Settings,
  Terminal,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { logoutAdmin } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

const NAV_ITEMS = [
  { href: "/admin", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/admin/projects", label: "PROJECTS", icon: FolderKanban },
  { href: "/admin/team", label: "TEAM", icon: Users },
  { href: "/admin/cases", label: "CASES", icon: BookOpen },
  { href: "/admin/blog", label: "BLOG", icon: FileText },
  { href: "/admin/services", label: "SERVICES", icon: LayoutGrid },
  { href: "/admin/analytics", label: "ANALYTICS", icon: BarChart3 },
  { href: "/admin/settings", label: "SETTINGS", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin")
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <Terminal className="text-primary" size={24} />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">CMD_CENTER</h1>
            <p className="font-mono text-[10px] text-muted tracking-widest">ADMIN // ACTIVE</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div
                className={`flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-wider transition-all duration-200 border-l-2 ${
                  active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-muted hover:text-white hover:border-border hover:bg-card/50"
                }`}
              >
                <Icon size={16} />
                <span className="font-bold">{label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Container variant="ghost" className="px-4 py-2 w-full" hoverEffect>
            <span className="font-mono text-[10px] tracking-widest text-muted">VIEW_SITE</span>
          </Container>
        </Link>
        <button onClick={handleLogout} className="w-full mt-2">
          <Container variant="ghost" className="px-4 py-2 w-full" hoverEffect>
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted">
              <LogOut size={12} />
              LOGOUT
            </span>
          </Container>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card border border-border p-2 text-white"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {navContent}
      </aside>
    </>
  )
}
