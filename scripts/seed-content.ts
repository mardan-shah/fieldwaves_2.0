/**
 * Seed script for dummy blog posts and case studies.
 * Run: bun scripts/seed-content.ts
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local')
  process.exit(1)
}

// ---- Schemas (inline to avoid Next.js import issues) ----

const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  coverImage: String,
  keywords: [String],
  tags: [String],
  author: String,
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true })

const caseStudySchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  subtitle: String,
  overview: String,
  description: String,
  coverImage: String,
  metricCards: [{ label: String, value: String, unit: String }],
  techStack: [String],
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true })

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema)
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseStudySchema)

// ---- Dummy Blog Posts ----

const blogPosts = [
  {
    title: "Why We Ditched REST for tRPC in Production",
    slug: "why-we-ditched-rest-for-trpc",
    excerpt: "After 2 years of maintaining a REST API with 140+ endpoints, we migrated to tRPC. Here's what broke, what improved, and the hard numbers on developer velocity.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    keywords: ["tRPC", "REST", "API design", "TypeScript", "developer experience"],
    tags: ["Engineering", "TypeScript", "Architecture"],
    author: "FieldWaves Engineering",
    published: true,
    order: 1,
    views: 1247,
    content: `## The Breaking Point

After two years of building and maintaining a REST API that grew to **140+ endpoints**, we hit the wall every backend team dreads: type drift.

Our frontend and backend were speaking different languages. Zod schemas on the server, hand-written TypeScript interfaces on the client, and a Swagger doc that was always three PRs behind reality.

> "We spent more time debugging type mismatches than building features. Something had to give."

## The Migration Strategy

We didn't do a big-bang rewrite. That's how projects die. Instead, we followed a **strangler fig pattern**:

### Phase 1: Parallel Routes
- Kept all existing REST endpoints running
- Added tRPC router alongside Express
- New features went through tRPC exclusively

### Phase 2: Gradual Migration
- Migrated endpoints by domain (auth → users → billing → content)
- Each domain took roughly 1 sprint
- Feature flags controlled which path the client used

### Phase 3: Cleanup
- Removed REST routes once tRPC equivalents were stable
- Deleted 4,200 lines of dead code
- Removed the OpenAPI generator entirely

## The Hard Numbers

Here's what changed after full migration:

| Metric | Before (REST) | After (tRPC) | Delta |
|--------|--------------|--------------|-------|
| Type errors in CI | ~12/week | 0 | -100% |
| API-related bugs | 8/month | 1/month | -87% |
| Time to add endpoint | ~45 min | ~8 min | -82% |
| Client bundle size | 142kb | 98kb | -31% |
| Lines of API code | 8,400 | 3,200 | -62% |

## Code Comparison

A typical REST endpoint with validation:

\`\`\`typescript
// REST: 34 lines for a simple CRUD read
router.get('/api/projects/:id',
  authenticate,
  validateParams(z.object({ id: z.string() })),
  async (req, res) => {
    try {
      const project = await db.project.findUnique({
        where: { id: req.params.id }
      })
      if (!project) return res.status(404).json({ error: 'Not found' })
      return res.json(project)
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' })
    }
  }
)
\`\`\`

The same thing in tRPC:

\`\`\`typescript
// tRPC: 8 lines, fully typed end-to-end
export const projectRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.project.findUniqueOrThrow({
        where: { id: input.id }
      })
    }),
})
\`\`\`

## What We'd Do Differently

- **Start with tRPC from day one** if TypeScript is your stack
- **Don't migrate auth routes last** — do them first, they touch everything
- **Keep REST for webhooks** — external services don't speak tRPC

## The Verdict

tRPC isn't just a better API layer. It's a different way of thinking about the contract between your frontend and backend. The type safety isn't a nice-to-have — it's a force multiplier that compounds over time.

---

*This post reflects our experience on a specific project. Your mileage may vary, but the direction is clear: if you're all-in on TypeScript, there's no good reason to hand-roll REST anymore.*`
  },
  {
    title: "Hardening Next.js: A Security Checklist for Production",
    slug: "hardening-nextjs-security-checklist",
    excerpt: "Most Next.js tutorials skip security entirely. Here's the checklist we use before every production deploy — from CSP headers to server action validation.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
    keywords: ["Next.js", "security", "CSP", "CSRF", "authentication", "production"],
    tags: ["Security", "Next.js", "DevOps"],
    author: "FieldWaves Engineering",
    published: true,
    order: 2,
    views: 892,
    content: `## The Problem With Defaults

Next.js ships with sensible defaults for development. But production is a different beast. Out of the box, you're missing:

- Content Security Policy headers
- CSRF protection on server actions
- Rate limiting on API routes
- Proper session management
- Input sanitization

> "Security isn't a feature you bolt on. It's a foundation you build on."

## The Checklist

### 1. Content Security Policy

Every response should include CSP headers. Here's our baseline:

\`\`\`typescript
// middleware.ts
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://api.your-domain.com",
  "frame-ancestors 'none'",
].join('; ')

response.headers.set('Content-Security-Policy', csp)
\`\`\`

### 2. Server Action Validation

**Every server action must validate its inputs.** No exceptions.

\`\`\`typescript
// Bad: trusting client data
export async function updateProfile(data: any) {
  await db.user.update({ data }) // SQL injection vector
}

// Good: validate everything
const schema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
})

export async function updateProfile(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid input' }
  await db.user.update({ data: parsed.data })
}
\`\`\`

### 3. CSRF Protection

Server actions are vulnerable to CSRF by default. Add origin checking:

\`\`\`typescript
// middleware.ts
const origin = request.headers.get('origin')
const host = request.headers.get('host')

if (request.method !== 'GET') {
  if (!origin || !host || new URL(origin).host !== host) {
    return new Response('Forbidden', { status: 403 })
  }
}
\`\`\`

### 4. Rate Limiting

Without rate limiting, your auth endpoints are a brute-force target:

- Login: 5 attempts per 15 minutes per IP
- Signup: 3 per hour per IP
- Password reset: 3 per hour per email
- API routes: 100 per minute per user

### 5. Session Management

- Use HTTP-only cookies (never localStorage)
- Sign cookies with HMAC
- Set \`Secure\`, \`SameSite=Strict\` flags
- Rotate session tokens on privilege escalation
- Set reasonable expiration (24h for standard, 1h for admin)

### 6. Environment Variables

- Never commit \`.env\` files
- Use different secrets per environment
- Rotate secrets quarterly
- Audit access to production env vars

## Testing Your Security

Run these checks before every deploy:

- \`npx is-website-vulnerable\` — checks for known CVEs
- Mozilla Observatory scan
- Check headers at securityheaders.com
- Verify CSP with CSP Evaluator

---

*Security is never "done." It's a continuous process. But this checklist gives you a solid baseline that puts you ahead of 90% of Next.js deployments.*`
  },
  {
    title: "The Architecture Behind Our Real-Time Dashboard",
    slug: "real-time-dashboard-architecture",
    excerpt: "How we built a dashboard that handles 50K concurrent connections with sub-100ms latency using WebSockets, Redis pub/sub, and a custom event pipeline.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
    keywords: ["WebSocket", "Redis", "real-time", "architecture", "dashboard", "performance"],
    tags: ["Architecture", "Performance", "Engineering"],
    author: "FieldWaves Engineering",
    published: true,
    order: 3,
    views: 2103,
    content: `## The Requirements

Our client needed a dashboard that could:

- Display live metrics from 200+ IoT sensors
- Handle 50,000 concurrent viewers
- Deliver updates with sub-100ms latency
- Work on unreliable mobile networks
- Scale horizontally without downtime

Traditional polling was out. SSE was tempting but didn't meet the bidirectional requirement. We went with WebSockets backed by Redis pub/sub.

## System Architecture

The system has four layers:

### Ingestion Layer
- IoT sensors push data via MQTT
- A bridge service translates MQTT → Redis Streams
- Each message is validated, timestamped, and tagged

### Processing Layer
- Redis Streams consumers aggregate raw data
- Rolling averages, min/max, and anomaly detection happen here
- Processed events publish to Redis pub/sub channels

### Distribution Layer
- WebSocket servers subscribe to relevant Redis channels
- Each WS server handles ~5,000 connections
- Horizontal scaling via consistent hashing on channel names

### Presentation Layer
- React dashboard with custom WebSocket hook
- Automatic reconnection with exponential backoff
- Local state reconciliation on reconnect

## The WebSocket Hook

\`\`\`typescript
function useLiveMetrics(sensorIds: string[]) {
  const [metrics, setMetrics] = useState<Map<string, Metric>>(new Map())
  const wsRef = useRef<WebSocket | null>(null)
  const retryCount = useRef(0)

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        retryCount.current = 0
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: sensorIds
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setMetrics(prev => {
          const next = new Map(prev)
          next.set(data.sensorId, data)
          return next
        })
      }

      ws.onclose = () => {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000)
        retryCount.current++
        setTimeout(connect, delay)
      }
    }

    connect()
    return () => wsRef.current?.close()
  }, [sensorIds])

  return metrics
}
\`\`\`

## Performance Results

After 3 months in production:

| Metric | Target | Actual |
|--------|--------|--------|
| P50 latency | < 100ms | 23ms |
| P99 latency | < 500ms | 87ms |
| Max connections | 50K | 62K (tested) |
| Uptime | 99.9% | 99.97% |
| Data loss | < 0.1% | 0.002% |

## Lessons Learned

- **Redis pub/sub is fire-and-forget.** If a subscriber is down, messages are lost. Use Redis Streams for durability, pub/sub for speed.
- **WebSocket compression matters.** Enabling permessage-deflate reduced bandwidth by 60%.
- **Don't trust the client clock.** Server-side timestamps saved us from hours of debugging.
- **Monitor connection counts per server.** Uneven distribution indicates a hashing problem.

> "The fastest architecture is the one that does less. Every layer we removed made the system faster and more reliable."

## What's Next

We're exploring:

- **WebTransport** as a WebSocket replacement (HTTP/3 based)
- **CRDT-based state sync** for offline-first mobile clients
- **Edge computing** to pre-process sensor data closer to source

---

*If you're building real-time systems and want to avoid the pitfalls we hit, [get in touch](/contact). We've learned the hard way so you don't have to.*`
  }
]

// ---- Dummy Case Studies ----

const caseStudies = [
  {
    title: "NovaPay Financial Platform",
    slug: "novapay-financial-platform",
    subtitle: "Fintech Infrastructure",
    overview: "Rebuilt a legacy payment processing platform handling $2.4B annually, reducing transaction failures by 94% and cutting processing costs by 40%.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1200&h=600&fit=crop",
    metricCards: [
      { label: "TRANSACTION VOLUME", value: "$2.4B", unit: "annually processed" },
      { label: "FAILURE RATE", value: "-94%", unit: "reduction in failures" },
      { label: "PROCESSING COST", value: "-40%", unit: "cost reduction" },
      { label: "UPTIME", value: "99.99%", unit: "availability" },
    ],
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe", "AWS", "Docker", "Terraform"],
    published: true,
    order: 1,
    views: 534,
    description: `## The Challenge

NovaPay's payment platform was built on a 7-year-old PHP monolith. Transaction failures were running at 6.2% — costing them approximately $148M in failed payments annually. The system couldn't scale, couldn't be tested reliably, and every deploy was a prayer.

They needed a complete rebuild without any downtime during migration.

## Our Approach

### Architecture Redesign

We decomposed the monolith into domain-driven microservices:

- **Payment Gateway Service** — handles all payment provider integrations
- **Ledger Service** — double-entry bookkeeping with ACID guarantees
- **Fraud Detection** — real-time ML-based transaction scoring
- **Notification Service** — multi-channel alerts and webhooks

### Zero-Downtime Migration

The migration strategy used the strangler fig pattern:

1. Built new services alongside the old system
2. Routed traffic through a feature-flag-controlled proxy
3. Ran both systems in parallel with reconciliation checks
4. Gradually shifted traffic over 6 weeks
5. Decommissioned old services only after 30 days of clean operation

### Security Hardening

Financial platforms demand enterprise-grade security:

- PCI DSS Level 1 compliance
- End-to-end encryption with rotating keys
- Tokenized card data (never stored raw)
- SOC 2 Type II audit passed on first attempt
- Automated vulnerability scanning in CI/CD

## Key Technical Decisions

### Why PostgreSQL over NoSQL

For financial data, ACID transactions are non-negotiable. PostgreSQL gave us:

- Strong consistency guarantees
- Row-level locking for concurrent transactions
- Native JSON support for flexible schemas
- Proven at scale (Stripe, Square, and Robinhood use it)

### Idempotency as Architecture

Every operation in the system is idempotent. This means:

\`\`\`typescript
// Every mutation accepts an idempotency key
async function processPayment(
  idempotencyKey: string,
  payload: PaymentRequest
) {
  const existing = await cache.get(idempotencyKey)
  if (existing) return existing // Return cached result

  const result = await executePayment(payload)
  await cache.set(idempotencyKey, result, '24h')
  return result
}
\`\`\`

Network failures, retries, and duplicate webhooks are all handled gracefully.

## Results

The new platform launched on schedule. Within 90 days:

- Transaction failure rate dropped from 6.2% to 0.37%
- P99 payment processing latency: 340ms → 89ms
- Engineering team velocity increased 3x (measured by sprint points)
- First SOC 2 audit passed with zero findings
- Monthly infrastructure costs reduced by 40%

> "FieldWaves didn't just rebuild our platform — they transformed how we think about financial infrastructure."
> — CTO, NovaPay`
  },
  {
    title: "Meridian Health Telemedicine App",
    slug: "meridian-health-telemedicine",
    subtitle: "Healthcare Technology",
    overview: "Built a HIPAA-compliant telemedicine platform from scratch that scaled to 15,000 daily consultations within 3 months of launch.",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop",
    metricCards: [
      { label: "DAILY CONSULTATIONS", value: "15K", unit: "peak daily volume" },
      { label: "PATIENT SATISFACTION", value: "4.8/5", unit: "average rating" },
      { label: "WAIT TIME", value: "< 3min", unit: "average wait" },
      { label: "COMPLIANCE", value: "100%", unit: "HIPAA compliant" },
    ],
    techStack: ["React Native", "Node.js", "MongoDB", "WebRTC", "AWS", "Twilio", "Socket.io"],
    published: true,
    order: 2,
    views: 412,
    description: `## The Challenge

Meridian Health needed to launch a telemedicine platform in under 4 months. COVID-era demand meant their existing phone-based system was buckling under load. Patients waited 45+ minutes. Doctors were burning out.

The requirements were strict:

- HIPAA compliance from day one
- Video consultations with screen sharing
- E-prescriptions and lab result viewing
- Multi-platform (iOS, Android, Web)
- Integration with existing EHR systems

## Our Approach

### Mobile-First Architecture

We chose React Native for cross-platform development with native performance:

- Shared business logic between iOS and Android
- Platform-specific UI components where needed
- Over-the-air updates for rapid iteration
- 92% code sharing between platforms

### Video Infrastructure

WebRTC for peer-to-peer video with Twilio as fallback:

\`\`\`typescript
// Adaptive quality based on network conditions
function adaptVideoQuality(stats: RTCStatsReport) {
  const bandwidth = calculateAvailableBandwidth(stats)

  if (bandwidth < 500_000) {
    // Poor connection: audio priority
    sender.setParameters({
      encodings: [{ maxBitrate: 150_000, scaleResolutionDownBy: 4 }]
    })
  } else if (bandwidth < 1_500_000) {
    // Medium: balanced
    sender.setParameters({
      encodings: [{ maxBitrate: 600_000, scaleResolutionDownBy: 2 }]
    })
  } else {
    // Good: full quality
    sender.setParameters({
      encodings: [{ maxBitrate: 2_500_000 }]
    })
  }
}
\`\`\`

### HIPAA Compliance

Every technical decision was filtered through HIPAA requirements:

- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- PHI stored in dedicated, audited database clusters
- Role-based access control with MFA enforcement
- Comprehensive audit logging (who accessed what, when)
- Business Associate Agreements with all third-party services
- Regular penetration testing by independent security firm

## Key Features

### Smart Triage System

Before connecting with a doctor, patients complete an AI-assisted triage:

- Symptom checker narrows down possible conditions
- Urgency scoring routes critical cases immediately
- Historical context pulled from EHR integration
- Average triage time: 2 minutes

### Waiting Room Experience

The virtual waiting room was designed to reduce anxiety:

- Real-time queue position and estimated wait time
- Educational content relevant to reported symptoms
- Chat with nurse practitioners while waiting
- Seamless handoff when doctor becomes available

## Results

Three months post-launch:

- 15,000 daily consultations (from 800 phone calls)
- Average wait time: 2.8 minutes (from 45+ minutes)
- Patient satisfaction: 4.8/5 stars
- Zero HIPAA violations or data breaches
- Doctor burnout scores improved by 34%
- Platform available in 12 languages

> "This platform didn't just digitize our consultations — it fundamentally improved patient outcomes."
> — Chief Medical Officer, Meridian Health`
  },
  {
    title: "Vortex E-Commerce Platform Migration",
    slug: "vortex-ecommerce-migration",
    subtitle: "E-Commerce at Scale",
    overview: "Migrated a Shopify-based store doing $18M ARR to a custom headless commerce platform, increasing page speed by 340% and conversion rate by 28%.",
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    metricCards: [
      { label: "REVENUE", value: "$18M", unit: "annual revenue" },
      { label: "PAGE SPEED", value: "+340%", unit: "improvement" },
      { label: "CONVERSION", value: "+28%", unit: "rate increase" },
      { label: "LOAD TIME", value: "0.8s", unit: "TTI" },
    ],
    techStack: ["Next.js", "TypeScript", "Medusa.js", "PostgreSQL", "Algolia", "Vercel", "Cloudflare"],
    published: true,
    order: 3,
    views: 678,
    description: `## The Challenge

Vortex Outdoor Gear had outgrown Shopify. At $18M ARR with 400K monthly visitors, they were hitting walls:

- Page load times averaging 4.2 seconds on mobile
- Shopify's 100-variant limit blocking their product configurator
- Checkout customization limited by Shopify's Liquid templates
- International expansion blocked by single-currency limitations
- Monthly platform fees exceeding $15,000

They needed a headless solution that was faster, more flexible, and cheaper to operate.

## Our Approach

### Headless Architecture

We chose Medusa.js as the commerce engine with Next.js as the storefront:

- **Medusa.js** — open-source, Node.js-based commerce API
- **Next.js** — server-rendered storefront with ISR for product pages
- **Algolia** — search and product discovery
- **Cloudflare** — edge caching and image optimization
- **Vercel** — frontend deployment with edge functions

### Performance Strategy

Every millisecond of load time costs revenue. Our optimization stack:

\`\`\`typescript
// ISR: Product pages regenerate every 60 seconds
export async function generateStaticParams() {
  const products = await medusa.products.list({ limit: 1000 })
  return products.map(p => ({ slug: p.handle }))
}

export const revalidate = 60 // ISR every 60s

// Critical CSS inlined, non-critical deferred
// Images served as AVIF with Cloudflare Image Resizing
// Fonts subset to used characters only
\`\`\`

### Product Configurator

The custom configurator handles 2,000+ variant combinations:

- Real-time 3D preview using Three.js
- Dynamic pricing based on configuration
- Inventory checking per-variant in real-time
- Share configurations via URL

### Multi-Currency & Localization

- 8 currencies with real-time exchange rates
- 4 languages with professional translations
- Region-specific pricing strategies
- Local payment methods (iDEAL, Klarna, PIX)

## Performance Comparison

| Metric | Shopify | Custom | Improvement |
|--------|---------|--------|-------------|
| TTI (mobile) | 4.2s | 0.8s | +425% |
| LCP | 3.8s | 1.1s | +245% |
| CLS | 0.24 | 0.02 | +1100% |
| Lighthouse Score | 42 | 98 | +133% |
| Bundle Size | 890kb | 210kb | -76% |

## Business Impact

Six months after migration:

- Conversion rate increased from 2.1% to 2.7% (+28%)
- Average order value up 12% (better product discovery)
- Mobile revenue share grew from 38% to 52%
- International sales now 22% of total (was 0%)
- Platform costs reduced by 60% ($15K/mo → $6K/mo)
- SEO traffic increased 45% (Core Web Vitals improvement)

> "The speed difference is night and day. Our customers notice it, and our revenue reflects it."
> — Founder, Vortex Outdoor Gear

## Key Takeaway

Headless commerce isn't just a technical upgrade — it's a business transformation. When your store loads in under a second, everything downstream improves: conversion, SEO, customer satisfaction, and ultimately revenue.`
  }
]

// ---- Execute ----

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI!, { dbName: 'fieldwaves' })
  console.log('Connected.')

  // Upsert blog posts
  for (const post of blogPosts) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      post,
      { upsert: true, new: true }
    )
    console.log(`  Blog: "${post.title}" ✓`)
  }

  // Upsert case studies
  for (const cs of caseStudies) {
    await CaseStudy.findOneAndUpdate(
      { slug: cs.slug },
      cs,
      { upsert: true, new: true }
    )
    console.log(`  Case: "${cs.title}" ✓`)
  }

  console.log('\nDone! Seeded 3 blog posts and 3 case studies.')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
