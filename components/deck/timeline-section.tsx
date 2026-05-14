"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, CheckCircle2, Circle, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"

const milestones = [
  {
    month: "Jan",
    title: "Campaign Kickoff",
    description: "Strategy finalization, creative development, and partner onboarding",
    status: "complete",
    activities: ["Strategy approval", "Creative production", "Media planning"]
  },
  {
    month: "Feb",
    title: "Phase 1 Launch",
    description: "Awareness campaign goes live across primary channels",
    status: "complete",
    activities: ["OOH activation", "Digital launch", "Influencer seeding"]
  },
  {
    month: "Mar",
    title: "Expansion",
    description: "Extended reach with secondary channels and optimizations",
    status: "current",
    activities: ["Social amplification", "Event activations", "Performance review"]
  },
  {
    month: "Apr",
    title: "Phase 2: Engagement",
    description: "Consideration campaigns with interactive content",
    status: "upcoming",
    activities: ["Video content", "Community building", "Retargeting launch"]
  },
  {
    month: "May",
    title: "Peak Campaign",
    description: "Maximum media weight coinciding with key events",
    status: "upcoming",
    activities: ["Event sponsorships", "Premium placements", "PR activations"]
  },
  {
    month: "Jun",
    title: "Phase 3: Conversion",
    description: "Focus on lead generation and conversion optimization",
    status: "upcoming",
    activities: ["Lead campaigns", "Exclusive offers", "VIP experiences"]
  },
]

const keyDates = [
  { date: "Jan 15", event: "Campaign Launch" },
  { date: "Feb 28", event: "Dubai Design Week" },
  { date: "Mar 21", event: "Art Dubai" },
  { date: "Apr 10", event: "Dubai Luxury Show" },
  { date: "May 15", event: "Arabian Travel Market" },
  { date: "Jun 30", event: "Campaign Wrap" },
]

export function TimelineSection() {
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
      id="timeline"
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
            Campaign Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-primary">6-Month</span> Execution Plan
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A carefully choreographed timeline aligned with key UAE events 
            and seasonal opportunities.
          </p>
        </div>

        {/* Timeline */}
        <div className={cn(
          "relative transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={cn(
                  "relative grid md:grid-cols-2 gap-4 md:gap-8",
                  index % 2 === 0 ? "md:text-right" : ""
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    milestone.status === "complete" 
                      ? "bg-primary" 
                      : milestone.status === "current"
                        ? "bg-primary animate-pulse ring-4 ring-primary/30"
                        : "bg-secondary border-2 border-border"
                  )}>
                    {milestone.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    ) : milestone.status === "current" ? (
                      <Rocket className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Content - alternating sides on desktop */}
                <div className={cn(
                  "ml-12 md:ml-0 glass rounded-2xl p-6 shadow-premium transition-all hover:scale-[1.02]",
                  index % 2 === 0 
                    ? "md:col-start-1" 
                    : "md:col-start-2"
                )}>
                  <div className="flex items-center gap-2 mb-2 md:justify-start">
                    {index % 2 !== 0 && (
                      <Calendar className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-sm font-semibold text-primary">
                      {milestone.month} 2026
                    </span>
                    {index % 2 === 0 && (
                      <Calendar className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {milestone.description}
                  </p>
                  <div className="flex flex-wrap gap-2 md:justify-start">
                    {milestone.activities.map((activity, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Dates */}
        <div className={cn(
          "mt-20 transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-8">
            KEY DATES & EVENTS
          </h3>
          <div className="glass rounded-2xl p-6 shadow-premium overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {keyDates.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-[140px] p-4 rounded-xl bg-secondary/50 text-center hover:bg-secondary transition-colors"
                >
                  <div className="text-lg font-bold text-primary mb-1">{item.date}</div>
                  <div className="text-sm text-muted-foreground">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
