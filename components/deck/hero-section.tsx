"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToOverview = () => {
    const element = document.getElementById("overview")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />

      <div className="container relative z-10 mx-auto px-6 py-32 lg:py-40">
        <div
          className={cn(
            "max-w-5xl mx-auto text-center transition-all duration-1000",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 shadow-premium">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">UAE Media Campaign 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="block">Elevate Your Brand</span>
            <span className="block mt-2">
              Across the{" "}
              <span className="text-primary">Emirates</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A strategic media campaign designed to capture the attention of the UAE&apos;s 
            most influential audiences through premium channels and innovative storytelling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base shadow-premium glow transition-all hover:scale-105"
              onClick={scrollToOverview}
            >
              Explore Campaign
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-base glass hover:bg-secondary/50 transition-all hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Reel
            </Button>
          </div>

          {/* Stats Row */}
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transition-all duration-1000 delay-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {[
              { value: "10M+", label: "Potential Reach" },
              { value: "7", label: "Emirates Covered" },
              { value: "12+", label: "Media Channels" },
              { value: "94%", label: "Brand Recall Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 shadow-premium hover:scale-105 transition-transform"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToOverview}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  )
}
