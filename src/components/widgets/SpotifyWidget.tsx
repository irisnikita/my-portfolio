import { useEffect, useState } from "react";
import { useLanyard } from "use-lanyard";
import { motion } from "framer-motion";

// Replace with your Discord User ID
const DISCORD_ID = "432221040504995852";

export default function SpotifyWidget() {
  const { data } = useLanyard(DISCORD_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Lanyard data structure check
  const spotify = data?.spotify;
  const isPlaying = !!spotify;

  // We DO NOT want to return null if !data because we want to show "Spotify Offline"
  // But we can check if we have no data yet (meaning it's loading)
  if (!data) {
    return (
      <div className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 pr-4 animate-pulse">
        <div className="h-12 w-12 rounded-md bg-white/10"></div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 bg-white/10 rounded"></div>
          <div className="h-4 w-32 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 pr-4 transition-all hover:bg-white/10 hover:border-white/20"
      style={{
        boxShadow: isPlaying ? "var(--shadow-glow-cyan)" : "none",
      }}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-black/50">
        {isPlaying && spotify?.album_art_url ? (
          <img
            src={spotify.album_art_url}
            alt={spotify.album || "Album cover"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-5 w-5 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.81-.873 7.07-.496 9.712 1.115.293.18.386.563.208.853zm1.182-3.238c-.225.366-.704.483-1.07.258-2.695-1.652-6.78-2.13-9.596-1.168-.41.14-.853-.08-1-.49-.14-.41.078-.853.488-1 3.235-1.106 7.78-.58 10.92 1.348.366.226.484.706.258 1.052zm.126-3.414C14.73 7.9 8.543 7.705 4.97 8.79c-.496.15-1.018-.13-1.168-.624-.15-.495.128-1.018.623-1.168 4.108-1.246 10.957-1.026 14.633 1.157.44.262.585.845.32 1.285-.263.44-.847.585-1.287.32z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center overflow-hidden">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3 w-3">
              <motion.span
                className="w-[2px] bg-cyan-400 rounded-sm"
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="w-[2px] bg-cyan-400 rounded-sm"
                animate={{ height: ["8px", "4px", "10px"] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="w-[2px] bg-cyan-400 rounded-sm"
                animate={{ height: ["4px", "10px", "4px"] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          ) : (
            <svg className="h-3 w-3 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.81-.873 7.07-.496 9.712 1.115.293.18.386.563.208.853zm1.182-3.238c-.225.366-.704.483-1.07.258-2.695-1.652-6.78-2.13-9.596-1.168-.41.14-.853-.08-1-.49-.14-.41.078-.853.488-1 3.235-1.106 7.78-.58 10.92 1.348.366.226.484.706.258 1.052zm.126-3.414C14.73 7.9 8.543 7.705 4.97 8.79c-.496.15-1.018-.13-1.168-.624-.15-.495.128-1.018.623-1.168 4.108-1.246 10.957-1.026 14.633 1.157.44.262.585.845.32 1.285-.263.44-.847.585-1.287.32z" />
            </svg>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            {isPlaying ? "Now Playing" : "Spotify Offline"}
          </span>
        </div>

        <p className="truncate text-sm font-semibold text-white/90">
          {isPlaying ? spotify.song : "Not Playing Anything"}
        </p>
        <p className="truncate text-xs text-white/60">{isPlaying ? spotify.artist : "Silence"}</p>
      </div>

      <div className="absolute top-2 right-2 flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isPlaying ? "animate-ping bg-cyan-400" : "bg-transparent"
          }`}
        ></span>
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isPlaying ? "bg-cyan-500" : "bg-white/10"
          }`}
        ></span>
      </div>
    </div>
  );
}
