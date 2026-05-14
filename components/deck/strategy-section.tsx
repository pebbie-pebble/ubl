"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Eye, MessageCircle, Heart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const pillars = [
  {
    icon: Eye,
    phase: "Phase 1",
    title: "Awareness",
    subtitle: "Weeks 1-4",
    description: "Build brand visibility through high-impact placements and strategic partnerships across premium media channels.",
    tactics: [
      "Premium OOH in Dubai Marina & Downtown",
      "Digital takeovers on top UAE platforms",
      "Influencer seeding with luxury creators"
    ],
    kpi: "10M+ Impressions"
  },
  {
    icon: MessageCircle,
    phase: "Phase 2",
    title: "Consideration",
    subtitle: "Weeks 5-8",
    description: "Drive engagement through compelling content and interactive experiences that showcase brand value.",
    tactics: [
      "Interactive social campaigns",
      "Video content series",
      "Event activations at key venues"
    ],
    kpi: "500K Engagements"
  },
  {
    icon: Heart,
    phase: "Phase 3",
    title: "Conversion",
    subtitle: "Weeks 9-12",
    description: "Convert interest into action with targeted messaging and exclusive offers for qualified audiences.",
    tactics: [
      "Retargeting campaigns",
      "Exclusive launch events",
      "VIP customer experiences"
    ],
    kpi: "25K Qualified Leads"
  },
  {
    icon: Zap,
    phase: "Phase 4",
    title: "Loyalty",
    subtitle: "Ongoing",
    description: "Build lasting relationships through continuous engagement and brand advocacy programs.",
    tactics: [
      "Loyalty program integration",
      "Community building initiatives",
      "Ambassador program launch"
    ],
    kpi: "85% Retention Rate"
  }
]

export function StrategySection() {
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
      id="strategy"
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
            Campaign Strategy
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            A <span className="text-primary">Four-Phase</span> Approach
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our strategic framework guides audiences through a carefully orchestrated 
            journey from awareness to advocacy.
          </p>
        </div>

        {/* Strategy Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={cn(
                  "group relative transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Card */}
                <div className="glass rounded-3xl p-6 shadow-premium h-full transition-all duration-300 hover:scale-[1.02] group-hover:shadow-xl">
                  {/* Phase Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {pillar.phase}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <pillar.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-1">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pillar.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Tactics */}
                  <div className="space-y-2 mb-6">
                    {pillar.tactics.map((tactic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{tactic}</span>
                      </div>
                    ))}
                  </div>

                  {/* KPI */}
                  <div className="pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground block mb-1">Target KPI</span>
                    <span className="text-lg font-bold text-primary">{pillar.kpi}</span>
                  </div>
                </div>

                {/* Arrow (between cards on desktop) */}
                {index < pillars.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className={cn(
          "mt-16 text-center glass rounded-2xl p-8 shadow-premium max-w-3xl mx-auto transition-all duration-700 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-muted-foreground leading-relaxed">
            Each phase builds upon the previous, creating a cohesive narrative that 
            resonates with UAE audiences while delivering measurable business outcomes.
          </p>
        </div>
      </div>
    </section>
  )
}
