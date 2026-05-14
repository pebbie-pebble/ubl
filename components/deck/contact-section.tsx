"use client"

import { useEffect, useRef, useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const teamMembers = [
  {
    name: "Sarah Al-Rashid",
    role: "Campaign Director",
    email: "sarah@apexmedia.ae",
    image: null,
  },
  {
    name: "James Mitchell",
    role: "Media Strategy Lead",
    email: "james@apexmedia.ae",
    image: null,
  },
  {
    name: "Fatima Hassan",
    role: "Client Success Manager",
    email: "fatima@apexmedia.ae",
    image: null,
  },
]

const offices = [
  {
    city: "Dubai",
    address: "Level 42, Emirates Towers, Sheikh Zayed Road",
    phone: "+971 4 123 4567",
  },
  {
    city: "Abu Dhabi",
    address: "Al Maryah Island, Four Seasons Tower",
    phone: "+971 2 234 5678",
  },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to <span className="text-primary">Elevate</span> Your Brand?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Let&apos;s discuss how we can bring this campaign to life for your brand. 
            Our team is ready to customize this approach to your specific needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={cn(
            "glass rounded-3xl p-8 shadow-premium transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <h3 className="text-xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input
                    placeholder="John"
                    className="rounded-xl h-12 bg-secondary/50 border-0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input
                    placeholder="Smith"
                    className="rounded-xl h-12 bg-secondary/50 border-0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  className="rounded-xl h-12 bg-secondary/50 border-0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Company</label>
                <Input
                  placeholder="Your company name"
                  className="rounded-xl h-12 bg-secondary/50 border-0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <textarea
                  placeholder="Tell us about your campaign goals..."
                  rows={4}
                  className="w-full rounded-xl p-4 bg-secondary/50 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="w-full rounded-full h-12 text-base">
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className={cn(
            "space-y-6 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            {/* Team */}
            <div className="glass rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold mb-4">Your Campaign Team</h3>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div className="glass rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold mb-4">Our Offices</h3>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{office.city}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {office.address}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{office.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="glass rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                ].map((social, index) => (
                  <button
                    key={index}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:block">
                      {social.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "mt-20 pt-10 border-t border-border text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-lg">APEX Media</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Premium Media Solutions for the UAE Market
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 APEX Media. All rights reserved. Confidential proposal.
          </p>
        </div>
      </div>
    </section>
  )
}
