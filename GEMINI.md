# Fieldwaves 2.0 - Gemini Session Log

## Initial Setup - 2026-01-17
- Created `gemini.md` to track session progress and updates.

## Updates - 2026-03-12
- **Next.js 16 Cache Components:** Fully enabled and verified via build.
- **Data Caching:** Implemented `"use cache"`, `cacheLife`, and `cacheTag` across all public data actions.
- **Static Generation:** Added `generateStaticParams` for blog and case study routes.
- **UI Refinement:** Shifted theme toward "Engineered Aesthetics" to attract both Enterprises and High-end startups.
- **Instrument Aesthetics:** Added deterministic serial numbers and status indicators to `StatCard` and `ServiceCard`.


# Project Context: FieldWaves

## Documentation Links (Use docs-scraper to read these)
- **GSAP (Animation):** https://gsap.com/docs/v3/
- **Framer Motion:** https://www.framer.com/motion/
- **Ark UI (Reference):** https://ark-ui.com/docs/react/overview


## Design Rules
- All containers must use `skew-x-[-12deg]`.
- Inner content must be counter-skewed `skew-x-[12deg]` to remain legible.
- **New Rule:** Use "High-Fidelity Engineering" details (serial numbers, status bars, monospace metadata) to signal architectural rigor.

## Design Philosophy: Industrial Brutalism (Refined)
- **The "FieldWaves" Look:** Heavy machinery meets high-fidelity interfaces.
- **Aesthetics:** "Engineered Aesthetics" - balancing unique, edgy design with enterprise-grade professionalism.
- **Geometry:** Parallelograms are mandatory. Use `transform: skewX(-12deg)` on containers.
- **Counter-Skew:** Text inside skewed containers MUST be counter-skewed `skewX(12deg)` to remain upright and legible.
- **Motion:** Instant, snappy transitions (0.1s - 0.2s). No soft fades. Use "glitch" or "slide" effects.
- **Lighting:** No soft shadows. Use hard distinct borders (1px or 2px solid #FF5F1F).