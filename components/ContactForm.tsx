"use client"

import type React from "react"
import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import FormInput from "@/components/ui/FormInput"
import FormTextarea from "@/components/ui/FormTextarea"
import { Mail, MapPin, Loader2, Check } from "lucide-react"
import { submitContactForm } from "@/app/actions/public"
import { toast } from "sonner"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData(e.currentTarget)
      const result = await submitContactForm(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        setSubmitted(true)
        setFormData({ name: "", email: "", company: "", message: "" })
        toast.success("Message sent successfully!")

        setTimeout(() => {
          setSubmitted(false)
        }, 3000)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <SkewContainer variant="glass" className="p-8">
          <Mail className="text-primary mb-4" size={32} />
          <h3 className="font-display text-xl font-bold mb-2">Email</h3>
          <p className="text-secondary font-mono text-sm">contact@fieldwaves.com</p>
        </SkewContainer>

        <SkewContainer variant="glass" className="p-8">
          <MapPin className="text-primary mb-4" size={32} />
          <h3 className="font-display text-xl font-bold mb-2">Location</h3>
          <p className="text-secondary font-mono text-sm">Lahore, Pakistan</p>
        </SkewContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <SkewContainer variant="ghost" className="p-8">
            <h2 className="font-display text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-secondary mb-8 leading-relaxed">
              Whether you're looking to scale your infrastructure, improve security, or launch a new project, our team
              is ready to help. Fill out the form and we'll be in touch within 24 hours.
            </p>
          </SkewContainer>
        </div>

        <SkewContainer variant="outline" className="p-8 bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              type="text"
              name="name"
              label="NAME"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

            <FormInput
              type="email"
              name="email"
              label="EMAIL"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <FormInput
              type="text"
              name="company"
              label="COMPANY (OPTIONAL)"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
            />

            <FormTextarea
              name="message"
              label="MESSAGE"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              rows={5}
              required
            />

            <button
              type="submit"
              disabled={loading || submitted}
              className="w-full skew-x-12 group"
            >
              <SkewContainer
                variant="primary"
                className="py-3 text-center"
                hoverEffect
              >
                <div className="flex items-center justify-center gap-2">
                  {submitted ? (
                    <>
                      <Check size={18} />
                      <span className="font-bold tracking-widest">MESSAGE SENT</span>
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span className="font-bold tracking-widest">SENDING...</span>
                    </>
                  ) : (
                    <span className="font-bold tracking-widest">SEND MESSAGE</span>
                  )}
                </div>
              </SkewContainer>
            </button>
          </form>
        </SkewContainer>
      </div>
    </>
  )
}
