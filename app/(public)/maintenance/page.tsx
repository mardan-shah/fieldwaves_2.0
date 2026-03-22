import { Terminal, AlertTriangle, Construction } from "lucide-react"
import Container from "@/components/ui/Container"
import { getSettings } from "@/app/actions/public"
import GridBackground from "@/components/ui/GridBackground"
import { connection } from "next/server"

export default async function MaintenancePage() {
  await connection()
  const settings = await getSettings()
  const message = settings?.maintenanceMessage || "We're currently performing scheduled infrastructure upgrades to improve performance and security. Our systems will be back online shortly."
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid */}
            <GridBackground />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary transform  opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform  opacity-50" />

      <div className="relative z-10 max-w-2xl w-full">
        <Container variant="glass" className="p-12 border-t-4 border-t-primary relative overflow-hidden">
          <div className="absolute top-2 right-4 font-mono text-[10px] text-primary/40 animate-pulse">
            SYSTM_STATUS: DOWN // CODE_RED
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            <div className="bg-primary/10 p-6  border border-primary/20">
              <Construction size={64} className="text-primary animate-bounce " />
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
                System <br />
                <span className="text-primary">Maintenance</span>
              </h1>
              <p className="font-mono text-xs text-secondary tracking-[0.2em] uppercase">
                Status: Re-Engineering in progress
              </p>
            </div>

            <div className="w-full h-px bg-border relative">
              <div className="absolute inset-0 bg-primary/50 w-1/3 animate-slide" />
            </div>

            <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">
              {message}
            </p>

            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest bg-input/50 px-4 py-2 border border-border">
              <Terminal size={14} className="text-primary" />
              <span>Retry connection in: 00:59:59</span>
            </div>
          </div>
        </Container>

        <div className="mt-8 flex justify-center">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-primary animate-pulse" />
            <div className="w-2 h-2 bg-primary/60 animate-pulse delay-75" />
            <div className="w-2 h-2 bg-primary/30 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  )
}
