const items = [
  "AI Marketing", "Brand Strategy", "DACH Market", "Performance Marketing",
  "Product Building", "CRM Growth", "Content Systems", "Samsung", "BSH · Siemens",
  "Hamburg", "AI Marketing", "Brand Strategy", "DACH Market",
];

export function Marquee() {
  return (
    <div className="overflow-hidden bg-foreground text-background py-3 border-b border-border">
      <div
        className="flex whitespace-nowrap gap-10 animate-marquee-scroll"
        style={{ width: "max-content" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item}
            <span className="ml-10 opacity-30">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
