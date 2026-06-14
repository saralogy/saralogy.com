const services = [
  {
    number: "01",
    name: "Brand & Communications",
    desc: "Global brand management at enterprise scale. Visual identity, tone of voice, content systems, and campaign architecture that make brands unmistakable across every channel.",
  },
  {
    number: "02",
    name: "Performance Marketing",
    desc: "Data-driven campaigns that compound over time. Organic media at €M+ scale, multi-channel launch execution, CRM growth, and ROAS discipline — from brief to post-mortem.",
  },
  {
    number: "03",
    name: "Campaign Management",
    desc: "End-to-end ownership of integrated campaigns: briefing agencies, aligning stakeholders across markets, managing budgets, and delivering measurable results without softening the numbers.",
  },
  {
    number: "04",
    name: "AI-Native Marketing Strategy",
    desc: "Turning AI from buzzword to operational advantage — content automation pipelines, intelligent workflows, and AI-augmented campaign infrastructure for European companies ready to systematise.",
  },
  {
    number: "05",
    name: "Product Building",
    desc: "From observed gap to shipped product. AI marketing tools built lean, tested with real users, and priced for SMEs across Europe that need enterprise-grade thinking without enterprise-grade cost.",
  },
];

export function Services() {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <span
              className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ✦ What I do
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginTop: "0.5rem",
              }}
            >
              My approach
              <br />
              is simple.
            </h2>
          </div>
          <p
            className="text-muted-foreground text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Strategy before tactics. Data before opinion. Build the infrastructure first,
            then let it compound — whether that's a content system, a CRM, or an AI tool.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {services.map((s) => (
            <div
              key={s.number}
              className="flex flex-col md:flex-row md:items-center gap-4 py-6 group cursor-default"
            >
              <span
                className="text-[11px] tracking-widest text-muted-foreground w-10 shrink-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.number}
              </span>
              <h3
                className="md:w-1/3 group-hover:translate-x-1 transition-transform duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.name}
              </h3>
              <p
                className="md:w-1/2 text-[13px] text-muted-foreground leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.desc}
              </p>
              <div className="md:ml-auto">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200"
                >
                  <path
                    d="M3 9h12M10 4l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
