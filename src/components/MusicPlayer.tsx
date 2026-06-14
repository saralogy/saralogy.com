interface Track {
  id: string;
  title: string;
  url: string;
}

const tracks: Track[] = [
  { id: "1", title: "Camda bir leke", url: "https://soundcloud.com/berksaraloglu/camda-birleke" },
  { id: "2", title: "Son Sözlerin Aklımda", url: "https://soundcloud.com/berksaraloglu/son-so-zlerin-akl-mda" },
  { id: "3", title: "Mavi Yollar", url: "https://soundcloud.com/berk-saraloglu/mavi-yollar-2" },
];

export function MusicPlayer() {
  return (
    <div className="space-y-10">
      {tracks.map((track) => (
        <a
          key={track.id}
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-6 p-6 bg-white/5 hover:bg-white/8 transition-colors duration-200 border border-white/10 hover:border-white/20 cursor-pointer"
        >
          {/* Vinyl animation */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-full border border-white/30 group-hover:border-white/50 transition-colors"
              style={{
                animation: "spin 4s linear infinite",
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0))",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Track info */}
          <div className="flex-1 text-left">
            <p
              className="text-base font-medium text-white group-hover:text-white/90 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {track.title}
            </p>
          </div>

          {/* Play indicator */}
          <div className="text-white/60 group-hover:text-white transition-colors">▶</div>
        </a>
      ))}
    </div>
  );
}
