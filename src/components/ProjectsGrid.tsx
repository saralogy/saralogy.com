"use client";

import { useState } from "react";

export interface ProjectEntry {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  audience: string;
  projectStatus: string;
  techStack: string[];
  proofPoint?: string;
  liveUrl?: string;
  waitlistUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const STATUSES = [
  { id: "all",     label: "All" },
  { id: "live",    label: "Live" },
  { id: "mvp",     label: "MVP" },
  { id: "beta",    label: "Beta" },
  { id: "concept", label: "Concept" },
] as const;

type StatusId = (typeof STATUSES)[number]["id"];

const STATUS_LABELS: Record<string, string> = {
  concept: "Concept", mvp: "MVP", beta: "Beta", live: "Live", archived: "Archived",
};

export function ProjectsGrid({ entries }: { entries: ProjectEntry[] }) {
  const [active, setActive] = useState<StatusId>("all");

  const filtered = active === "all"
    ? entries
    : entries.filter((e) => e.projectStatus === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-0 border border-border mb-12 w-fit">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className="px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 border-r border-border last:border-r-0"
            style={{
              fontFamily: "var(--font-body)",
              background: active === s.id ? "var(--foreground)" : "var(--background)",
              color: active === s.id ? "var(--background)" : "var(--muted-foreground)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[13px] text-muted-foreground tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
            No projects in this stage yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {filtered.map((entry) => (
            <div key={entry.slug} className="bg-background p-8 flex flex-col gap-4 group hover:bg-card transition-colors duration-200">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {entry.title}
                  </h2>
                  <p className="text-[13px] text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
                    {entry.tagline}
                  </p>
                </div>
                <span
                  className="text-[10px] tracking-[0.2em] uppercase border border-border px-2.5 py-1 shrink-0"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {STATUS_LABELS[entry.projectStatus] ?? entry.projectStatus}
                </span>
              </div>

              {/* Problem */}
              <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                <span className="text-foreground font-medium">Problem: </span>
                {entry.problem}
              </p>

              {/* Proof point */}
              {entry.proofPoint && (
                <div className="border-l-2 border-foreground pl-4">
                  <p className="text-[12px] text-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {entry.proofPoint}
                  </p>
                </div>
              )}

              {/* Tech stack */}
              {entry.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] tracking-wider uppercase bg-muted text-muted-foreground px-2.5 py-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4 mt-auto pt-2">
                <a
                  href={`/projects/${entry.slug}`}
                  className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase border-b border-foreground pb-px hover:gap-4 transition-all duration-200"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Details
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M7 1l4 3.5m0 0L7 8m4-3.5H1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </a>
                {entry.liveUrl && (
                  <a
                    href={entry.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Visit ↗
                  </a>
                )}
                {entry.githubUrl && (
                  <a
                    href={entry.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
