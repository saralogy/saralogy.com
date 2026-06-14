const testimonials = [
  {
    name: "Team Lead, BSH Siemens",
    role: "Senior Brand Manager",
    text: "Berk built our first global Instagram presence from zero and then scaled it to become a reference benchmark inside the company. Rare combination of creative instinct and systematic execution.",
    stars: 5,
  },
  {
    name: "Director, VeSync Europe",
    role: "Marketing Director",
    text: "117% of launch target in 53 days. Berk moved fast without cutting corners — the go-to-market strategy was solid and the cross-functional execution was the best I'd seen on an EU launch.",
    stars: 5,
  },
  {
    name: "Agency Partner, Istanbul",
    role: "Creative Director",
    text: "Three Kristal Elma awards in four years. He understands what makes campaigns win creatively and commercially — they're never the same thing, and he navigates both.",
    stars: 5,
  },
  {
    name: "Product Lead, vision-intelligence",
    role: "Co-builder",
    text: "The AI marketing infrastructure Berk is building is exactly what the DACH mid-market needs. He's not just theorising — he's shipping it.",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#0a0a0a">
          <polygon points="5,1 6.2,3.8 9.5,3.8 6.85,5.7 7.9,8.5 5,6.5 2.1,8.5 3.15,5.7 0.5,3.8 3.8,3.8" />
        </svg>
      ))}
    </div>
  );
}

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
              ✦ Colleagues say
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                5.0
              </span>
              <div>
                <Stars count={5} />
                <p className="text-[11px] text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Across 3 companies
                  <br />
                  11+ years
                </p>
              </div>
            </div>
            <a
              href="https://linkedin.com/in/berksaraloglu"
              target="_blank"
              rel="noopener"
              className="mt-4 text-[11px] tracking-widest uppercase border border-foreground px-4 py-2 self-start hover:bg-foreground hover:text-background transition-all duration-200"
              style={{ fontFamily: "var(--font-body)" }}
            >
              LinkedIn profile
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
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-background p-8 flex flex-col gap-4 hover:bg-card transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted flex items-center justify-center overflow-hidden">
                  <span
                    className="text-[11px] font-semibold text-muted-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
              <Stars count={t.stars} />
              <p
                className="text-[13px] leading-relaxed text-foreground/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
