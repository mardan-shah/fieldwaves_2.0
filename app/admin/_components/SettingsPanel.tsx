"use client"

import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import type { GlobalSettings, TeamMember, Project, CaseStudy, BlogPost } from "@/types"
import { Power, Crown, BarChart3, Shield, Star } from "lucide-react"
import { updateCasesDisplayCount, toggleSoloMode } from "@/app/actions/admin"
import { getSettings } from "@/app/actions/public"
import { toast } from "sonner"

interface SettingsPanelProps {
  initialSettings: GlobalSettings
  initialProjects: Project[]
  initialTeam: TeamMember[]
  initialCaseStudies: CaseStudy[]
  initialBlogPosts: BlogPost[]
}

function Toggle({ value, onChange, label, description }: { value: boolean; onChange: () => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <h3 className="font-bold text-sm">{label}</h3>
        <p className="text-xs text-secondary max-w-sm">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 transition-colors duration-200 shrink-0 ${
          value ? "bg-primary" : "bg-border"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-200 ${
            value ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPanel({ initialSettings, initialProjects, initialTeam, initialCaseStudies, initialBlogPosts }: SettingsPanelProps) {
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings)
  const projects = initialProjects
  const team = initialTeam
  const caseStudies = initialCaseStudies
  const blogPosts = initialBlogPosts
  const owner = team.find(m => m.isOwner)
  const [displayCount, setDisplayCount] = useState(String(settings.casesDisplayCount ?? 3))

  const onToggleSoloMode = async () => {
    const newState = !settings.soloMode
    setSettings({ ...settings, soloMode: newState })
    await toggleSoloMode()
    toast.success(`SOLO_MODE: ${newState ? "ENABLED" : "DISABLED"}`)
    const s = await getSettings()
    if (s) setSettings(s)
  }

  const handleDisplayCountChange = async (value: string) => {
    setDisplayCount(value)
    const num = parseInt(value)
    if (isNaN(num) || num < 1 || num > 50) return

    const result = await updateCasesDisplayCount(num)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`CASES_DISPLAY_COUNT: ${num}`)
    const s = await getSettings()
    if (s) setSettings(s)
  }

  const featuredProjects = projects.filter(p => p.featured).length
  const featuredCases = caseStudies.filter(c => c.featured).length
  const featuredPosts = blogPosts.filter(p => p.featured).length

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Display Toggles */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Power className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">DISPLAY_CONFIG</h2>
          </div>

          <SkewContainer variant="glass" className="p-6 border-t-2 border-t-primary">
            <Toggle
              value={settings.soloMode}
              onChange={onToggleSoloMode}
              label="SOLO MODE"
              description="Show only the owner on the team page. Useful for solo developers."
            />
            <Toggle
              value={settings.maintenanceMode || false}
              onChange={() => toast.error("Maintenance mode toggle coming soon")}
              label="MAINTENANCE MODE"
              description="Show a maintenance page to all visitors. Admin panel remains accessible."
            />
          </SkewContainer>
        </section>

        {/* Content Display */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">CONTENT_DISPLAY</h2>
          </div>

          <SkewContainer variant="glass" className="p-6 border-t-2 border-t-primary">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">CASES_PER_PAGE</label>
                <p className="text-xs text-muted mb-2">Number of case studies shown on the /cases landing page.</p>
                <input
                  type="number"
                  value={displayCount}
                  onChange={(e) => handleDisplayCountChange(e.target.value)}
                  min={1}
                  max={50}
                  className="w-24 bg-input border border-border focus:border-primary text-white p-2 text-sm font-mono outline-none text-center"
                />
              </div>
            </div>
          </SkewContainer>
        </section>

        {/* Security Info */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">SECURITY</h2>
          </div>

          <SkewContainer variant="glass" className="p-6 border-t-2 border-t-primary">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-mono text-xs text-secondary">AUTH_METHOD</span>
                <span className="font-mono text-xs text-white">BCRYPT + HMAC COOKIES</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-mono text-xs text-secondary">RATE_LIMITING</span>
                <span className="font-mono text-xs text-white">5 ATTEMPTS / 15 MIN</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-mono text-xs text-secondary">CSRF_PROTECTION</span>
                <span className="font-mono text-xs text-green-400">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-mono text-xs text-secondary">SESSION_EXPIRY</span>
                <span className="font-mono text-xs text-white">24 HOURS</span>
              </div>
            </div>
          </SkewContainer>
        </section>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* System Stats */}
        <section>
          <h2 className="font-mono font-bold text-lg tracking-wider mb-6">SYSTEM_STATS</h2>
          <div className="grid grid-cols-2 gap-3">
            <SkewContainer variant="glass" className="p-4 text-center">
              <p className="font-mono text-[10px] text-secondary tracking-widest mb-1">PROJECTS</p>
              <p className="font-display text-2xl font-bold">{projects.length}</p>
            </SkewContainer>
            <SkewContainer variant="glass" className="p-4 text-center">
              <p className="font-mono text-[10px] text-secondary tracking-widest mb-1">TEAM</p>
              <p className="font-display text-2xl font-bold">{team.length}</p>
            </SkewContainer>
            <SkewContainer variant="glass" className="p-4 text-center">
              <p className="font-mono text-[10px] text-secondary tracking-widest mb-1">CASES</p>
              <p className="font-display text-2xl font-bold">{caseStudies.length}</p>
              <p className="font-mono text-[10px] text-muted">
                {caseStudies.filter(c => c.published).length} live / {caseStudies.filter(c => !c.published).length} draft
              </p>
            </SkewContainer>
            <SkewContainer variant="glass" className="p-4 text-center">
              <p className="font-mono text-[10px] text-secondary tracking-widest mb-1">BLOG</p>
              <p className="font-display text-2xl font-bold">{blogPosts.length}</p>
              <p className="font-mono text-[10px] text-muted">
                {blogPosts.filter(p => p.published).length} live / {blogPosts.filter(p => !p.published).length} draft
              </p>
            </SkewContainer>
          </div>
        </section>

        {/* Featured Summary */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-primary" />
            <h2 className="font-mono font-bold text-lg tracking-wider">FEATURED_CONTENT</h2>
          </div>

          <SkewContainer variant="glass" className="p-6 border-t-2 border-t-primary">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-mono text-xs text-secondary">FEATURED PROJECTS</span>
                <span className={`font-mono text-xs font-bold ${featuredProjects > 0 ? "text-primary" : "text-muted"}`}>
                  {featuredProjects}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="font-mono text-xs text-secondary">FEATURED CASES</span>
                <span className={`font-mono text-xs font-bold ${featuredCases > 0 ? "text-primary" : "text-muted"}`}>
                  {featuredCases}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-mono text-xs text-secondary">FEATURED POSTS</span>
                <span className={`font-mono text-xs font-bold ${featuredPosts > 0 ? "text-primary" : "text-muted"}`}>
                  {featuredPosts}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted mt-4 font-mono">
              Featured content appears in &quot;Top Picks&quot; sections on landing pages. Toggle featured status from each section&apos;s list view.
            </p>
          </SkewContainer>
        </section>

        {/* Owner Info */}
        {owner && (
          <section>
            <h2 className="font-mono font-bold text-lg tracking-wider mb-6">OWNER</h2>
            <SkewContainer variant="glass" className="p-6 border-t-2 border-t-primary">
              <div className="flex items-center gap-4">
                {owner.avatarUrl && (
                  <div className="w-14 h-14 border border-border overflow-hidden shrink-0">
                    <img src={owner.avatarUrl} alt={owner.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={14} className="text-primary" />
                    <h3 className="font-bold">{owner.name}</h3>
                  </div>
                  <p className="font-mono text-xs text-primary">{owner.role}</p>
                </div>
              </div>
            </SkewContainer>
          </section>
        )}

        {/* Mode Status */}
        <section>
          <SkewContainer variant="glass" className="p-4 text-center">
            <p className="font-mono text-[10px] text-secondary tracking-widest mb-1">ACTIVE_MODE</p>
            <p className="font-mono text-lg font-bold text-primary">
              {settings.soloMode ? "SOLO" : "PUBLIC"}
            </p>
          </SkewContainer>
        </section>
      </div>
    </div>
  )
}
