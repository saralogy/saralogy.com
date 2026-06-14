"use client";

import { useRef, useState } from "react";

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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const handlePlay = (trackId: string) => {
    setPlayingId(playingId === trackId ? null : trackId);

    // Access the SoundCloud widget API
    const iframe = iframeRefs.current[trackId];
    if (iframe && window.SC) {
      setTimeout(() => {
        window.SC.Widget(iframe).toggle();
      }, 100);
    }
  };

  return (
    <>
      {/* Load SoundCloud Widget API */}
      <script src="https://w.soundcloud.com/player/api.js"></script>

      <div className="space-y-10">
        {tracks.map((track) => (
          <div key={track.id} className="relative">
            {/* Custom overlay UI */}
            <button
              onClick={() => handlePlay(track.id)}
              className="w-full group flex items-center gap-6 p-6 bg-white/5 hover:bg-white/8 transition-colors duration-200 border border-white/10 hover:border-white/20 cursor-pointer relative z-10"
            >
              {/* Vinyl animation */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full border border-white/30 group-hover:border-white/50 transition-colors"
                  style={{
                    animation: playingId === track.id ? "spin 2s linear infinite" : "spin 4s linear infinite",
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
                  className="text-base font-medium text-white group-hover:text-white/90"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {track.title}
                </p>
              </div>

              {/* Play indicator */}
              <div className="text-white/60 group-hover:text-white transition-colors">
                {playingId === track.id ? "◼" : "▶"}
              </div>
            </button>

            {/* SoundCloud iframe - positioned off-screen but active */}
            <div className="fixed -bottom-96 -right-96 w-96 h-96 pointer-events-none">
              <iframe
                ref={(el) => {
                  if (el) iframeRefs.current[track.id] = el;
                }}
                width="100%"
                height="100%"
                scrolling="no"
                frameBorder="no"
                allow="autoplay; encrypted-media"
                src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.trackId}&color=%23ffffff&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
              ></iframe>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
