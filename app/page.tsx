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

type SlideLayout =
  | "cover"
  | "objective"
  | "audience"
  | "touchpointHero"
  | "touchpointMosaic"
  | "mediaOnly"
  | "outdoorZones"
  | "commercial"
  | "creativeColumns"
  | "closingTimeline";

type ObjectiveStep = {
  phase: string;
  title: string;
  body: string;
  metric: string;
  iconKey: string;
};

type AudienceKpi = {
  value: string;
  label: string;
  sublabel: string;
  iconKey: string;
};

type Persona = {
  role: string;
  focus: string;
  iconKey: string;
};

type FactSheetRow = {
  label: string;
  value: string;
  iconKey: string;
};

type StatBlock = {
  value: string;
  label: string;
};

type MetroZone = {
  name: string;
  iconKey: string;
};

type OutdoorZone = {
  name: string;
  copy: string;
  formats: { count: string; type: string }[];
  iconKey: string;
};

type CreativeColumn = {
  env: string;
  iconKey: string;
  headline: string;
  message: string;
  copyRule: string;
  legibility: string;
  image?: string;
};

type ClosingDate = {
  badge: string;
  title: string;
  detail: string;
  iconKey: string;
};

type ClosingSummaryItem = {
  phase: string;
  copy: string;
  iconKey: string;
};

type CommercialContributionRow = {
  name: string;
  value: number;
  note?: string;
  excluded?: boolean;
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
  layout?: SlideLayout;
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

  // Layout-specific richer content slots
  coverMarquee?: string[];
  objective?: {
    intro: string;
    steps: ObjectiveStep[];
    outcome: { stat: string; statLabel: string; copy: string };
  };
  audience?: {
    kpis: AudienceKpi[];
    personas: Persona[];
    insight: string;
  };
  touchpointHero?: {
    badge: string;
    factSheet: FactSheetRow[];
    insight: string;
    heroImage?: string;
  };
  metro?: {
    statRibbon: StatBlock[];
    zones: MetroZone[];
    insight: string;
  };
  outdoor?: {
    heroStat: StatBlock;
    zones: OutdoorZone[];
    insight: string;
  };
  mediaSceneLabels?: string[];
  mediaStatRibbon?: StatBlock[];
  commercialExtras?: {
    breakdown: CommercialContributionRow[];
    total: number;
    checklist: { iconKey: string; label: string }[];
  };
  creative?: {
    columns: CreativeColumn[];
    hierarchy: string[];
  };
  closing?: {
    dates: ClosingDate[];
    summary: ClosingSummaryItem[];
    farewell: string;
  };
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
    location: "Deira / Old Dubai Corridor",
    format: "Bridge Banners (Pedestrian)",
    type: "Static Bridge Banners",
    screens: "7 Faces",
    duration: "1 month",
    productionFee: "Included",
    grossRate: "AED 540,000",
    netRate: "AED 540,000",
    totalFee: "AED 540,000",
  },
  {
    location: "JAFZA / Jebel Ali",
    format: "SZR Hoarding",
    type: "Static Roadside Hoarding",
    screens: "1 Face",
    duration: "1 month",
    productionFee: "Included",
    grossRate: "AED 100,000",
    netRate: "AED 100,000",
    totalFee: "AED 100,000",
  },
  {
    location: "DIFC · One Central",
    format: "DIFC Screens",
    type: "Digital LED Screens",
    screens: "62 Screens",
    duration: "10s spot · every 2 min · 1 month",
    productionFee: "Included",
    grossRate: "AED 100,000",
    netRate: "AED 100,000",
    totalFee: "AED 100,000",
  },
  {
    location: "Business Bay",
    format: "Elevator Screens",
    type: "Digital LCD Network",
    screens: "84 Screens",
    duration: "12s spot · 4 min loop · 1 month",
    productionFee: "Included",
    grossRate: "AED 37,500",
    netRate: "AED 37,500",
    totalFee: "AED 37,500",
  },
];

const grandTotal = "AED 777,500";

const ICON_REGISTRY: Record<string, LucideIcon> = {
  arrowUpRight: ArrowUpRight,
  award: Award,
  badgeCheck: BadgeCheck,
  briefcase: Briefcase,
  building2: Building2,
  calendarRange: CalendarRange,
  chevronRight: ChevronRight,
  compass: Compass,
  fileText: FileText,
  globe2: Globe2,
  handshake: Handshake,
  heartHandshake: HeartHandshake,
  layers: Layers,
  layoutGrid: LayoutGrid,
  lineChart: LineChart,
  mapPinned: MapPinned,
  megaphone: Megaphone,
  monitorPlay: MonitorPlay,
  package: Package,
  palette: Palette,
  plane: Plane,
  receipt: Receipt,
  sparkles: Sparkles,
  table2: Table2,
  target: Target,
  timer: Timer,
  trainFront: TrainFront,
  tv: Tv,
  users: Users,
  wallet: Wallet,
  workflow: Workflow,
  zap: Zap,
};

function getIcon(
  key: string | undefined,
  fallback: LucideIcon = ArrowUpRight,
): LucideIcon {
  if (!key) return fallback;
  return ICON_REGISTRY[key] ?? fallback;
}

function iconForAsideTitle(title: string | undefined): LucideIcon | undefined {
  if (!title) return undefined;
  const t = title.trim();
  if (t === "Core Plan") return LayoutGrid;
  if (t === "Why this fits UBL") return BadgeCheck;
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
  if (l.includes("q4")) return CalendarRange;
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
              boxShadow: "0 4px 28px rgba(0,131,202,0.14)",
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
          boxShadow: "0 6px 20px rgba(0,131,202,0.12)",
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
    eyebrow: "MAG × UBL",
    title: "Q4 2026\nOOH Media Plan",
    subtitle:
      "A high-impact, month-by-month Out-of-Home plan placing UBL across Dubai's busiest commuter, business and pedestrian corridors throughout the fourth quarter.",
    rightTitle: "Core Plan",
    rightContent: [
      "Deira / Old Dubai Bridge Banners",
      "JAFZA · Sheikh Zayed Road Hoarding",
      "DIFC Digital Screens · One Central",
      "Business Bay Elevator Network",
    ],
    coverMarquee: [
      "7 Pedestrian Bridge Banners · Deira",
      "1 SZR Hoarding · JAFZA / Jebel Ali",
      "62 Digital Screens · DIFC One Central",
      "84 Elevator Screens · Business Bay",
      "Q4 2026 · Oct – Dec",
      "Monthly Investment · AED 777,500",
    ],
  },
  {
    layout: "objective",
    eyebrow: "Brand Objective",
    title: "Keep UBL visible across Dubai's high-density Q4 corridors.",
    subtitle:
      "Q4 concentrates seasonal salary cycles, year-end financial decisions and remittance peaks. The plan builds frequency on the routes UBL's target customers travel every day.",
    objective: {
      intro:
        "Combine pedestrian, roadside and premium digital touchpoints so UBL stays present across the full Dubai workday — commute, office and footfall zones — for the full quarter.",
      steps: [
        {
          phase: "Commute layer",
          title: "Own the daily route",
          body: "Bridge banners in Deira and the SZR hoarding capture residents and commuters on repeat journeys into the city.",
          metric: "Daily",
          iconKey: "trainFront",
        },
        {
          phase: "Office layer",
          title: "Reach the business district",
          body: "DIFC and Business Bay deliver UBL to executives and corporate clients in the highest-value financial corridor in the UAE.",
          metric: "Workdays",
          iconKey: "building2",
        },
        {
          phase: "Reinforcement",
          title: "Hold presence across the quarter",
          body: "A continuous monthly investment keeps UBL top of mind through October, November and December.",
          metric: "Q4",
          iconKey: "calendarRange",
        },
      ],
      outcome: {
        stat: "154",
        statLabel: "Faces & Screens Live",
        copy: "A single connected media layer working across commute, business district and high-footfall premium environments — every day of Q4.",
      },
    },
    rightTitle: "Why this fits UBL",
    rightContent: [
      "Retail & priority banking",
      "Digital banking adoption",
      "Corporate & SME relationships",
      "Remittance & expat services",
    ],
  },
  {
    layout: "audience",
    eyebrow: "Audience Strategy",
    title: "Reach UBL's customers where Dubai actually moves.",
    subtitle:
      "Dubai's working population concentrates on a small number of high-traffic corridors. The Q4 plan layers UBL across the daily flow of residents, executives and high-footfall venues.",
    audience: {
      kpis: [
        {
          value: "3.7M+",
          label: "Dubai residents",
          sublabel: "Across the active Q4 footfall radius",
          iconKey: "users",
        },
        {
          value: "200+",
          label: "Nationalities reached",
          sublabel: "Strong overlap with UBL's expat & remittance base",
          iconKey: "globe2",
        },
        {
          value: "12x+",
          label: "Avg weekly frequency",
          sublabel: "Across the four-channel monthly layer",
          iconKey: "lineChart",
        },
      ],
      personas: [
        {
          role: "Salaried Professionals",
          focus: "Priority banking, payroll & lifestyle products",
          iconKey: "briefcase",
        },
        {
          role: "Expatriate Workforce",
          focus: "Remittance, savings & multi-currency accounts",
          iconKey: "globe2",
        },
        {
          role: "Business Owners & SMEs",
          focus: "Corporate banking, trade finance, lending",
          iconKey: "workflow",
        },
        {
          role: "Executives & C-suite",
          focus: "Private banking, wealth, advisory services",
          iconKey: "award",
        },
        {
          role: "Digital-First Customers",
          focus: "UBL Digital app, cards and online onboarding",
          iconKey: "sparkles",
        },
        {
          role: "Daily Commuters",
          focus: "Bridge, road and metro-adjacent corridors",
          iconKey: "trainFront",
        },
      ],
      insight:
        "The four channels intersect UBL's audience at the moments that matter — commute, workday and lifestyle footfall — every single day of Q4.",
    },
  },
  {
    layout: "touchpointHero",
    eyebrow: "Touchpoint 01",
    title: "Deira / Old Dubai Bridge Banners",
    subtitle:
      "Seven pedestrian bridge banners across the busiest commuter corridor in Old Dubai — Al Garhoud, Deira, Al Qusais and Airport Road.",
    stat: "7",
    statLabel: "Bridge Faces",
    imagePlaceholders: 1,
    billboardImages: ["/images/ubl/bridge-nad-al-hamar-face-a.png"],
    touchpointHero: {
      badge: "Touchpoint 01 · Commute Layer",
      heroImage: "/images/ubl/bridge-nad-al-hamar-face-a.png",
      factSheet: [
        { label: "Location", value: "Deira / Old Dubai corridor", iconKey: "mapPinned" },
        { label: "Format", value: "Pedestrian Bridge Banners", iconKey: "monitorPlay" },
        { label: "Faces", value: "7 Bridge Faces", iconKey: "layers" },
        { label: "Duration", value: "1 Month · Repeatable Monthly", iconKey: "calendarRange" },
        { label: "Audience", value: "Commuters, residents, expats", iconKey: "users" },
        { label: "Visibility", value: "All-day · daylight + night", iconKey: "timer" },
      ],
      insight:
        "The frequency layer. Deira's bridge network delivers UBL to the same audience on the same routes, day after day, for the full month.",
    },
  },
  {
    layout: "mediaOnly",
    eyebrow: "Touchpoint 01 · Bridge Route · Pt. 1",
    title: "Nad Al Hamar & Al Nahda — eastern approach corridor.",
    stat: "3",
    statLabel: "Bridge Faces",
    imagePlaceholders: 3,
    mediaLayout: "twoPlusVideo",
    billboardImages: [
      "/images/ubl/bridge-nad-al-hamar-face-a.png",
      "/images/ubl/bridge-nad-al-hamar-face-b.png",
      "/images/ubl/bridge-al-nahda.png",
    ],
    mediaSceneLabels: [
      "1st Nad Al Hamar Bridge · Face A · Towards Airport Road",
      "1st Nad Al Hamar Bridge · Face B · Towards DFC Road",
      "Al Nahda Bridge · Towards Emirates Road",
    ],
    mediaStatRibbon: [
      { value: "3", label: "Bridge faces" },
      { value: "Daily", label: "Repeat exposure" },
      { value: "1 mo", label: "Campaign window" },
    ],
  },
  {
    layout: "mediaOnly",
    eyebrow: "Touchpoint 01 · Bridge Route · Pt. 2",
    title: "Gold Souk, Omar Bin Khattab & Sheikh Rashid — central Deira loop.",
    stat: "4",
    statLabel: "Bridge Faces",
    imagePlaceholders: 4,
    mediaLayout: "twoPlusVideo",
    billboardImages: [
      "/images/ubl/bridge-gold-souk-face-a.png",
      "/images/ubl/bridge-gold-souk-face-b.png",
      "/images/ubl/bridge-omar-bin-khattab-face-a.png",
      "/images/ubl/bridge-sheikh-rashid-face-b.png",
    ],
    mediaSceneLabels: [
      "Gold Souk Bridge · Face A · Al Shandagha → Naif",
      "Gold Souk Bridge · Face B · Naif → Al Shandagha",
      "Omar Bin Khattab St. Bridge · Face A · Al Gurrair → Etisalat",
      "Sheikh Rashid Road Bridge · Face B · Towards Al Garhoud",
    ],
    mediaStatRibbon: [
      { value: "4", label: "Bridge faces" },
      { value: "Daily", label: "Repeat exposure" },
      { value: "1 mo", label: "Campaign window" },
    ],
  },
  {
    layout: "touchpointHero",
    eyebrow: "Touchpoint 02",
    title: "JAFZA · Sheikh Zayed Road Hoarding",
    subtitle:
      "A single large-format hoarding on Sheikh Zayed Road within the Jebel Ali / JAFZA corridor — the highest-traffic logistics and business artery in the UAE.",
    stat: "SZR",
    statLabel: "Prime Hoarding",
    imagePlaceholders: 1,
    billboardImages: ["/images/ubl/jafza-hoarding.png"],
    touchpointHero: {
      badge: "Touchpoint 02 · Roadside Layer",
      heroImage: "/images/ubl/jafza-hoarding.png",
      factSheet: [
        { label: "Location", value: "Sheikh Zayed Rd · JAFZA / Jebel Ali", iconKey: "mapPinned" },
        { label: "Format", value: "Static Roadside Hoarding", iconKey: "monitorPlay" },
        { label: "Faces", value: "1 Face · Large Format", iconKey: "layers" },
        { label: "Duration", value: "1 Month · Repeatable Monthly", iconKey: "calendarRange" },
        { label: "Audience", value: "SZR commuters · JAFZA workforce", iconKey: "users" },
        { label: "Visibility", value: "All-day · arterial road", iconKey: "timer" },
      ],
      insight:
        "Anchors UBL on the UAE's most strategic commercial road, reaching commuters travelling between Abu Dhabi and Dubai every day.",
    },
  },
  {
    layout: "touchpointMosaic",
    eyebrow: "Touchpoint 03",
    title: "DIFC Digital Screens · One Central",
    subtitle:
      "62 digital screens across One Central in DIFC — UBL's natural environment of bankers, finance professionals and corporate decision-makers.",
    stat: "62",
    statLabel: "Digital Screens",
    imagePlaceholders: 3,
    billboardImages: [
      "/images/ubl/difc-columns.png",
      "/images/ubl/difc-one-central.png",
      "/images/ubl/difc-columns-corridor.png",
    ],
    metro: {
      statRibbon: [
        { value: "62", label: "Digital Screens" },
        { value: "10s", label: "Ad spot" },
        { value: "1/2 min", label: "Frequency" },
        { value: "1 mo", label: "Campaign" },
      ],
      zones: [
        { name: "DIFC Lobbies", iconKey: "building2" },
        { name: "One Central", iconKey: "compass" },
        { name: "Columns", iconKey: "layers" },
        { name: "Premium Halls", iconKey: "sparkles" },
      ],
      insight:
        "High-frequency, high-relevance. Every spot lands in front of the exact decision-makers UBL's corporate and priority banking teams pursue.",
    },
  },
  {
    layout: "touchpointHero",
    eyebrow: "Touchpoint 04",
    title: "Business Bay Elevator Network",
    subtitle:
      "84 elevator screens across Business Bay's residential and commercial towers — UBL in front of residents, professionals and visitors during the captive elevator ride.",
    stat: "84",
    statLabel: "Elevator Screens",
    imagePlaceholders: 1,
    billboardImages: ["/images/ubl/business-bay-elevators.png"],
    touchpointHero: {
      badge: "Touchpoint 04 · Lifestyle Layer",
      heroImage: "/images/ubl/business-bay-elevators.png",
      factSheet: [
        { label: "Location", value: "Business Bay · Residential & Office Towers", iconKey: "mapPinned" },
        { label: "Format", value: "Digital LCD Elevator Screens", iconKey: "monitorPlay" },
        { label: "Network", value: "84 Screens", iconKey: "tv" },
        { label: "Loop Cycle", value: "4 minutes", iconKey: "timer" },
        { label: "Ad Duration", value: "12 seconds per spot", iconKey: "zap" },
        { label: "Monthly Rate", value: "AED 37,500", iconKey: "wallet" },
      ],
      insight:
        "Captive attention environment. Daily repeat exposure to residents and office workers — high-value frequency at a low monthly cost.",
    },
  },
  {
    layout: "commercial",
    eyebrow: "Commercial Plan",
    title: "Q4 2026 monthly media investment.",
    subtitle:
      "A four-channel monthly package combining bridge banners, an SZR hoarding, DIFC digital screens and Business Bay elevators. Repeatable each month of Q4 — October, November, December.",
    bullets: [
      "All rates are in AED",
      "Prices exclude 5% VAT",
      "Production & artwork: included",
      "Monthly package total: AED 777,500",
    ],
    rightTitle: "Total Package",
    rightContent: [
      "Deira Bridge Banners · 7 faces",
      "JAFZA SZR Hoarding · 1 face",
      "DIFC Screens · 62 screens",
      "Business Bay · 84 elevator screens",
    ],
    commercialExtras: {
      total: 777500,
      breakdown: [],
      checklist: [
        { iconKey: "trainFront", label: "Commuter bridge layer" },
        { iconKey: "mapPinned", label: "SZR arterial hoarding" },
        { iconKey: "building2", label: "DIFC premium digital" },
        { iconKey: "tv", label: "Business Bay lifestyle network" },
      ],
    },
  },
  {
    layout: "creativeColumns",
    eyebrow: "Creative Strategy",
    title: "Adapt the message to each environment.",
    subtitle:
      "Each channel reaches a different mindset. The creative should change in tone and call-to-action — but stay consistent in the brand cue — so UBL builds a single, layered impression across Q4.",
    creative: {
      columns: [
        {
          env: "Bridges & Hoarding",
          iconKey: "trainFront",
          headline: "Mass reach · daily commute",
          message: "Big logo, single benefit. Build the habit of seeing UBL on the daily route.",
          copyRule: "≤ 5 words + CTA",
          legibility: "Readable from 10m+",
        },
        {
          env: "DIFC Screens",
          iconKey: "building2",
          headline: "Corporate & premium banking",
          message: "Lead with trust and service. Speak to finance professionals on their turf.",
          copyRule: "≤ 7 words",
          legibility: "Readable from 4m",
        },
        {
          env: "Business Bay Elevators",
          iconKey: "tv",
          headline: "Captive · lifestyle frequency",
          message: "Use the dwell time. Spotlight digital banking, cards or lifestyle offers.",
          copyRule: "≤ 8 words",
          legibility: "Readable from 1.5m",
        },
      ],
      hierarchy: [
        "Trusted everyday banking",
        "Digital-first experience",
        "Wealth & corporate",
        "Call to action · UBL Digital",
      ],
    },
  },
  {
    layout: "closingTimeline",
    eyebrow: "Q4 2026 · Campaign Calendar",
    title: "Three months. One connected presence for UBL.",
    subtitle:
      "Q4 covers the final salary cycle, year-end financial decisions and the seasonal remittance peak. Holding all four channels through October, November and December keeps UBL present at every moment that matters.",
    closing: {
      dates: [
        {
          badge: "01 OCT",
          title: "Q4 Wave 1 Launch",
          detail: "All four channels live · Month 1",
          iconKey: "calendarRange",
        },
        {
          badge: "31 DEC",
          title: "Q4 Campaign Close",
          detail: "Month 3 wrap · post-campaign report",
          iconKey: "sparkles",
        },
      ],
      summary: [
        {
          phase: "Commute layer",
          copy: "Deira bridge banners and the JAFZA SZR hoarding keep UBL on the daily route, all quarter.",
          iconKey: "trainFront",
        },
        {
          phase: "Workday layer",
          copy: "DIFC One Central screens reach finance professionals and corporate decision-makers on every workday.",
          iconKey: "building2",
        },
        {
          phase: "Lifestyle layer",
          copy: "Business Bay elevator screens deliver high-frequency, captive exposure in the residential and office network.",
          iconKey: "tv",
        },
      ],
      farewell:
        "MAG International is ready to launch UBL's Q4 plan across Dubai's most valuable corridors — an extension of your team for the full quarter.",
    },
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
        accent: "#0083CA",
        accentSoft: "rgba(0,131,202,0.12)",
        accentLine: "rgba(0,131,202,0.35)",
        ublAccent: "#0083CA",
        ublAccentSoft: "rgba(0,131,202,0.12)",
        ublAccentLine: "rgba(0,131,202,0.35)",
        grid: "rgba(15,23,34,0.06)",
        orb1: "rgba(0,131,202,0.18)",
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
      accent: "#2199E8",
      accentSoft: "rgba(33,153,232,0.14)",
      accentLine: "rgba(33,153,232,0.40)",
      ublAccent: "#2199E8",
      ublAccentSoft: "rgba(33,153,232,0.14)",
      ublAccentLine: "rgba(33,153,232,0.40)",
      grid: "rgba(255,255,255,0.05)",
      orb1: "rgba(33,153,232,0.18)",
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
                src="/brands/ubl-logo-mark.png"
                alt="UBL · United Bank Limited"
                width={738}
                height={322}
                loading="eager"
                fetchPriority="high"
                className="block h-[26px] w-auto max-w-[min(150px,38vw)] object-contain object-left sm:h-7 md:h-[30px]"
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 sm:px-28 md:px-36 lg:px-44"
            >
              <div
                className="max-w-full truncate text-center text-[10px] font-bold uppercase tracking-[0.18em] opacity-60 sm:text-xs sm:tracking-[0.24em]"
                style={{ color: themeVars.text }}
              >
                <span className="sm:hidden">Q4 ’26</span>
                <span className="hidden sm:inline">Q4 2026 · MAG × UBL</span>
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
                        ? "0 2px 8px rgba(0,131,202,0.35)"
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
                        ? "0 2px 8px rgba(0,131,202,0.35)"
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
          <SlideRenderer
            slide={slide}
            slideIndex={current}
            theme={theme}
            themeVars={themeVars}
            galleryNav={galleryNav}
            onOpenGallery={hasDeckGallery ? openGalleryAt : undefined}
          />
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

type SlideRendererProps = {
  slide: Slide;
  slideIndex: number;
  theme: ThemeMode;
  themeVars: any;
  galleryNav: SlideGalleryNav | null;
  onOpenGallery?: (index: number) => void;
};

function SlideRenderer(props: SlideRendererProps) {
  switch (props.slide.layout) {
    case "cover":
      return <CoverSlide {...props} />;
    case "objective":
      return <ObjectiveSlide {...props} />;
    case "audience":
      return <AudienceSlide {...props} />;
    case "touchpointHero":
      return <TouchpointHeroSlide {...props} />;
    case "touchpointMosaic":
      return <TouchpointMosaicSlide {...props} />;
    case "mediaOnly":
      return <MediaOnlySlide {...props} />;
    case "outdoorZones":
      return <OutdoorZonesSlide {...props} />;
    case "commercial":
      return <CommercialSlide {...props} />;
    case "creativeColumns":
      return <CreativeColumnsSlide {...props} />;
    case "closingTimeline":
      return <ClosingTimelineSlide {...props} />;
    default:
      return null;
  }
}

function SlideShell({
  themeVars: _themeVars,
  theme,
  slideIndex,
  className = "",
  children,
}: {
  themeVars: any;
  theme: ThemeMode;
  slideIndex: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      key={`slide-${slideIndex}-${theme}`}
      className={`deck-slide-fit mx-auto flex w-full max-w-full animate-[fadeUp_.45s_ease-out] flex-col gap-4 sm:gap-5 lg:max-w-6xl xl:max-w-7xl ${className}`}
    >
      {children}
    </div>
  );
}

function EyebrowChip({
  slide,
  themeVars,
  className = "",
}: {
  slide: Slide;
  themeVars: any;
  className?: string;
}) {
  const Icon = eyebrowLeadIcon(slide.eyebrow);
  return (
    <div
      className={`deck-eyebrow inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 font-black uppercase sm:gap-2.5 sm:px-4 sm:py-2 ${className}`}
      style={{
        color: themeVars.accent,
        background: themeVars.accentSoft,
        border: `1px solid ${themeVars.accentLine}`,
      }}
    >
      {Icon ? (
        <Icon
          className="h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"
          strokeWidth={2.25}
          aria-hidden
        />
      ) : null}
      {slide.eyebrow}
    </div>
  );
}

function CoverSlide({ slide, slideIndex, theme, themeVars }: SlideRendererProps) {
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid min-h-0 flex-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5">
            <img
              src="/brands/mag-logo.png"
              alt="MAG · Media Agency Group"
              width={500}
              height={127}
              loading="eager"
              fetchPriority="high"
              className="block h-[34px] w-auto max-w-[min(188px,52vw)] shrink-0 object-contain object-left sm:h-[40px] md:h-[44px]"
              style={theme === "light" ? { filter: "brightness(0)" } : undefined}
            />
            <span
              className="select-none text-base font-light leading-none sm:text-lg"
              style={{ color: themeVars.sub }}
              aria-hidden
            >
              ×
            </span>
            <img
              src="/brands/ubl-logo.png"
              alt="UBL · United Bank Limited · where you come first"
              width={738}
              height={441}
              loading="eager"
              fetchPriority="high"
              className="block h-[48px] w-auto max-w-[min(220px,50vw)] shrink-0 object-contain object-left sm:h-[56px] md:h-[64px]"
            />
          </div>

          <EyebrowChip slide={slide} themeVars={themeVars} className="mt-4" />

          <h1 className="deck-title-cover mt-4 whitespace-pre-line font-black sm:mt-5">
            {slide.title}
          </h1>

          {slide.subtitle ? (
            <p
              className="deck-subtitle mt-4 max-w-2xl deck-clamp-4 sm:mt-5"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}
        </div>

        <div
          className="flex h-full min-h-0 flex-col rounded-2xl p-4 sm:p-5 md:p-6"
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
          {slide.rightTitle ? (
            <AsideSectionHeading title={slide.rightTitle} themeVars={themeVars} compact />
          ) : null}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {slide.rightContent?.map((item, i) => (
              <AsideFeatureTile
                key={item}
                Icon={asideRowIcon(0, i)}
                themeVars={themeVars}
              >
                {item}
              </AsideFeatureTile>
            ))}
          </div>
        </div>
      </div>

      {slide.coverMarquee && slide.coverMarquee.length > 0 ? (
        <CoverMarquee items={slide.coverMarquee} themeVars={themeVars} />
      ) : null}
    </SlideShell>
  );
}

function CoverMarquee({ items, themeVars }: { items: string[]; themeVars: any }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden rounded-full"
      style={{
        background: themeVars.cardInner,
        border: `1px solid ${themeVars.border}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20"
        style={{
          background: `linear-gradient(90deg, ${themeVars.bg} 0%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20"
        style={{
          background: `linear-gradient(270deg, ${themeVars.bg} 0%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div className="deck-marquee-track flex w-max items-center gap-8 whitespace-nowrap px-4 py-3 sm:gap-12 sm:px-8 sm:py-4">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-3 text-xs font-black uppercase tracking-[0.22em] sm:text-sm"
            style={{ color: themeVars.text }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: themeVars.accent }}
              aria-hidden
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ObjectiveSlide({ slide, slideIndex, theme, themeVars }: SlideRendererProps) {
  const obj = slide.objective;
  if (!obj) return null;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-3 mt-3 max-w-2xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}
          <p
            className="deck-clamp-3 mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: themeVars.text }}
          >
            {obj.intro}
          </p>
        </div>

        <div
          className="flex flex-col gap-2 rounded-2xl p-4 sm:p-5"
          style={{
            background: themeVars.accentSoft,
            border: `1px solid ${themeVars.accentLine}`,
          }}
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] opacity-80"
               style={{ color: themeVars.accent }}>
            <Target className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
            Outcome
          </div>
          <div className="deck-stat font-black" style={{ color: themeVars.accent }}>
            <AnimatedStat value={obj.outcome.stat} playKey={slideIndex} duration={1.45} />
          </div>
          <div className="deck-stat-label font-black uppercase opacity-70">
            {obj.outcome.statLabel}
          </div>
          <p
            className="deck-clamp-3 text-xs leading-relaxed opacity-85 sm:text-[13px]"
            style={{ color: themeVars.text }}
          >
            {obj.outcome.copy}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {obj.steps.map((step, i) => {
          const Icon = getIcon(step.iconKey);
          return (
            <div
              key={step.title}
              className="relative flex min-h-0 flex-col gap-2 overflow-hidden rounded-2xl p-4 sm:p-5"
              style={{
                background: themeVars.panel,
                border: `1px solid ${themeVars.border}`,
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2.2}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                </span>
                <span
                  className="text-[10px] font-black uppercase tracking-[0.22em] opacity-60"
                  style={{ color: themeVars.text }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: themeVars.accent }}
              >
                {step.phase}
              </div>
              <div
                className="text-base font-black leading-tight sm:text-lg"
                style={{ color: themeVars.text }}
              >
                {step.title}
              </div>
              <p
                className="deck-clamp-3 text-xs leading-relaxed sm:text-[13px] sm:leading-relaxed"
                style={{ color: themeVars.sub }}
              >
                {step.body}
              </p>
              <div
                className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                style={{
                  background: themeVars.cardInner,
                  border: `1px solid ${themeVars.border}`,
                  color: themeVars.accent,
                }}
              >
                {step.metric}
              </div>
            </div>
          );
        })}
      </div>

      {slide.rightContent && slide.rightContent.length > 0 ? (() => {
        const isUbl = (slide.rightTitle ?? "").toLowerCase().includes("ubl");
        const chipDot = isUbl ? themeVars.ublAccent : themeVars.accent;
        const chipLine = isUbl ? themeVars.ublAccentLine : themeVars.border;
        const chipBg = isUbl ? themeVars.ublAccentSoft : themeVars.cardInner;
        const labelColor = isUbl ? themeVars.ublAccent : themeVars.text;
        return (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className="text-[10px] font-black uppercase tracking-[0.22em] opacity-80"
              style={{ color: labelColor }}
            >
              {slide.rightTitle ?? "Why this fits"}
            </span>
            {slide.rightContent.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold sm:text-[13px]"
                style={{
                  background: chipBg,
                  border: `1px solid ${chipLine}`,
                  color: themeVars.text,
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: chipDot }}
                  aria-hidden
                />
                {item}
              </span>
            ))}
          </div>
        );
      })() : null}
    </SlideShell>
  );
}

function AudienceSlide({ slide, slideIndex, theme, themeVars }: SlideRendererProps) {
  const a = slide.audience;
  if (!a) return null;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-4 mt-3 max-w-2xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}
          <div
            className="mt-4 inline-flex items-start gap-2 rounded-xl p-3 sm:p-4"
            style={{
              background: themeVars.ublAccentSoft,
              border: `1px solid ${themeVars.ublAccentLine}`,
            }}
          >
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2.3}
              style={{ color: themeVars.ublAccent }}
              aria-hidden
            />
            <p
              className="deck-clamp-3 text-xs font-semibold leading-relaxed sm:text-[13px]"
              style={{ color: themeVars.text }}
            >
              {a.insight}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          {a.kpis.map((kpi) => {
            const Icon = getIcon(kpi.iconKey);
            return (
              <div
                key={kpi.label}
                className="flex flex-col gap-2 rounded-2xl p-3 sm:p-4"
                style={{
                  background: themeVars.panel,
                  border: `1px solid ${themeVars.border}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={2.2}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                </span>
                <div className="deck-stat-compact font-black" style={{ color: themeVars.accent }}>
                  <AnimatedStat value={kpi.value} playKey={slideIndex} duration={1.35} />
                </div>
                <div
                  className="text-[11px] font-black uppercase tracking-[0.18em] opacity-75"
                  style={{ color: themeVars.text }}
                >
                  {kpi.label}
                </div>
                <p
                  className="deck-clamp-2 text-[11px] leading-snug sm:text-xs"
                  style={{ color: themeVars.sub }}
                >
                  {kpi.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <div
          className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: themeVars.accent }}
        >
          <Users className="h-3.5 w-3.5" strokeWidth={2.3} aria-hidden />
          Personas in the room
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {a.personas.map((p) => {
            const Icon = getIcon(p.iconKey);
            return (
              <div
                key={p.role}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{
                  background: themeVars.cardInner,
                  border: `1px solid ${themeVars.border}`,
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={2.2}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-sm font-black leading-tight sm:text-[15px]"
                    style={{ color: themeVars.text }}
                  >
                    {p.role}
                  </div>
                  <p
                    className="deck-clamp-2 mt-1 text-[11px] leading-snug sm:text-xs"
                    style={{ color: themeVars.sub }}
                  >
                    {p.focus}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
}

function TouchpointHeroSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
  galleryNav,
  onOpenGallery,
}: SlideRendererProps) {
  const t = slide.touchpointHero;
  if (!t) return null;
  const heroSrc = t.heroImage ?? slide.billboardImages?.[0];
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid min-h-0 flex-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-stretch lg:gap-6">
        <div className="relative min-h-0 w-full overflow-hidden rounded-2xl"
             style={{
               background: themeVars.cardInner,
               border: `1px solid ${themeVars.border}`,
             }}>
          {heroSrc ? (
            <GalleryImageTrigger
              src={heroSrc}
              alt="DXB Terminal 3 Arrivals reference"
              globalIndex={galleryNav?.images[0]}
              onOpenGallery={onOpenGallery}
              imgClassName="h-full min-h-[18rem] w-full object-cover sm:min-h-[22rem]"
            />
          ) : (
            <div className="flex h-full min-h-[18rem] items-center justify-center text-xs font-black uppercase tracking-[0.22em]"
                 style={{ color: themeVars.accent }}>
              Touchpoint Reference
            </div>
          )}

          <div
            className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] sm:left-4 sm:top-4 sm:text-[11px]"
            style={{
              background: "rgba(13,20,32,0.72)",
              border: `1px solid ${themeVars.accentLine}`,
              color: "#fff",
              backdropFilter: "blur(10px)",
            }}
          >
            <MapPinned className="h-3 w-3" strokeWidth={2.4} aria-hidden />
            {t.badge}
          </div>

          {slide.stat ? (
            <div
              className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl px-3 py-2 text-right sm:bottom-4 sm:right-4 sm:px-4 sm:py-3"
              style={{
                background: "rgba(13,20,32,0.78)",
                border: `1px solid ${themeVars.accentLine}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="deck-stat-compact font-black" style={{ color: themeVars.accent }}>
                <AnimatedStat value={slide.stat} playKey={slideIndex} duration={1.45} />
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/85 sm:text-[10px]">
                {slide.statLabel}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-3 max-w-xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}

          <div
            className="grid grid-cols-1 gap-2 rounded-2xl p-3 sm:grid-cols-2 sm:gap-2 sm:p-4"
            style={{
              background: themeVars.panel,
              border: `1px solid ${themeVars.border}`,
              backdropFilter: "blur(14px)",
            }}
          >
            {t.factSheet.map((row) => {
              const Icon = getIcon(row.iconKey);
              return (
                <div
                  key={row.label}
                  className="flex items-start gap-2.5 rounded-lg px-2.5 py-2"
                  style={{
                    background: themeVars.cardInner,
                    border: `1px solid ${themeVars.border}`,
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: themeVars.accentSoft,
                      border: `1px solid ${themeVars.accentLine}`,
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={2.2}
                      style={{ color: themeVars.accent }}
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[9px] font-black uppercase tracking-[0.22em] opacity-70"
                      style={{ color: themeVars.text }}
                    >
                      {row.label}
                    </div>
                    <div
                      className="deck-clamp-1 text-[12px] font-bold leading-snug sm:text-[13px]"
                      style={{ color: themeVars.text }}
                    >
                      {row.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-auto flex items-start gap-2 rounded-xl p-3"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <BadgeCheck
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2.3}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
            <p
              className="deck-clamp-3 text-xs font-semibold leading-relaxed sm:text-[13px]"
              style={{ color: themeVars.text }}
            >
              {t.insight}
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

function TouchpointMosaicSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
  galleryNav,
  onOpenGallery,
}: SlideRendererProps) {
  const m = slide.metro;
  if (!m) return null;
  const src = (i: number) => slide.billboardImages?.[i];
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid min-h-0 flex-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-6">
        <div className="flex min-h-0 flex-col gap-3">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-3 max-w-xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}

          <div
            className="grid grid-cols-4 gap-0 overflow-hidden rounded-2xl"
            style={{
              background: themeVars.panel,
              border: `1px solid ${themeVars.border}`,
              backdropFilter: "blur(14px)",
            }}
          >
            {m.statRibbon.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-center sm:py-4"
                style={{
                  borderRight:
                    i < m.statRibbon.length - 1
                      ? `1px solid ${themeVars.border}`
                      : undefined,
                }}
              >
                <div
                  className="text-base font-black leading-none sm:text-xl"
                  style={{ color: themeVars.accent }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[9px] font-black uppercase tracking-[0.18em] opacity-70"
                  style={{ color: themeVars.text }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {m.zones.map((z) => {
              const Icon = getIcon(z.iconKey);
              return (
                <div
                  key={z.name}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 sm:gap-2.5 sm:px-3"
                  style={{
                    background: themeVars.cardInner,
                    border: `1px solid ${themeVars.border}`,
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: themeVars.accentSoft,
                      border: `1px solid ${themeVars.accentLine}`,
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      strokeWidth={2.3}
                      style={{ color: themeVars.accent }}
                      aria-hidden
                    />
                  </span>
                  <span
                    className="text-[11px] font-black uppercase tracking-[0.14em] sm:text-xs"
                    style={{ color: themeVars.text }}
                  >
                    {z.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="mt-auto flex items-start gap-2 rounded-xl p-3"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <Zap
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2.3}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
            <p
              className="deck-clamp-3 text-xs font-semibold leading-relaxed sm:text-[13px]"
              style={{ color: themeVars.text }}
            >
              {m.insight}
            </p>
          </div>
        </div>

        <div className="grid min-h-[18rem] grid-cols-2 grid-rows-[1.35fr_1fr] gap-2 sm:gap-3">
          <div
            className="relative col-span-2 row-span-1 overflow-hidden rounded-2xl"
            style={{
              background: themeVars.cardInner,
              border: `1px solid ${themeVars.border}`,
            }}
          >
            {src(0) ? (
              <GalleryImageTrigger
                src={src(0)!}
                alt="Metro reference 1"
                globalIndex={galleryNav?.images[0]}
                onOpenGallery={onOpenGallery}
                imgClassName="h-full w-full object-cover object-top"
              />
            ) : null}
            {slide.stat ? (
              <div
                className="pointer-events-none absolute bottom-3 left-3 flex flex-col gap-0.5 rounded-2xl px-3 py-2"
                style={{
                  background: "rgba(13,20,32,0.78)",
                  border: `1px solid ${themeVars.accentLine}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="deck-stat-compact font-black" style={{ color: themeVars.accent }}>
                  <AnimatedStat value={slide.stat} playKey={slideIndex} duration={1.45} />
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/85 sm:text-[10px]">
                  {slide.statLabel}
                </div>
              </div>
            ) : null}
          </div>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: themeVars.cardInner,
              border: `1px solid ${themeVars.border}`,
            }}
          >
            {src(1) ? (
              <GalleryImageTrigger
                src={src(1)!}
                alt="Metro reference 2"
                globalIndex={galleryNav?.images[1]}
                onOpenGallery={onOpenGallery}
                imgClassName="h-full w-full object-contain"
              />
            ) : null}
          </div>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: themeVars.cardInner,
              border: `1px solid ${themeVars.border}`,
            }}
          >
            {src(2) ? (
              <GalleryImageTrigger
                src={src(2)!}
                alt="Metro reference 3"
                globalIndex={galleryNav?.images[2]}
                onOpenGallery={onOpenGallery}
                imgClassName="h-full w-full object-cover object-center"
              />
            ) : null}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

function OutdoorZonesSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
  galleryNav,
  onOpenGallery,
}: SlideRendererProps) {
  const o = slide.outdoor;
  if (!o) return null;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-3 mt-3 max-w-2xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}
          <div
            className="mt-3 flex items-start gap-2 rounded-xl p-3"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <Palette
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2.3}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
            <p
              className="deck-clamp-2 text-xs font-semibold leading-relaxed sm:text-[13px]"
              style={{ color: themeVars.text }}
            >
              {o.insight}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 rounded-2xl p-4 sm:gap-5 sm:p-5"
          style={{
            background: themeVars.panel,
            border: `1px solid ${themeVars.border}`,
            backdropFilter: "blur(14px)",
          }}
        >
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <LayoutGrid
              className="h-7 w-7 sm:h-8 sm:w-8"
              strokeWidth={2.05}
              style={{ color: themeVars.accent }}
              aria-hidden
            />
          </span>
          <div className="min-w-0">
            <div
              className="deck-stat-hero font-black leading-none"
              style={{ color: themeVars.accent }}
            >
              <AnimatedStat value={o.heroStat.value} playKey={slideIndex} duration={1.45} />
            </div>
            <div
              className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] opacity-75"
              style={{ color: themeVars.text }}
            >
              {o.heroStat.label}
            </div>
          </div>
        </div>
      </div>

      {o.zones.length === 1 ? (
        (() => {
          const zone = o.zones[0]!;
          const Icon = getIcon(zone.iconKey);
          const photo = slide.billboardImages?.[0];
          return (
            <div
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-3xl p-4 sm:flex-row sm:gap-6 sm:p-6"
              style={{
                background: themeVars.panel,
                border: `1px solid ${themeVars.border}`,
                backdropFilter: "blur(14px)",
              }}
            >
              <div
                className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:w-[44%] sm:min-h-[18rem]"
                style={{
                  background: themeVars.cardInner,
                  border: `1px solid ${themeVars.border}`,
                }}
              >
                {photo ? (
                  <GalleryImageTrigger
                    src={photo}
                    alt={`${zone.name} reference`}
                    globalIndex={galleryNav?.images[0]}
                    onOpenGallery={onOpenGallery}
                    imgClassName="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-center text-xs font-black uppercase tracking-[0.22em]"
                    style={{ color: themeVars.accent }}
                  >
                    Zone Photo
                  </div>
                )}
                <span
                  className="pointer-events-none absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                  style={{
                    background: "rgba(13,20,32,0.78)",
                    border: `1px solid ${themeVars.accentLine}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Icon
                    className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                    strokeWidth={2.3}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                </span>
                <span
                  className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em]"
                  style={{
                    background: "rgba(13,20,32,0.78)",
                    border: `1px solid ${themeVars.accentLine}`,
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Featured Zone · 01
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="text-[10px] font-black uppercase tracking-[0.22em]"
                    style={{ color: themeVars.accent }}
                  >
                    Outdoor · Featured Zone
                  </div>
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.22em] opacity-60"
                    style={{ color: themeVars.text }}
                  >
                    Zone 01
                  </span>
                </div>
                <h2
                  className="text-3xl font-black leading-tight sm:text-4xl"
                  style={{ color: themeVars.text }}
                >
                  {zone.name}
                </h2>
                <p
                  className="deck-clamp-4 max-w-2xl text-sm leading-relaxed sm:text-base sm:leading-relaxed"
                  style={{ color: themeVars.sub }}
                >
                  {zone.copy}
                </p>
                <div className="mt-auto grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {zone.formats.map((f) => (
                    <div
                      key={`${zone.name}-${f.type}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 sm:py-3"
                      style={{
                        background: themeVars.cardInner,
                        border: `1px solid ${themeVars.border}`,
                      }}
                    >
                      <span
                        className="text-2xl font-black leading-none sm:text-3xl"
                        style={{ color: themeVars.accent }}
                      >
                        {f.count}
                      </span>
                      <span
                        className="text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs"
                        style={{ color: themeVars.text }}
                      >
                        {f.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {o.zones.map((zone, i) => {
            const Icon = getIcon(zone.iconKey);
            const photo = slide.billboardImages?.[i];
            return (
              <div
                key={zone.name}
                className="flex min-h-0 gap-3 overflow-hidden rounded-2xl p-3 sm:gap-4 sm:p-4"
                style={{
                  background: themeVars.panel,
                  border: `1px solid ${themeVars.border}`,
                  backdropFilter: "blur(14px)",
                }}
              >
                <div
                  className="relative h-full min-h-[5.5rem] w-24 shrink-0 overflow-hidden rounded-xl sm:w-32"
                  style={{
                    background: themeVars.cardInner,
                    border: `1px solid ${themeVars.border}`,
                  }}
                >
                  {photo ? (
                    <GalleryImageTrigger
                      src={photo}
                      alt={`${zone.name} reference`}
                      globalIndex={galleryNav?.images[i]}
                      onOpenGallery={onOpenGallery}
                      imgClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center text-center text-[9px] font-black uppercase tracking-[0.2em]"
                      style={{ color: themeVars.accent }}
                    >
                      Zone Photo
                    </div>
                  )}
                  <span
                    className="pointer-events-none absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(13,20,32,0.78)",
                      border: `1px solid ${themeVars.accentLine}`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      strokeWidth={2.3}
                      style={{ color: themeVars.accent }}
                      aria-hidden
                    />
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="text-sm font-black leading-tight sm:text-[15px]"
                      style={{ color: themeVars.text }}
                    >
                      {zone.name}
                    </div>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.22em] opacity-60"
                      style={{ color: themeVars.text }}
                    >
                      {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <p
                    className="deck-clamp-2 text-[11px] leading-snug sm:text-xs"
                    style={{ color: themeVars.sub }}
                  >
                    {zone.copy}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {zone.formats.map((f) => (
                      <span
                        key={`${zone.name}-${f.type}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-black"
                        style={{
                          background: themeVars.cardInner,
                          border: `1px solid ${themeVars.border}`,
                          color: themeVars.text,
                        }}
                      >
                        <span style={{ color: themeVars.accent }}>{f.count}</span>
                        <span className="opacity-75">{f.type}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SlideShell>
  );
}

function CommercialSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
}: SlideRendererProps) {
  const extras = slide.commercialExtras;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-6">
        <div className="min-w-0">
          <EyebrowChip slide={slide} themeVars={themeVars} />
          <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
          {slide.subtitle ? (
            <p
              className="deck-subtitle deck-clamp-4 mt-3 max-w-xl"
              style={{ color: themeVars.sub }}
            >
              {slide.subtitle}
            </p>
          ) : null}

          {extras ? (
            <>
              {extras.breakdown.length > 0 ? (
                <div
                  className="mt-4 rounded-2xl p-3 sm:p-4"
                  style={{
                    background: themeVars.panel,
                    border: `1px solid ${themeVars.border}`,
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <div
                    className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]"
                    style={{ color: themeVars.accent }}
                  >
                    <Wallet className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                    Contribution Breakdown
                  </div>
                  <ContributionBars rows={extras.breakdown} total={extras.total} themeVars={themeVars} />
                </div>
              ) : (
                <div
                  className="mt-4 rounded-2xl p-4 sm:p-5"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]"
                    style={{ color: themeVars.accent }}
                  >
                    <Wallet className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                    Monthly Investment
                  </div>
                  <div
                    className="mt-1.5 text-3xl font-black leading-none sm:text-4xl"
                    style={{ color: themeVars.accent }}
                  >
                    AED {extras.total.toLocaleString("en-US")}
                  </div>
                  <div
                    className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] opacity-65"
                    style={{ color: themeVars.text }}
                  >
                    Per month · Excluding 5% VAT
                  </div>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2">
                {extras.checklist.map((item) => {
                  const Icon = getIcon(item.iconKey);
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                      style={{
                        background: themeVars.cardInner,
                        border: `1px solid ${themeVars.border}`,
                      }}
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: themeVars.accentSoft,
                          border: `1px solid ${themeVars.accentLine}`,
                        }}
                      >
                        <Icon
                          className="h-3.5 w-3.5"
                          strokeWidth={2.3}
                          style={{ color: themeVars.accent }}
                          aria-hidden
                        />
                      </span>
                      <span
                        className="text-[11px] font-bold leading-snug sm:text-xs"
                        style={{ color: themeVars.text }}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>

        <CommercialTable themeVars={themeVars} slideIndex={slideIndex} />
      </div>
    </SlideShell>
  );
}

function ContributionBars({
  rows,
  total,
  themeVars,
}: {
  rows: CommercialContributionRow[];
  total: number;
  themeVars: any;
}) {
  const max = Math.max(...rows.map((r) => r.value));
  const fmt = (n: number) =>
    `AED ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return (
    <div className="space-y-2.5">
      {rows.map((row) => {
        const pct = Math.max(8, (row.value / max) * 100);
        return (
          <div key={row.name} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`deck-clamp-1 text-[11px] font-black sm:text-xs ${row.excluded ? "opacity-65" : ""}`}
                style={{ color: themeVars.text }}
              >
                {row.name}
              </span>
              <span
                className={`text-[11px] font-black sm:text-xs ${row.excluded ? "opacity-65" : ""}`}
                style={{ color: row.excluded ? themeVars.text : themeVars.accent }}
              >
                {fmt(row.value)}
              </span>
            </div>
            <div
              className="relative h-2 w-full overflow-hidden rounded-full"
              style={{
                background: themeVars.cardInner,
                border: `1px solid ${themeVars.border}`,
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: row.excluded
                    ? `repeating-linear-gradient(45deg, ${themeVars.border}, ${themeVars.border} 4px, transparent 4px, transparent 8px)`
                    : themeVars.accent,
                  opacity: row.excluded ? 0.55 : 1,
                }}
              />
            </div>
            {row.note ? (
              <div
                className="text-[10px] font-medium opacity-65"
                style={{ color: themeVars.text }}
              >
                {row.note}
              </div>
            ) : null}
          </div>
        );
      })}
      <div
        className="mt-3 flex items-baseline justify-between rounded-xl px-3 py-2"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: themeVars.accent }}
        >
          Monthly Total
        </span>
        <span className="text-base font-black sm:text-lg" style={{ color: themeVars.accent }}>
          {fmt(total)}
        </span>
      </div>
    </div>
  );
}

function CreativeColumnsSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
}: SlideRendererProps) {
  const c = slide.creative;
  if (!c) return null;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="min-w-0">
        <EyebrowChip slide={slide} themeVars={themeVars} />
        <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
        {slide.subtitle ? (
          <p
            className="deck-subtitle deck-clamp-2 mt-3 max-w-3xl"
            style={{ color: themeVars.sub }}
          >
            {slide.subtitle}
          </p>
        ) : null}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {c.columns.map((col, i) => {
          const Icon = getIcon(col.iconKey);
          return (
            <div
              key={col.env}
              className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-2xl p-3 sm:p-4"
              style={{
                background: themeVars.panel,
                border: `1px solid ${themeVars.border}`,
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9"
                    style={{
                      background: themeVars.accentSoft,
                      border: `1px solid ${themeVars.accentLine}`,
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={2.3}
                      style={{ color: themeVars.accent }}
                      aria-hidden
                    />
                  </span>
                  <span
                    className="text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs"
                    style={{ color: themeVars.text }}
                  >
                    {col.env}
                  </span>
                </div>
                <span
                  className="text-[10px] font-black uppercase tracking-[0.18em] opacity-60"
                  style={{ color: themeVars.text }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: themeVars.accent }}
              >
                {col.headline}
              </div>
              <p
                className="deck-clamp-3 text-[13px] font-semibold leading-snug sm:text-sm sm:leading-relaxed"
                style={{ color: themeVars.text }}
              >
                {col.message}
              </p>

              <div className="mt-auto grid grid-cols-2 gap-2">
                <div
                  className="flex flex-col rounded-lg px-2.5 py-2"
                  style={{
                    background: themeVars.cardInner,
                    border: `1px solid ${themeVars.border}`,
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.18em] opacity-65"
                    style={{ color: themeVars.text }}
                  >
                    Copy Rule
                  </span>
                  <span
                    className="text-[11px] font-black leading-snug sm:text-xs"
                    style={{ color: themeVars.text }}
                  >
                    {col.copyRule}
                  </span>
                </div>
                <div
                  className="flex flex-col rounded-lg px-2.5 py-2"
                  style={{
                    background: themeVars.cardInner,
                    border: `1px solid ${themeVars.border}`,
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.18em] opacity-65"
                    style={{ color: themeVars.text }}
                  >
                    Legibility
                  </span>
                  <span
                    className="text-[11px] font-black leading-snug sm:text-xs"
                    style={{ color: themeVars.text }}
                  >
                    {col.legibility}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl p-3 sm:gap-3 sm:p-4"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: themeVars.accent }}
        >
          Message Hierarchy
        </span>
        {c.hierarchy.map((h, i) => (
          <span
            key={h}
            className="inline-flex items-center gap-1.5 text-[11px] font-black sm:text-xs"
            style={{ color: themeVars.text }}
          >
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
              style={{
                background: themeVars.panel,
                border: `1px solid ${themeVars.border}`,
                color: themeVars.accent,
              }}
            >
              {i + 1}
            </span>
            {h}
          </span>
        ))}
      </div>
    </SlideShell>
  );
}

function ClosingTimelineSlide({
  slide,
  slideIndex,
  theme,
  themeVars,
}: SlideRendererProps) {
  const c = slide.closing;
  if (!c) return null;
  return (
    <SlideShell themeVars={themeVars} theme={theme} slideIndex={slideIndex}>
      <div className="min-w-0">
        <EyebrowChip slide={slide} themeVars={themeVars} />
        <h1 className="deck-title mt-3 font-black">{slide.title}</h1>
        {slide.subtitle ? (
          <p
            className="deck-subtitle deck-clamp-3 mt-3 max-w-3xl"
            style={{ color: themeVars.sub }}
          >
            {slide.subtitle}
          </p>
        ) : null}
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <div
          className="pointer-events-none absolute left-4 right-4 top-1/2 hidden h-px -translate-y-1/2 md:block"
          style={{
            background: `linear-gradient(90deg, transparent, ${themeVars.accent}, transparent)`,
            opacity: 0.55,
          }}
          aria-hidden
        />
        {c.dates.map((d, i) => {
          const Icon = getIcon(d.iconKey);
          return (
            <div
              key={d.badge}
              className="relative flex items-center gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5"
              style={{
                background: themeVars.panel,
                border: `1px solid ${themeVars.border}`,
                backdropFilter: "blur(14px)",
              }}
            >
              <div
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl sm:h-20 sm:w-20"
                style={{
                  background: themeVars.accentSoft,
                  border: `1px solid ${themeVars.accentLine}`,
                }}
              >
                <span
                  className="text-[10px] font-black uppercase tracking-[0.18em] opacity-75"
                  style={{ color: themeVars.accent }}
                >
                  Q4 ’26
                </span>
                <span
                  className="text-sm font-black leading-tight sm:text-base"
                  style={{ color: themeVars.accent }}
                >
                  {d.badge}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70"
                  style={{ color: themeVars.text }}
                >
                  Stage {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="text-base font-black leading-tight sm:text-lg"
                  style={{ color: themeVars.text }}
                >
                  {d.title}
                </div>
                <div
                  className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold sm:text-[13px]"
                  style={{ color: themeVars.sub }}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={2.3}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                  {d.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {c.summary.map((s, i) => {
          const Icon = getIcon(s.iconKey);
          return (
            <div
              key={s.phase}
              className="flex min-h-0 flex-col gap-2 rounded-2xl p-4 sm:p-5"
              style={{
                background: themeVars.cardInner,
                border: `1px solid ${themeVars.border}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2.2}
                    style={{ color: themeVars.accent }}
                    aria-hidden
                  />
                </span>
                <span
                  className="text-[10px] font-black uppercase tracking-[0.22em] opacity-60"
                  style={{ color: themeVars.text }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                className="text-sm font-black uppercase tracking-[0.18em]"
                style={{ color: themeVars.accent }}
              >
                {s.phase}
              </div>
              <p
                className="deck-clamp-3 text-xs leading-relaxed sm:text-[13px] sm:leading-relaxed"
                style={{ color: themeVars.text }}
              >
                {s.copy}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-start gap-2.5 rounded-2xl p-3 sm:p-4"
        style={{
          background: themeVars.accentSoft,
          border: `1px solid ${themeVars.accentLine}`,
        }}
      >
        <HeartHandshake
          className="mt-0.5 h-4 w-4 shrink-0"
          strokeWidth={2.3}
          style={{ color: themeVars.accent }}
          aria-hidden
        />
        <p
          className="deck-clamp-2 text-xs font-semibold leading-relaxed sm:text-[13px]"
          style={{ color: themeVars.text }}
        >
          {c.farewell}
        </p>
      </div>
    </SlideShell>
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
        className="deck-panel-dense w-full rounded-xl p-3 sm:rounded-2xl sm:p-3.5 md:p-4"
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
          className="deck-eyebrow mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 font-black uppercase sm:mb-2.5 sm:gap-2.5 sm:px-3.5 sm:py-1.5"
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

        <div className="mb-2.5 flex flex-col gap-3 sm:mb-3 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-x-5 lg:gap-x-6">
          <h2
            className="deck-panel-heading min-w-0 font-black leading-[1.08]"
            style={{ color: themeVars.text }}
          >
            {slide.title}
          </h2>

          <div
            className="min-w-0 shrink-0 rounded-lg px-3 py-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 md:min-w-[8.5rem] lg:min-w-[9.5rem]"
            style={{
              background: themeVars.accentSoft,
              border: `1px solid ${themeVars.accentLine}`,
            }}
          >
            <div
              className="deck-stat text-center font-black leading-none"
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
            <div className="deck-stat-label mt-1 text-center font-black uppercase opacity-65 sm:mt-1.5">
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

        {slide.mediaSceneLabels && slide.mediaSceneLabels.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
            {slide.mediaSceneLabels.map((label, i) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] sm:text-[11px]"
                style={{
                  background: themeVars.cardInner,
                  border: `1px solid ${themeVars.border}`,
                  color: themeVars.text,
                }}
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black"
                  style={{
                    background: themeVars.accentSoft,
                    border: `1px solid ${themeVars.accentLine}`,
                    color: themeVars.accent,
                  }}
                >
                  {i + 1}
                </span>
                {label}
              </span>
            ))}
          </div>
        ) : null}

        {slide.mediaStatRibbon && slide.mediaStatRibbon.length > 0 ? (
          <div
            className="mt-3 grid grid-cols-3 overflow-hidden rounded-xl"
            style={{
              background: themeVars.cardInner,
              border: `1px solid ${themeVars.border}`,
            }}
          >
            {slide.mediaStatRibbon.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-center sm:py-3"
                style={{
                  borderRight:
                    i < slide.mediaStatRibbon!.length - 1
                      ? `1px solid ${themeVars.border}`
                      : undefined,
                }}
              >
                <div
                  className="text-sm font-black leading-none sm:text-base"
                  style={{ color: themeVars.accent }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[9px] font-black uppercase tracking-[0.18em] opacity-70"
                  style={{ color: themeVars.text }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
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
        className="group relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 outline-none transition-opacity hover:opacity-[0.98] focus-visible:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
    const flexRowCount = count >= 2 && count <= 3 ? count : 0;
    return (
      <div className="space-y-3 sm:space-y-4">
        {flexRowCount ? (
          <div
            className={`relative w-full overflow-hidden ${fitToViewport ? "h-[clamp(11rem,40dvh,26rem)] min-h-[11rem]" : "h-[260px] sm:h-[320px] md:h-[380px]"} ${cellRound}`}
            style={{
              background: themeVars.cardInner,
              border: Array.from({ length: flexRowCount }).some((_, i) =>
                slotSrc(i),
              )
                ? `1px solid ${themeVars.border}`
                : `1px dashed ${themeVars.accentLine}`,
            }}
          >
            <div className="flex h-full min-h-0 w-full gap-2.5 sm:gap-3">
              {Array.from({ length: flexRowCount }, (_, i) => {
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
                        imgClassName="h-full w-full object-cover object-top"
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
              const fourGridCellClass = fitToViewport
                ? "h-[clamp(6.5rem,19dvh,13rem)] min-h-[6.5rem]"
                : "h-[150px] sm:h-[180px] md:h-[210px]";
              return (
                <div
                  key={i}
                  className={`relative w-full overflow-hidden ${count >= 4 ? fourGridCellClass : gridCellClass} ${cellRound}`}
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
                      imgClassName="h-full w-full object-cover object-top"
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
                imgClassName="h-full w-full object-cover object-[center_15%]"
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
      className="min-w-0 w-full rounded-xl p-3 sm:rounded-2xl sm:p-4 md:p-5"
      style={{
        background: themeVars.panel,
        border: `1px solid ${themeVars.border}`,
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="mb-3 rounded-lg p-3 sm:mb-4 sm:rounded-xl sm:p-4"
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
        <table className="w-full min-w-0 border-collapse text-left text-[10px] sm:text-[11px]">
          <thead>
            <tr style={{ background: themeVars.cardInner }}>
              {["Location", "Format", "Inventory", "Duration"].map((head) => (
                <th
                  key={head}
                  className="whitespace-nowrap px-1.5 py-2 text-[9px] font-black uppercase tracking-[0.1em] sm:px-2 sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em]"
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
                  className="max-w-[160px] px-1.5 py-2.5 font-bold sm:max-w-none sm:px-2 sm:py-3"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.location}
                </td>

                <td
                  className="whitespace-nowrap px-1.5 py-2.5 sm:px-2 sm:py-3"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.format}
                  <div className="mt-0.5 text-[9px] font-medium opacity-60">
                    {row.type}
                  </div>
                </td>

                <td
                  className="whitespace-nowrap px-1.5 py-2.5 font-black sm:px-2 sm:py-3"
                  style={{
                    color: themeVars.accent,
                    borderBottom: `1px solid ${themeVars.border}`,
                  }}
                >
                  {row.screens}
                </td>

                <td
                  className="px-1.5 py-2.5 sm:px-2 sm:py-3"
                  style={{ borderBottom: `1px solid ${themeVars.border}` }}
                >
                  {row.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-3 rounded-lg p-3 text-[11px] font-semibold leading-5 sm:rounded-xl sm:text-xs"
        style={{
          background: themeVars.cardInner,
          border: `1px solid ${themeVars.border}`,
        }}
      >
        Kindly note: all rates are in AED and quoted per month. Prices exclude
        5% VAT. Production & artwork delivery:
        <span style={{ color: themeVars.accent }}>
          {" "}
          included.
        </span>
      </div>
    </div>
  );
}
