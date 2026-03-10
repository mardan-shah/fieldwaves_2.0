# FieldWaves

A portfolio/agency website with a full-featured admin panel. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and MongoDB.

**Industrial Brutalism** design system — parallelogram geometry, hard edges, no rounded corners.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router + Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Database | MongoDB (Mongoose 9) |
| Auth | bcrypt + HMAC-signed HTTP-only cookies |
| Email | Nodemailer (Gmail SMTP) + Resend fallback |
| Package Manager | Bun |
| Deployment | nixpacks (Railway/Render) |

## Quick Start

```bash
cp .env.example .env.local   # Configure environment variables
bun install                   # Install dependencies
bun run dev                   # Start dev server (Turbopack)
bun run build                 # Production build
bun run lint                  # Lint
```

## Project Structure

```
app/
├── actions/
│   ├── admin.ts              Server actions: CRUD, auth, analytics, reorder, featured
│   └── public.ts             Server actions: reads, contact form, featured queries
├── admin/
│   ├── layout.tsx            Admin layout with sidebar + auth guard
│   ├── page.tsx              Dashboard overview (stats, quick actions)
│   ├── projects/page.tsx     Project management
│   ├── team/page.tsx         Team management
│   ├── cases/page.tsx        Case study management
│   ├── blog/page.tsx         Blog management
│   ├── analytics/page.tsx    Site analytics
│   ├── settings/page.tsx     Global settings
│   └── _components/          Admin UI components (views, sidebar, login)
├── blog/
│   ├── page.tsx              Blog landing (featured + latest)
│   ├── all/page.tsx          All posts (search + filter)
│   └── [slug]/page.tsx       Blog post detail (TOC, markdown)
├── cases/
│   ├── page.tsx              Cases landing (featured + more work)
│   ├── all/page.tsx          All cases (search + filter)
│   └── [slug]/page.tsx       Case study detail (metrics, TOC)
├── contact/page.tsx          Contact form
├── projects/page.tsx         Project grid
├── team/page.tsx             Team grid
├── services/page.tsx         Services
├── about/page.tsx            About
├── philosophy/page.tsx       Philosophy
└── privacy/page.tsx          Privacy policy
components/
├── ui/                       Primitives: SkewContainer, FormInput, MarkdownEditor, etc.
├── admin/                    Edit modals, confirm dialogs
├── BlogGrid.tsx              Blog card grid with search
├── CaseStudyCard.tsx         Case study showcase card
├── CaseStudyGrid.tsx         Case study grid with search
├── ProjectGrid.tsx           Project card grid
├── TeamGrid.tsx              Team member grid
├── SearchFilterBar.tsx       Unified search + tag filter
├── Navbar.tsx                Navigation bar
└── Footer.tsx                Site footer
lib/
├── models.ts                 Mongoose schemas (7 models)
├── db.ts                     MongoDB singleton connection
├── session.ts                HMAC-SHA256 signed cookie sessions
└── email-templates.ts        Branded HTML email builders
hooks/
└── use-in-view.ts            IntersectionObserver hook (respects prefers-reduced-motion)
types.ts                      Shared TypeScript interfaces
```

## Design System

CSS variables defined in `globals.css`, mapped to Tailwind via `@theme inline`:

- **Primary:** `var(--primary)` / `#FF5F1F` (orange)
- **Background:** `var(--background)` / `#1a1a1a`
- **Card:** `var(--card)` / `#141414`
- **Border:** `var(--border)` / `#333`

### Skew Rules

- All containers use `SkewContainer` component with `-skew-x-12` — content flows with the skew (no counter-skew)
- `noSkewMobile` prop: cards stay square on mobile, skew on desktop
- Small decorative elements (dots, lines, dividers) use standalone `-skew-x-12`

### Typography

- `font-display` — Bold uppercase headings
- `font-mono` — Labels, codes, status text
- All animations respect `prefers-reduced-motion`

## Admin Panel

Route-based admin at `/admin` with persistent sidebar navigation:

| Route | Purpose |
|---|---|
| `/admin` | Dashboard: stats, views, quick actions |
| `/admin/projects` | CRUD projects with screenshot upload, reorder, featured |
| `/admin/team` | CRUD team members with avatar upload, reorder |
| `/admin/cases` | CRUD case studies with markdown, metrics, cover images, featured |
| `/admin/blog` | CRUD blog posts with markdown preview, cover images, featured |
| `/admin/analytics` | Page views, daily chart, top pages/posts |
| `/admin/settings` | Solo mode, display count, security info, featured summary |

### Admin Features

- Reorder items with up/down arrows
- Toggle featured status (star icon) — featured items appear in "Top Picks"
- Markdown editor with live preview
- Image upload for projects, team, cases, blog
- Published/Draft toggle for cases and blog
- Search/filter in all list views
- Mobile sidebar with hamburger menu

## Security

- HMAC-SHA256 signed HTTP-only session cookies (24h expiry)
- Rate limiting: 5 auth attempts per 15-minute window
- CSRF protection via origin header verification
- Password complexity: uppercase, lowercase, digit, special character
- File uploads: type whitelist, 5MB max, UUID filenames
- Zod validation on all inputs with max length constraints
- Security headers in middleware
- All admin actions guarded with `requireAuth()`

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `GMAIL_USER` | Yes | Gmail address for SMTP |
| `GMAIL_APP_PASSWORD` | Yes | Gmail app password |
| `CONTACT_EMAIL` | Yes | Contact form destination |
| `RESEND_API_KEY` | No | Resend key for confirmation emails |
| `SESSION_SECRET` | No | Cookie signing secret (falls back to `MONGODB_URI`) |

## Data Model

- **Project** — title, liveUrl, screenshotUrl, techStack[], description, order, featured
- **TeamMember** — name, role, bio, socialLinks (Map), avatarUrl, order, isOwner
- **CaseStudy** — title, slug, subtitle, overview, description (markdown), coverImage, metricCards[], techStack[], published, featured, views
- **BlogPost** — title, slug, excerpt, content (markdown), coverImage, tags[], keywords[], author, published, featured, views
- **GlobalSettings** — soloMode, maintenanceMode, casesDisplayCount
- **PageView** — path, contentType, contentId, date, count
- **Admin** — email, passwordHash, isOwner
