"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Briefcase, Crown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const audienceSegments = [
  {
    icon: Crown,
    name: "Affluent Consumers",
    percentage: 35,
    description: "High net-worth individuals with luxury lifestyle preferences",
    traits: ["Premium brands", "Travel", "Fine dining", "Exclusive events"],
  },
  {
    icon: Briefcase,
    name: "Business Professionals",
    percentage: 30,
    description: "C-suite executives and senior management across industries",
    traits: ["Investment", "Technology", "Networking", "Thought leadership"],
  },
  {
    icon: Users,
    name: "Young Millennials",
    percentage: 25,
    description: "Digital natives aged 25-35 with high engagement rates",
    traits: ["Social media", "Experiences", "Sustainability", "Innovation"],
  },
  {
    icon: Globe,
    name: "Expat Community",
    percentage: 10,
    description: "International professionals seeking premium services",
    traits: ["Global brands", "Quality", "Convenience", "Community"],
  },
]

const demographicData = [
  { name: "25-34", value: 32, fill: "var(--chart-1)" },
  { name: "35-44", value: 28, fill: "var(--chart-2)" },
  { name: "45-54", value: 22, fill: "var(--chart-3)" },
  { name: "55+", value: 18, fill: "var(--chart-4)" },
]

const interestData = [
  { name: "Travel", value: 85 },
  { name: "Technology", value: 78 },
  { name: "Fashion", value: 72 },
  { name: "Finance", value: 68 },
  { name: "Wellness", value: 65 },
]

export function AudienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)

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
      id="audience"
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
            Target Audience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Reaching the <span className="text-primary">Right People</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our strategy targets high-value segments with precision, 
            maximizing ROI through data-driven audience insights.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Audience Segments */}
          <div className={cn(
            "space-y-4 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {audienceSegments.map((segment, index) => (
              <button
                key={index}
                onClick={() => setActiveSegment(index)}
                className={cn(
                  "w-full text-left glass rounded-2xl p-6 shadow-premium transition-all duration-300",
                  activeSegment === index
                    ? "ring-2 ring-primary scale-[1.02]"
                    : "hover:scale-[1.01]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    activeSegment === index ? "bg-primary" : "bg-primary/10"
                  )}>
                    <segment.icon className={cn(
                      "w-6 h-6 transition-colors",
                      activeSegment === index ? "text-primary-foreground" : "text-primary"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{segment.name}</h3>
                      <span className="text-2xl font-bold text-primary">
                        {segment.percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {segment.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {segment.traits.map((trait, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className={cn(
            "space-y-6 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {/* Age Demographics */}
            <div className="glass rounded-2xl p-6 shadow-premium">
              <h3 className="font-semibold mb-4">Age Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {demographicData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Areas */}
            <div className="glass rounded-2xl p-6 shadow-premium">
              <h3 className="font-semibold mb-4">Interest Categories</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interestData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={70}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                      }}
                      formatter={(value) => [`${value}%`, "Interest"]}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
