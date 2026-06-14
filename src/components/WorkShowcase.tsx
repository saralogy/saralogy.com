const projects = [
  {
    id: 1,
    name: "BSH / Siemens — Global Brand",
    category: "Brand Communications · Strategy",
    year: "2020–2024",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format&q=80",
    alt: "BSH Siemens global brand communications",
    href: "/career/bsh",
  },
  {
    id: 2,
    name: "VeSync — EU Market Launch",
    category: "Integrated Marketing · Growth",
    year: "2025–2026",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80",
    alt: "VeSync EU market launch campaign",
    href: "/career/vesync",
  },
  {
    id: 3,
    name: "Samsung — Digital Campaigns",
    category: "Digital Marketing · Creative",
    year: "2016–2020",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&auto=format&q=80",
    alt: "Samsung digital marketing campaigns",
    href: "/career/samsung",
  },
];

export function WorkShowcase() {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span
              className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ✦ Selected work
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
              Career.
            </h2>
          </div>
          <a
            href="/career"
            className="hidden md:inline-flex items-center gap-2 text-[12px] tracking-widest uppercase border-b border-foreground pb-px hover:gap-4 transition-all duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Full history
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M9 1l4 4m0 0l-4 4m4-4H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.href}
              className="group bg-background flex flex-col"
            >
              <div className="overflow-hidden bg-muted" style={{ height: "clamp(180px, 28vw, 380px)" }}>
                <img
                  src={p.image}
                  alt={p.alt}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-6 flex flex-col gap-1 border-t border-border">
                <div className="flex items-center justify-between">
                  <p
                    className="text-[11px] tracking-widest uppercase text-muted-foreground"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {p.category}
                  </p>
                  <span
                    className="text-[11px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {p.year}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
