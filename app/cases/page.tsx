import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/Button"
import SkewContainer from "../../components/ui/SkewContainer"

export default function CaseStudiesPage() {
  const cases = [
    {
      id: 1,
      title: "FinTech Platform Scaling",
      client: "NextGen Financial",
      description: "Rebuilt a legacy monolith into a microservices architecture handling 10M+ daily transactions.",
      results: [
        { label: "Response Time", value: "89%", unit: "Improvement" },
        { label: "Throughput", value: "320%", unit: "Increase" },
        { label: "Downtime", value: "99.99%", unit: "Uptime" },
      ],
      image: "https://picsum.photos/seed/fintech/800/600",
      technologies: ["Go", "PostgreSQL", "Kubernetes", "gRPC"],
    },
    {
      id: 2,
      title: "E-Commerce Security Audit",
      client: "RetailCorp Global",
      description: "Comprehensive security hardening reducing vulnerability surface area by 94%.",
      results: [
        { label: "Vulnerabilities", value: "94%", unit: "Reduced" },
        { label: "Compliance", value: "PCI-DSS", unit: "Certified" },
        { label: "Response Time", value: "45ms", unit: "Avg" },
      ],
      image: "https://picsum.photos/seed/ecommerce/800/600",
      technologies: ["Rust", "WebAssembly", "Next.js", "Edge Workers"],
    },
    {
      id: 3,
      title: "Real-Time Analytics Engine",
      client: "DataViz Solutions",
      description: "Built real-time analytics processing 5B+ events daily with sub-second latency.",
      results: [
        { label: "Throughput", value: "5B+", unit: "Events/Day" },
        { label: "Latency", value: "340ms", unit: "P99" },
        { label: "Cost", value: "62%", unit: "Savings" },
      ],
      image: "https://picsum.photos/seed/analytics/800/600",
      technologies: ["Apache Kafka", "Rust", "ClickHouse", "Redis"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden selection:bg-[#FF5F1F] selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Proven Track Record"
            title="Results That Speak"
            subtitle="Real projects. Real metrics. Real impact."
          />
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 space-y-24">
        {cases.map((caseStudy, i) => (
          <div key={caseStudy.id} className={`max-w-7xl mx-auto px-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <SkewContainer variant="ghost" className={`h-80 overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <img
                  src={caseStudy.image || "/placeholder.svg"}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-110 hover:scale-100"
                />
              </SkewContainer>

              {/* Content */}
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="mb-4">
                  <p className="font-mono text-xs text-[#FF5F1F] tracking-widest uppercase mb-2">{caseStudy.client}</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{caseStudy.title}</h2>
                </div>
                <p className="text-lg text-[#B0B0B0] mb-8">{caseStudy.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {caseStudy.results.map((result, idx) => (
                    <div key={idx} className="bg-[#141414] border border-[#333] p-4">
                      <p className="font-mono text-xs text-[#FF5F1F] mb-2">{result.label}</p>
                      <p className="font-display text-2xl font-bold">{result.value}</p>
                      <p className="text-xs text-[#B0B0B0]">{result.unit}</p>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <p className="font-mono text-xs text-[#B0B0B0] mb-3">TECH STACK</p>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.technologies.map((tech) => (
                      <SkewContainer key={tech} variant="outline" className="px-3 py-1">
                        <span className="font-mono text-xs">{tech}</span>
                      </SkewContainer>
                    ))}
                  </div>
                </div>

                <Button>View Full Case Study</Button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Your Success Story Starts Here</h2>
          <p className="text-lg text-[#B0B0B0] mb-8">Let's engineer something extraordinary together.</p>
          <Button>Schedule a Discovery Call</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
