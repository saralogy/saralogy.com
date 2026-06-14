"use client";

import { useState } from "react";

interface Track {
  id: string;
  title: string;
  soundcloudUrl: string;
}

const tracks: Track[] = [
  { id: "1", title: "Urban Wandering", soundcloudUrl: "https://soundcloud.com/berk-saraloglu/urban-wandering" },
  { id: "2", title: "Hamburg Nocturne", soundcloudUrl: "https://soundcloud.com/berk-saraloglu/hamburg-nocturne" },
  { id: "3", title: "Prototype", soundcloudUrl: "https://soundcloud.com/berk-saraloglu/prototype" },
];

export function MusicPlayer() {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const activeTrack = tracks.find(t => t.id === activeTrackId);

  return (
    <>
      {/* Player grid */}
      <div className="space-y-8">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => setActiveTrackId(track.id)}
            className="w-full group flex items-center gap-6 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 text-left cursor-pointer border border-white/10 hover:border-white/20"
          >
            {/* Vinyl animation */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-colors duration-200"
                style={{
                  animation: activeTrackId === track.id
                    ? "spin 3s linear infinite"
                    : "none",
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                }}
              >
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                </div>
              </div>

              {/* Play indicator when active */}
              {activeTrackId === track.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/80">▶</div>
                </div>
              )}
            </div>

            {/* Track info */}
            <div className="flex-1">
              <p
                className="text-lg font-medium text-white group-hover:text-white/90 transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {track.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* SoundCloud player modal */}
      {activeTrackId && activeTrack && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setActiveTrackId(null)}
        >
          <div
            className="bg-black border border-white/20 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-white font-medium" style={{ fontFamily: "var(--font-display)" }}>
                {activeTrack.title}
              </p>
              <button
                onClick={() => setActiveTrackId(null)}
                className="text-white/50 hover:text-white/100 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* SoundCloud embed */}
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(activeTrack.soundcloudUrl)}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
              className="rounded"
            ></iframe>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
