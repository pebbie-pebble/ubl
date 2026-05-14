"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const sections = [
  { id: "hero", label: "Home" },
  { id: "overview", label: "Overview" },
  { id: "market", label: "Market" },
  { id: "audience", label: "Audience" },
  { id: "strategy", label: "Strategy" },
  { id: "channels", label: "Channels" },
  { id: "timeline", label: "Timeline" },
  { id: "investment", label: "Investment" },
  { id: "contact", label: "Contact" },
]

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }))
      
      const current = sectionElements.find(s => {
        if (s.element) {
          const rect = s.element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      
      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass shadow-premium py-3"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              APEX Media
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={cn(
          "absolute top-20 left-4 right-4 glass rounded-2xl p-6 shadow-premium transition-all duration-500",
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        )}>
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-4 py-3 text-left text-base font-medium rounded-xl transition-all duration-300",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
