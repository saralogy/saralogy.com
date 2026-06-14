const stats = [
  { value: "11+", label: "Years in marketing" },
  { value: "3", label: "Global companies" },
  { value: "600%", label: "CRM database growth" },
  { value: "€M+", label: "Campaigns managed" },
];

export function Stats() {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {stats.map((s) => (
            <div
              key={s.value}
              className="bg-background px-8 py-10 flex flex-col gap-2"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </span>
              <span
                className="text-[11px] tracking-widest uppercase text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
