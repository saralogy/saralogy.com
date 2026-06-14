"use client";

import { useState } from "react";
import { Palette, TrendingUp, Music, Code } from "lucide-react";

interface IconItem {
  id: string;
  icon: React.ComponentType<{ size: number; className: string }>;
  label: string;
  angle: number;
}

const icons: IconItem[] = [
  { id: "design", icon: Palette, label: "Design", angle: 0 },
  { id: "marketing", icon: TrendingUp, label: "Marketing", angle: 90 },
  { id: "music", icon: Music, label: "Music", angle: 180 },
  { id: "code", icon: Code, label: "Code", angle: 270 },
];

export function AboutHero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-2">
      {/* Image with orbiting icons */}
      <div
        className="relative w-32 h-32 shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Center image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/berk-profile-2026.png"
            alt="Berk Saraloglu"
            className="w-28 h-28 object-cover border border-border"
          />
        </div>

        {/* Orbiting icons */}
        {icons.map((item, index) => {
          const radius = 64;
          const radian = (item.angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isHovered ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center border border-border transition-all duration-300 ${
                    isHovered ? "scale-100 bg-card" : "scale-75"
                  }`}
                  style={{
                    animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <IconComponent
                    size={16}
                    className="text-foreground"
                  />
                </div>
                {isHovered && (
                  <span
                    className="text-[10px] tracking-widest uppercase text-muted-foreground whitespace-nowrap"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bio text */}
      <p
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ fontFamily: "var(--font-body)" }}
      >
        I spent 11 years inside three of the world's largest consumer electronics
        companies building what the marketing function should look like. The same
        structural gaps kept appearing at every scale. So I started building the
        infrastructure to fix them.
      </p>

      {/* Languages */}
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {[
          ["English", "C1 · Fluent"],
          ["Turkish", "Native"],
          ["French", "B2 · Conversational"],
          ["German", "B1 · Intermediate"],
        ].map(([lang, level]) => (
          <div key={lang} className="flex items-baseline gap-2">
            <span
              className="text-[12px] font-medium text-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {lang}
            </span>
            <span
              className="text-[11px] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {level}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
