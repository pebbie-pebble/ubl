"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeMode = "dark" | "light";

type Slide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stat?: string;
  statLabel?: string;
  bullets?: string[];
  rightTitle?: string;
  rightContent?: string[];
  layout?: "cover" | "standard" | "split" | "commercial";
};

const slides: Slide[] = [
  {
    layout: "cover",
    eyebrow: "SolarWinds × OOH.ae",
    title: "GITEX 2026\nCommercial Plan & Strategy",
    subtitle:
      "A premium journey-based OOH plan built to place SolarWinds in front of enterprise technology buyers before they ever reach the exhibition hall.",
    rightTitle: "Core Plan",
    rightContent: [
      "DXB Terminal 3 Arrivals",
      "Expo City Metro Station",
      "Expo City Digital Outdoor Network",
      "2-week GITEX campaign window",
    ],
  },
  {
    eyebrow: "Brand Objective",
    title: "Make SolarWinds visible before competitor noise begins.",
    subtitle:
      "The commercial goal is not just event presence. It is to warm the audience before booth interaction, lift brand familiarity across the full visitor journey, and improve the quality of conversations at GITEX.",
    bullets: [
      "Pre-booth awareness",
      "Higher recall at point of conversation",
      "Premium enterprise presence",
      "Repeated exposure across key journey touchpoints",
    ],
    rightTitle: "Why this fits SolarWinds",
    rightContent: [
      "Observability",
      "Database performance",
      "Incident response",
      "ITSM and enterprise operations",
    ],
  },
  {
    eyebrow: "Audience Strategy",
    title: "Target the enterprise technology audience in motion.",
    subtitle:
      "GITEX gathers CIOs, CTOs, infrastructure heads, IT procurement managers, transformation teams, partners and enterprise decision-makers from across the region and beyond.",
    bullets: [
      "180,000+ registered visitors",
      "170+ countries represented",
      "Enterprise tech buyer concentration",
      "High receptivity before booth overload",
    ],
    rightTitle: "Commercial logic",
    rightContent: [
      "Reach them before they enter the hall",
      "Build recognition before direct sales meetings",
      "Use contextually relevant premium digital environments",
      "Support booth investment with upstream visibility",
    ],
  },
  {
    eyebrow: "Touchpoint 01",
    title: "DXB Terminal 3 Arrivals",
    subtitle:
      "Capture international arrivals at the first business-touchpoint in Dubai. This layer is about premium first impression and senior traveller visibility.",
    stat: "2.92M",
    statLabel: "Monthly Impressions",
    bullets: [
      "3 screens at passport control",
      "Captive arrivals audience",
      "Average frequency: 5.84x",
      "Best for premium senior-business visibility",
    ],
    rightTitle: "Commercial role",
    rightContent: [
      "Top-of-funnel prestige",
      "International executive exposure",
      "Sets tone before city movement",
      "Supports premium market perception",
    ],
  },
  {
    eyebrow: "Touchpoint 02",
    title: "Expo City Metro Station",
    subtitle:
      "This is the mass-arrival layer. SolarWinds becomes visible to GITEX visitors as they enter the venue ecosystem through the metro route.",
    stat: "134",
    statLabel: "Digital Screens",
    bullets: [
      "Entrance, concourse, platform and footbridge coverage",
      "8-second spot length",
      "Once per minute frequency",
      "2-week GITEX campaign period",
    ],
    rightTitle: "Commercial role",
    rightContent: [
      "Mass awareness at event gateway",
      "High repetition",
      "Strong arrival dominance",
      "Best layer for scale and frequency",
    ],
  },
  {
    eyebrow: "Touchpoint 03",
    title: "Expo City Digital Outdoor Network",
    subtitle:
      "This is the venue-journey reinforcement layer. It keeps SolarWinds visible as people move through Expo City between the metro and the halls.",
    stat: "49",
    statLabel: "Outdoor Screens",
    bullets: [
      "41 MUPI Totems",
      "6 Step Screens",
      "2 Horizontal LED screens",
      "Zones include Entrance Gate, Al Wasl Plaza, Jubilee Park and Sustainability",
    ],
    rightTitle: "Commercial role",
    rightContent: [
      "Venue presence near pedestrian flow",
      "Last-mile reinforcement before hall entry",
      "Multi-format visual variety",
      "Excellent support for recall and booth directionality",
    ],
  },
  {
    layout: "commercial",
    eyebrow: "Recommended Commercial Package",
    title: "Run the campaign in three layers.",
    subtitle:
      "The strongest commercial recommendation is a full-journey package. Airport builds prestige, metro builds scale, and Expo City outdoor builds venue recall.",
    rightTitle: "Package recommendation",
    rightContent: [
      "Layer 1 · DXB T3 for premium arrival audience",
      "Layer 2 · Metro for event-scale frequency",
      "Layer 3 · Outdoor for venue reinforcement",
      "Outcome · awareness + recall + warmer booth conversations",
    ],
    bullets: [
      "Best option: Full Journey Ownership",
      "Alternative option: Metro + Expo City only",
      "Premium option: DXB + Metro + Outdoor with tailored creative by format",
      "Use sequential messaging rather than one static message everywhere",
    ],
  },
  {
    eyebrow: "Creative Strategy",
    title: "Adapt the message to each environment.",
    subtitle:
      "Do not run one generic event message everywhere. Use the environment to shape the creative and move the audience toward the booth with clearer intent.",
    bullets: [
      "Airport: category authority and enterprise confidence",
      "Metro: bold GITEX presence and quick brand recognition",
      "Outdoor: booth reminder, product themes, directional reinforcement",
      "Keep copy minimal and highly legible from distance",
    ],
    rightTitle: "Suggested message hierarchy",
    rightContent: [
      "Unified observability",
      "Operational resilience",
      "Database performance",
      "Meet SolarWinds at GITEX",
    ],
  },
  {
    eyebrow: "Commercial Outcome",
    title: "What this plan is meant to achieve.",
    subtitle:
      "This is a commercial visibility plan designed to improve the efficiency of the event investment, not just beautify it. The media should make SolarWinds easier to remember, easier to notice, and easier to approach.",
    bullets: [
      "Stronger pre-booth familiarity",
      "Higher enterprise-brand salience",
      "Better use of booth investment",
      "More qualified walk-up and warmer meeting context",
    ],
    rightTitle: "Next steps",
    rightContent: [
      "Confirm asset mix",
      "Lock GITEX dates",
      "Approve creative route",
      "Adapt artwork to each format",
    ],
  },
];

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key.toLowerCase() === "d") setTheme("dark");
      if (e.key.toLowerCase() === "l") setTheme("light");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const slide = slides[current];

  const themeVars = useMemo(() => {
    if (theme === "light") {
      return {
        bg: "#f7f8fb",
        panel: "rgba(255,255,255,0.75)",
        panelSolid: "#ffffff",
        text: "#0f1722",
        sub: "#475569",
        accent: "#f47c20",
        accentSoft: "rgba(244,124,32,0.12)",
        accentLine: "rgba(244,124,32,0.35)",
        grid: "rgba(15,23,34,0.06)",
        orb1: "rgba(244,124,32,0.18)",
        orb2: "rgba(19,34,61,0.10)",
        nav: "rgba(255,255,255,0.78)",
      };
    }

    return {
      bg: "#0d1420",
      panel: "rgba(255,255,255,0.06)",
      panelSolid: "#111b2a",
      text: "#f8fafc",
      sub: "#cbd5e1",
      accent: "#f47c20",
      accentSoft: "rgba(244,124,32,0.12)",
      accentLine: "rgba(244,124,32,0.35)",
      grid: "rgba(255,255,255,0.05)",
      orb1: "rgba(244,124,32,0.18)",
      orb2: "rgba(75,107,161,0.18)",
      nav: "rgba(13,20,32,0.84)",
    };
  }, [theme]);

  return (
    <main
      className="h-screen w-screen overflow-hidden"
      style={{
        background: themeVars.bg,
        color: themeVars.text,
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-[110px]"
            style={{ background: themeVars.orb1 }}
          />
          <div
            className="absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full blur-[120px]"
            style={{ background: themeVars.orb2 }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${themeVars.grid} 1px, transparent 1px), linear-gradient(90deg, ${themeVars.grid} 1px, transparent 1px)`,
              backgroundSize: "52px 52px",
            }}
          />
        </div>

        <header className="absolute left-8 right-8 top-6 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em]"
              style={{
                background: themeVars.accentSoft,
                color: themeVars.accent,
                border: `1px solid ${themeVars.accentLine}`,
              }}
            >
              SolarWinds
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] opacity-60">
              GITEX 2026 Deck
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme("light")}
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: theme === "light" ? themeVars.accent : themeVars.panel,
                color: theme === "light" ? "#fff" : themeVars.text,
                border: `1px solid ${
                  theme === "light" ? themeVars.accent : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: theme === "dark" ? themeVars.accent : themeVars.panel,
                color: theme === "dark" ? "#fff" : themeVars.text,
                border: `1px solid ${
                  theme === "dark" ? themeVars.accent : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              Dark
            </button>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] opacity-50">
              {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        <section className="relative z-10 flex h-full items-center px-8 pb-24 pt-24 md:px-14 lg:px-20">
          <div
            key={`${theme}-${current}`}
            className="mx-auto grid w-full max-w-7xl animate-[fadeUp_.45s_ease-out] gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center"
          >
            <div>
              <div
                className="mb-5 inline-flex rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em]"
                style={{
                  color: themeVars.accent,
                  background: themeVars.accentSoft,
                  border: `1px solid ${themeVars.accentLine}`,
                }}
              >
                {slide.eyebrow}
              </div>

              <h1
                className={`whitespace-pre-line font-black leading-[0.94] tracking-[-0.06em] ${
                  slide.layout === "cover"
                    ? "text-6xl md:text-8xl lg:text-[92px]"
                    : "text-5xl md:text-7xl"
                }`}
              >
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p
                  className="mt-7 max-w-3xl text-lg leading-8 md:text-[21px]"
                  style={{ color: themeVars.sub }}
                >
                  {slide.subtitle}
                </p>
              )}

              {slide.bullets && (
                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {slide.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl px-4 py-4 text-sm leading-6"
                      style={{
                        background: themeVars.panel,
                        border: `1px solid ${
                          theme === "light" ? "rgba(15,23,34,0.08)" : "rgba(255,255,255,0.08)"
                        }`,
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-2 h-2.5 w-2.5 rounded-full"
                          style={{ background: themeVars.accent }}
                        />
                        <span>{bullet}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="rounded-[30px] p-6 md:p-7"
              style={{
                background: themeVars.panel,
                border: `1px solid ${
                  theme === "light" ? "rgba(15,23,34,0.08)" : "rgba(255,255,255,0.09)"
                }`,
                backdropFilter: "blur(18px)",
                boxShadow:
                  theme === "light"
                    ? "0 20px 60px rgba(15,23,34,0.08)"
                    : "0 20px 60px rgba(0,0,0,0.28)",
              }}
            >
              {slide.stat ? (
                <div
                  className="mb-6 rounded-[24px] p-6"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <div
                    className="text-6xl font-black tracking-[-0.06em] md:text-7xl"
                    style={{ color: themeVars.accent }}
                  >
                    {slide.stat}
                  </div>
                  <div className="mt-2 text-xs font-black uppercase tracking-[0.25em] opacity-65">
                    {slide.statLabel}
                  </div>
                </div>
              ) : (
                <div
                  className="mb-6 rounded-[24px] p-6"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <div
                    className="text-xs font-black uppercase tracking-[0.25em]"
                    style={{ color: themeVars.accent }}
                  >
                    Commercial Focus
                  </div>
                  <div className="mt-3 text-3xl font-black tracking-[-0.04em]">
                    Awareness · Recall · Booth Influence
                  </div>
                </div>
              )}

              {slide.rightTitle && (
                <div
                  className="mb-4 text-xs font-black uppercase tracking-[0.24em]"
                  style={{ color: themeVars.accent }}
                >
                  {slide.rightTitle}
                </div>
              )}

              <div className="space-y-3">
                {slide.rightContent?.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl px-4 py-4 text-sm leading-6"
                    style={{
                      background: theme === "light" ? "rgba(15,23,34,0.03)" : "rgba(0,0,0,0.14)",
                      border: `1px solid ${
                        theme === "light" ? "rgba(15,23,34,0.07)" : "rgba(255,255,255,0.07)"
                      }`,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <nav
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-3"
          style={{
            background: themeVars.nav,
            border: `1px solid ${
              theme === "light" ? "rgba(15,23,34,0.08)" : "rgba(255,255,255,0.08)"
            }`,
            backdropFilter: "blur(18px)",
          }}
        >
          <button
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            style={{ background: themeVars.panel, color: themeVars.text }}
          >
            ‹
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === current ? 34 : 8,
                  background: i === current ? themeVars.accent : theme === "light" ? "#cbd5e1" : "rgba(255,255,255,0.22)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            style={{ background: themeVars.panel, color: themeVars.text }}
          >
            ›
          </button>
        </nav>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
