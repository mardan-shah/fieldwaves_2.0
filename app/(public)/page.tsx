import type { Metadata } from "next"

import { Suspense } from "react"
import HomeHero from "./components/HomeHero"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Stats from "./components/Stats"
import FeaturedProjects from "./components/FeaturedProjects"
import ServicesSection from "./components/ServicesSection"
import WhyUs from "./components/WhyUs"
import CallToActionSection from "@/components/CallToActionSection"

export const metadata: Metadata = {
  title: "FieldWaves | Engineering Over Vibe",
  description: "Enterprise-grade full-stack development with AI-accelerated senior-level security and architectural rigor.",
}


export default async function Home() {


  return (
    <Suspense fallback={<LoadingSpinner fullPage label="Loading..." size="lg" />}>
      <HomeHero />
      <Stats />
      <FeaturedProjects />
      <ServicesSection />
      <WhyUs />
      <CallToActionSection />
    </Suspense>
  )
}
