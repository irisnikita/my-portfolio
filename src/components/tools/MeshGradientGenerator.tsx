import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Shuffle,
  Copy,
  Check,
  Download,
  Plus,
  X,
  Lock,
  Unlock,
  Code,
  ChevronDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────
interface GradientPoint {
  id: string;
  color: string;
  x: number;
  y: number;
  size: number;
  locked: boolean;
}

interface MeshDict {
  randomize?: string;
  copyCSS?: string;
  copyTailwind?: string;
  downloadPNG?: string;
  copied?: string;
  colors?: string;
  settings?: string;
  exportLabel?: string;
  presets?: string;
  addPoint?: string;
  blur?: string;
  grain?: string;
  aspectRatio?: string;
  bgColor?: string;
  viewCode?: string;
  position?: string;
  size?: string;
  locked?: string;
  unlock?: string;
  free?: string;
}

const defaultDict: Required<MeshDict> = {
  randomize: "Randomize",
  copyCSS: "Copy CSS",
  copyTailwind: "Copy Tailwind",
  downloadPNG: "Download PNG",
  copied: "Copied!",
  colors: "Colors",
  settings: "Settings",
  exportLabel: "Export",
  presets: "Presets",
  addPoint: "Add Point",
  blur: "Blur",
  grain: "Grain Overlay",
  aspectRatio: "Aspect Ratio",
  bgColor: "Background",
  viewCode: "View Code",
  position: "Position",
  size: "Size",
  locked: "Locked",
  unlock: "Unlock",
  free: "Free",
};

// ─── Presets ────────────────────────────────────────
const PRESETS: { name: string; bg: string; points: Omit<GradientPoint, "id" | "locked">[] }[] = [
  {
    name: "Aurora",
    bg: "#0a0a2e",
    points: [
      { color: "#00ff87", x: 20, y: 30, size: 60 },
      { color: "#60efff", x: 80, y: 20, size: 55 },
      { color: "#7b2ff7", x: 50, y: 70, size: 65 },
      { color: "#00d2ff", x: 30, y: 80, size: 50 },
    ],
  },
  {
    name: "Sunset",
    bg: "#1a0a2e",
    points: [
      { color: "#ff6b6b", x: 15, y: 25, size: 60 },
      { color: "#ffa502", x: 75, y: 15, size: 55 },
      { color: "#ff4757", x: 50, y: 65, size: 70 },
      { color: "#ff6348", x: 85, y: 75, size: 50 },
    ],
  },
  {
    name: "Ocean",
    bg: "#020c1b",
    points: [
      { color: "#0077b6", x: 25, y: 20, size: 65 },
      { color: "#00b4d8", x: 70, y: 35, size: 50 },
      { color: "#0096c7", x: 40, y: 75, size: 60 },
      { color: "#48cae4", x: 80, y: 80, size: 55 },
    ],
  },
  {
    name: "Candy",
    bg: "#1a0520",
    points: [
      { color: "#ff6fd8", x: 20, y: 30, size: 60 },
      { color: "#3813c2", x: 80, y: 20, size: 55 },
      { color: "#ff9a76", x: 50, y: 70, size: 65 },
      { color: "#a855f7", x: 30, y: 80, size: 50 },
    ],
  },
  {
    name: "Forest",
    bg: "#0a1a0a",
    points: [
      { color: "#22c55e", x: 30, y: 25, size: 55 },
      { color: "#15803d", x: 70, y: 30, size: 60 },
      { color: "#4ade80", x: 20, y: 70, size: 50 },
      { color: "#166534", x: 75, y: 80, size: 65 },
    ],
  },
  {
    name: "Nebula",
    bg: "#0d0221",
    points: [
      { color: "#b91c1c", x: 15, y: 20, size: 70 },
      { color: "#7c3aed", x: 85, y: 25, size: 55 },
      { color: "#ec4899", x: 45, y: 60, size: 60 },
      { color: "#6d28d9", x: 70, y: 85, size: 50 },
    ],
  },
  {
    name: "Lava",
    bg: "#1a0500",
    points: [
      { color: "#ef4444", x: 25, y: 30, size: 65 },
      { color: "#f97316", x: 75, y: 20, size: 55 },
      { color: "#dc2626", x: 40, y: 75, size: 60 },
      { color: "#eab308", x: 80, y: 70, size: 50 },
    ],
  },
  {
    name: "Arctic",
    bg: "#0c1929",
    points: [
      { color: "#e0f2fe", x: 20, y: 20, size: 60 },
      { color: "#7dd3fc", x: 80, y: 30, size: 55 },
      { color: "#bae6fd", x: 50, y: 70, size: 65 },
      { color: "#38bdf8", x: 30, y: 85, size: 50 },
    ],
  },
  {
    name: "Emerald",
    bg: "#021a0f",
    points: [
      { color: "#10b981", x: 30, y: 25, size: 60 },
      { color: "#06b6d4", x: 70, y: 20, size: 55 },
      { color: "#34d399", x: 20, y: 75, size: 50 },
      { color: "#14b8a6", x: 80, y: 70, size: 65 },
    ],
  },
  {
    name: "Dusk",
    bg: "#1a0a20",
    points: [
      { color: "#818cf8", x: 20, y: 25, size: 60 },
      { color: "#f472b6", x: 75, y: 30, size: 55 },
      { color: "#c084fc", x: 45, y: 70, size: 65 },
      { color: "#fb923c", x: 80, y: 80, size: 50 },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────
const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const uid = () => Math.random().toString(36).substring(2, 9);

const generateRandomPoints = (count = 4): GradientPoint[] =>
  Array.from({ length: count }, () => ({
    id: uid(),
    color: randomHex(),
    x: randomBetween(10, 90),
    y: randomBetween(10, 90),
    size: randomBetween(35, 70),
    locked: false,
  }));

const buildCSS = (points: GradientPoint[], bgColor: string, blur: number, _showNoise: boolean) => {
  const gradients = points
    .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
    .join(",\n    ");
  let css = `background-color: ${bgColor};\nbackground-image:\n    ${gradients};`;
  if (blur > 0) css += `\nfilter: blur(${blur}px);`;
  return css;
};

// ─── Aspect ratio options ───────────────────────────
const RATIOS = [
  { label: "16:9", value: "16/9" },
  { label: "4:3", value: "4/3" },
  { label: "1:1", value: "1/1" },
  { label: "9:16", value: "9/16" },
];

// ─── Component ──────────────────────────────────────
export default function MeshGradientClient({ dict: userDict }: { dict?: MeshDict }) {
  const dict = { ...defaultDict, ...userDict };

  const [points, setPoints] = useState<GradientPoint[]>(generateRandomPoints(4));
  const [bgColor, setBgColor] = useState("#0a0a2e");
  const [blur, setBlur] = useState(0);
  const [showNoise, setShowNoise] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16/9");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const cssCode = buildCSS(points, bgColor, blur, showNoise);

  const handleRandomize = useCallback(() => {
    setPoints((prev) =>
      prev.map((p) =>
        p.locked
          ? p
          : {
              ...p,
              color: randomHex(),
              x: randomBetween(10, 90),
              y: randomBetween(10, 90),
              size: randomBetween(35, 70),
            }
      )
    );
    setBgColor((prev) => {
      // Only randomize bg if nothing is locked
      const hasLocked = points.some((p) => p.locked);
      return hasLocked ? prev : randomHex().replace(/[89a-f]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 6));
    });
  }, [points]);

  const handleCopy = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      }
    },
    []
  );

  const handleDownloadPNG = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = "mesh-gradient.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
    }
  }, []);

  const loadPreset = (preset: (typeof PRESETS)[number]) => {
    setPoints(
      preset.points.map((p) => ({ ...p, id: uid(), locked: false }))
    );
    setBgColor(preset.bg);
  };

  const updatePoint = (id: string, updates: Partial<GradientPoint>) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const addPoint = () => {
    if (points.length >= 6) return;
    setPoints((prev) => [...prev, { id: uid(), color: randomHex(), x: randomBetween(10, 90), y: randomBetween(10, 90), size: randomBetween(35, 70), locked: false }]);
  };

  // Canvas style
  const canvasStyle: React.CSSProperties = {
    aspectRatio,
    backgroundColor: bgColor,
    backgroundImage: points
      .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
      .join(", "),
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
    borderRadius: "16px",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    transition: "background-image 0.4s ease, background-color 0.4s ease, filter 0.3s ease",
  };

  // Tailwind version of the CSS
  const tailwindCode = `bg-[${bgColor}] [background-image:${points.map((p) => `radial-gradient(at_${p.x}%_${p.y}%,${p.color}_0px,transparent_${p.size}%)`).join(",")}]${blur > 0 ? ` [filter:blur(${blur}px)]` : ""}`;

  return (
    <div className="flex flex-col gap-6 relative z-10">
      {/* Presets Gallery */}
      <div>
        <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">{dict.presets}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="group shrink-0 flex flex-col items-center gap-2"
              title={preset.name}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/10 group-hover:border-white/30 transition-all group-hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: preset.bg,
                  backgroundImage: preset.points
                    .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
                    .join(", "),
                }}
              />
              <span className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Canvas + Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Preview */}
        <div className="flex-1 min-w-0">
          <div
            ref={canvasRef}
            style={canvasStyle}
          >
            {/* Noise overlay */}
            {showNoise && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "16px",
                  opacity: 0.15,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "128px 128px",
                  pointerEvents: "none",
                  mixBlendMode: "overlay",
                }}
              />
            )}
          </div>

          {/* Quick actions below canvas */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all border border-white/5 hover:border-white/20 active:scale-95"
            >
              <Shuffle size={16} />
              {dict.randomize}
            </button>

            <button
              onClick={() => handleCopy(cssCode, "css")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--c-neon-cyan)]/10 hover:bg-[var(--c-neon-cyan)]/20 text-[var(--c-neon-cyan)] text-sm font-semibold transition-all border border-[var(--c-neon-cyan)]/20 hover:border-[var(--c-neon-cyan)]/40 active:scale-95"
            >
              {copied === "css" ? <Check size={16} /> : <Copy size={16} />}
              {copied === "css" ? dict.copied : dict.copyCSS}
            </button>

            <button
              onClick={() => handleCopy(tailwindCode, "tw")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all border border-white/5 hover:border-white/20 active:scale-95"
            >
              {copied === "tw" ? <Check size={16} /> : <Copy size={16} />}
              {copied === "tw" ? dict.copied : dict.copyTailwind}
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all border border-white/5 hover:border-white/20 active:scale-95"
            >
              <Download size={16} />
              {dict.downloadPNG}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="mt-4">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors font-medium"
            >
              <Code size={14} />
              {dict.viewCode}
              <motion.div animate={{ rotate: showCode ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <pre className="mt-3 p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm font-mono text-white/80 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                    {cssCode}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-5">
          {/* Colors Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">{dict.colors}</h3>
            <div className="flex flex-col gap-3">
              {points.map((point) => (
                <div
                  key={point.id}
                  className="bg-black/30 rounded-xl p-3 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={point.color}
                        onChange={(e) => updatePoint(point.id, { color: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border-2 border-white/20 bg-transparent"
                        style={{ padding: 0 }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white/60 flex-1 uppercase">{point.color}</span>
                    <button
                      onClick={() => updatePoint(point.id, { locked: !point.locked })}
                      className={`p-1.5 rounded-lg transition-colors ${point.locked ? "bg-[var(--c-neon-cyan)]/20 text-[var(--c-neon-cyan)]" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                      title={point.locked ? dict.locked : dict.unlock}
                    >
                      {point.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    {points.length > 2 && (
                      <button
                        onClick={() => removePoint(point.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {/* Position & Size sliders */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium block mb-1">X</label>
                      <input type="range" min="0" max="100" value={point.x} onChange={(e) => updatePoint(point.id, { x: parseInt(e.target.value) })} className="w-full accent-[var(--c-neon-cyan)] cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium block mb-1">Y</label>
                      <input type="range" min="0" max="100" value={point.y} onChange={(e) => updatePoint(point.id, { y: parseInt(e.target.value) })} className="w-full accent-[var(--c-neon-cyan)] cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium block mb-1">{dict.size}</label>
                      <input type="range" min="20" max="80" value={point.size} onChange={(e) => updatePoint(point.id, { size: parseInt(e.target.value) })} className="w-full accent-[var(--c-neon-cyan)] cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}

              {points.length < 6 && (
                <button
                  onClick={addPoint}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-white/30 text-white/40 hover:text-white/70 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  {dict.addPoint}
                </button>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">{dict.settings}</h3>
            <div className="flex flex-col gap-4">
              {/* Background Color */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60 font-medium">{dict.bgColor}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-white/20 bg-transparent"
                    style={{ padding: 0 }}
                  />
                  <span className="font-mono text-xs text-white/40 uppercase w-16">{bgColor}</span>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="text-sm text-white/60 font-medium block mb-2">{dict.aspectRatio}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {RATIOS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setAspectRatio(r.value)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                        aspectRatio === r.value
                          ? "bg-[var(--c-neon-cyan)]/10 border-[var(--c-neon-cyan)]/50 text-[var(--c-neon-cyan)]"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-white/60 font-medium">{dict.blur}</label>
                  <span className="text-xs font-mono text-white/40">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value))}
                  className="w-full accent-[var(--c-neon-cyan)] cursor-pointer"
                />
              </div>

              {/* Grain */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60 font-medium">{dict.grain}</label>
                <button
                  onClick={() => setShowNoise(!showNoise)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${showNoise ? "bg-[var(--c-neon-cyan)]" : "bg-white/20"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${showNoise ? "translate-x-[22px]" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="color"] { -webkit-appearance: none; appearance: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 6px; }
      `}</style>
    </div>
  );
}
