"use client"

import { useEffect, useRef, useState } from "react"
import { Target, Lightbulb, TrendingUp, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const objectives = [
  {
    icon: Target,
    title: "Brand Awareness",
    description: "Establish a strong presence in the UAE market with targeted exposure across premium touchpoints.",
    metric: "85%",
    metricLabel: "Target Awareness"
  },
  {
    icon: Lightbulb,
    title: "Market Positioning",
    description: "Position the brand as a leader in innovation and luxury within the MENA region.",
    metric: "Top 3",
    metricLabel: "Market Position"
  },
  {
    icon: TrendingUp,
    title: "Engagement Growth",
    description: "Drive meaningful interactions and conversations across digital and physical channels.",
    metric: "150%",
    metricLabel: "Engagement Lift"
  },
  {
    icon: Award,
    title: "Premium Association",
    description: "Align with high-value partnerships and events that reflect brand excellence.",
    metric: "12+",
    metricLabel: "Key Partnerships"
  }
]

export function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
            Campaign Overview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Strategic Objectives for{" "}
            <span className="text-primary">Maximum Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our comprehensive approach combines data-driven insights with creative excellence 
            to deliver measurable results across every touchpoint.
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className={cn(
                "group relative glass rounded-3xl p-8 shadow-premium transition-all duration-700 hover:scale-[1.02]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <objective.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{objective.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {objective.description}
                </p>

                {/* Metric */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{objective.metric}</span>
                  <span className="text-sm text-muted-foreground">{objective.metricLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={cn(
          "mt-16 text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-muted-foreground">
            Each objective is backed by detailed KPIs and real-time tracking mechanisms.
          </p>
        </div>
      </div>
    </section>
  )
}
