"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

type SlideType =
  | "cover"
  | "brand"
  | "objective"
  | "mediaSummary"
  | "timelineMetrics"
  | "mapRight"
  | "mapLeft"
  | "visualSummary"
  | "closing"

type Slide = {
  eyebrow: string
  title: string
  subtitle?: string
  body?: string
  points?: string[]
  type: SlideType
  image?: string
  gallery?: { title: string; image: string }[]
  popupTitle?: string
  popupBody?: string
  insightTitle?: string
  insightBody?: string
}

const loopImages = {
  ceiling: "https://looprestaurant.ae/_next/image?q=75&url=%2Fimages%2Fceiling.avif&w=2560",
  pot: "https://looprestaurant.ae/_next/image?q=75&url=%2Fimages%2Fpot.avif&w=2560",
  moments: "https://looprestaurant.ae/_next/image?q=75&url=%2Fimages%2Fmoments-text.webp&w=2560",
}

const mapEmbed =
  "https://www.google.com/maps/d/u/0/embed?mid=1bB0xAiPyYJqyDKuvXJd1OPHoo1lLmBw&ehbc=2E312F"

const mapLink =
  "https://www.google.com/maps/d/u/0/edit?mid=1bB0xAiPyYJqyDKuvXJd1OPHoo1lLmBw&usp=sharing"

const whatsappLink =
  "https://wa.me/971527249913?text=Hi%2C%20I%20would%20like%20to%20address%20concerns%20regarding%20the%20Loop%20Restaurant%20OOH%20proposal."

const mediaPlan = [
  {
    title: "SZR LED Unipole 01",
    location: "Sheikh Zayed Road",
    format: "LED Unipole, 10 sec",
    duration: "1 month",
    cost: 75520,
    traffic: "745,000+ vehicles daily",
    impressions: "High commuter visibility",
    image: "/loop/page-06.webp",
  },
  {
    title: "SZR LED Unipole 02",
    location: "Sheikh Zayed Road",
    format: "LED Unipole, 10 sec",
    duration: "1 month",
    cost: 75520,
    traffic: "745,000+ vehicles daily",
    impressions: "High commuter visibility",
    image: "/loop/page-07.webp",
  },
  {
    title: "SZR LED Unipole 03",
    location: "Sheikh Zayed Road",
    format: "LED Unipole, 10 sec",
    duration: "1 month",
    cost: 75520,
    traffic: "745,000+ vehicles daily",
    impressions: "High commuter visibility",
    image: "/loop/page-08.webp",
  },
  {
    title: "Al Khail LED Unipole",
    location: "Al Khail Road",
    format: "LED Unipole, 10 sec",
    duration: "1 month",
    cost: 750520,
    traffic: "Approx. 595,000 vehicles daily",
    impressions: "High-volume connector route",
    image: "/loop/page-03.webp",
  },
  {
    title: "SZR Dubai Canal",
    location: "Dubai Canal / SZR",
    format: "4x LED Screens",
    duration: "2 weeks",
    cost: 275520,
    traffic: "Premium SZR / Canal movement",
    impressions: "P6 high-clarity LED package",
    image: "/loop/page-09.webp",
  },
  {
    title: "Business Bay Tower Lifts",
    location: "Business Bay",
    format: "Residential and commercial tower lift screens",
    duration: "1 month",
    cost: 60520,
    traffic: "Residential + commercial tower audience",
    impressions: "Approx. 2.84M monthly impressions combined",
    image: "/loop/page-15.webp",
  },
]

const totalInvestment = mediaPlan.reduce((sum, item) => sum + item.cost, 0)

function formatAED(value: number) {
  return `AED ${value.toLocaleString("en-AE")}`
}

const slides: Slide[] = [
  {
    eyebrow: "Loop Restaurant Dubai",
    title: "Stay in the Loop",
    subtitle: "OOH & Elevator Media Campaign Proposal",
    body: "Campaign Start: 1 June 2026",
    type: "cover",
    popupTitle: "Presented by OOH.ae",
    popupBody:
      "OOH.ae is a UAE outdoor advertising platform helping brands plan, package, and activate premium media across roads, landmarks, towers, malls, airports, and high-value urban environments.",
  },
  {
    eyebrow: "Brand Context",
    title: "A circle of taste, sound, and slow time.",
    body: "Loop is positioned as a sensory dining destination in Business Bay, built around food, music, light, atmosphere, and the quiet rhythm of premium evening dining.",
    type: "brand",
    image: loopImages.ceiling,
    points: [
      "Taste · Connect · Flow.",
      "Seasonal, slow, crafted, welcoming, local, quiet.",
      "Food, music, and light moving at one tempo.",
    ],
  },
  {
    eyebrow: "Campaign Objective",
    title: "Build awareness, anticipation, and reservation intent.",
    body: "The campaign introduces Loop through selected Dubai OOH and elevator media, creating city-scale visibility and repeated exposure close to dining decisions.",
    type: "objective",
    image: loopImages.pot,
    points: [
      "Awareness across premium Dubai movement corridors.",
      "Repeated exposure close to work and home decisions.",
      "Elegant brand recall through short, memorable copy.",
    ],
    insightTitle: "Objective",
    insightBody:
      "The campaign builds recognition first, curiosity second, and reservation intent third, without adding media beyond the supplied plan.",
  },
  {
    eyebrow: "Media Plan Summary",
    title: "Selected media inventory",
    type: "mediaSummary",
    gallery: mediaPlan.map((item) => ({
      title: item.title,
      image: item.image,
    })),
    popupTitle: "Focused media plan",
    popupBody:
      "The plan uses only six selected inventory rows: three SZR LED Unipoles, one Al Khail LED Unipole, SZR Dubai Canal 4x LED Screens, and Business Bay tower lift screens.",
  },
  {
    eyebrow: "Campaign Timing & Site Data",
    title: "Timeline, traffic, and exposure logic",
    body: "The launch begins on 1 June 2026, with all placements planned for one month except the SZR Dubai Canal LED screen package, which runs for two weeks.",
    type: "timelineMetrics",
    popupTitle: "Timing note",
    popupBody:
      "Exact end dates and final exposure figures remain subject to media owner confirmation, but the table keeps the campaign structure clear for client review.",
  },
  {
    eyebrow: "Sheikh Zayed Road",
    title: "Three LED Unipoles as a high-frequency awareness layer",
    body: "The three SZR LED Unipoles create repeated roadside visibility across one of Dubai’s most prestigious commuter corridors.",
    type: "mapRight",
    image: "/loop/page-02.webp",
    points: [
      "Format: LED Unipole, 10 sec.",
      "Duration: 1 month.",
      "Cost per placement: AED 75,520.",
      "Sheikh Zayed Road reaches over 745,000 vehicles daily.",
    ],
    gallery: [
      { title: "SZR route context", image: "/loop/page-02.webp" },
      { title: "Placement 01", image: "/loop/page-06.webp" },
      { title: "Placement 02", image: "/loop/page-07.webp" },
    ],
    popupTitle: "Stay visible where Dubai moves.",
    popupBody:
      "A prestige roadside layer designed to keep Loop present across daily commuter movement, business traffic, and landmark-led city journeys.",
  },
  {
    eyebrow: "Al Khail Road",
    title: "A high-traffic connector route",
    body: "The Al Khail Road LED Unipole extends campaign visibility across a major movement corridor connecting business, residential, and emerging lifestyle hubs.",
    type: "mapLeft",
    image: "/loop/page-03.webp",
    points: [
      "Format: LED Unipole, 10 sec.",
      "Duration: 1 month.",
      "Cost: AED 750,520.",
      "Supports approx. 595,000 vehicles daily.",
    ],
    gallery: [
      { title: "Al Khail context", image: "/loop/page-03.webp" },
      { title: "Route movement", image: "/loop/page-03.webp" },
      { title: "Connector visibility", image: "/loop/page-03.webp" },
    ],
    popupTitle: "Catch the city between destinations.",
    popupBody:
      "Al Khail extends Loop’s presence across residential, business, and lifestyle movement, building awareness before audiences arrive at their evening decision.",
  },
  {
    eyebrow: "Dubai Canal / SZR",
    title: "4x premium LED screens near Dubai’s landmark district",
    body: "The SZR Dubai Canal package adds a premium LED presence around key destination zones including SZR, Dubai Mall, Burj Khalifa, Downtown, and Business Bay.",
    type: "mapLeft",
    image: "/loop/page-09.webp",
    points: [
      "Format: 4x LED Screens.",
      "Duration: 2 weeks.",
      "Cost: AED 275,520.",
      "P6 screen technology, as referenced in the PDF.",
    ],
    gallery: [
      { title: "Dubai Canal screens", image: "/loop/page-09.webp" },
      { title: "Canal map", image: "/loop/page-10.webp" },
      { title: "LED package", image: "/loop/page-11.webp" },
    ],
    popupTitle: "Let the city see the glow.",
    popupBody:
      "The Dubai Canal screens give Loop a polished LED presence close to premium landmarks, evening traffic, and destination-led dining behaviour.",
  },
  {
    eyebrow: "Business Bay",
    title: "Elevator screens for repeated indoor exposure",
    body: "Business Bay residential and commercial tower lift screens place Loop close to daily work, home, and evening dining decisions.",
    type: "mapLeft",
    image: "/loop/page-15.webp",
    points: [
      "Format: Residential and commercial tower lift screens.",
      "Duration: 1 month.",
      "Cost: AED 60,520.",
      "Approx. 2.84M monthly impressions combined across residential and commercial circuits.",
    ],
    gallery: [
      { title: "Tower network", image: "/loop/page-14.webp" },
      { title: "Lift screen examples", image: "/loop/page-15.webp" },
      { title: "Business Bay proximity", image: "/loop/page-15.webp" },
    ],
    popupTitle: "Stay close to the moment of choice.",
    popupBody:
      "Elevator media brings Loop into the daily rhythm of residents, executives, and after-work audiences, creating repeated exposure before dinner plans are made.",
  },
  {
    eyebrow: "Selected Media Visual Summary",
    title: "A focused six-part launch footprint",
    type: "visualSummary",
    gallery: mediaPlan.map((item) => ({
      title: item.title,
      image: item.image,
    })),
    popupTitle: "Six planned placements",
    popupBody:
      "This visual summary keeps the full media mix easy to review before final booking, artwork approvals, upload requirements, and applicable fees are confirmed.",
  },
  {
    eyebrow: "Closing",
    title: "Let Dubai stay in the Loop",
    subtitle: "Click here to address concerns",
    type: "closing",
    image: loopImages.moments,
    popupTitle: "Final note",
    popupBody:
      "Loop’s campaign should feel like the restaurant itself: quiet, memorable, atmospheric, and designed for people who choose their evenings carefully.",
  },
]

export default function LoopDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [activePopup, setActivePopup] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("loop-theme")
    if (savedTheme === "dark") setDarkMode(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("loop-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
        setActivePopup(false)
      }

      if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0))
        setActivePopup(false)
      }

      if (event.key === "Escape") {
        setActivePopup(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const slide = slides[currentSlide]

  const themeClass = darkMode
    ? "bg-[#100f0c] text-[#f8efe1]"
    : "bg-[#efe6d8] text-[#1f1a15]"

  const deckClass = darkMode
    ? "border-[#3c3429] bg-[#181511] text-[#f8efe1]"
    : "border-[#d5c2a8] bg-[#fffaf1] text-[#1f1a15]"

  const softCardClass = darkMode
    ? "border-[#3c3429] bg-[#211d17]/85"
    : "border-[#d5c2a8] bg-[#fff7ea]/85"

  const mutedText = darkMode ? "text-[#cabba2]" : "text-[#6f604f]"
  const accent = darkMode ? "text-[#d1aa5f]" : "text-[#9c6428]"
  const divider = darkMode ? "border-[#3c3429]" : "border-[#d5c2a8]"

  const progress = useMemo(() => ((currentSlide + 1) / slides.length) * 100, [currentSlide])

  function nextSlide() {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
    setActivePopup(false)
  }

  function prevSlide() {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
    setActivePopup(false)
  }

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${themeClass}`}
      style={{
        fontFamily:
          'Inter, Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="flex min-h-screen flex-col px-3 py-2">
        <header className="mx-auto mb-2 flex w-full max-w-[1380px] items-center justify-between">
          <div className="flex items-center gap-3">
            <OOHLogo accent={accent} />
            <div className={`hidden h-7 border-l ${divider} sm:block`} />
            <div>
              <p className={`text-[8px] uppercase tracking-[0.34em] ${accent}`}>
                Loop Restaurant Dubai
              </p>
              <p className={`mt-0.5 text-[10px] ${mutedText}`}>
                OOH & Elevator Media Campaign Proposal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className={`hidden text-[10px] sm:block ${mutedText}`}>Use ← → keys</p>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full border px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] transition ${softCardClass}`}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-[1380px] flex-1 items-center justify-center">
          <div
            className={`relative aspect-video w-full max-h-[calc(100vh-74px)] overflow-hidden rounded-[24px] border shadow-2xl transition-colors duration-500 ${deckClass}`}
          >
            <div
              className="absolute left-0 top-0 z-20 h-[3px] bg-[#b89150] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

            {slide.type !== "cover" && (
              <div className="absolute inset-0 opacity-[0.1]">
                <div className="absolute right-[-8%] top-[-14%] h-80 w-80 rounded-full bg-[#b89150] blur-3xl" />
                <div className="absolute bottom-[-12%] left-[-8%] h-96 w-96 rounded-full bg-[#6d4828] blur-3xl" />
              </div>
            )}

            {renderSlide({
              slide,
              currentSlide,
              softCardClass,
              mutedText,
              accent,
              divider,
              nextSlide,
              prevSlide,
              setActivePopup,
            })}
          </div>
        </section>
      </div>

      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6 backdrop-blur-sm">
          <div className={`relative max-w-xl rounded-[28px] border p-7 shadow-2xl ${deckClass}`}>
            <p className={`text-[9px] uppercase tracking-[0.35em] ${accent}`}>Media Insight</p>

            <h3
              className="mt-4 text-3xl font-light leading-tight tracking-[-0.04em]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {slide.popupTitle}
            </h3>

            <p className={`mt-5 text-sm leading-7 ${mutedText}`}>{slide.popupBody}</p>

            <button
              onClick={() => setActivePopup(false)}
              className="mt-7 rounded-full bg-[#b89150] px-5 py-2 text-xs text-[#15110c]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function renderSlide({
  slide,
  currentSlide,
  softCardClass,
  mutedText,
  accent,
  divider,
  nextSlide,
  prevSlide,
  setActivePopup,
}: {
  slide: Slide
  currentSlide: number
  softCardClass: string
  mutedText: string
  accent: string
  divider: string
  nextSlide: () => void
  prevSlide: () => void
  setActivePopup: (value: boolean) => void
}) {
  if (slide.type === "cover") {
    return (
      <CoverSlide
        slide={slide}
        currentSlide={currentSlide}
        softCardClass={softCardClass}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
      />
    )
  }

  if (slide.type === "mediaSummary") {
    return (
      <SlideShell
        slide={slide}
        currentSlide={currentSlide}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        softCardClass={softCardClass}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
      >
        <div className="grid h-full min-h-0 grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="min-h-0">
            <MediaTable mutedText={mutedText} divider={divider} />
          </div>
          <SixImageGrid gallery={slide.gallery || []} softCardClass={softCardClass} mutedText={mutedText} />
        </div>
      </SlideShell>
    )
  }

  if (slide.type === "timelineMetrics") {
    return (
      <SlideShell
        slide={slide}
        currentSlide={currentSlide}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        softCardClass={softCardClass}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
      >
        <div className="mt-3 grid gap-3">
          <TimelineBars mutedText={mutedText} divider={divider} softCardClass={softCardClass} />
          <MetricsTable divider={divider} mutedText={mutedText} />
        </div>
      </SlideShell>
    )
  }

  if (slide.type === "mapRight") {
    return (
      <MapSlide
        slide={slide}
        currentSlide={currentSlide}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        softCardClass={softCardClass}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
        mapSide="right"
      />
    )
  }

  if (slide.type === "mapLeft") {
    return (
      <MapSlide
        slide={slide}
        currentSlide={currentSlide}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        softCardClass={softCardClass}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
        mapSide="left"
      />
    )
  }

  if (slide.type === "visualSummary") {
    return (
      <SlideShell
        slide={slide}
        currentSlide={currentSlide}
        mutedText={mutedText}
        accent={accent}
        divider={divider}
        softCardClass={softCardClass}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setActivePopup={setActivePopup}
      >
        <div className="mt-3 grid min-h-0 grid-cols-[0.9fr_1.1fr] gap-3">
          <Investment mutedText={mutedText} divider={divider} softCardClass={softCardClass} compact />
          <SixImageGrid gallery={slide.gallery || []} softCardClass={softCardClass} mutedText={mutedText} />
        </div>
      </SlideShell>
    )
  }

  if (slide.type === "closing") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
        {slide.image && (
          <img
            src={slide.image}
            alt="Loop closing visual"
            className="mb-5 max-h-[90px] max-w-[520px] object-contain"
          />
        )}

        <p className={`text-[9px] uppercase tracking-[0.38em] ${accent}`}>Closing</p>

        <h1
          className="mt-4 max-w-4xl text-[clamp(2.4rem,5vw,5.2rem)] font-light leading-[0.92] tracking-[-0.06em]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {slide.title}
        </h1>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 rounded-full bg-[#b89150] px-7 py-3 text-sm text-[#15110c] transition hover:opacity-90"
        >
          {slide.subtitle}
        </a>

        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
          <button
            onClick={prevSlide}
            className={`rounded-full border px-4 py-2 text-[10px] ${softCardClass}`}
          >
            Previous
          </button>
          <p className={`text-[10px] ${mutedText}`}>Slide {currentSlide + 1} / {slides.length}</p>
          <span className="w-[70px]" />
        </div>
      </div>
    )
  }

  return (
    <SlideShell
      slide={slide}
      currentSlide={currentSlide}
      mutedText={mutedText}
      accent={accent}
      divider={divider}
      softCardClass={softCardClass}
      nextSlide={nextSlide}
      prevSlide={prevSlide}
      setActivePopup={setActivePopup}
    >
      <DefaultSlideContent
        slide={slide}
        mutedText={mutedText}
        divider={divider}
        softCardClass={softCardClass}
      />
    </SlideShell>
  )
}

function CoverSlide({
  slide,
  currentSlide,
  softCardClass,
  mutedText,
  accent,
  divider,
  nextSlide,
  prevSlide,
  setActivePopup,
}: {
  slide: Slide
  currentSlide: number
  softCardClass: string
  mutedText: string
  accent: string
  divider: string
  nextSlide: () => void
  prevSlide: () => void
  setActivePopup: (value: boolean) => void
}) {
  return (
    <div className="relative h-full overflow-hidden bg-[#130b05] text-[#f8efe1]">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        src="/loop/loop-showcase.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(184,145,80,0.25),transparent_34%),linear-gradient(90deg,rgba(18,10,4,0.96)_0%,rgba(30,17,8,0.88)_42%,rgba(74,45,21,0.48)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#120b05] via-transparent to-[#120b05]/40" />

      <div className="relative z-10 grid h-full grid-cols-[1.12fr_0.88fr] gap-8 p-8">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-[9px] uppercase tracking-[0.5em] text-[#d1aa5f]">
            Loop Restaurant Dubai
          </p>

          <h1
            className="max-w-3xl text-[clamp(4.2rem,7.8vw,8.6rem)] font-light leading-[0.85] tracking-[-0.08em]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {slide.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-7 text-[#d9c6a4]">{slide.subtitle}</p>
          <p className="mt-3 text-sm text-[#bfae92]">{slide.body}</p>

          {slide.popupTitle && (
            <button
              onClick={() => setActivePopup(true)}
              className="mt-8 w-fit rounded-full border border-[#b89150] px-5 py-2 text-[9px] uppercase tracking-[0.22em] text-[#d1aa5f] transition hover:bg-[#b89150] hover:text-[#130b05]"
            >
              View Media Insight
            </button>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <div className="rounded-[28px] border border-[#b89150]/50 bg-[#160f09]/70 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#d1aa5f]">
              Presented by OOH.ae
            </p>
            <p className="mt-4 text-sm leading-6 text-[#d9c6a4]">
              UAE outdoor advertising specialists for premium roadside, tower, landmark, and urban media planning.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] text-[#f8efe1]">
              <div>
                <p className="text-[#bfae92]">Website</p>
                <p>ooh.ae</p>
              </div>
              <div>
                <p className="text-[#bfae92]">Market</p>
                <p>UAE</p>
              </div>
              <div>
                <p className="text-[#bfae92]">Focus</p>
                <p>OOH Media</p>
              </div>
              <div>
                <p className="text-[#bfae92]">Proposal</p>
                <p>Loop Dubai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between border-t border-[#b89150]/35 pt-3`}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="rounded-full border border-[#b89150]/40 px-4 py-2 text-[10px] text-[#d9c6a4] transition disabled:cursor-not-allowed disabled:opacity-30"
        >
          Previous
        </button>

        <p className="text-[10px] text-[#bfae92]">Slide {currentSlide + 1} / {slides.length}</p>

        <button
          onClick={nextSlide}
          className="rounded-full bg-[#b89150] px-4 py-2 text-[10px] text-[#15110c] transition hover:opacity-90"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function SlideShell({
  slide,
  currentSlide,
  children,
  mutedText,
  accent,
  divider,
  softCardClass,
  nextSlide,
  prevSlide,
  setActivePopup,
}: {
  slide: Slide
  currentSlide: number
  children: ReactNode
  mutedText: string
  accent: string
  divider: string
  softCardClass: string
  nextSlide: () => void
  prevSlide: () => void
  setActivePopup: (value: boolean) => void
}) {
  return (
    <div className="relative flex h-full flex-col p-5 xl:p-6">
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <p className={`mb-3 text-[8px] uppercase tracking-[0.42em] ${accent}`}>{slide.eyebrow}</p>

        <h1
          className="max-w-5xl text-[clamp(1.45rem,2.6vw,3.15rem)] font-light leading-[0.98] tracking-[-0.045em]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && <p className={`mt-2 text-[clamp(0.78rem,1vw,1rem)] ${mutedText}`}>{slide.subtitle}</p>}

        {slide.body && <p className={`mt-3 max-w-4xl text-[clamp(0.7rem,0.82vw,0.82rem)] leading-5 ${mutedText}`}>{slide.body}</p>}

        {children}

        {slide.popupTitle && (
          <button
            onClick={() => setActivePopup(true)}
            className="mt-3 rounded-full border border-[#b89150] px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#9c6428] transition hover:bg-[#b89150] hover:text-[#15110c]"
          >
            View Media Insight
          </button>
        )}
      </div>

      <div className={`mt-3 flex items-center justify-between border-t pt-2.5 ${divider}`}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`rounded-full border px-3.5 py-1.5 text-[10px] transition disabled:cursor-not-allowed disabled:opacity-30 ${softCardClass}`}
        >
          Previous
        </button>

        <p className={`text-[10px] ${mutedText}`}>
          Slide {currentSlide + 1} / {slides.length}
        </p>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="rounded-full bg-[#b89150] px-4 py-1.5 text-[10px] text-[#15110c] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function DefaultSlideContent({
  slide,
  mutedText,
  divider,
  softCardClass,
}: {
  slide: Slide
  mutedText: string
  divider: string
  softCardClass: string
}) {
  return (
    <div className="mt-4 grid min-h-0 grid-cols-[1.05fr_0.95fr] gap-4">
      <div>
        {slide.points && (
          <div className="grid gap-2">
            {slide.points.map((point) => (
              <div key={point} className={`border-t pt-2 ${divider}`}>
                <p className="text-[clamp(0.68rem,0.78vw,0.8rem)] leading-4">{point}</p>
              </div>
            ))}
          </div>
        )}

        {slide.insightTitle && slide.insightBody && (
          <div className={`mt-4 rounded-2xl border p-4 ${softCardClass}`}>
            <p className="text-[8px] uppercase tracking-[0.28em] text-[#9c6428]">Media Insight</p>
            <h3
              className="mt-2 text-2xl font-light tracking-[-0.04em]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {slide.insightTitle}
            </h3>
            <p className={`mt-2 text-xs leading-5 ${mutedText}`}>{slide.insightBody}</p>
          </div>
        )}
      </div>

      <div className="min-h-0">
        {slide.image && (
          <div className={`overflow-hidden rounded-[20px] border ${softCardClass}`}>
            <img
              src={slide.image}
              alt={`${slide.title} visual`}
              className="h-[240px] w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function MapSlide({
  slide,
  currentSlide,
  mutedText,
  accent,
  divider,
  softCardClass,
  nextSlide,
  prevSlide,
  setActivePopup,
  mapSide,
}: {
  slide: Slide
  currentSlide: number
  mutedText: string
  accent: string
  divider: string
  softCardClass: string
  nextSlide: () => void
  prevSlide: () => void
  setActivePopup: (value: boolean) => void
  mapSide: "left" | "right"
}) {
  const textBlock = (
    <div className="min-h-0 overflow-y-auto pr-1">
      <p className={`mb-3 text-[8px] uppercase tracking-[0.42em] ${accent}`}>{slide.eyebrow}</p>

      <h1
        className="text-[clamp(1.4rem,2.3vw,2.9rem)] font-light leading-[0.98] tracking-[-0.045em]"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {slide.title}
      </h1>

      {slide.body && <p className={`mt-3 text-[clamp(0.7rem,0.8vw,0.82rem)] leading-5 ${mutedText}`}>{slide.body}</p>}

      {slide.points && (
        <div className="mt-3 grid gap-2">
          {slide.points.map((point) => (
            <div key={point} className={`border-t pt-2 ${divider}`}>
              <p className="text-[clamp(0.66rem,0.76vw,0.78rem)] leading-4">{point}</p>
            </div>
          ))}
        </div>
      )}

      {slide.popupTitle && (
        <button
          onClick={() => setActivePopup(true)}
          className="mt-3 rounded-full border border-[#b89150] px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[#9c6428] transition hover:bg-[#b89150] hover:text-[#15110c]"
        >
          View Media Insight
        </button>
      )}
    </div>
  )

  const visualBlock = (
    <div className="grid h-full min-h-0 grid-rows-[0.42fr_0.58fr] gap-2.5">
      <div className="grid grid-cols-3 gap-2.5">
        {(slide.gallery || []).slice(0, 3).map((item) => (
          <FigureCard key={item.title} item={item} softCardClass={softCardClass} mutedText={mutedText} />
        ))}
      </div>

      <div className={`overflow-hidden rounded-[18px] border ${softCardClass}`}>
        <div className="flex items-center justify-between px-2 py-1">
          <p className={`text-[7px] uppercase tracking-[0.16em] ${mutedText}`}>Interactive media map</p>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-[7px] uppercase tracking-[0.14em] text-[#9c6428]">
            Open map
          </a>
        </div>
        <iframe
          src={mapEmbed}
          className="h-[230px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )

  return (
    <div className="relative flex h-full flex-col p-5 xl:p-6">
      <div className={`grid min-h-0 flex-1 gap-4 ${mapSide === "right" ? "grid-cols-[0.95fr_1.05fr]" : "grid-cols-[1.05fr_0.95fr]"}`}>
        {mapSide === "left" ? visualBlock : textBlock}
        {mapSide === "left" ? textBlock : visualBlock}
      </div>

      <div className={`mt-3 flex items-center justify-between border-t pt-2.5 ${divider}`}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`rounded-full border px-3.5 py-1.5 text-[10px] transition disabled:cursor-not-allowed disabled:opacity-30 ${softCardClass}`}
        >
          Previous
        </button>

        <p className={`text-[10px] ${mutedText}`}>
          Slide {currentSlide + 1} / {slides.length}
        </p>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="rounded-full bg-[#b89150] px-4 py-1.5 text-[10px] text-[#15110c] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function OOHLogo({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b89150] text-[9px] font-semibold">
        OOH
      </div>
      <div>
        <p className={`text-xs font-semibold tracking-[0.14em] ${accent}`}>OOH.ae</p>
        <p className="text-[8px] uppercase tracking-[0.16em] opacity-70">Outdoor Advertising UAE</p>
      </div>
    </div>
  )
}

function MediaTable({
  mutedText,
  divider,
}: {
  mutedText: string
  divider: string
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-inherit text-[8.5px] xl:text-[9.5px]">
      <div className={`grid grid-cols-[1.25fr_1fr_0.7fr_0.75fr] border-b ${divider}`}>
        <div className="p-2 uppercase tracking-[0.16em]">Media</div>
        <div className="p-2 uppercase tracking-[0.16em]">Format</div>
        <div className="p-2 uppercase tracking-[0.16em]">Duration</div>
        <div className="p-2 text-right uppercase tracking-[0.16em]">Cost</div>
      </div>

      {mediaPlan.map((item) => (
        <div key={item.title} className={`grid grid-cols-[1.25fr_1fr_0.7fr_0.75fr] border-b ${divider}`}>
          <div className="p-2">
            <p className="font-medium">{item.title}</p>
            <p className={`mt-0.5 text-[8px] ${mutedText}`}>{item.location}</p>
          </div>
          <div className="p-2">{item.format}</div>
          <div className="p-2">{item.duration}</div>
          <div className="p-2 text-right font-medium">{formatAED(item.cost)}</div>
        </div>
      ))}
    </div>
  )
}

function TimelineBars({
  mutedText,
  divider,
  softCardClass,
}: {
  mutedText: string
  divider: string
  softCardClass: string
}) {
  return (
    <div className={`rounded-2xl border p-3 ${softCardClass}`}>
      <div className="mb-3 grid grid-cols-[1.1fr_2fr_0.6fr] gap-3 text-[8px] uppercase tracking-[0.18em]">
        <div>Placement</div>
        <div>June 2026 Campaign Window</div>
        <div>Duration</div>
      </div>

      <div className="grid gap-2">
        {mediaPlan.map((item) => {
          const width = item.title.includes("Dubai Canal") ? "46%" : "100%"
          const end = item.title.includes("Dubai Canal") ? "14 Jun" : "30 Jun"

          return (
            <div key={item.title} className="grid grid-cols-[1.1fr_2fr_0.6fr] items-center gap-3 text-[9px]">
              <div className="font-medium">{item.title}</div>

              <div>
                <div className={`mb-1 flex justify-between text-[8px] ${mutedText}`}>
                  <span>1 Jun</span>
                  <span>{end}</span>
                </div>
                <div className={`h-2 rounded-full border ${divider}`}>
                  <div className="h-full rounded-full bg-[#b89150]" style={{ width }} />
                </div>
              </div>

              <div className={mutedText}>{item.duration}</div>
            </div>
          )
        })}
      </div>

      <p className={`mt-3 border-t pt-2 text-[8px] leading-4 ${divider} ${mutedText}`}>
        Exact end dates are subject to final booking confirmation by the relevant media owner.
      </p>
    </div>
  )
}

function MetricsTable({
  mutedText,
  divider,
}: {
  mutedText: string
  divider: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-inherit text-[9px]">
      <div className={`grid grid-cols-[1.2fr_1fr_1fr] border-b ${divider}`}>
        <div className="p-2 uppercase tracking-[0.16em]">Site / Network</div>
        <div className="p-2 uppercase tracking-[0.16em]">Traffic / Reach</div>
        <div className="p-2 uppercase tracking-[0.16em]">Exposure</div>
      </div>

      {mediaPlan.map((item) => (
        <div key={item.title} className={`grid grid-cols-[1.2fr_1fr_1fr] border-b ${divider}`}>
          <div className="p-2 font-medium">{item.title}</div>
          <div className={`p-2 ${mutedText}`}>{item.traffic}</div>
          <div className={`p-2 ${mutedText}`}>{item.impressions}</div>
        </div>
      ))}
    </div>
  )
}

function SixImageGrid({
  gallery,
  softCardClass,
  mutedText,
}: {
  gallery: { title: string; image: string }[]
  softCardClass: string
  mutedText: string
}) {
  return (
    <div className="grid min-h-0 grid-cols-2 gap-2.5">
      {gallery.map((item) => (
        <FigureCard key={item.title} item={item} softCardClass={softCardClass} mutedText={mutedText} />
      ))}
    </div>
  )
}

function FigureCard({
  item,
  softCardClass,
  mutedText,
}: {
  item: { title: string; image: string }
  softCardClass: string
  mutedText: string
}) {
  return (
    <figure className={`overflow-hidden rounded-2xl border ${softCardClass}`}>
      <img src={item.image} alt={item.title} className="h-[82px] w-full object-cover" />
      <figcaption className={`px-2.5 py-1.5 text-[8px] uppercase tracking-[0.14em] ${mutedText}`}>
        {item.title}
      </figcaption>
    </figure>
  )
}

function Investment({
  mutedText,
  divider,
  softCardClass,
  compact = false,
}: {
  mutedText: string
  divider: string
  softCardClass: string
  compact?: boolean
}) {
  return (
    <div>
      <div className={`rounded-2xl border p-4 ${softCardClass}`}>
        <p className="text-[8px] uppercase tracking-[0.28em]">Total Campaign Investment</p>
        <p
          className={`${compact ? "text-[clamp(1.55rem,2.6vw,2.8rem)]" : "text-[clamp(1.8rem,3.4vw,3.3rem)]"} mt-2.5 font-light tracking-[-0.055em]`}
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {formatAED(totalInvestment)}
        </p>

        <div className={`mt-3 grid gap-1.5 border-t pt-3 ${divider}`}>
          {mediaPlan.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-5 text-[9px]">
              <span className={mutedText}>{item.title}</span>
              <span>{formatAED(item.cost)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className={`mt-2.5 text-[9px] leading-4 ${mutedText}`}>
        VAT, municipality fees, artwork approval fees, and production/uploading fees should be confirmed where applicable.
      </p>
    </div>
  )
}
