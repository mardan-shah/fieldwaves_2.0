import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import ContactForm from "@/components/ContactForm"
import GridBackground from "@/components/ui/GridBackground"

export const metadata: Metadata = {
  title: "Contact | FieldWaves",
  description: "Get in touch with FieldWaves. Let's discuss your next enterprise project, security audit, or infrastructure scaling.",
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-20">
              <GridBackground />
        

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
