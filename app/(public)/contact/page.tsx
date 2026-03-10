import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact | FieldWaves",
  description: "Get in touch with FieldWaves. Let's discuss your next enterprise project, security audit, or infrastructure scaling.",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading
            label="Let's Connect"
            title="Start Your Project"
            subtitle="Have an ambitious idea? Let's discuss how FieldWaves can help bring it to life."
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ContactForm />
        </div>
      </section>
    </>
  )
}
