export default function SolarWindsPlanPage() {
  const touchpoints = [
    {
      number: "01",
      label: "Metro Gateway",
      title: "Expo City Metro Station Digital Network",
      stat: "134",
      statLabel: "Digital Screens",
      description:
        "Station-wide digital domination across entrance, concourse, platform and footbridge zones. SolarWinds reaches GITEX visitors before they enter the venue environment.",
      details: [
        "LED display formats",
        "8-second creative spots",
        "Once per minute frequency",
        "2-week GITEX campaign period",
        "Coverage across Entrance, Concourse, Platform and Footbridge",
      ],
    },
    {
      number: "02",
      label: "Venue Journey",
      title: "Expo City Outdoor Digital Network",
      stat: "49",
      statLabel: "Outdoor Screens",
      description:
        "A venue-level digital layer across the Expo City promenade, capturing visitors as they move between the metro station, open-air zones and exhibition halls.",
      details: [
        "MUPI totems",
        "Horizontal LED screens",
        "Step screens",
        "High-footfall pedestrian journey coverage",
        "Positioned across Expo City grounds",
      ],
    },
    {
      number: "03",
      label: "Airport Arrival",
      title: "DXB Terminal 3 Arrivals",
      stat: "2.92M",
      statLabel: "Monthly Impressions",
      description:
        "Premium airport exposure at passport control, reaching international business leaders, investors and enterprise decision-makers as they arrive in Dubai.",
      details: [
        "3 screens at passport control",
        "Captive premium arrival audience",
        "Global business traveller exposure",
        "Average frequency: 5.84x",
        "First Dubai brand impression opportunity",
      ],
    },
  ];

  const strategyCards = [
    {
      title: "Audience Fit",
      text: "GITEX attracts CIOs, CTOs, IT procurement managers, enterprise technology buyers and senior decision-makers from global markets.",
    },
    {
      title: "Pre-Booth Influence",
      text: "The campaign builds familiarity before attendees reach the exhibition hall, helping SolarWinds feel present, established and easier to recall.",
    },
    {
      title: "Journey Ownership",
      text: "SolarWinds appears across the full visitor journey: arrival, transit, venue approach and event movement.",
    },
    {
      title: "Contextual Relevance",
      text: "Expo City’s tech-forward environment makes the campaign feel naturally aligned with SolarWinds’ enterprise software positioning.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#101820] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-[#4F6583] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-[#2f4258] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#d6d6d6]">
            SolarWinds × OOH.ae · GITEX 2026 · 2 Weeks
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl">
            Own the Journey.
            <br />
            <span className="text-[#7f9abb]">Before the Hall Door.</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#d6d6d6]">
            A precision out-of-home campaign placing SolarWinds across the
            GITEX visitor journey, from Dubai arrival and metro movement to the
            Expo City venue approach.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <HeroMetric value="134" label="Metro digital screens" />
            <HeroMetric value="49" label="Expo City outdoor screens" />
            <HeroMetric value="2.92M" label="DXB T3 monthly impressions" />
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="border-y border-white/10 bg-white/[0.03] px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel text="Campaign Rationale" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                Why this works for SolarWinds
              </h2>
              <p className="mt-5 text-base leading-8 text-[#d6d6d6]">
                The campaign is designed to reach enterprise technology
                decision-makers before competitor messaging becomes dense inside
                the exhibition hall. It makes SolarWinds visible early,
                repeatedly and in context.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {strategyCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-[#1b2836] p-6 shadow-2xl shadow-black/10"
                >
                  <h3 className="text-lg font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#d6d6d6]">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Touchpoints */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel text="Three-Touchpoint Coverage" />
          <h2 className="max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-5xl">
            The GITEX visitor journey, covered from arrival to venue.
          </h2>

          <div className="mt-12 grid gap-6">
            {touchpoints.map((item) => (
              <article
                key={item.number}
                className="grid gap-8 rounded-3xl border border-white/10 bg-[#172331] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8"
              >
                <div className="rounded-2xl bg-[#4F6583]/15 p-6">
                  <div className="text-sm font-black uppercase tracking-[0.3em] text-[#7f9abb]">
                    Touchpoint {item.number}
                  </div>
                  <div className="mt-5 text-6xl font-black tracking-[-0.06em] text-[#7f9abb]">
                    {item.stat}
                  </div>
                  <div className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d6d6d6]/70">
                    {item.statLabel}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#7f9abb]">
                    {item.label}
                  </div>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[#d6d6d6]">
                    {item.description}
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {item.details.map((detail) => (
                      <div
                        key={detail}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#d6d6d6]"
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Plan */}
      <section className="bg-[#d6d6d6] px-6 py-20 text-[#101820] md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionLabel text="Recommended Plan" dark />
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">
                A high-frequency, premium visibility layer for GITEX 2026.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#334155]">
                The recommended approach is to run all three media layers
                together for maximum journey ownership. Metro builds mass event
                arrival visibility, Expo City outdoor reinforces the venue path,
                and DXB Terminal 3 captures senior international arrivals before
                they reach the city.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-black">Plan Summary</h3>

              <div className="mt-6 space-y-4">
                <PlanRow label="Client" value="SolarWinds" />
                <PlanRow label="Event" value="GITEX 2026" />
                <PlanRow label="Campaign Duration" value="2 Weeks" />
                <PlanRow label="Primary Location" value="Expo City Dubai" />
                <PlanRow
                  label="Core Objective"
                  value="Awareness, recall and pre-booth influence"
                />
                <PlanRow
                  label="Recommended Media"
                  value="Metro Digital + Expo City Outdoor + DXB T3 Arrivals"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[#4F6583]/20 p-8 md:p-12">
          <div className="max-w-3xl">
            <SectionLabel text="Next Step" />
            <h2 className="text-4xl font-black tracking-[-0.04em]">
              Confirm availability, lock the GITEX window, and adapt creative
              for each screen format.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#d6d6d6]">
              Once the media route is approved, the next step is to finalise
              artwork formats, booking timelines, production specifications and
              go-live checks across the selected digital networks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
      <div className="text-4xl font-black tracking-[-0.05em] text-[#7f9abb]">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#d6d6d6]/70">
        {label}
      </div>
    </div>
  );
}

function SectionLabel({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div
      className={`mb-5 text-xs font-black uppercase tracking-[0.28em] ${
        dark ? "text-[#4F6583]" : "text-[#7f9abb]"
      }`}
    >
      {text}
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[180px_1fr]">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-[#4F6583]">
        {label}
      </div>
      <div className="text-sm font-semibold leading-6 text-[#101820]">
        {value}
      </div>
    </div>
  );
}
