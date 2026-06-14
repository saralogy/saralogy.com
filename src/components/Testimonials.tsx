const experiences = [
  {
    company: "VeSync GmbH",
    period: "2025–2026",
    brands: "Cosori · Levoit",
    contribution: "Built 3 full-funnel launch playbooks from scratch and hit 117% of flagship product sell-out target in 53 days across 8 channels simultaneously.",
  },
  {
    company: "BSH / Siemens Global",
    period: "2020–2024",
    brands: "Siemens Home",
    contribution: "Built Siemens' first global Instagram presence and a centralised content system adopted across 10+ markets, saving significant annual production costs.",
  },
  {
    company: "Samsung Electronics",
    period: "2016–2020",
    brands: "Samsung Turkey",
    contribution: "Ran 100+ campaigns across 4 product divisions, won 3 Kristal Elma Awards, and developed a YouTube format adopted as the Samsung EMEA regional benchmark.",
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
