# Fieldwaves 2.0 - Gemini Session Log

## Initial Setup - 2026-01-17
- Created `gemini.md` to track session progress and updates.


# Project Context: FieldWaves

## Documentation Links (Use docs-scraper to read these)
- **GSAP (Animation):** https://gsap.com/docs/v3/
- **Framer Motion:** https://www.framer.com/motion/
- **Ark UI (Reference):** https://ark-ui.com/docs/react/overview


## Design Rules
- All containers must use `skew-x-[-12deg]`.
- Inner content must be counter-skewed `skew-x-[12deg]` to remain legible.

## Design Philosophy: Industrial Brutalism
- **The "FieldWaves" Look:** Heavy machinery, high-fidelity interfaces, not "toylike."
- **Geometry:** Parallelograms are mandatory. Use `transform: skewX(-12deg)` on containers.
- **Counter-Skew:** Text inside skewed containers MUST be counter-skewed `skewX(12deg)` to remain upright and legible.
- **Motion:** Instant, snappy transitions (0.1s - 0.2s). No soft fades. Use "glitch" or "slide" effects.
- **Lighting:** No soft shadows. Use hard distinct borders (1px or 2px solid #FF5F1F).