"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Sparkles, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts"

const investmentTiers = [
  {
    name: "Essential",
    price: "AED 850K",
    description: "Core campaign with essential touchpoints",
    features: [
      "3 Emirates coverage",
      "Digital & Social channels",
      "4-month duration",
      "Monthly reporting",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "AED 1.8M",
    description: "Comprehensive campaign with premium placements",
    features: [
      "All 7 Emirates coverage",
      "Omnichannel presence",
      "6-month duration",
      "Weekly reporting",
      "Advanced analytics",
      "Influencer partnerships",
      "Event activations",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "AED 3.2M",
    description: "Full-scale campaign with exclusive benefits",
    features: [
      "Full UAE + GCC coverage",
      "Omnichannel + Experiential",
      "12-month duration",
      "Real-time reporting",
      "Custom dashboards",
      "Celebrity partnerships",
      "Exclusive sponsorships",
      "Dedicated team",
    ],
    popular: false,
  },
]

const budgetAllocation = [
  { name: "Digital Media", value: 35, fill: "var(--chart-1)" },
  { name: "Out of Home", value: 25, fill: "var(--chart-2)" },
  { name: "Production", value: 15, fill: "var(--chart-3)" },
  { name: "Partnerships", value: 15, fill: "var(--chart-4)" },
  { name: "Analytics", value: 10, fill: "var(--chart-5)" },
]

const projectedROI = [
  { metric: "Brand Awareness Lift", value: "+45%", baseline: "vs. industry avg" },
  { metric: "Engagement Rate", value: "8.5%", baseline: "3x UAE benchmark" },
  { metric: "Lead Cost", value: "-30%", baseline: "vs. previous campaigns" },
  { metric: "Media Efficiency", value: "1.4x", baseline: "above plan" },
]

export function InvestmentSection() {
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
      id="investment"
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
            Investment Overview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Flexible <span className="text-primary">Investment</span> Options
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the package that aligns with your goals and budget. 
            All tiers deliver premium value and measurable results.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className={cn(
          "grid md:grid-cols-3 gap-6 mb-20 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {investmentTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "relative glass rounded-3xl p-8 shadow-premium transition-all duration-300 hover:scale-[1.02]",
                tier.popular && "ring-2 ring-primary"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Recommended
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary mb-2">{tier.price}</div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-full h-12",
                  tier.popular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                Get Started
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        {/* Budget Allocation & ROI */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Budget Allocation */}
          <div className={cn(
            "glass rounded-3xl p-8 shadow-premium transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <h3 className="text-xl font-bold mb-6 text-center">Budget Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Allocation"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {budgetAllocation.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Projected ROI */}
          <div className={cn(
            "glass rounded-3xl p-8 shadow-premium transition-all duration-700 delay-400",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            <h3 className="text-xl font-bold mb-6 text-center">Projected Performance</h3>
            <div className="space-y-4">
              {projectedROI.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{item.metric}</span>
                    <span className="text-xl font-bold text-primary">{item.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.baseline}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              *Projections based on historical campaign data and market benchmarks
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
