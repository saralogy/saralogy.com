"use client";

import { useState } from "react";

export interface CareerEntry {
  slug: string;
  company: string;
  role: string;
  location: string;
  period: string;
  highlight: string;
  wins: { headline: string; metric?: string }[];
  category: "corporate" | "startup" | "early";
}

const CATEGORIES = [
  { id: "all",       label: "All" },
  { id: "corporate", label: "Corporate" },
  { id: "startup",   label: "Startup" },
  { id: "early",     label: "Early" },
] as const;

type FilterId = (typeof CATEGORIES)[number]["id"];

export function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  const [active, setActive] = useState<FilterId>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = active === "all" ? entries : entries.filter((e) => e.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-0 border border-border mb-12 w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActive(cat.id); setExpanded(null); }}
            className="px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 border-r border-border last:border-r-0"
            style={{
              fontFamily: "var(--font-body)",
              background: active === cat.id ? "var(--foreground)" : "var(--background)",
              color: active === cat.id ? "var(--background)" : "var(--muted-foreground)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline entries */}
      <div className="flex flex-col divide-y divide-border">
        {filtered.map((entry, i) => {
          const isOpen = expanded === entry.slug;
          return (
            <div key={entry.slug} className="group">
              <button
                onClick={() => setExpanded(isOpen ? null : entry.slug)}
                className="w-full flex items-start md:items-center gap-6 py-6 text-left hover:bg-card transition-colors duration-150 px-0"
              >
                <span
                  className="text-[11px] tracking-widest text-muted-foreground w-10 shrink-0 pt-1 md:pt-0"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <div className="md:w-1/3">
                    <p
                      className="font-semibold text-foreground group-hover:translate-x-1 transition-transform duration-200"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {entry.company}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      {entry.role}
                    </p>
                  </div>

                  <p className="md:w-1/2 text-[13px] text-muted-foreground leading-relaxed hidden md:block" style={{ fontFamily: "var(--font-body)" }}>
                    {entry.highlight}
                  </p>

                  <div className="md:ml-auto flex items-center gap-4 shrink-0">
                    <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                      {entry.period}
                    </span>
                    <svg
                      width="18" height="18" viewBox="0 0 18 18" fill="none"
                      className="text-muted-foreground group-hover:text-foreground transition-all duration-200"
                      style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                    >
                      <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded win metrics */}
              {isOpen && (
                <div className="pb-6 pl-16 pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border mb-4">
                    {entry.wins.slice(0, 6).map((win, j) => (
                      <div key={j} className="bg-background p-4 flex flex-col gap-1">
                        {win.metric && (
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {win.metric}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground tracking-wider leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                          {win.headline}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`/career/${entry.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase border-b border-foreground pb-px hover:gap-4 transition-all duration-200"
                    style={{ fontFamily: "var(--font-body)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Full case study
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M7 1l4 3.5m0 0L7 8m4-3.5H1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
