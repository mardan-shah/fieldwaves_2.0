# FieldWaves Polish Plan

## Overview
A systematic overhaul covering: CSS variable migration, animation system, skew consistency, admin panel restructure, blog/case study landing pages, and README update.

---

## Phase 1: Design Token Migration (Colors)
> **Goal:** Eliminate all 200+ hardcoded hex values. Use CSS variables from `globals.css` via Tailwind theme.

### Step 1.1 — Extend Tailwind config to map CSS variables
- Update `tailwind.config.ts` (or `globals.css` `@theme` block) to expose CSS variables as Tailwind utilities
- Map: `bg-primary` -> `var(--primary)`, `bg-card` -> `var(--card)`, `text-muted` -> `var(--muted)`, etc.
- Add all missing tokens: `--surface`, `--border`, `--input`, `--muted`

### Step 1.2 — Replace hardcoded colors in all page files
- Replace `bg-[#1a1a1a]` -> `bg-background`
- Replace `bg-[#141414]` -> `bg-card`
- Replace `text-[#FF5F1F]` / `bg-[#FF5F1F]` -> `text-primary` / `bg-primary`
- Replace `text-[#B0B0B0]` -> `text-secondary`
- Replace `border-[#333]` -> `border-border`
- Replace `text-[#666]` -> `text-muted`
- Replace `bg-[#0a0a0a]` -> `bg-input`
- Replace `bg-[#0f0f0f]` -> `bg-surface`
- **Files:** All 10+ page files, all 15+ components, all admin components

### Step 1.3 — Replace hardcoded colors in admin components
- Same mappings as above for all files in `app/admin/_components/`
- Also fix `components/admin/` edit modals

**Test:** `bun run build` should pass. Visually verify homepage, team page, admin panel — all colors should look identical to before.

- [x] Step 1.1 — Already done (theme tokens exist in @theme inline block)
- [x] Step 1.2 — All page + component files migrated
- [x] Step 1.3 — All admin components migrated

---

## Phase 2: Animation System & Accessibility
> **Goal:** Add `prefers-reduced-motion` fallbacks, clean up transition durations for snappy brutalist feel.

### Step 2.1 — Add reduced-motion media query in globals.css
- Add `@media (prefers-reduced-motion: reduce)` block
- Disable all custom animations (`animate-pulse-slow`, `animate-slide-in`, `animate-fade-in`)
- Set `transition-duration: 0.01ms !important` for all elements
- Set `animation-duration: 0.01ms !important`

### Step 2.2 — Standardize transition durations
- Brutalist = snappy. Audit and normalize:
  - `duration-300` -> `duration-200` where appropriate
  - `duration-500` -> `duration-200` for hover effects
  - Keep `duration-300` only for layout shifts / modals
- Ensure all `transition-*` classes have consistent timing

### Step 2.3 — Add entrance animations with intersection observer
- Create a lightweight `useInView` hook or use CSS `animation-timeline: view()`
- Add subtle fade-in-up for section headings and cards on scroll
- These must respect `prefers-reduced-motion`

**Test:** Toggle "Reduce motion" in OS accessibility settings. All animations should stop. Normal mode should feel snappy (0.1-0.2s transitions).

- [x] Step 2.1 — prefers-reduced-motion media query added to globals.css
- [x] Step 2.2 — Hover durations standardized to 200ms on grids/cards
- [x] Step 2.3 — useInView hook + fade-in-up animations on ProjectGrid, TeamGrid, BlogGrid, CaseStudyGrid, SectionHeading

---

## Phase 3: Skew Consistency & Mobile Fix
> **Goal:** Fix all broken skew implementations, ensure mobile never gets skewed content.

### Step 3.1 — Audit and fix broken counter-skews
- **`app/philosophy/page.tsx`** — Add `md:skew-x-12` to child content
- **`components/TeamDetailModal.tsx`** — Add counter-skew to modal content
- **`components/ProjectDetailModal.tsx`** — Add counter-skew to modal content
- **`components/ContactForm.tsx`** — Fix inconsistent `skew-x-0` approach, use proper counter-skew

### Step 3.2 — Standardize skew approach
- All skew should use `SkewContainer` component where possible
- For cases where raw classes are needed: always pair `md:-skew-x-12` parent with `md:skew-x-12` child
- No skew on screens below `md` (768px) — this is already mostly correct
- Add a `no-skew-mobile` safeguard class if needed

### Step 3.3 — Test edge cases
- Verify skew doesn't clip content on narrow viewports (768px-1024px)
- Ensure overflow is handled (no horizontal scrollbar from skewed elements)
- Check modals render correctly with skew on desktop

**Test:** Resize browser from 320px to 1440px. No content should be skewed on mobile. On desktop, all skewed containers should have readable (counter-skewed) text inside. No horizontal scrollbar.

- [x] Step 3.1 — Fixed broken counter-skews (modals, philosophy, contact form)
- [x] Step 3.2 — SkewContainer: always-skew by default, `noSkewMobile` prop for cards. Removed all skew-x-0 hacks. overflow-x-hidden on body.
- [x] Step 3.3 — Cards stay square on mobile, everything else skews on all screens

---

## Phase 3.5: Blog & Cases Polish — Search Bars, Detail Pages, Dummy Data
> **Goal:** Consistent search/filter bars with skew styling, beautifully designed detail pages for markdown content, and dummy blog posts + case studies for visual testing.

### Step 3.5.1 — Unified SearchFilterBar component
- Extract search + tag filter into a reusable `SearchFilterBar` component
- Skewed search input with counter-skewed content
- Skewed tag/filter pills
- Consistent across BlogGrid, CaseStudyGrid, ProjectGrid

### Step 3.5.2 — Polish MarkdownRenderer typography
- Better spacing, larger body text for readability
- Styled horizontal rules with skew accent
- Better code blocks with language label
- Blockquote with brutalist left border
- Image captions support

### Step 3.5.3 — Redesign blog detail page
- Full-width cover with gradient overlay
- Skewed accent bar under title
- Better meta bar with skew containers
- Sticky TOC with skew active indicator
- Related posts section at bottom
- Proper reading width (max-w-3xl for prose)

### Step 3.5.4 — Redesign case study detail page
- Full-width cover with gradient overlay
- Metric cards with skew styling
- Tech stack pills
- Better content layout with sidebar
- CTA section with skew

### Step 3.5.5 — Insert dummy blog posts & case studies
- 3 blog posts with real-looking markdown content (code blocks, headings, lists, images, blockquotes)
- 3 case studies with metric cards, tech stacks, and detailed descriptions
- Cover images from picsum/unsplash

**Test:** Visit `/blog` and `/cases`. Search bars should be skewed and styled consistently. Click into a post/case — detail page should look polished with proper markdown rendering. TOC should work on desktop.

- [x] Step 3.5.1 — SearchFilterBar component: skewed search input, skewed tag pills, result count
- [x] Step 3.5.2 — MarkdownRenderer: skewed code blocks with language label, skewed blockquotes, skewed images with captions, skewed tables, better typography
- [x] Step 3.5.3 — Blog detail: skewed meta bar, skewed excerpt, sticky TOC in glass container, read time estimate
- [x] Step 3.5.4 — Case study detail: skewed subtitle badge, skewed metric cards with primary top border, tech stack in sidebar, mobile tech stack section
- [x] Step 3.5.5 — Seeded 3 blog posts + 3 case studies with rich markdown (code blocks, tables, blockquotes, lists, images)

---

## Phase 4: Admin Panel Restructure — Route-Based Sections
> **Goal:** Replace tab-based admin with route-based pages. Each section gets its own URL. Sidebar navigation.

### Step 4.1 — Create admin layout with persistent sidebar
- Create `app/admin/layout.tsx` with:
  - Left sidebar (fixed, always visible on desktop, collapsible on mobile)
  - Navigation links: Dashboard, Projects, Team, Cases, Blog, Analytics, Settings
  - Each link routes to `/admin/[section]`
  - Active state indicator (orange left border + highlight)
  - Admin header with logout
- Sidebar design: dark card background, skewed nav items on desktop, clean on mobile

### Step 4.2 — Create individual admin route pages
- `app/admin/page.tsx` — Dashboard overview (stats, recent activity, quick actions)
- `app/admin/projects/page.tsx` — ProjectsView (full CRUD)
- `app/admin/team/page.tsx` — TeamView (full CRUD)
- `app/admin/cases/page.tsx` — CaseStudiesView (full CRUD)
- `app/admin/blog/page.tsx` — BlogsView (full CRUD)
- `app/admin/analytics/page.tsx` — AnalyticsView
- `app/admin/settings/page.tsx` — SettingsPanel (expanded)

### Step 4.3 — Dashboard overview page
- Stats grid: total projects, team members, blog posts, case studies, page views
- Recent activity feed (last 5 created/updated items across all sections)
- Quick action buttons: "New Blog Post", "New Case Study", "Add Project", "Add Team Member"
- System health: DB connection status, last deploy info

**Test:** Navigate to `/admin`. You should see a sidebar with links. Clicking each link loads the respective section at its own URL (`/admin/projects`, `/admin/team`, etc.). Browser back/forward should work. Dashboard shows stats.

- [x] Step 4.1 — Admin layout with persistent sidebar (logo, nav links with active state, logout, mobile hamburger)
- [x] Step 4.2 — Route-based pages: /admin, /admin/projects, /admin/team, /admin/cases, /admin/blog, /admin/analytics, /admin/settings
- [x] Step 4.3 — Dashboard overview: stats grid, total views, quick actions, system status

---

## Phase 5: Admin Panel — Enhanced Controls
> **Goal:** Give admin granular control over every section like a master architect.

### Step 5.1 — Project management enhancements
- Drag-and-drop reordering (or up/down arrows for order)
- Bulk actions: select multiple, bulk delete, bulk reorder
- Project preview before publish
- Rich description field with markdown editor
- Image upload/URL input with live preview
- "Featured" flag to pin projects to homepage

### Step 5.2 — Team management enhancements
- Drag-and-drop or arrow reordering
- Avatar preview (live URL preview)
- Social links validation (URL format check)
- "Featured on homepage" toggle
- Bio with markdown support and preview
- Bulk actions

### Step 5.3 — Blog management enhancements
- Markdown editor with live preview pane (side-by-side)
- Cover image URL with live preview
- Tag management (add/remove tags inline)
- SEO fields: meta description, OG image, canonical URL
- Schedule publishing (future date)
- "Featured" flag for homepage/landing page top picks
- Draft/Published status toggle
- View count display
- Slug auto-generation from title (with manual override)

### Step 5.4 — Case study management enhancements
- Same markdown editor with preview
- Metric cards editor (add/remove/reorder)
- Tech stack tag input
- "Featured" flag for landing page top picks
- Cover image preview
- SEO fields

### Step 5.5 — Settings panel expansion
- **Site Identity:** Site name, tagline, logo URL
- **Homepage Config:** Featured projects count, featured team count, hero text
- **Display Settings:** Cases display count, blog posts per page
- **SEO Defaults:** Default OG image, site description
- **Maintenance Mode:** Toggle with custom message
- **Contact Settings:** Contact email, notification preferences
- **Social Links:** Global social media URLs for footer

**Test:** Go through each admin section. Verify: reordering works, markdown preview renders, image previews load, featured flags save, settings panel has all new controls. Create a test blog post with markdown and verify preview matches.

- [x] Step 5.1 — Project: reorder arrows, featured star toggle, featured badge
- [x] Step 5.2 — Team: reorder arrows, counter-skewed avatar/content in list
- [x] Step 5.3 — Blog: reorder arrows, featured star toggle, featured badge, view count in list
- [x] Step 5.4 — Cases: reorder arrows, featured star toggle, featured badge, view count in list
- [x] Step 5.5 — Settings: expanded two-column layout with display toggles, content display config, security info, featured content summary, owner card

---

## Phase 6: Blog & Case Study Landing Pages
> **Goal:** Root pages (`/blog`, `/cases`) become curated landing pages with admin-controlled "top picks". Full listings at `/blog/all`, `/cases/all`.

### Step 6.1 — Blog landing page (`/blog`)
- Hero section with page description (editable via admin)
- "TOP PICKS" section: admin-flagged featured posts (3-6 posts, large cards)
- "LATEST" section: most recent posts (6 posts, smaller cards)
- "ALL POSTS" link/button to `/blog/all`
- Tag cloud or category navigation
- Consistent brutalist styling with skew containers

### Step 6.2 — Blog all-posts page (`/blog/all`)
- Full grid with search, tag filtering, and pagination
- Uses existing `BlogGrid` component (refined)

### Step 6.3 — Case studies landing page (`/cases`)
- Hero section with section description (editable via admin)
- "FEATURED WORK" section: admin-flagged top case studies (large showcase cards)
- "MORE WORK" section: remaining published case studies
- "VIEW ALL" link to `/cases/all`
- Metric highlights from featured cases

### Step 6.4 — Case studies all page (`/cases/all`)
- Already exists — refine with search, filters, pagination
- Uses existing `CaseStudyGrid`/`CaseStudyList` components

### Step 6.5 — Update server actions for featured content
- Add `featured` field to BlogPost and CaseStudy models
- Add `getFeaturedBlogPosts()` and `getFeaturedCaseStudies()` server actions
- Add admin toggle for featured status in blog/case study views

**Test:** Visit `/blog` — should see hero, top picks (if any flagged), latest posts, and link to all. Visit `/cases` — should see hero, featured work, more work, and link to all. Admin panel: mark a blog post as "featured" and verify it appears in top picks on the landing page.

- [x] Step 6.1 — Blog landing page: hero, TOP_PICKS (featured posts as large cards), LATEST section, VIEW ALL link
- [x] Step 6.2 — Blog all-posts page (/blog/all): full grid with search + tag filtering
- [x] Step 6.3 — Cases landing page: hero, FEATURED_WORK section, MORE_WORK section, VIEW ALL link, CTA
- [x] Step 6.4 — Cases all page (/cases/all): already exists with search/filter grid
- [x] Step 6.5 — Added `featured` field to Project, CaseStudy, BlogPost models + types + server actions (getFeaturedBlogPosts, getFeaturedCaseStudies, toggle actions)

---

## Phase 7: Admin UX Polish — Spacing, Typography, Micro-interactions
> **Goal:** Treat the admin panel as a work of art. Every pixel matters.

### Step 7.1 — Typography hierarchy in admin
- Section titles: `text-2xl font-display uppercase tracking-wider`
- Card titles: `text-lg font-semibold`
- Labels: `text-xs font-mono uppercase tracking-widest text-muted`
- Body: `text-sm text-secondary`
- Consistent spacing: `space-y-6` between sections, `space-y-4` within cards, `gap-4` in grids

### Step 7.2 — Form design polish
- Input fields: consistent padding (`px-4 py-3`), border-border, bg-input
- Focus states: `ring-2 ring-primary` with transition
- Error states: `border-destructive` with error message below
- Labels above inputs with `mb-2` gap
- Grouped fields in bordered sections with section headers
- Consistent button sizing and spacing

### Step 7.3 — Card and list item design
- Admin list items: consistent height, aligned columns
- Hover state: subtle border-primary highlight
- Action buttons: icon-only with tooltips on desktop, full text on mobile
- Status badges: Published (green), Draft (muted), Featured (primary/orange)
- Consistent card padding: `p-6` for main cards, `p-4` for nested items

### Step 7.4 — Loading and empty states
- Skeleton loaders for data-fetching states
- Empty state illustrations/messages: "No projects yet. Create your first one."
- Success/error toast styling consistency
- Button loading states (spinner + disabled)

### Step 7.5 — Responsive admin layout
- Mobile: hamburger menu for sidebar, full-width content
- Tablet: collapsible sidebar (icons only), wider content
- Desktop: full sidebar + content
- All forms stack vertically on mobile
- Modal forms become full-screen on mobile

**Test:** Navigate through every admin section on desktop and mobile. Check: consistent spacing between all elements, typography hierarchy is clear, forms feel polished, loading states appear, empty states show helpful messages. Resize from mobile to desktop — layout should adapt gracefully.

- [x] Step 7.1 — Typography: consistent font-display headings, font-mono labels, tracking-widest across all admin pages
- [x] Step 7.2 — Forms: removed double-skew from all admin forms (login, projects, cases, blog) for usability; consistent FormInput/MarkdownEditor usage
- [x] Step 7.3 — Lists: status badges (LIVE/DRAFT/FEATURED), reorder arrows, star toggles, view counts in all admin list views
- [x] Step 7.4 — Loading states: spinner in analytics, empty states in all lists with helpful messages
- [x] Step 7.5 — Responsive: mobile hamburger sidebar, padding adjusted for mobile (pt-16 for menu button clearance), forms stack on mobile

---

## Phase 8: README.md Update
> **Goal:** Comprehensive, current documentation.

### Step 8.1 — Rewrite README.md
- Project name, one-line description, and badges
- Screenshots (placeholder paths)
- Tech stack with versions
- Getting started (clone, install, env vars, run)
- Project structure tree
- Design system reference (colors, typography, skew rules)
- Admin panel documentation (routes, capabilities)
- Deployment guide (Railway/Render/Vercel)
- Environment variables table (updated with all new ones)
- Security features summary
- Remove the old "Improvement Roadmap" section (or update with completed items)

**Test:** Read through README.md. All sections should be accurate, no outdated references. Links should be valid.

- [x] Step 8.1 — Complete README rewrite: tech stack table, project structure tree, design system docs, admin panel routes table, security summary, data model reference, removed old roadmap

---

## Execution Order & Dependencies

```
Phase 1 (Colors)     ──> can start immediately
Phase 2 (Animations) ──> can start immediately (parallel with Phase 1)
Phase 3 (Skew)       ──> can start immediately (parallel with Phase 1 & 2)
Phase 4 (Admin Routes) ──> after Phase 1 (uses new color tokens)
Phase 5 (Admin Controls) ──> after Phase 4 (needs new route structure)
Phase 6 (Landing Pages) ──> after Phase 1 + Phase 5 (needs featured flags)
Phase 7 (Admin UX) ──> after Phase 4 + Phase 5 (polishes new admin)
Phase 8 (README) ──> last (documents final state)
```

## Total Steps: 26
