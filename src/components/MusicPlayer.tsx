"use client";

interface Track {
  id: string;
  title: string;
  soundcloudUrl: string;
}

const tracks: Track[] = [
  { id: "1", title: "Urban Wandering", soundcloudUrl: "https://on.soundcloud.com/BrwIJuoaAZuYO8p3vG" },
  { id: "2", title: "Hamburg Nocturne", soundcloudUrl: "https://on.soundcloud.com/SRXfyPrtRIRvfcMcUU" },
  { id: "3", title: "Prototype", soundcloudUrl: "https://on.soundcloud.com/VCZbEJfic0XKbGmLOy" },
];

export function MusicPlayer() {
  return (
    <div className="space-y-8">
      {tracks.map((track) => (
        <a
          key={track.id}
          href={track.soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-6 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 text-left cursor-pointer border border-white/10 hover:border-white/20"
        >
          {/* Vinyl animation */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-colors duration-200"
              style={{
                animation: "spin 3s linear infinite",
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0))",
              }}
            >
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
              </div>
            </div>

            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">▶</div>
            </div>
          </div>

          {/* Track info */}
          <div className="flex-1">
            <p
              className="text-lg font-medium text-white group-hover:text-white/90 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {track.title}
            </p>
            <p className="text-[11px] text-white/40 mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Opens in SoundCloud
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
