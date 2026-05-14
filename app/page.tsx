"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeMode = "dark" | "light";

type CommercialRow = {
  location: string;
  format: string;
  type: string;
  screens: string;
  duration: string;
  productionFee: string;
  grossRate: string;
  netRate: string;
  totalFee: string;
};

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
  imagePlaceholders?: number;
};

const commercialRows: CommercialRow[] = [
  {
    location: "Expo Station",
    format: "Network Screen",
    type: "Digital LED Screens",
    screens: "134 Screens",
    duration: "2 weeks",
    productionFee: "-",
    grossRate: "$103,471.75",
    netRate: "-",
    totalFee: "$103,471.75",
  },
  {
    location: "Expo City",
    format: "Network Screen",
    type: "Digital LED Screens",
    screens: "49 Screens",
    duration: "2 weeks",
    productionFee: "$1,090.00",
    grossRate: "$88,495.58",
    netRate: "$122,532.34",
    totalFee: "$123,622.34",
  },
  {
    location: "DXB Terminal 3",
    format: "Network Screen",
    type: "Digital LED Screens",
    screens: "3 Screens",
    duration: "One month",
    productionFee: "$4,085.00",
    grossRate: "$68,074.00",
    netRate: "$25,000.00",
    totalFee: "$25,000.00",
  },
];

const grandTotal = "$252,094.09";

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
    imagePlaceholders: 1,
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
      "8-second creative spots",
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
    imagePlaceholders: 4,
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
    imagePlaceholders: 4,
  },
  {
    layout: "commercial",
    eyebrow: "Commercial Plan",
    title: "Recommended media investment.",
    subtitle:
      "A full-journey commercial package combining airport arrivals, Expo City Metro Station and Expo City outdoor digital media to maximise visibility across the complete GITEX visitor path.",
    bullets: [
      "All rates are in USD",
      "Prices exclude 5% VAT",
      "Municipality fee: $141.59 per artwork",
      "Recommended total media package: $252,094.09",
    ],
    rightTitle: "Total Package",
    rightContent: [
      "DXB Terminal 3 Arrivals",
      "Expo City Metro Station",
      "Expo City Outdoor Digital Network",
      "Total: $252,094.09 excluding VAT",
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
    eyebrow: "GITEX 2026",
    title: "We’re excited to see SolarWinds there.",
    subtitle:
      "GITEX GLOBAL 2026 moves into a major new chapter with the Scale Summit on 7 December 2026 at Dubai World Trade Centre, followed by the main Expo from 8 to 11 December 2026 at Expo City Dubai. With the event’s strongest technology audience moving through the exact locations in this plan, SolarWinds has a clear opportunity to arrive with confidence, visibility and momentum.",
    bullets: [
      "GITEX Scale Summit: 7 December 2026",
      "GITEX GLOBAL Expo: 8 to 11 December 2026",
      "Expo venue: Expo City Dubai",
      "We would be genuinely excited to see SolarWinds take a standout presence across the GITEX journey.",
    ],
    rightTitle: "Closing thought",
    rightContent: [
      "This plan gives SolarWinds presence before the hall, around the venue and at the moment of arrival.",
      "It supports the booth, the brand and the commercial conversations that matter most.",
      "We look forward to seeing SolarWinds at GITEX 2026.",
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
        panel: "rgba(255,255,255,0.76)",
        text: "#0f1722",
        sub: "#475569",
        accent: "#f47c20",
        accentSoft: "rgba(244,124,32,0.12)",
        accentLine: "rgba(244,124,32,0.35)",
        grid: "rgba(15,23,34,0.06)",
        orb1: "rgba(244,124,32,0.18)",
        orb2: "rgba(19,34,61,0.10)",
        nav: "rgba(255,255,255,0.82)",
        cardInner: "rgba(15,23,34,0.035)",
        border: "rgba(15,23,34,0.08)",
      };
    }

    return {
      bg: "#0d1420",
      panel: "rgba(255,255,255,0.06)",
      text: "#f8fafc",
      sub: "#cbd5e1",
      accent: "#f47c20",
      accentSoft: "rgba(244,124,32,0.12)",
      accentLine: "rgba(244,124,32,0.35)",
      grid: "rgba(255,255,255,0.05)",
      orb1: "rgba(244,124,32,0.18)",
      orb2: "rgba(75,107,161,0.18)",
      nav: "rgba(13,20,32,0.84)",
      cardInner: "rgba(0,0,0,0.14)",
      border: "rgba(255,255,255,0.09)",
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
                border: `1px solid ${theme === "light" ? themeVars.accent : themeVars.border}`,
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
                border: `1px solid ${theme === "dark" ? themeVars.accent : themeVars.border}`,
              }}
            >
              Dark
            </button>

            <div className="text-xs font-semibold uppercase tracking-[0.22em] opacity-50">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        <section className="relative z-10 flex h-full items-center px-8 pb-24 pt-24 md:px-14 lg:px-20">
          <div
            key={`${theme}-${current}`}
            className={`mx-auto grid w-full max-w-7xl animate-[fadeUp_.45s_ease-out] gap-8 lg:items-center ${
              slide.layout === "commercial"
                ? "lg:grid-cols-[0.78fr_1.22fr]"
                : "lg:grid-cols-[1.2fr_.8fr]"
            }`}
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

              {slide.bullets && slide.layout !== "commercial" && (
                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {slide.bullets.map((bullet) => (
                    <InfoPill key={bullet} text={bullet} themeVars={themeVars} />
                  ))}
                </div>
              )}

              {slide.bullets && slide.layout === "commercial" && (
                <div className="mt-8 space-y-3">
                  {slide.bullets.map((bullet) => (
                    <InfoPill key={bullet} text={bullet} themeVars={themeVars} />
                  ))}
                </div>
              )}
            </div>

            {slide.layout === "commercial" ? (
              <CommercialTable themeVars={themeVars} />
            ) : (
              <RightPanel slide={slide} theme={theme} themeVars={themeVars} />
            )}
          </div>
        </section>

        <nav
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-3"
          style={{
            background: themeVars.nav,
            border: `1px solid ${themeVars.border}`,
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
                  background:
                    i === current
                      ? themeVars.accent
                      : theme === "light"
                        ? "#cbd5e1"
                        : "rgba(255,255,255,0.22)",
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

function RightPanel({
  slide,
  theme,
  themeVars,
}: {
  slide: Slide;
  theme: ThemeMode;
  themeVars: any;
}) {
  return (
    <div
      className="rounded-[30px] p-6 md:p-7"
      style={{
        background: themeVars.panel,
        border: `1px solid ${themeVars.border}`,
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

      {slide.imagePlaceholders ? (
        <ImagePlaceholderGrid count={slide.imagePlaceholders} themeVars={themeVars} />
      ) : null}

      {slide.rightTitle && (
        <div
          className="mb-4 mt-5 text-xs font-black uppercase tracking-[0.24em]"
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
              background: themeVars.cardInner,
              border: `1px solid ${themeVars.border}`,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePlaceholderGrid({
  count,
  themeVars,
}: {
  count: number;
  themeVars: any;
}) {
  return (
    <div
      className={`mb-5 grid gap-3 ${
        count === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-center rounded-2xl text-center text-xs font-black uppercase tracking-[0.2em] ${
            count === 1 ? "h-56" : "h-28"
          }`}
          style={{
            background: themeVars.cardInner,
            border: `1px dashed ${themeVars.accentLine}`,
            color: themeVars.accent,
          }}
        >
          Image Placeholder {i + 1}
        </div>
      ))}
    </div>
  );
}

function InfoPill({ text, themeVars }: { text: string; themeVars: any }) {
  return (
    <div
      className="rounded-2xl px-4 py-4 text-sm leading-6"
      style={{
        background: themeVars.panel,
        border: `1px solid ${themeVars.border}`,
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: themeVars.accent }}
        />
        <span>{text}</span>
      </div>
    </div>
  );
}

function CommercialTable({ themeVars }: { themeVars: any }) {
  return (
    <div
      className="rounded-[30px] p-5 md:p-6"
      style={{
        background: themeVars.panel,
        border: `1px solid ${themeVars.border}`,
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="mb-5 rounded-[24px] p-5"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <div
          className="text-xs font-black uppercase tracking-[0.25em]"
          style={{ color: themeVars.accent }}
        >
          Total Media Investment
        </div>
        <div
          className="mt-2 text-5xl font-black tracking-[-0.06em]"
          style={{ color: themeVars.accent }}
        >
          {grandTotal}
        </div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] opacity-60">
          Excluding 5% VAT
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${themeVars.border}` }}>
        <table className="w-full border-collapse text-left text-[12px]">
          <thead>
            <tr style={{ background: themeVars.cardInner }}>
              {[
                "Location",
                "Screens",
                "Duration",
                "Production",
                "Gross Rate",
                "Net Rate",
                "Total Fee",
              ].map((head) => (
                <th
                  key={head}
                  className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ color: themeVars.accent, borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {commercialRows.map((row) => (
              <tr key={row.location}>
                <td className="px-3 py-4 font-bold" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.location}
                  <div className="mt-1 text-[10px] font-medium opacity-60">
                    {row.format}
                  </div>
                </td>
                <td className="px-3 py-4" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.screens}
                </td>
                <td className="px-3 py-4" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.duration}
                </td>
                <td className="px-3 py-4" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.productionFee}
                </td>
                <td className="px-3 py-4" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.grossRate}
                </td>
                <td className="px-3 py-4" style={{ borderBottom: `1px solid ${themeVars.border}` }}>
                  {row.netRate}
                </td>
                <td
                  className="px-3 py-4 font-black"
                  style={{
                    color: themeVars.accent,
                    borderBottom: `1px solid ${themeVars.border}`,
                  }}
                >
                  {row.totalFee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-4 rounded-2xl p-4 text-xs font-semibold leading-6"
        style={{
          background: themeVars.cardInner,
          border: `1px solid ${themeVars.border}`,
        }}
      >
        Kindly note: all rates are in USD. Prices exclude 5% VAT. Municipality fee:
        <span style={{ color: themeVars.accent }}> $141.59 per artwork.</span>
      </div>
    </div>
  );
}
