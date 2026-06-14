interface Track {
  id: string;
  title: string;
  trackId: string;
}

const tracks: Track[] = [
  { id: "1", title: "Camda bir leke", trackId: "2264717972" },
  { id: "2", title: "Son Sözlerin Aklımda", trackId: "2291239535" },
  { id: "3", title: "Mavi Yollar", trackId: "2005367875" },
];

export function MusicPlayer() {
  return (
    <div className="space-y-12">
      {tracks.map((track) => (
        <div key={track.id} className="space-y-4">
          {/* Track header with vinyl */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full border border-white/30"
                style={{
                  animation: "spin 4s linear infinite",
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
            <p
              className="text-base font-medium text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {track.title}
            </p>
          </div>

          {/* SoundCloud player - clean embed */}
          <div className="pl-16">
            <iframe
              width="100%"
              height="100"
              scrolling="no"
              frameBorder="no"
              allow="autoplay; encrypted-media"
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.trackId}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
              style={{
                borderRadius: "0",
              }}
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
}
