# FieldWaves 2.0

A high-fidelity portfolio and engineering showcase built with **Industrial Brutalism** aesthetics. This project bridges the gap between boutique design uniqueness and enterprise-grade architectural rigor.

Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Cache Components)
- **Frontend:** React 19, Tailwind CSS 4, Framer Motion, GSAP
- **Database:** MongoDB (Mongoose 9)
- **Auth:** HMAC-Signed Secure Cookies + bcrypt
- **Architecture:** Partial Prerendering (PPR), "Use Cache" directives, Async Server Components
- **Email:** Nodemailer (Gmail) + Resend Fallback

## 📐 Design Philosophy: Engineered Aesthetics

The site follows a strict design language inspired by heavy machinery and professional instrumentation:

- **Geometry:** Parallelograms are mandatory. All main containers use `Container` with a `-12deg` skew.
- **Counter-Skew:** Content within skewed containers is automatically counter-skewed to maintain perfect legibility while preserving the edgy silhouette.
- **Micro-interactions:** Instant, snappy transitions (0.1s - 0.2s). No soft fades. Feedback feels like a physical switch clicking.
- **Information Density:** UI elements include monospace "metadata" (e.g., `SYSTM_READY`, `SRV_01`, `CORP_ID_FW`) to signal precision and architectural depth.
- **Color Palette:**
  - **Primary:** `#FF5F1F` (High-visibility Orange)
  - **Background:** `#1a1a1a` (Deep Charcoal)
  - **Surface:** `#141414` (Industrial Black)

## 🛠️ Key Features

### Admin Command Center

A secure, persistent sidebar dashboard for managing all aspects of the digital identity:

- **Services Management:** Dynamic CRUD for service offerings with custom Lucide icons.
- **Deployments (Projects):** Showcase work with screenshot uploads and reordering.
- **Intelligence Feed (Blog):** Full Markdown editor with live preview and SEO controls.
- **Unit (Team):** Manage senior operatives with image cropping and bio management.
- **Analytics:** Real-time page view tracking and daily visualizers.

### Maintenance Mode

A global system-wide toggle accessible from the Admin Panel. When active:

- All public visitors are redirected to a branded **System Maintenance** page.
- The Admin Panel remains fully accessible for updates and re-engineering.
- Uses `x-invoke-path` header detection for seamless redirection within the layout.

### Next.js 16 Optimization

- **Cache Components:** Explicit opt-in caching via `"use cache"` for high performance.
- **Static Generation:** Dynamic routes use `generateStaticParams` for build-time optimization.
- **Deterministic Aesthetics:** Component IDs and serial numbers are generated deterministically to satisfy prerendering requirements.

## 🏁 Quick Start

1. **Clone & Install:**

   ```bash
   pnpm install
   ```

2. **Environment Configuration:**
   Create `.env.local` with the following variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_app_password
   CONTACT_EMAIL=target_email@example.com
   RESEND_API_KEY=your_resend_key
   ```

3. **Seed Initial Data:**

   ```bash
   bun scripts/seed-content.ts
   ```

4. **Launch Engine:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
├── app/
│   ├── (public)/       # Visitor routes (Home, About, Blog, Cases, etc.)
│   ├── admin/          # Command Center (Auth-guarded)
│   ├── actions/        # Server Actions (Admin & Public)
│   └── layout.tsx      # Root configuration & Error Boundaries
├── components/
│   ├── ui/             # Brutalist primitives (Container, etc.)
│   ├── admin/          # Management modals and forms
│   └── ...             # Visual grid and list components
├── lib/
│   ├── models.ts       # Mongoose schemas
│   └── session.ts      # Secure session management
└── styles/
    └── globals.css     # Tailwind 4 configuration
```

## 🔒 Security

- **Rate Limiting:** Auth attempts restricted to 5 per 15-minute window.
- **Session Integrity:** HMAC-SHA256 signing on all HTTP-only cookies.
- **Input Validation:** Strict Zod schemas for all data entry points.
- **Headers:** Strict Content Security Policy (CSP) and security headers enabled.

---

_Built by FieldWaves — Engineering Over Vibe._
