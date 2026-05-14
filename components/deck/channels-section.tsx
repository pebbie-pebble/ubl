"use client"

import { useEffect, useRef, useState } from "react"
import { 
  Monitor, 
  Smartphone, 
  Radio, 
  MapPin, 
  Users, 
  Tv,
  Instagram,
  Youtube
} from "lucide-react"
import { cn } from "@/lib/utils"

const channels = [
  {
    category: "Digital",
    icon: Monitor,
    items: [
      { name: "Premium Display", reach: "4.2M", allocation: 25 },
      { name: "Programmatic Video", reach: "3.8M", allocation: 20 },
      { name: "Native Advertising", reach: "2.5M", allocation: 15 },
    ]
  },
  {
    category: "Social",
    icon: Instagram,
    items: [
      { name: "Instagram", reach: "3.5M", allocation: 15 },
      { name: "TikTok", reach: "2.8M", allocation: 10 },
      { name: "LinkedIn", reach: "1.2M", allocation: 5 },
    ]
  },
  {
    category: "Video",
    icon: Youtube,
    items: [
      { name: "YouTube Pre-roll", reach: "4.0M", allocation: 12 },
      { name: "Connected TV", reach: "1.8M", allocation: 8 },
      { name: "OTT Platforms", reach: "1.5M", allocation: 5 },
    ]
  },
  {
    category: "Out of Home",
    icon: MapPin,
    items: [
      { name: "Digital Billboards", reach: "6.0M", allocation: 18 },
      { name: "Mall Networks", reach: "3.2M", allocation: 12 },
      { name: "Airport Media", reach: "2.5M", allocation: 10 },
    ]
  },
]

const mediaPartners = [
  { name: "Dubai Media Inc.", type: "Digital" },
  { name: "Gulf News Network", type: "Publishing" },
  { name: "MBC Group", type: "Broadcast" },
  { name: "OSN+", type: "Streaming" },
  { name: "JCDecaux", type: "OOH" },
  { name: "Clear Channel", type: "OOH" },
]

export function ChannelsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

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
      id="channels"
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
            Media Channels
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-primary">Omnichannel</span> Presence
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Strategic placement across premium channels ensures maximum visibility 
            and engagement with target audiences.
          </p>
        </div>

        {/* Channel Categories */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Tabs */}
          <div className={cn(
            "lg:col-span-1 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <div className="glass rounded-2xl p-4 shadow-premium sticky top-24">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-2">
                Channel Categories
              </h3>
              <div className="space-y-2">
                {channels.map((channel, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(index)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left",
                      activeCategory === index
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    <channel.icon className="w-5 h-5" />
                    <span className="font-medium">{channel.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Details */}
          <div className={cn(
            "lg:col-span-2 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            <div className="glass rounded-3xl p-8 shadow-premium">
              <div className="flex items-center gap-3 mb-8">
                {(() => {
                  const Icon = channels[activeCategory].icon
                  return (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  )
                })()}
                <div>
                  <h3 className="text-2xl font-bold">{channels[activeCategory].category}</h3>
                  <p className="text-sm text-muted-foreground">Premium placements</p>
                </div>
              </div>

              <div className="space-y-4">
                {channels[activeCategory].items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {item.reach} reach
                        </span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {item.allocation}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${item.allocation * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Allocation */}
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-muted-foreground">Total Category Allocation</span>
                <span className="text-2xl font-bold text-primary">
                  {channels[activeCategory].items.reduce((acc, item) => acc + item.allocation, 0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Media Partners */}
        <div className={cn(
          "mt-16 transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-8">
            MEDIA PARTNERS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mediaPartners.map((partner, index) => (
              <div
                key={index}
                className="glass rounded-xl p-4 shadow-premium text-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <div className="font-medium text-sm truncate">{partner.name}</div>
                <div className="text-xs text-muted-foreground">{partner.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
