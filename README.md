# FieldWaves

Portfolio/agency website built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and MongoDB.

## Quick Start

```bash
cp .env.example .env.local   # Configure environment variables
bun install                   # Install dependencies
bun run dev                   # Start dev server (Turbopack)
bun run build                 # Production build
bun run lint                  # Lint
```

## Architecture

- **Framework:** Next.js 16 App Router + Turbopack
- **Data:** MongoDB (Mongoose 9), no API routes — Server Actions only
- **Auth:** bcrypt-based admin auth via HTTP-only signed cookies (server-side sessions)
- **Email:** Nodemailer (Gmail SMTP) primary, Resend fallback
- **UI:** shadcn/ui + custom brutalist design system (parallelogram geometry, `-skew-x-12`)
- **Deployment:** nixpacks (Railway/Render)

### Key Directories

```
app/actions/admin.ts    Server actions for CRUD (projects, team, admin auth)
app/actions/public.ts   Server actions for reads + contact form
app/admin/              Admin dashboard (decomposed into _components/)
lib/models.ts           Mongoose schemas (Project, TeamMember, Admin, GlobalSettings)
lib/email-templates.ts  Branded HTML email builders
lib/db.ts               MongoDB singleton connection
components/admin/       Admin-specific components (modals, dialogs)
components/ui/          shadcn/ui primitives + custom form components
types.ts                Shared TypeScript interfaces
```

### Design System

- **Primary:** `#FF5F1F` (orange) | **Secondary:** `#B0B0B0` | **BG:** `#1a1a1a` / `#141414`
- All containers use `-skew-x-12` with inner `skew-x-12` for legibility
- Hard 1-2px borders, no rounded corners, no soft shadows
- `font-display` for headings, `font-mono` for labels

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `GMAIL_USER` | Yes | Gmail address for SMTP |
| `GMAIL_APP_PASSWORD` | Yes | Gmail app password ([generate here](https://myaccount.google.com/apppasswords)) |
| `CONTACT_EMAIL` | Yes | Where contact form submissions are sent |
| `RESEND_API_KEY` | No | Resend key for branded confirmation emails |
| `SESSION_SECRET` | No | Cookie signing secret (falls back to `MONGODB_URI`) |

## Security Measures

- **Server-side sessions** via HMAC-signed HTTP-only cookies (no client-side spoofing)
- **Rate limiting** on auth endpoints (5 attempts per 15-minute window per email)
- **CSRF protection** via origin header verification in middleware
- **Password complexity** enforcement (uppercase, lowercase, number, special character required)
- File uploads validated: type whitelist (JPEG/PNG/WebP/GIF/SVG), 5MB max, UUID filenames
- All admin server actions protected with session auth guards
- All user input in emails is HTML-escaped to prevent injection
- Zod validation with max length constraints on all inputs
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- Error messages sanitized before sending to client
- `.env*` files excluded from git via `.gitignore`
- TypeScript strict mode enabled (no `ignoreBuildErrors`)
- Public pages are Server Components (SSR for SEO, no client-side data fetching)

---

## What's Still Missing (Improvement Roadmap)

### High Priority

1. **Password reset flow** — No way to recover/change the admin password once created. Need email-based reset or a CLI reset command.

### Medium Priority

2. **Maintenance mode implementation** — `GlobalSettings.maintenanceMode` exists in the schema but is never checked. Need middleware or layout-level guard that returns a 503 page.

9. **Drag-and-drop reordering** — Projects and team members have an `order` field but reordering is manual (type a number). Add drag-and-drop with `@dnd-kit/core`.

10. **SEO: per-page metadata + Open Graph** — Only root layout has metadata. Each page (`/projects`, `/team`, `/about`, etc.) needs its own `title`, `description`, `og:image`.

11. **Sitemap + robots.txt** — Missing `app/sitemap.ts` and `app/robots.ts` for search engine crawling.

12. **Structured data (JSON-LD)** — No Schema.org markup for Organization, Person, or CreativeWork. Hurts rich snippet appearance.

13. **Image optimization** — `images.unoptimized: true` disables Next.js image optimization. Should use `next/image` with proper `remotePatterns` config.

14. **Pagination** — Project/team lists load everything at once. Will degrade with 50+ items. Add cursor-based pagination or at least a "load more" pattern.

15. **Activity/audit logging** — No record of who did what. Admin actions (create/edit/delete) should be logged with timestamp and actor.

16. **Social link URL validation** — Social links in team member forms accept any string. Should validate URLs match expected platform patterns.

17. **Contact form: persist submissions to DB** — Submissions are only emailed. If email fails, the lead is lost. Store in a `ContactSubmission` model as backup.

18. **Admin: bulk operations** — No way to delete multiple projects/members at once, or bulk update order.

### Low Priority

19. **Dark/light theme toggle** — Currently hardcoded dark theme. Not a priority for brutalist design, but accessibility-wise a high-contrast light option would help.

20. **Animations/transitions** — Page transitions are abrupt. Could add subtle enter animations with Framer Motion on route changes.

21. **Project detail pages** — `/projects` only shows a grid. No individual project page (`/projects/[slug]`) with full description, gallery, case study.

22. **Blog/case studies section** — `/cases` page exists but likely has placeholder content. A proper Markdown/MDX blog system would add content marketing value.

23. **Analytics dashboard in admin** — Show page views, contact form conversion rate, popular projects. Could integrate with Vercel Analytics API.

24. **Multi-admin support** — Currently single-admin. Adding roles (owner, editor, viewer) would be useful for teams.

25. **Testimonials/reviews section** — No client testimonials. Adding a testimonial model + display section builds credibility.

26. **i18n/localization** — English-only. If targeting international clients, add `next-intl` or similar.

27. **PWA support** — No `manifest.json`, no service worker. Adding would enable "install" on mobile.

28. **Accessibility audit** — No ARIA labels on custom toggle switches, no skip-to-content link, no keyboard navigation testing, color contrast not verified for all text combinations.

29. **Error boundary per-route** — Single global `ErrorBoundary`. Per-route `error.tsx` files would give better error isolation.

30. **Database indexes** — No explicit indexes beyond `_id`. Add indexes on `Project.order`, `TeamMember.order`, `Admin.email` for query performance.

31. **Content Security Policy** — No CSP header. Should restrict script/style/image sources to prevent XSS via injected resources.

32. **Caching strategy** — No `revalidate` or ISR configuration. Server component data fetches happen on every request.
