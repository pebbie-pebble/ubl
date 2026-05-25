"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarRange,
  ChevronRight,
  Compass,
  FileText,
  Globe2,
  Handshake,
  HeartHandshake,
  Layers,
  LayoutGrid,
  LineChart,
  MapPinned,
  Megaphone,
  MonitorPlay,
  Moon,
  Package,
  Palette,
  Plane,
  Receipt,
  Sparkles,
  Sun,
  Table2,
  TrainFront,
  Target,
  Timer,
  Tv,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import { AnimatedStat } from "@/components/animated-stat";
import { RippleLineGridBackdrop } from "@/components/ripple-line-grid";

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
  layout?: "cover" | "standard" | "split" | "commercial" | "mediaOnly";
  imagePlaceholders?: number;
  videoPlaceholder?: boolean;
  mediaLayout?: "standard" | "twoPlusVideo";
  /** Local `/public` paths or absolute URLs — one per image slot, in order. */
  billboardImages?: string[];
  /**
   * With `imagePlaceholders === 4`, render `stat` / `statLabel` inside this
   * grid cell (0–3, row-major) instead of above the grid. `billboardImages` is
   * then only the photo URLs in row-major order, skipping this index.
   */
  statInGridIndex?: number;
  /** Wide still for the horizontal “video” block on `twoPlusVideo` layouts. */
  billboardVideoPoster?: string;
};

/** Maps each slide’s image slots to indices in the global deck lightbox strip (billboards only). */
type SlideGalleryNav = {
  images: (number | null)[];
  poster: number | null;
};

function buildDeckGallery(slides: Slide[]): {
  lightboxSlides: { src: string; alt: string }[];
  navBySlide: (SlideGalleryNav | null)[];
} {
  const lightboxSlides: { src: string; alt: string }[] = [];

  const navBySlide = slides.map((s, si) => {
    const n = s.imagePlaceholders ?? 0;
    const hasPosterInUi =
      Boolean(s.billboardVideoPoster) &&
      Boolean(s.videoPlaceholder) &&
      s.mediaLayout === "twoPlusVideo";

    if (n === 0 && !hasPosterInUi) return null;

    const images: (number | null)[] = [];
    let hasAny = false;
    const useStatSlot =
      s.statInGridIndex != null &&
      n === 4 &&
      s.statInGridIndex >= 0 &&
      s.statInGridIndex < n;

    let imgCursor = 0;
    for (let i = 0; i < n; i++) {
      if (useStatSlot && i === s.statInGridIndex) {
        images[i] = null;
        continue;
      }
      const src = s.billboardImages?.[imgCursor++];
      if (src) {
        images[i] = lightboxSlides.length;
        hasAny = true;
        lightboxSlides.push({
          src,
          alt: `Slide ${si + 1} · Reference ${i + 1}`,
        });
      } else {
        images[i] = null;
      }
    }

    let poster: number | null = null;
    if (hasPosterInUi) {
      poster = lightboxSlides.length;
      hasAny = true;
      lightboxSlides.push({
        src: s.billboardVideoPoster!,
        alt: `Slide ${si + 1} · Wide reference`,
      });
    }

    if (!hasAny) return null;
    return { images, poster };
  });

  return { lightboxSlides, navBySlide };
}

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
    totalFee: "-",
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

const grandTotal = "$148,622.34";

/** Deck reference photos in display order (airport → metro 1–7). */
const DECK_REFERENCE_IMAGES = [
  "/images/dxb-airport-1.webp",
  "/images/dxb-terminal-3-arrivals.webp",
  "/images/metro-1.webp",
  "/images/metro-2.webp",
  "/images/metro-3.webp",
  "/images/metro-4.webp",
  "/images/metro-5.webp",
  "/images/metro-6.webp",
  "/images/metro-7.webp",
] as const;

function slideNeedsViewportFit(slide: Slide): boolean {
  return (
    Boolean(slide.imagePlaceholders) ||
    slide.layout === "mediaOnly" ||
    slide.layout === "commercial"
  );
}

function iconForAsideTitle(title: string | undefined): LucideIcon | undefined {
  if (!title) return undefined;
  const t = title.trim();
  if (t === "Core Plan") return LayoutGrid;
  if (t === "Why this fits SolarWinds") return BadgeCheck;
  if (t === "Commercial logic") return Workflow;
  if (t === "Commercial role") return Briefcase;
  if (t === "Total Package") return Package;
  if (t === "Suggested message hierarchy") return Layers;
  if (t === "Closing thought") return Sparkles;
  return undefined;
}

function eyebrowLeadIcon(eyebrow: string): LucideIcon | undefined {
  const l = eyebrow.toLowerCase();
  if (l.startsWith("touchpoint")) return MapPinned;
  if (l.includes("brand objective")) return Target;
  if (l.includes("audience")) return Users;
  if (l.includes("commercial plan")) return Receipt;
  if (l.includes("creative")) return Palette;
  if (l.includes("gitex")) return Sparkles;
  return undefined;
}

function asideRowIcon(slideIndex: number, rowIndex: number): LucideIcon {
  const matrix: Record<number, LucideIcon[]> = {
    0: [MapPinned, TrainFront, Building2, CalendarRange],
    1: [Target, LineChart, Layers, Zap],
    2: [Users, Globe2, Target, LineChart],
    3: [Plane, Target, Sparkles, Award],
    4: [TrainFront, Tv, Timer, Zap],
    6: [Building2, MapPinned, Palette, Compass],
    7: [FileText, Table2, MapPinned, Receipt],
    8: [Plane, TrainFront, Megaphone, Palette],
    9: [Sparkles, HeartHandshake, Sparkles],
  };
  const row = matrix[slideIndex];
  if (!row?.length) return ArrowUpRight;
  return row[Math.min(rowIndex, row.length - 1)]!;
}

function AsideSectionHeading({
  title,
  themeVars,
  compact = false,
}: {
  title: string;
  themeVars: any;
  compact?: boolean;
}) {
  const Icon = iconForAsideTitle(title);
  return (
    <div
      className={
        compact ? "mb-2 mt-3 w-full sm:mt-4" : "mb-4 mt-6 w-full sm:mt-7"
      }
    >
      <div className="flex items-center gap-3">
        {Icon ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
              boxShadow: "0 4px 28px rgba(244,124,32,0.14)",
            }}
          >
            <Icon
              className="h-[18px] w-[18px] sm:h-5 sm:w-5"
              strokeWidth={2.15}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
          </div>
        ) : null}
        <span
          className="deck-eyebrow min-w-0 flex-1 font-black uppercase"
          style={{ color: themeVars.accent }}
        >
          {title}
        </span>
      </div>
      <div
        className="mt-3 h-px w-full rounded-full opacity-50"
        style={{
          background: `linear-gradient(90deg, ${themeVars.accent}, transparent)`,
        }}
      />
    </div>
  );
}

function AsideContentRow({
  children,
  Icon,
  themeVars,
  compact = false,
}: {
  children: ReactNode;
  Icon: LucideIcon;
  themeVars: any;
  compact?: boolean;
}) {
  return (
    <div
      className={`group flex min-h-0 items-center gap-2.5 rounded-lg transition-[border-color,box-shadow,transform] duration-200 sm:rounded-xl ${
        compact
          ? "px-2.5 py-2 sm:px-3 sm:py-2.5"
          : "gap-3 px-3 py-3 sm:px-3.5 sm:py-3.5"
      }`}
      style={{
        background: themeVars.cardInner,
        border: `1px solid ${themeVars.border}`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 1px 2px rgba(15,23,34,0.04)",
      }}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg transition-colors duration-200 sm:rounded-[10px] ${
          compact ? "h-8 w-8" : "h-10 w-10 sm:h-11 sm:w-11"
        }`}
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <Icon
          className={`opacity-95 ${compact ? "h-4 w-4" : "h-[18px] w-[18px] sm:h-5 sm:w-5"}`}
          strokeWidth={2.2}
          style={{ color: themeVars.accent }}
          aria-hidden
        />
      </span>
      <div
        className={`min-w-0 flex-1 text-left font-semibold leading-snug ${
          compact ? "text-[12px] sm:text-[13px]" : "text-[13px] sm:text-sm sm:leading-relaxed"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/** Compact 2×2 tiles: icon + label centered (slides with four short aside lines, no gallery). */
function AsideFeatureTile({
  children,
  Icon,
  themeVars,
}: {
  children: ReactNode;
  Icon: LucideIcon;
  themeVars: any;
}) {
  return (
    <div
      className="flex h-full min-h-[132px] flex-col items-center justify-center gap-3 rounded-lg px-3 py-5 text-center transition-[border-color,box-shadow] duration-200 sm:min-h-[148px] sm:rounded-xl sm:px-4 sm:py-6"
      style={{
        background: themeVars.cardInner,
        border: `1px solid ${themeVars.border}`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 2px 8px rgba(15,23,34,0.05)",
      }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
          boxShadow: "0 6px 20px rgba(244,124,32,0.12)",
        }}
      >
        <Icon
          className="h-6 w-6 sm:h-7 sm:w-7"
          strokeWidth={2.05}
          style={{ color: themeVars.accent }}
          aria-hidden
        />
      </span>
      <p
        className="w-full px-0.5 text-[12.5px] font-semibold leading-snug tracking-[-0.02em] sm:text-sm sm:leading-snug"
        style={{ color: themeVars.text }}
      >
        {children}
      </p>
    </div>
  );
}

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
    billboardImages: [DECK_REFERENCE_IMAGES[0]],
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
    statInGridIndex: 1,
    billboardImages: [
      DECK_REFERENCE_IMAGES[1],
      DECK_REFERENCE_IMAGES[2],
      DECK_REFERENCE_IMAGES[3],
    ],
  },
  {
    layout: "mediaOnly",
    eyebrow: "Touchpoint 02 · Visual Route",
    title: "Expo City Metro Station creative visibility.",
    stat: "134",
    statLabel: "Digital Screens",
    imagePlaceholders: 2,
    videoPlaceholder: true,
    mediaLayout: "twoPlusVideo",
    billboardImages: [
      DECK_REFERENCE_IMAGES[4],
      DECK_REFERENCE_IMAGES[5],
    ],
    billboardVideoPoster: DECK_REFERENCE_IMAGES[8],
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
    statInGridIndex: 1,
    billboardImages: [
      DECK_REFERENCE_IMAGES[6],
      DECK_REFERENCE_IMAGES[7],
      DECK_REFERENCE_IMAGES[8],
    ],
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
      "Recommended total media package: $148,622.34",
    ],
    rightTitle: "Total Package",
    rightContent: [
      "DXB Terminal 3 Arrivals",
      "Expo City Metro Station",
      "Expo City Outdoor Digital Network",
      "Total: $148,622.34 excluding VAT",
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

const DECK_GALLERY = buildDeckGallery(slides);

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const next = () => setCurrent((p) => Math.min(p + 1, slides.length - 1));
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));

  const openGalleryAt = useCallback((index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("[data-no-swipe]")) {
      touchStartX.current = null;
      return;
    }
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 52) return;
    if (dx < 0) setCurrent((p) => Math.min(p + 1, slides.length - 1));
    else setCurrent((p) => Math.max(p - 1, 0));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (galleryOpen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key.toLowerCase() === "d") setTheme("dark");
      if (e.key.toLowerCase() === "l") setTheme("light");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryOpen]);

  const slide = slides[current];
  const viewportFit = slideNeedsViewportFit(slide);
  const galleryNav = DECK_GALLERY.navBySlide[current] ?? null;
  const gallerySlides = DECK_GALLERY.lightboxSlides;
  const hasDeckGallery = gallerySlides.length > 0;

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
      className="flex h-dvh max-h-dvh w-full max-w-[100vw] flex-col overflow-hidden antialiased"
      style={{
        background: themeVars.bg,
        color: themeVars.text,
      }}
    >
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute -left-24 -top-24 z-0 h-[420px] w-[420px] rounded-full blur-[110px]"
            style={{ background: themeVars.orb1 }}
          />
          <div
            className="absolute -bottom-24 -right-24 z-0 h-[420px] w-[420px] rounded-full blur-[120px]"
            style={{ background: themeVars.orb2 }}
          />
          <RippleLineGridBackdrop
            themeKey={theme}
            baseLine={themeVars.grid}
            glow={themeVars.accent}
            background={themeVars.bg}
          />
        </div>

        <header
          className="absolute left-3 right-3 top-[max(0.5rem,env(safe-area-inset-top))] z-30 sm:left-8 sm:right-8 sm:top-6"
          style={{
            paddingLeft: "max(0px, env(safe-area-inset-left))",
            paddingRight: "max(0px, env(safe-area-inset-right))",
          }}
        >
          <div className="relative flex w-full min-w-0 items-center justify-between gap-2 sm:gap-3">
            <div className="relative z-10 shrink-0">
              <img
                src="/brands/solarwinds-logo.svg"
                alt="SolarWinds"
                width={220}
                height={44}
                loading="eager"
                fetchPriority="high"
                className="block h-[18px] w-auto max-w-[min(148px,38vw)] object-contain object-left sm:h-5 md:h-[22px]"
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 sm:px-28 md:px-36 lg:px-44"
            >
              <div
                className="max-w-full truncate text-center text-[10px] font-bold uppercase tracking-[0.18em] opacity-60 sm:text-xs sm:tracking-[0.24em]"
                style={{ color: themeVars.text }}
              >
                <span className="sm:hidden">GITEX ’26</span>
                <span className="hidden sm:inline">GITEX 2026 Deck</span>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 flex-col-reverse items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              <div
                className="box-border inline-flex h-8 cursor-pointer items-center gap-0 rounded-full p-0.5"
                style={{
                  background: themeVars.cardInner,
                  border: `1px solid ${themeVars.border}`,
                  boxShadow:
                    theme === "light"
                      ? "inset 0 1px 2px rgba(15,23,34,0.06)"
                      : "inset 0 1px 3px rgba(0,0,0,0.35)",
                }}
                role="group"
                aria-label="Color theme"
              >
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  aria-pressed={theme === "light"}
                  aria-label="Use light theme"
                  title="Light"
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full transition-all duration-200 ease-out"
                  style={{
                    background:
                      theme === "light" ? themeVars.accent : "transparent",
                    color: theme === "light" ? "#fff" : themeVars.sub,
                    boxShadow:
                      theme === "light"
                        ? "0 2px 8px rgba(244,124,32,0.35)"
                        : "none",
                  }}
                >
                  <Sun
                    className="size-3.5"
                    strokeWidth={2.35}
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  aria-pressed={theme === "dark"}
                  aria-label="Use dark theme"
                  title="Dark"
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full transition-all duration-200 ease-out"
                  style={{
                    background:
                      theme === "dark" ? themeVars.accent : "transparent",
                    color: theme === "dark" ? "#fff" : themeVars.sub,
                    boxShadow:
                      theme === "dark"
                        ? "0 2px 8px rgba(244,124,32,0.35)"
                        : "none",
                  }}
                >
                  <Moon
                    className="size-3.5"
                    strokeWidth={2.35}
                    aria-hidden
                  />
                </button>
              </div>

              <div
                className="whitespace-nowrap tabular-nums text-[10px] font-semibold uppercase tracking-[0.16em] opacity-50 sm:text-xs sm:tracking-[0.22em]"
                style={{ color: themeVars.text }}
              >
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </header>

        <section
          className="relative z-10 flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-[calc(5.25rem+env(safe-area-inset-top))] [-webkit-overflow-scrolling:touch] sm:px-6 sm:pb-28 sm:pt-[5.75rem] md:px-10 md:pt-24 lg:px-14 lg:pt-[6.25rem] xl:px-16 xl:pt-24"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slide.layout === "mediaOnly" ? (
            <MediaOnlySlide
              slide={slide}
              theme={theme}
              themeVars={themeVars}
              slideIndex={current}
              galleryNav={galleryNav}
              onOpenGallery={hasDeckGallery ? openGalleryAt : undefined}
            />
          ) : (
            <div
              key={`${theme}-${current}`}
              className={`mx-auto grid w-full max-w-full animate-[fadeUp_.45s_ease-out] gap-5 sm:gap-6 md:gap-7 lg:max-w-6xl lg:items-start lg:gap-x-10 xl:max-w-7xl ${
                viewportFit ? "deck-slide-fit" : ""
              } ${
                slide.layout === "commercial"
                  ? "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
                  : "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
              }`}
            >
              <div
                className={`min-w-0 lg:max-w-[34rem] xl:max-w-[36rem] ${
                  slide.imagePlaceholders ? "deck-touchpoint-left" : ""
                }`}
              >
                {slide.layout === "cover" ? (
                  <div className="mb-3 flex flex-col items-start gap-3 sm:mb-4 sm:gap-3.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5">
                      <img
                        src={
                          theme === "light"
                            ? "/ooh-ae-black.webp"
                            : "/ooh-ae-white.webp"
                        }
                        alt="OOH.ae"
                        width={200}
                        height={48}
                        loading="eager"
                        fetchPriority="high"
                        className="block h-[26px] w-auto max-w-[min(188px,52vw)] shrink-0 object-contain object-left sm:h-[30px] md:h-8"
                      />
                      <span
                        className="select-none text-base font-light leading-none sm:text-lg"
                        style={{ color: themeVars.sub }}
                        aria-hidden
                      >
                        ×
                      </span>
                      <img
                        src="/brands/solarwinds-logo.svg"
                        alt="SolarWinds"
                        width={220}
                        height={44}
                        loading="eager"
                        fetchPriority="high"
                        className="block h-[22px] w-auto max-w-[min(200px,46vw)] shrink-0 object-contain object-left sm:h-[26px] md:h-7"
                        style={
                          theme === "dark"
                            ? { filter: "brightness(0) invert(1)" }
                            : undefined
                        }
                      />
                    </div>
                    <div
                      className="deck-eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-black uppercase sm:gap-2.5 sm:px-4 sm:py-2"
                      style={{
                        color: themeVars.accent,
                        background: themeVars.accentSoft,
                        border: `1px solid ${themeVars.accentLine}`,
                      }}
                    >
                      <Handshake
                        className="h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                      {slide.eyebrow}
                    </div>
                  </div>
                ) : (
                <div
                  className={`deck-eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-black uppercase sm:gap-2.5 sm:px-4 sm:py-2 ${
                    slide.imagePlaceholders ? "mb-3 sm:mb-4" : "mb-4 sm:mb-5"
                  }`}
                  style={{
                    color: themeVars.accent,
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  {(() => {
                    const Icon = eyebrowLeadIcon(slide.eyebrow);
                    return Icon ? (
                      <Icon
                        className="h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                    ) : null;
                  })()}
                  {slide.eyebrow}
                </div>
                )}

                <h1
                  className={`whitespace-pre-line font-black ${
                    slide.layout === "cover" ? "deck-title-cover" : "deck-title"
                  }`}
                >
                  {slide.title}
                </h1>

                {slide.subtitle && (
                  <p
                    className={`deck-subtitle max-w-2xl lg:max-w-xl xl:max-w-2xl ${
                      slide.imagePlaceholders
                        ? "mt-3 sm:mt-4"
                        : "mt-4 sm:mt-5"
                    }`}
                    style={{ color: themeVars.sub }}
                  >
                    {slide.subtitle}
                  </p>
                )}

                {slide.bullets && slide.layout !== "commercial" && (
                  <div
                    className={`grid gap-2 sm:gap-2.5 ${
                      slide.imagePlaceholders
                        ? "mt-4 sm:mt-5 md:grid-cols-2"
                        : "mt-6 sm:mt-8 sm:gap-3 md:grid-cols-2"
                    }`}
                  >
                    {slide.bullets.map((bullet) => (
                      <InfoPill
                        key={bullet}
                        text={bullet}
                        themeVars={themeVars}
                      />
                    ))}
                  </div>
                )}

                {slide.bullets && slide.layout === "commercial" && (
                  <div className="mt-6 grid min-w-0 grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 *:min-w-0">
                    {slide.bullets.map((bullet) => (
                      <InfoPill
                        key={bullet}
                        text={bullet}
                        themeVars={themeVars}
                      />
                    ))}
                  </div>
                )}
              </div>

              {slide.layout === "commercial" ? (
                <CommercialTable themeVars={themeVars} slideIndex={current} />
              ) : (
                <RightPanel
                  slide={slide}
                  theme={theme}
                  themeVars={themeVars}
                  slideIndex={current}
                  galleryNav={galleryNav}
                  onOpenGallery={hasDeckGallery ? openGalleryAt : undefined}
                />
              )}
            </div>
          )}
        </section>

        <nav
          className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex w-[min(calc(100vw-1.25rem),26rem)] max-w-[calc(100vw-1.25rem)] -translate-x-1/2 items-center gap-1.5 rounded-full px-2 py-2 shadow-lg shadow-black/10 sm:bottom-5 sm:w-auto sm:max-w-none sm:gap-2 sm:px-2.5 sm:py-1.5 sm:shadow-none"
          style={{
            background: themeVars.nav,
            border: `1px solid ${themeVars.border}`,
            backdropFilter: "blur(18px)",
          }}
        >
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold leading-none transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100 sm:h-9 sm:w-9 sm:text-sm"
            style={{ background: themeVars.panel, color: themeVars.text }}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto px-0.5 [scrollbar-width:none] sm:flex-initial sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1 shrink-0 rounded-full transition-all active:scale-110"
                style={{
                  width: i === current ? 14 : 4,
                  background:
                    i === current
                      ? themeVars.accent
                      : theme === "light"
                        ? "#cbd5e1"
                        : "rgba(255,255,255,0.22)",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={current === slides.length - 1}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold leading-none transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100 sm:h-9 sm:w-9 sm:text-sm"
            style={{ background: themeVars.panel, color: themeVars.text }}
            aria-label="Next slide"
          >
            ›
          </button>
        </nav>

        {hasDeckGallery ? (
          <Lightbox
            open={galleryOpen}
            close={() => setGalleryOpen(false)}
            index={galleryIndex}
            slides={gallerySlides}
            plugins={[Counter, Thumbnails]}
            carousel={{ finite: true, preload: 2 }}
            thumbnails={{
              position: "bottom",
              width: 88,
              height: 56,
              gap: 10,
              padding: 3,
              border: 2,
              borderRadius: 8,
              imageFit: "cover",
              vignette: true,
            }}
            controller={{ closeOnBackdropClick: true }}
            portal={{
              container: {
                "data-no-swipe": "",
              } as ComponentProps<"div">,
            }}
            on={{
              view: ({ index }) => setGalleryIndex(index),
            }}
          />
        ) : null}
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

function MediaOnlySlide({
  slide,
  theme,
  themeVars,
  slideIndex,
  galleryNav,
  onOpenGallery,
}: {
  slide: Slide;
  theme: ThemeMode;
  themeVars: any;
  slideIndex: number;
  galleryNav: SlideGalleryNav | null;
  onOpenGallery?: (index: number) => void;
}) {
  return (
    <div
      key={`media-only-${slideIndex}`}
      className="deck-slide-fit mx-auto w-full max-w-full animate-[fadeUp_.45s_ease-out] lg:max-w-7xl"
    >
      <div
        className="deck-panel-dense w-full rounded-xl p-3 sm:rounded-2xl sm:p-4 md:p-5"
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
        <div
          className="deck-eyebrow mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-black uppercase sm:mb-5 sm:gap-2.5 sm:px-4 sm:py-2"
          style={{
            color: themeVars.accent,
            background: themeVars.accentSoft,
            border: `1px solid ${themeVars.accentLine}`,
          }}
        >
          <MonitorPlay
            className="h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"
            strokeWidth={2.25}
            aria-hidden
          />
          {slide.eyebrow}
        </div>

        <div className="mb-4 flex flex-col gap-4 sm:mb-5 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-x-6 lg:gap-x-8">
          <h2
            className="deck-panel-heading min-w-0 font-black"
            style={{ color: themeVars.text }}
          >
            {slide.title}
          </h2>

          <div
            className="min-w-0 shrink-0 rounded-lg p-3 sm:rounded-xl sm:p-4 md:min-w-[9.5rem] lg:min-w-[10.5rem]"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <div
              className="deck-stat text-center font-black"
              style={{ color: themeVars.accent }}
            >
              {slide.stat ? (
                <AnimatedStat
                  value={slide.stat}
                  playKey={slideIndex}
                  duration={1.35}
                />
              ) : null}
            </div>
            <div className="deck-stat-label mt-1.5 text-center font-black uppercase opacity-65 sm:mt-2">
              {slide.statLabel}
            </div>
          </div>
        </div>

        <ImagePlaceholderGrid
          count={slide.imagePlaceholders || 2}
          themeVars={themeVars}
          videoPlaceholder={slide.videoPlaceholder}
          mediaLayout={slide.mediaLayout}
          billboardImages={slide.billboardImages}
          billboardVideoPoster={slide.billboardVideoPoster}
          galleryNav={galleryNav}
          onOpenGallery={onOpenGallery}
          fitToViewport
        />
      </div>
    </div>
  );
}

function RightPanel({
  slide,
  theme,
  themeVars,
  slideIndex,
  galleryNav,
  onOpenGallery,
}: {
  slide: Slide;
  theme: ThemeMode;
  themeVars: any;
  slideIndex: number;
  galleryNav: SlideGalleryNav | null;
  onOpenGallery?: (index: number) => void;
}) {
  const hasImages = Boolean(slide.imagePlaceholders);
  const fourAsideItems = slide.rightContent?.length === 4;
  const useFeatureTiles = fourAsideItems && !hasImages;
  /** Slides 4, 5, 7 (1-based): DXB T3, Expo Metro, Expo outdoor — center stat copy */
  const centerStatInPanel = [3, 4, 6].includes(slideIndex);
  const embedStatInGrid =
    Boolean(slide.stat) &&
    slide.statInGridIndex != null &&
    slide.imagePlaceholders === 4;
  const panelDense = hasImages;
  const singleImageWithStat =
    slide.imagePlaceholders === 1 && Boolean(slide.stat) && !embedStatInGrid;

  return (
    <div
      className={`min-w-0 w-full rounded-xl sm:rounded-2xl ${
        panelDense
          ? "deck-panel-dense deck-slide-fit p-3 sm:p-4 md:p-5"
          : "p-4 sm:p-6 md:p-7"
      }`}
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
      {singleImageWithStat ? (
        <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] sm:gap-3">
          <div
            className="flex flex-col justify-center rounded-lg p-3 text-center sm:p-4"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <div
              className="deck-stat font-black"
              style={{ color: themeVars.accent }}
            >
              <AnimatedStat
                value={slide.stat!}
                playKey={slideIndex}
                duration={1.35}
              />
            </div>
            <div className="deck-stat-label mt-1.5 font-black uppercase opacity-65">
              {slide.statLabel}
            </div>
          </div>
          <ImagePlaceholderGrid
            count={1}
            themeVars={themeVars}
            videoPlaceholder={slide.videoPlaceholder}
            mediaLayout={slide.mediaLayout}
            billboardImages={slide.billboardImages}
            billboardVideoPoster={slide.billboardVideoPoster}
            galleryNav={galleryNav}
            onOpenGallery={onOpenGallery}
            fitToViewport
            embedded
          />
        </div>
      ) : slide.stat && !embedStatInGrid ? (
        <div
          className={`rounded-lg ${
            hasImages
              ? "mb-3 p-3 sm:mb-4 sm:p-4"
              : "mb-5 p-4 sm:mb-6 sm:p-6"
          }${centerStatInPanel ? " text-center" : ""}`}
          style={{
            background: themeVars.accentSoft,
            border: `1px solid ${themeVars.accentLine}`,
          }}
        >
          <div
            className={`deck-stat font-black${centerStatInPanel ? " text-center" : ""}`}
            style={{ color: themeVars.accent }}
          >
            <AnimatedStat
              value={slide.stat}
              playKey={slideIndex}
              duration={1.35}
            />
          </div>
          <div className="deck-stat-label mt-1.5 font-black uppercase opacity-65 sm:mt-2">
            {slide.statLabel}
          </div>
        </div>
      ) : !slide.stat ? (
        <div
          className="mb-5 rounded-lg p-4 sm:rounded-xl sm:p-6"
          style={{
            background: themeVars.accentSoft,
            border: `1px solid ${themeVars.accentLine}`,
          }}
        >
          <div
            className="deck-eyebrow font-black uppercase"
            style={{ color: themeVars.accent }}
          >
            Commercial Focus
          </div>
          <div className="deck-panel-heading mt-2 font-black sm:mt-3">
            Awareness · Recall · Booth Influence
          </div>
        </div>
      ) : null}

      {slide.imagePlaceholders && !singleImageWithStat ? (
        <ImagePlaceholderGrid
          count={slide.imagePlaceholders}
          themeVars={themeVars}
          videoPlaceholder={slide.videoPlaceholder}
          mediaLayout={slide.mediaLayout}
          billboardImages={slide.billboardImages}
          billboardVideoPoster={slide.billboardVideoPoster}
          galleryNav={galleryNav}
          onOpenGallery={onOpenGallery}
          fitToViewport={panelDense}
          statInGrid={
            embedStatInGrid
              ? {
                  index: slide.statInGridIndex!,
                  value: slide.stat!,
                  label: slide.statLabel,
                  playKey: slideIndex,
                }
              : undefined
          }
        />
      ) : null}

      {slide.rightTitle ? (
        <AsideSectionHeading
          title={slide.rightTitle}
          themeVars={themeVars}
          compact={panelDense}
        />
      ) : null}

      <div
        className={
          fourAsideItems
            ? `grid grid-cols-2 ${panelDense ? "gap-2" : "gap-2.5 sm:gap-3"}`
            : panelDense
              ? "space-y-2"
              : "space-y-2.5 sm:space-y-3"
        }
      >
        {slide.rightContent?.map((item, i) => {
          const RowIcon = asideRowIcon(slideIndex, i);
          return useFeatureTiles ? (
            <AsideFeatureTile key={item} Icon={RowIcon} themeVars={themeVars}>
              {item}
            </AsideFeatureTile>
          ) : (
            <AsideContentRow
              key={item}
              Icon={RowIcon}
              themeVars={themeVars}
              compact={panelDense}
            >
              {item}
            </AsideContentRow>
          );
        })}
      </div>
    </div>
  );
}

/** Clickable deck reference image → opens global lightbox at `globalIndex`. */
function GalleryImageTrigger({
  src,
  alt,
  globalIndex,
  onOpenGallery,
  imgClassName,
}: {
  src: string;
  alt: string;
  globalIndex: number | null | undefined;
  onOpenGallery?: (index: number) => void;
  imgClassName: string;
}) {
  if (onOpenGallery != null && globalIndex != null) {
    return (
      <button
        type="button"
        onClick={() => onOpenGallery(globalIndex)}
        aria-label={`Open image viewer: ${alt}`}
        className="group relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 outline-none transition-opacity hover:opacity-[0.98] focus-visible:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-orange-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <img src={src} alt={alt} className={imgClassName} loading="lazy" />
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/0 transition-colors group-hover:bg-black/8 group-focus-visible:bg-black/8"
          aria-hidden
        />
      </button>
    );
  }
  return <img src={src} alt={alt} className={imgClassName} loading="lazy" />;
}

function ImagePlaceholderGrid({
  count,
  themeVars,
  videoPlaceholder,
  mediaLayout,
  billboardImages,
  billboardVideoPoster,
  galleryNav,
  onOpenGallery,
  statInGrid,
  fitToViewport = false,
  embedded = false,
}: {
  count: number;
  themeVars: any;
  videoPlaceholder?: boolean;
  mediaLayout?: "standard" | "twoPlusVideo";
  billboardImages?: string[];
  billboardVideoPoster?: string;
  galleryNav: SlideGalleryNav | null;
  onOpenGallery?: (index: number) => void;
  statInGrid?: {
    index: number;
    value: string;
    label?: string;
    playKey: number;
  };
  fitToViewport?: boolean;
  embedded?: boolean;
}) {
  const slotSrc = (i: number) => billboardImages?.[i];
  const cellRound = "rounded-md sm:rounded-lg";
  const videoRound = "rounded-lg sm:rounded-xl";
  const singleImageClass = fitToViewport
    ? "h-[var(--deck-image-single)] min-h-[7.5rem]"
    : "aspect-video";
  const gridCellClass = fitToViewport
    ? "h-[var(--deck-image-grid)] min-h-[5.5rem]"
    : "aspect-video";
  const wideMediaClass = fitToViewport
    ? "h-[var(--deck-image-wide)] min-h-[6.5rem]"
    : "h-[150px] sm:h-[176px] md:h-[200px]";

  if (mediaLayout === "twoPlusVideo") {
    return (
      <div className="space-y-3 sm:space-y-4">
        {count === 2 ? (
          <div
            className={`relative w-full overflow-hidden ${fitToViewport ? "h-[var(--deck-image-grid)] min-h-[7rem] sm:min-h-[7.5rem]" : "h-[200px] sm:h-[220px] md:h-[240px]"} ${cellRound}`}
            style={{
              background: themeVars.cardInner,
              border:
                slotSrc(0) || slotSrc(1)
                  ? `1px solid ${themeVars.border}`
                  : `1px dashed ${themeVars.accentLine}`,
            }}
          >
            <div className="flex h-full min-h-0 w-full gap-2.5 sm:gap-3">
              {[0, 1].map((i) => {
                const src = slotSrc(i);
                return (
                  <div
                    key={i}
                    className="relative min-h-0 min-w-0 flex-1 basis-0 overflow-hidden"
                    style={{
                      background: themeVars.cardInner,
                    }}
                  >
                    {src ? (
                      <GalleryImageTrigger
                        src={src}
                        alt={`Reference billboard ${i + 1}`}
                        globalIndex={galleryNav?.images[i]}
                        onOpenGallery={onOpenGallery}
                        imgClassName="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
                        style={{ color: themeVars.accent }}
                      >
                        Image Placeholder {i + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {Array.from({ length: count }).map((_, i) => {
              const src = slotSrc(i);
              return (
                <div
                  key={i}
                  className={`relative w-full overflow-hidden ${gridCellClass} ${cellRound}`}
                  style={{
                    background: themeVars.cardInner,
                    border: src
                      ? `1px solid ${themeVars.border}`
                      : `1px dashed ${themeVars.accentLine}`,
                  }}
                >
                  {src ? (
                    <GalleryImageTrigger
                      src={src}
                      alt={`Reference billboard ${i + 1}`}
                      globalIndex={galleryNav?.images[i]}
                      onOpenGallery={onOpenGallery}
                      imgClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
                      style={{ color: themeVars.accent }}
                    >
                      Image Placeholder {i + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {videoPlaceholder && (
          <div
            className={`relative w-full overflow-hidden ${wideMediaClass} ${videoRound}`}
            style={{
              background: themeVars.accentSoft,
              border: billboardVideoPoster
                ? `1px solid ${themeVars.border}`
                : `1px dashed ${themeVars.accentLine}`,
            }}
          >
            {billboardVideoPoster ? (
              <GalleryImageTrigger
                src={billboardVideoPoster}
                alt="Wide reference for horizontal video placement"
                globalIndex={galleryNav?.poster}
                onOpenGallery={onOpenGallery}
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
                style={{ color: themeVars.accent }}
              >
                Horizontal Video Placeholder
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (count === 1) {
    const src = slotSrc(0);
    return (
      <div
        className={`relative w-full max-w-full overflow-hidden ${singleImageClass} ${embedded ? "mb-0 h-full min-h-[7.5rem]" : "mb-3 sm:mb-4"} ${videoRound}`}
        style={{
          background: themeVars.cardInner,
          border: src
            ? `1px solid ${themeVars.border}`
            : `1px dashed ${themeVars.accentLine}`,
        }}
      >
        {src ? (
          <GalleryImageTrigger
            src={src}
            alt="Reference billboard"
            globalIndex={galleryNav?.images[0]}
            onOpenGallery={onOpenGallery}
            imgClassName="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
            style={{ color: themeVars.accent }}
          >
            Image Placeholder 1
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-5 sm:gap-3">
      {Array.from({ length: count }, (_, i) => {
        if (statInGrid && i === statInGrid.index) {
          return (
            <div
              key={`stat-slot-${i}`}
              className={`relative flex w-full min-h-0 flex-col items-center justify-center overflow-hidden ${fitToViewport ? "h-[var(--deck-image-grid)] min-h-[5.5rem]" : "aspect-video"} ${cellRound} px-2 py-3 text-center sm:px-3 sm:py-4`}
              style={{
                background: themeVars.accentSoft,
                border: `1px solid ${themeVars.accentLine}`,
              }}
            >
              <div
                className="deck-stat-compact font-black"
                style={{ color: themeVars.accent }}
              >
                <AnimatedStat
                  value={statInGrid.value}
                  playKey={statInGrid.playKey}
                  duration={1.35}
                />
              </div>
              {statInGrid.label ? (
                <div className="deck-stat-label mt-1 max-w-full px-1 font-black uppercase leading-tight opacity-65 sm:mt-1.5">
                  {statInGrid.label}
                </div>
              ) : null}
            </div>
          );
        }

        let bi = 0;
        for (let j = 0; j < i; j++) {
          if (statInGrid && j === statInGrid.index) continue;
          bi++;
        }
        const src = statInGrid != null ? billboardImages?.[bi] : slotSrc(i);

        return (
          <div
            key={i}
            className={`relative w-full overflow-hidden ${gridCellClass} ${cellRound}`}
            style={{
              background: themeVars.cardInner,
              border: src
                ? `1px solid ${themeVars.border}`
                : `1px dashed ${themeVars.accentLine}`,
            }}
          >
            {src ? (
              <GalleryImageTrigger
                src={src}
                alt={`Reference billboard ${i + 1}`}
                globalIndex={galleryNav?.images[i]}
                onOpenGallery={onOpenGallery}
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
                style={{ color: themeVars.accent }}
              >
                Image Placeholder {i + 1}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoPill({ text, themeVars }: { text: string; themeVars: any }) {
  return (
    <div
      className="group flex h-full min-h-0 flex-col rounded-lg border px-3 py-3 text-[13px] leading-snug transition-[border-color,box-shadow] duration-200 sm:rounded-xl sm:px-3.5 sm:py-3.5 sm:text-sm sm:leading-relaxed"
      style={{
        background: themeVars.panel,
        borderColor: themeVars.border,
        backdropFilter: "blur(14px)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.05) inset, 0 1px 2px rgba(15,23,34,0.04)",
      }}
    >
      <div className="flex min-h-0 flex-1 items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:translate-x-0.5 sm:h-10 sm:w-10 sm:rounded-[10px]"
          style={{
            background: themeVars.accentSoft,
            border: `1px solid ${themeVars.accentLine}`,
          }}
        >
          <ChevronRight
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            strokeWidth={2.35}
            style={{ color: themeVars.accent }}
            aria-hidden
          />
        </span>
        <span className="min-w-0 flex-1 font-medium leading-snug sm:leading-relaxed">
          {text}
        </span>
      </div>
    </div>
  );
}

function CommercialTable({
  themeVars,
  slideIndex,
}: {
  themeVars: any;
  slideIndex: number;
}) {
  return (
    <div
      className="min-w-0 w-full rounded-xl p-4 sm:rounded-2xl sm:p-5 md:p-6"
      style={{
        background: themeVars.panel,
        border: `1px solid ${themeVars.border}`,
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="mb-4 rounded-lg p-4 sm:mb-5 sm:rounded-xl sm:p-5"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <div
          className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] sm:gap-3 sm:text-xs sm:tracking-[0.25em]"
          style={{ color: themeVars.accent }}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-[10px]"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <Wallet
              className="h-[18px] w-[18px] sm:h-5 sm:w-5"
              strokeWidth={2.15}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
          </span>
          <span>Total Media Investment</span>
        </div>

        <div
          className="deck-stat mt-1 font-black sm:mt-2"
          style={{ color: themeVars.accent }}
        >
          <AnimatedStat
            value={grandTotal}
            playKey={slideIndex}
            duration={1.55}
          />
        </div>

        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] opacity-60 sm:mt-2 sm:text-xs sm:tracking-[0.18em]">
          Excluding 5% VAT
        </div>
      </div>

      <div
        data-no-swipe
        className="-mx-1 overflow-x-auto rounded-lg [scrollbar-width:thin] sm:mx-0 sm:rounded-xl"
        style={{ border: `1px solid ${themeVars.border}` }}
      >
        <table className="w-full min-w-[620px] border-collapse text-left text-[10px] sm:text-[12px]">
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
                  className="whitespace-nowrap px-2 py-2.5 text-[9px] font-black uppercase tracking-[0.12em] sm:px-3 sm:py-3 sm:text-[10px] sm:tracking-[0.18em]"
                  style={{
                    color: themeVars.accent,
                    borderBottom: `1px solid ${themeVars.border}`,
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {commercialRows.map((row) => (
              <tr key={row.location}>
                <td
                  className="max-w-[140px] px-2 py-3 font-bold sm:max-w-none sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.location}
                  <div className="mt-1 text-[9px] font-medium opacity-60 sm:text-[10px]">
                    {row.format}
                  </div>
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.screens}
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.duration}
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.productionFee}
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.grossRate}
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 sm:px-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.netRate}
                </td>

                <td
                  className="whitespace-nowrap px-2 py-3 font-black sm:px-3 sm:py-4"
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
        className="mt-4 rounded-lg p-4 text-xs font-semibold leading-6 sm:rounded-xl"
        style={{
          background: themeVars.cardInner,
          border: `1px solid ${themeVars.border}`,
        }}
      >
        Kindly note: all rates are in USD. Prices exclude 5% VAT. Municipality
        fee:
        <span style={{ color: themeVars.accent }}>
          {" "}
          $141.59 per artwork.
        </span>
      </div>
    </div>
  );
}
