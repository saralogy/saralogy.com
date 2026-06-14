const experiences = [
  {
    company: "VeSync GmbH",
    period: "Nov 2025 – May 2026",
    brands: "Cosori · Levoit",
    contribution: "I was brought in on a targeted assignment to build and standardize VeSync's European IMC launch infrastructure; now that the system is fully operational and scaled across three countries, I am looking to return to a long-term role within an established global matrix.",
  },
  {
    company: "Bosch Siemens Home Appliances",
    period: "2021–2024",
    brands: "Siemens Home",
    contribution: "My focus was on building a holistic digital ecosystem that connected global brand equity with measurable consumer journeys across 20+ countries. By integrating long-tail SEO strategies with performance marketing, we injected over 20,000 high-intent monthly visitors per country into our funnel — then closed the loop with a multi-pillar CRM architecture piloted in Germany and the Netherlands to drive a 6-fold increase in MQLs, before scaling those automated lifecycles across core European markets to lift conversions by 13%. Promoted in 2023; ended via company restructuring.",
  },
  {
    company: "Samsung Electronics",
    period: "2016–2020",
    brands: "Samsung Turkey",
    contribution: "As the centralized digital marketing and agency lead under Samsung's local marketing directorate, I synchronized commercial execution across seven distinct product lines — by transforming global GTM playbooks into a high-efficiency localized conversion engine that systematically lowered customer acquisition costs by 22% and institutionalized a high-retention consumer-education framework scaled as an EMEA-wide benchmark.",
  },
  {
    company: "BSH / Profilo",
    period: "2020–2021",
    brands: "Profilo Turkey",
    contribution: "Engineered pandemic-era digital turnaround: tripled online revenue year-over-year, scaled web traffic, and recovered market share during Covid-19 lockdowns. Promoted to Siemens Munich global HQ after 9 months.",
  },
  {
    company: "ORMA Chipwood",
    period: "2015–2016",
    brands: "B2B Manufacturing",
    contribution: "Opened the architect and designer segment from zero through targeted B2B marketing and led the full UX/UI redesign of the brand website and mobile app.",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-16">
          <div className="md:w-1/3 flex flex-col gap-2">
            <span
              className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ✦ Where I've been
            </span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                marginTop: "0.5rem",
              }}
            >
              11+<br />years.
            </p>
            <a
              href="/career"
              className="mt-4 text-[11px] tracking-widest uppercase border border-foreground px-4 py-2 self-start hover:bg-foreground hover:text-background transition-all duration-200"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Full case studies
            </a>
          </div>

          <div className="md:w-2/3">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              Experiences.
            </h2>
            <p
              className="text-muted-foreground text-xs tracking-widest mt-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ©2026
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {experiences.map((e, i) => (
            <div
              key={i}
              className="bg-background p-8 flex flex-col gap-4 hover:bg-card transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {e.company}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
                    {e.brands}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                  {e.period}
                </span>
              </div>
              <p
                className="text-[13px] leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {e.contribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
