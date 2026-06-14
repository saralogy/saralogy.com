"use client";

import { useState } from "react";

export interface MusicEntry {
  title: string;
  genre: string[];
  releaseStatus: string;
  datePublished?: string;
  duration?: string;
  soundcloud?: string;
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
  writingProcess?: string;
}

function formatDate(s?: string) {
  if (!s) return "";
  const [y, m] = s.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function formatDuration(s?: string) {
  if (!s) return "";
  return s.replace("PT", "").replace("M", ":").replace("S", "");
}

function soundcloudEmbed(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%230a0a0a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

function WaveformBars({ active }: { active: boolean }) {
  const bars = [3, 5, 8, 4, 7, 6, 9, 5, 3, 7, 4, 8];
  return (
    <div className="flex items-end gap-[2px] h-5">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[2px] bg-foreground transition-all duration-300"
          style={{
            height: active ? `${h * 2}px` : "4px",
            opacity: active ? 1 : 0.25,
            transitionDelay: active ? `${i * 30}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  released: "Released", demo: "Demo", writing: "Writing", archived: "Archived",
};

export function MusicList({ entries }: { entries: MusicEntry[] }) {
  const allGenres = Array.from(new Set(entries.flatMap((e) => e.genre)));
  const [activeGenre, setActiveGenre] = useState<string>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeGenre === "all"
    ? entries
    : entries.filter((e) => e.genre.includes(activeGenre));

  return (
    <div>
      {/* Genre filter pills */}
      <div className="flex flex-wrap items-center gap-0 mb-12">
        <button
          onClick={() => setActiveGenre("all")}
          className="px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 border border-r-0 border-border"
          style={{
            fontFamily: "var(--font-body)",
            background: activeGenre === "all" ? "var(--foreground)" : "var(--background)",
            color: activeGenre === "all" ? "var(--background)" : "var(--muted-foreground)",
          }}
        >
          All
        </button>
        {allGenres.map((genre, i) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className="px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 border border-border"
            style={{
              fontFamily: "var(--font-body)",
              marginLeft: i === 0 ? 0 : -1,
              background: activeGenre === genre ? "var(--foreground)" : "var(--background)",
              color: activeGenre === genre ? "var(--background)" : "var(--muted-foreground)",
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[13px] text-muted-foreground py-20 text-center" style={{ fontFamily: "var(--font-body)" }}>
          No tracks in this genre yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {filtered.map((entry) => {
            const isHovered = hovered === entry.title;
            const isExpanded = expanded === entry.title;
            return (
              <div key={entry.title}>
                <button
                  className="w-full flex items-center gap-6 py-6 text-left group hover:bg-card transition-colors duration-150"
                  onMouseEnter={() => setHovered(entry.title)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setExpanded(isExpanded ? null : entry.title)}
                >
                  {/* Waveform */}
                  <div className="w-16 shrink-0 flex items-center justify-center">
                    <WaveformBars active={isHovered || isExpanded} />
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-foreground"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {entry.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {entry.genre.map((g) => (
                        <span key={g} className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status + date */}
                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    <span className="text-[11px] tracking-wider uppercase text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                      {STATUS_LABEL[entry.releaseStatus] ?? entry.releaseStatus}
                    </span>
                    {entry.datePublished && (
                      <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {formatDate(entry.datePublished)}
                      </span>
                    )}
                    {entry.duration && (
                      <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {formatDuration(entry.duration)}
                      </span>
                    )}
                  </div>

                  <svg
                    width="18" height="18" viewBox="0 0 18 18" fill="none"
                    className="text-muted-foreground group-hover:text-foreground transition-all duration-200 shrink-0"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
                  >
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expanded: embed + process */}
                {isExpanded && (
                  <div className="pb-8 pl-22 pr-4" style={{ paddingLeft: "5.5rem" }}>
                    {entry.soundcloud && (
                      <iframe
                        title={`Listen to ${entry.title}`}
                        className="w-full mb-4 border border-border"
                        style={{ height: "120px" }}
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={soundcloudEmbed(entry.soundcloud)}
                      />
                    )}

                    {entry.writingProcess && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
                        {entry.writingProcess.substring(0, 280)}{entry.writingProcess.length > 280 ? "…" : ""}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4">
                      {entry.spotify && (
                        <a href={entry.spotify} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}>
                          Spotify ↗
                        </a>
                      )}
                      {entry.appleMusic && (
                        <a href={entry.appleMusic} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}>
                          Apple Music ↗
                        </a>
                      )}
                      {entry.youtube && (
                        <a href={entry.youtube} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}>
                          YouTube ↗
                        </a>
                      )}
                      {entry.soundcloud && (
                        <a href={entry.soundcloud} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}>
                          SoundCloud ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
