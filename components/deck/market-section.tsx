"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const emiratesData = [
  { name: "Dubai", population: "3.5M", gdp: "$110B", color: "bg-chart-1" },
  { name: "Abu Dhabi", population: "2.9M", gdp: "$280B", color: "bg-chart-2" },
  { name: "Sharjah", population: "1.8M", gdp: "$30B", color: "bg-chart-3" },
  { name: "Ajman", population: "0.5M", gdp: "$4B", color: "bg-chart-4" },
  { name: "RAK", population: "0.4M", gdp: "$7B", color: "bg-chart-5" },
  { name: "Fujairah", population: "0.2M", gdp: "$3B", color: "bg-chart-1" },
  { name: "UAQ", population: "0.1M", gdp: "$1B", color: "bg-chart-2" },
]

const marketStats = [
  { label: "Total GDP", value: "$435B", growth: "+4.2%" },
  { label: "Population", value: "9.4M", growth: "+1.8%" },
  { label: "Internet Penetration", value: "99%", growth: "+0.5%" },
  { label: "Social Media Users", value: "10.5M", growth: "+5.2%" },
]

export function MarketSection() {
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
      id="market"
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
            Market Analysis
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            The UAE <span className="text-primary">Opportunity</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A dynamic market with high purchasing power, digital sophistication, 
            and appetite for premium experiences.
          </p>
        </div>

        {/* Market Stats Grid */}
        <div className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {marketStats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 shadow-premium text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {stat.growth} YoY
              </div>
            </div>
          ))}
        </div>

        {/* Emirates Map Visualization */}
        <div className={cn(
          "glass rounded-3xl p-8 lg:p-12 shadow-premium transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-xl font-semibold mb-8 text-center">Emirates Coverage</h3>
          
          {/* UAE Map Placeholder */}
          <div className="relative aspect-[2/1] mb-8 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary overflow-hidden">
            {/* Decorative Map Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-2xl">
                {/* Simplified UAE Shape */}
                <svg viewBox="0 0 400 200" className="w-full h-auto">
                  <defs>
                    <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {/* UAE simplified path */}
                  <path
                    d="M50,150 L100,120 L150,100 L200,90 L250,85 L300,90 L350,110 L370,130 L350,150 L300,160 L250,155 L200,150 L150,155 L100,160 L50,150"
                    fill="url(#mapGradient)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />
                  {/* City markers */}
                  {[
                    { x: 320, y: 120, name: "Dubai" },
                    { x: 250, y: 110, name: "Abu Dhabi" },
                    { x: 340, y: 100, name: "Sharjah" },
                  ].map((city, i) => (
                    <g key={i}>
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="8"
                        fill="var(--primary)"
                        className="animate-pulse"
                      />
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="4"
                        fill="white"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
          </div>

          {/* Emirates List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {emiratesData.map((emirate, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center"
              >
                <div className={cn(
                  "w-3 h-3 rounded-full mx-auto mb-2",
                  emirate.color
                )} />
                <div className="font-medium text-sm mb-1">{emirate.name}</div>
                <div className="text-xs text-muted-foreground">{emirate.population}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className={cn(
          "grid md:grid-cols-3 gap-6 mt-8 transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {[
            { title: "Highest GDP per Capita", desc: "Among the world's wealthiest nations" },
            { title: "Young Demographics", desc: "65% of population under 35 years" },
            { title: "Expat Majority", desc: "88% diverse international residents" },
          ].map((insight, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 shadow-premium text-center"
            >
              <h4 className="font-semibold text-primary mb-2">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
