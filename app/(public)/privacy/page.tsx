import type { Metadata } from "next"
import SectionHeading from "@/components/ui/SectionHeading"
import SkewContainer from "@/components/ui/SkewContainer"

export const metadata: Metadata = {
  title: "Privacy Policy | FieldWaves",
  description: "FieldWaves privacy policy — how we collect, use, and protect your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-12">
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
            label="Legal"
            title="Privacy Policy"
            subtitle="Last updated: February 2026"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          {/* Introduction */}
          <SkewContainer variant="glass" className="p-8">
            <p className="text-secondary leading-relaxed">
              FieldWaves (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to
              protecting the personal data you share with us. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website and use our services.
            </p>
          </SkewContainer>

          {/* Section 1 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">1. Information We Collect</h2>
            <div className="space-y-4 text-secondary leading-relaxed">
              <div>
                <h3 className="font-mono text-sm text-primary tracking-widest mb-2">PERSONAL INFORMATION</h3>
                <p>
                  When you use our contact form, we collect your name, email address, company name (optional), and the
                  content of your message. This information is provided voluntarily and is necessary to respond to your
                  inquiry.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-sm text-primary tracking-widest mb-2">USAGE DATA</h3>
                <p>
                  We automatically collect certain information when you visit our website, including your IP address,
                  browser type, operating system, referring URLs, pages viewed, time spent on pages, and the date and
                  time of your visit. This data is collected through Vercel Analytics and our internal analytics system
                  to help us understand how visitors interact with our site.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-sm text-primary tracking-widest mb-2">COOKIES & TRACKING</h3>
                <p>
                  We use essential cookies to maintain session state and security (such as admin authentication cookies).
                  Third-party services like Vercel Analytics may use cookies or similar technologies for performance
                  monitoring. We may also use Google AdSense, which uses cookies to serve personalized advertisements
                  based on your browsing behavior.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">2. How We Use Your Information</h2>
            <div className="text-secondary leading-relaxed space-y-2">
              <p>We use the information we collect to:</p>
              <ul className="list-none space-y-2 ml-4">
                {[
                  "Respond to your contact form submissions and inquiries",
                  "Send confirmation emails regarding your inquiries",
                  "Analyze website traffic and usage patterns to improve our content and services",
                  "Monitor and maintain the security of our website",
                  "Display relevant advertisements through Google AdSense",
                  "Generate aggregated, non-identifying analytics about page views and content popularity",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-mono text-xs mt-1 shrink-0">[{String(i + 1).padStart(2, '0')}]</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">3. Data Sharing & Third Parties</h2>
            <div className="text-secondary leading-relaxed space-y-4">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share data with the
                following service providers who assist us in operating our website:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Vercel", purpose: "Hosting and analytics" },
                  { name: "MongoDB Atlas", purpose: "Database storage" },
                  { name: "Gmail / Nodemailer", purpose: "Email delivery" },
                  { name: "Resend", purpose: "Transactional email fallback" },
                  { name: "Google AdSense", purpose: "Advertisement serving" },
                ].map((provider) => (
                  <SkewContainer key={provider.name} variant="ghost" className="p-4">
                    <p className="font-mono text-sm text-white font-bold">{provider.name}</p>
                    <p className="text-xs text-muted">{provider.purpose}</p>
                  </SkewContainer>
                ))}
              </div>
              <p>
                These providers are bound by their own privacy policies and are only permitted to use your data as
                necessary to provide their services to us.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">4. Google AdSense & Advertising</h2>
            <div className="text-secondary leading-relaxed space-y-3">
              <p>
                We may use Google AdSense to display advertisements on our blog pages. Google AdSense uses cookies
                (including the DoubleClick cookie) to serve ads based on your prior visits to our website and other
                websites on the internet.
              </p>
              <p>
                You may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>
                . Alternatively, you can opt out of third-party vendor cookies by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  aboutads.info
                </a>
                .
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">5. Data Retention</h2>
            <div className="text-secondary leading-relaxed space-y-3">
              <p>
                Contact form submissions are retained for as long as necessary to respond to and resolve your inquiry.
                Analytics data (page views and usage statistics) is retained in aggregated, non-identifying form
                indefinitely to help us track long-term trends.
              </p>
              <p>
                Admin authentication sessions are temporary and expire automatically. We do not store passwords in
                plain text — all credentials are hashed using bcrypt.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">6. Data Security</h2>
            <div className="text-secondary leading-relaxed space-y-3">
              <p>
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-none space-y-2 ml-4">
                {[
                  "HTTPS encryption for all data in transit",
                  "HMAC-signed HTTP-only cookies for session management",
                  "Bcrypt password hashing for admin credentials",
                  "CSRF protection via origin header verification",
                  "Rate limiting on authentication endpoints",
                  "Input validation and sanitization using Zod schemas",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-mono text-xs mt-1 shrink-0">//</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                While we strive to protect your data, no method of transmission over the internet or electronic storage
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">7. Your Rights</h2>
            <div className="text-secondary leading-relaxed space-y-3">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-none space-y-2 ml-4">
                {[
                  "Access the personal data we hold about you",
                  "Request correction of inaccurate personal data",
                  "Request deletion of your personal data",
                  "Object to or restrict the processing of your data",
                  "Withdraw consent where processing is based on consent",
                  "Lodge a complaint with a supervisory authority",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-mono text-xs mt-1 shrink-0">&gt;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">8. Children&apos;s Privacy</h2>
            <p className="text-secondary leading-relaxed">
              Our website and services are not directed to individuals under the age of 16. We do not knowingly collect
              personal data from children. If you believe we have inadvertently collected data from a child, please
              contact us and we will promptly delete the information.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">9. Changes to This Policy</h2>
            <p className="text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law.
              Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to
              review this policy periodically.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 uppercase">10. Contact Us</h2>
            <p className="text-secondary leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <SkewContainer variant="outline" className="p-6">
              <div className="space-y-2">
                <p className="font-mono text-sm">
                  <span className="text-primary">EMAIL:</span>{" "}
                  <a href="mailto:contact@fieldwaves.com" className="text-white hover:text-primary transition-colors">
                    contact@fieldwaves.com
                  </a>
                </p>
                <p className="font-mono text-sm">
                  <span className="text-primary">PAGE:</span>{" "}
                  <a href="/contact" className="text-white hover:text-primary transition-colors">
                    fieldwaves.io/contact
                  </a>
                </p>
              </div>
            </SkewContainer>
          </div>

        </div>
      </section>
    </>
  )
}
