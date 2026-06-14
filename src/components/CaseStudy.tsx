const metrics = [
  { label: "Target achieved in 53 days", value: "117%" },
  { label: "CRM database growth", value: "600%" },
  { label: "Annual savings (content centralisation)", value: "€1.5M" },
  { label: "Markets activated (EU)", value: "12+" },
];

const chartData = [8, 12, 11, 18, 22, 19, 31, 28, 38, 35, 46, 53];

export function CaseStudy() {
  const max = Math.max(...chartData);

  return (
    <section className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <span
          className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-8 block"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ✦ Case Study
        </span>

        <div className="bg-foreground text-background grid grid-cols-1 md:grid-cols-2">
          {/* Left — image + brand */}
          <div className="relative overflow-hidden bg-neutral-900" style={{ minHeight: "380px" }}>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&h=600&fit=crop&auto=format&q=80"
              alt="BSH Siemens brand case study"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40 grayscale"
            />
            <div className="relative z-10 p-10 flex flex-col justify-between h-full" style={{ minHeight: "380px" }}>
              <div>
                <p
                  className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Global Brand Communications & AI Marketing
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    color: "white",
                  }}
                >
                  BSH<span className="text-white/30"> · </span>Siemens
                </p>
              </div>
            </div>
          </div>

          {/* Right — metrics */}
          <div className="p-10 flex flex-col gap-8">
            <div>
              <p
                className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Results — BSH Global Brand Programme 2020–2024
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem, 2.8vw, 2.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "white",
                }}
              >
                117% launch target,
                <br />
                600% CRM growth
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "white",
                    }}
                  >
                    {m.value}
                  </span>
                  <span
                    className="text-[10px] tracking-wider uppercase text-white/40"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div>
              <p
                className="text-[10px] tracking-widest uppercase text-white/30 mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                12-month campaign growth index
              </p>
              <div className="flex items-end gap-1 h-12">
                {chartData.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/20 hover:bg-white/40 transition-colors duration-150"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <a
              href="/career/bsh"
              className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase border-b border-white/30 pb-px text-white/60 hover:text-white hover:border-white transition-all duration-200 self-start"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Read case study
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M7 1l4 3.5m0 0L7 8m4-3.5H1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
