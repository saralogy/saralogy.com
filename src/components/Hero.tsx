"use client";

import { useState } from "react";

export function Hero() {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero image */}
      <div
        className="relative w-full bg-neutral-200"
        style={{ height: "clamp(340px, 65vh, 720px)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop&auto=format&q=80"
          alt="Berk Saraloglu — AI-native marketing leader in Hamburg"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Play button overlay */}
        <button
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Watch intro"
        >
          <div
            className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center transition-all duration-300"
            style={{
              background: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ color: hovered ? "#0a0a0a" : "white", marginLeft: 3 }}
            >
              <polygon points="5,3 15,9 5,15" fill="currentColor" />
            </svg>
          </div>
          <span
            className="text-white text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Watch intro
          </span>
          <span
            className="text-white/50 text-[10px] tracking-widest"
            style={{ fontFamily: "var(--font-body)" }}
          >
            2:00 min
          </span>
        </button>
      </div>

      {/* Below-hero headline */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(3rem, 8vw, 7.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            Marketing
            <br />
            <span className="italic font-light">meets</span>
            <br />
            AI.
          </h1>
        </div>
        <div className="max-w-xs">
          <p
            className="text-muted-foreground text-sm leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I'm Berk, 11+ years of digital & integrated marketing at Bosch-Siemens Home Appliances,
            Samsung Electronics, and recently at VeSync (Cosori & Levoit). Now building AI-native
            marketing workflows for SMEs in addition to strategic & operational value for top-tier brands.
          </p>
          <a
            href="/work"
            className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase border-b border-foreground pb-px hover:gap-4 transition-all duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            See my work
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M9 1l4 4m0 0l-4 4m4-4H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
