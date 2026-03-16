import React, { useState, useRef, useCallback } from "react";
import EditorPkg from "react-simple-code-editor";
// SSR workaround for react-simple-code-editor ESM import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = (EditorPkg as any).default || EditorPkg;
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-r";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-objectivec";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-less";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-clojure";
import "prismjs/components/prism-fsharp";
import "prismjs/components/prism-groovy";
import "prismjs/components/prism-lisp";
import "prismjs/components/prism-pascal";
import "prismjs/components/prism-protobuf";
import "prismjs/components/prism-csv";
import "prismjs/components/prism-regex";
import "prismjs/components/prism-makefile";
import "prismjs/themes/prism-tomorrow.css"; // base theme
import { toPng } from "html-to-image";
import { Settings, Download, Copy, Check, Info, X } from "lucide-react";
import type { codeToImageDict } from "../../i18n/dicts/codeToImage";

interface CodeToImageProps {
  dict: (typeof codeToImageDict)["en"] | (typeof codeToImageDict)["vi"];
}
type Language = "javascript" | "typescript" | "css" | "json" | "html" | "bash" | "python" | "java" | "c" | "cpp" | "csharp" | "ruby" | "rust" | "go" | "sql" | "yaml" | "markdown" | "php" | "swift" | "kotlin" | "dart" | "scala" | "elixir" | "graphql" | "docker" | "lua" | "r" | "solidity" | "objectivec" | "powershell" | "scss" | "sass" | "less" | "haskell" | "perl" | "clojure" | "fsharp" | "groovy" | "lisp" | "pascal" | "protobuf" | "csv" | "regex" | "makefile";
type BgGradient = "ocean" | "candy" | "aurora" | "nebula" | "sunset" | "emerald" | "velvet" | "noir" | "cyberpunk" | "matrix" | "synthwave" | "dracula" | "monokai" | "nord" | "lava" | "forest" | "frost" | "royal" | "crimson" | "midnight" | "peach" | "mango" | "violet" | "abyss" | "cosmic" | "silver" | "gold" | "rose" | "teal" | "amber" | "indigo" | "pink" | "lime" | "coral" | "jade" | "sapphire" | "amethyst" | "ruby" | "citrine" | "obsidian" | "pearl" | "onyx" | "quartz" | "opal" | "topaz" | "malachite" | "turquoise" | "spinel" | "garnet" | "none";

export default function CodeToImageGenerator({ dict }: CodeToImageProps) {
  const [code, setCode] = useState(`function calculateVelocity(distance, time) {
  if (time === 0) throw new Error("Time cannot be zero");
  return distance / time;
}

// Example usage
const v = calculateVelocity(120, 2);
console.log(\`Velocity is \${v} m/s\`);`);

  const [language, setLanguage] = useState<Language>("javascript");
  const [bgGradient, setBgGradient] = useState<BgGradient>("ocean");
  const [padding, setPadding] = useState("64px");
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [widthMode, setWidthMode] = useState<"auto" | "custom">("auto");
  const [customWidth, setCustomWidth] = useState(600);

  const [isExporting, setIsExporting] = useState(false);
  const [copiedIndicator, setCopiedIndicator] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  const paddingOptions = ["32px", "64px", "96px", "128px"];
  
  const LANGUAGES_LIST = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "html", label: "HTML" },
    { value: "bash", label: "Bash / Shell" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "ruby", label: "Ruby" },
    { value: "rust", label: "Rust" },
    { value: "go", label: "Go" },
    { value: "sql", label: "SQL" },
    { value: "yaml", label: "YAML" },
    { value: "markdown", label: "Markdown" },
    { value: "php", label: "PHP" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "elixir", label: "Elixir" },
    { value: "graphql", label: "GraphQL" },
    { value: "docker", label: "Docker" },
    { value: "lua", label: "Lua" },
    { value: "r", label: "R" },
    { value: "solidity", label: "Solidity" },
    { value: "objectivec", label: "Objective-C" },
    { value: "powershell", label: "PowerShell" },
    { value: "scss", label: "SCSS" },
    { value: "sass", label: "SASS" },
    { value: "less", label: "LESS" },
    { value: "haskell", label: "Haskell" },
    { value: "perl", label: "Perl" },
    { value: "clojure", label: "Clojure" },
    { value: "fsharp", label: "F#" },
    { value: "groovy", label: "Groovy" },
    { value: "lisp", label: "Lisp" },
    { value: "pascal", label: "Pascal" },
    { value: "protobuf", label: "Protocol Buffers" },
    { value: "csv", label: "CSV" },
    { value: "regex", label: "Regex" },
    { value: "makefile", label: "Makefile" }
  ];

  const bgGradients: Record<BgGradient, string> = {
    ocean: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    candy: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    aurora: "linear-gradient(135deg, #10b981, #3b82f6)",
    nebula: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    sunset: "linear-gradient(135deg, #f59e0b, #ef4444)",
    emerald: "linear-gradient(135deg, #059669, #10b981)",
    velvet: "linear-gradient(135deg, #4c1d95, #c026d3)",
    noir: "linear-gradient(135deg, #1e293b, #0f172a)",
    cyberpunk: "linear-gradient(135deg, #fce043, #fb7ba2)",
    matrix: "linear-gradient(135deg, #0f9b0f, #000000)",
    synthwave: "linear-gradient(135deg, #ff00cc, #333399)",
    dracula: "linear-gradient(135deg, #282a36, #bd93f9)",
    monokai: "linear-gradient(135deg, #272822, #f92672)",
    nord: "linear-gradient(135deg, #434c5e, #81a1c1)",
    lava: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    forest: "linear-gradient(135deg, #134e5e, #71b280)",
    frost: "linear-gradient(135deg, #000428, #004e92)",
    royal: "linear-gradient(135deg, #141e30, #243b55)",
    crimson: "linear-gradient(135deg, #870000, #190a05)",
    midnight: "linear-gradient(135deg, #232526, #414345)",
    peach: "linear-gradient(135deg, #ed4264, #ffedbc)",
    mango: "linear-gradient(135deg, #ffe259, #ffa751)",
    violet: "linear-gradient(135deg, #4b1248, #f0c27b)",
    abyss: "linear-gradient(135deg, #000000, #434343)",
    cosmic: "linear-gradient(135deg, #ff0099, #493240)",
    silver: "linear-gradient(135deg, #8e9eab, #eef2f3)",
    gold: "linear-gradient(135deg, #f37335, #fdc830)",
    rose: "linear-gradient(135deg, #ff9a9e, #fecfef)",
    teal: "linear-gradient(135deg, #11998e, #38ef7d)",
    amber: "linear-gradient(135deg, #f12711, #f5af19)",
    indigo: "linear-gradient(135deg, #654ea3, #eaafc8)",
    pink: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    lime: "linear-gradient(135deg, #a8ff78, #78ffd6)",
    coral: "linear-gradient(135deg, #ff9966, #ff5e62)",
    jade: "linear-gradient(135deg, #4ca1af, #c4e0e5)",
    sapphire: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
    amethyst: "linear-gradient(135deg, #9d50bb, #6e48aa)",
    ruby: "linear-gradient(135deg, #e52d27, #b31217)",
    citrine: "linear-gradient(135deg, #f9d423, #ff4e50)",
    obsidian: "linear-gradient(135deg, #4ca1af, #2c3e50)",
    pearl: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    onyx: "linear-gradient(135deg, #000000, #53346d)",
    quartz: "linear-gradient(135deg, #ffafbd, #ffc3a0)",
    opal: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
    topaz: "linear-gradient(135deg, #1cd8d2, #93edc7)",
    malachite: "linear-gradient(135deg, #11998e, #38ef7d)",
    turquoise: "linear-gradient(135deg, #134e5e, #71b280)",
    spinel: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    garnet: "linear-gradient(135deg, #870000, #190a05)",
    none: "transparent",
  };

  // Compute lines for line numbers
  const linesCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      // Add a slight delay to ensure UI updates before capturing
      await new Promise((r) => setTimeout(r, 50));

      const dataUrl = await toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2, // High resolution
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `code-snippet-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      await new Promise((r) => setTimeout(r, 50));
      const dataUrl = await toPng(exportRef.current, { quality: 1, pixelRatio: 2 });

      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

      setCopiedIndicator(true);
      setTimeout(() => setCopiedIndicator(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Workspace / Preview Area */}
      <div className="lg:col-span-3 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[500px]">
        {/* The Exportable Container */}
        <div
          ref={exportRef}
          className="relative transition-all duration-300 ease-out max-w-full"
          style={{
            padding: padding,
            background: showBackground ? bgGradients[bgGradient] : "transparent",
          }}
        >
          {/* Code Editor Window */}
          <div
            className={`relative min-w-[320px] sm:min-w-[400px] max-w-full rounded-xl shadow-2xl transition-colors duration-300 ${darkMode ? "bg-[#0E1117]/95 border border-white/10" : "bg-white/95 border border-black/10"} ${widthMode === "auto" ? "w-fit" : ""} overflow-hidden`}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              width: widthMode === "custom" ? `${customWidth}px` : "auto",
            }}
          >
            {/* Custom Resize Handle */}
            {widthMode === "custom" && (
              <div
                className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize z-20 hover:bg-white/10 transition-colors flex items-center justify-center group"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = customWidth;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    setCustomWidth(Math.max(320, startWidth + deltaX * 2));
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              >
                <div className="w-1 h-8 rounded-full bg-white/20 group-hover:bg-white/50 transition-colors" />
              </div>
            )}

            {/* Mac OS Window Controls */}
            {showWindowControls && (
              <div
                className={`flex items-center gap-2 px-4 py-3 ${darkMode ? "bg-white/5" : "bg-black/5"}`}
              >
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
            )}

            {/* React Simple Code Editor */}
            <div className="flex p-4 sm:p-6 overflow-auto max-h-[600px] code-editor-container">
              {showLineNumbers && (
                <div 
                  className={`flex flex-col text-right pr-4 mr-4 select-none border-r ${darkMode ? "text-white/30 border-white/10" : "text-black/30 border-black/10"}`}
                  style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace', fontSize: 15, lineHeight: 1.5, paddingTop: 10, paddingBottom: 10 }}
                >
                  {lineNumbers.map(n => <span key={n}>{n}</span>)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Editor
                  value={code}
                  onValueChange={(code: string) => setCode(code)}
                  highlight={(code: string) =>
                    Prism.highlight(
                      code,
                      Prism.languages[language] || Prism.languages.javascript,
                      language,
                    )
                  }
                  padding={10}
                  style={{
                    fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                    fontSize: 15,
                    color: darkMode ? "#e2e8f0" : "#1e293b",
                    backgroundColor: "transparent",
                    minHeight: "100px",
                    lineHeight: 1.5,
                  }}
                  textareaClassName="focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About & Shortcuts Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsAboutOpen(false)}>
          <div 
            className="w-full max-w-2xl bg-[#0E1117] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up and closing modal
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--c-neon-cyan)] to-[var(--c-neon-magenta)]">
                {dict.aboutTitle}
              </h2>
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 text-white/80">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">{dict.about}</h3>
                <p className="leading-relaxed">
                  {dict.aboutDesc}
                </p>
                <p className="leading-relaxed">
                  {dict.aboutFeatures}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">{dict.shortcuts}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span>Copy Image</span>
                    <kbd className="px-2 py-1 bg-white/10 text-xs rounded-md font-mono text-white/60">Ctrl/Cmd + C</kbd>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span>Download PNG</span>
                    <kbd className="px-2 py-1 bg-white/10 text-xs rounded-md font-mono text-white/60">Ctrl/Cmd + S</kbd>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span>Unfocus text editor</span>
                    <kbd className="px-2 py-1 bg-white/10 text-xs rounded-md font-mono text-white/60">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span>Close Modal</span>
                    <kbd className="px-2 py-1 bg-white/10 text-xs rounded-md font-mono text-white/60">Esc</kbd>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 text-center text-white/40 text-sm">
                 {dict.madeBy}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Settings Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 max-h-[800px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white text-lg font-semibold">
              <Settings className="w-5 h-5 text-[var(--c-neon-cyan)]" />
              {dict.settings}
            </div>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title={dict.about}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Language */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {dict.language}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--c-neon-cyan)]"
              >
                {LANGUAGES_LIST.map((langItem) => (
                  <option key={langItem.value} value={langItem.value}>
                    {langItem.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Background Gradient */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {dict.bgPattern}
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {Object.entries(bgGradients).map(([key, gradient]) => (
                  <button
                    key={key}
                    onClick={() => setBgGradient(key as BgGradient)}
                    className={`w-full aspect-square rounded-md border-2 transition-all ${bgGradient === key ? "border-white scale-110" : "border-transparent hover:border-white/30"}`}
                    style={{ background: gradient === "transparent" ? "#111" : gradient }}
                    title={key}
                  />
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {dict.padding}
              </label>
              <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                {paddingOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPadding(p)}
                    className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${padding === p ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                  >
                    {p.replace("px", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Width Controls */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {dict.widthMode}
              </label>
              <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setWidthMode("auto")}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${widthMode === "auto" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                >
                  {dict.autoWidth}
                </button>
                <button
                  onClick={() => setWidthMode("custom")}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${widthMode === "custom" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                >
                  {dict.customWidth}
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {dict.windowControls}
                </span>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showWindowControls ? "bg-[var(--c-neon-cyan)]" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${showWindowControls ? "translate-x-4" : "translate-x-0"}`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={showWindowControls}
                  onChange={(e) => setShowWindowControls(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {dict.darkMode}
                </span>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${darkMode ? "bg-[var(--c-neon-cyan)]" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "translate-x-4" : "translate-x-0"}`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {dict.showBackground}
                </span>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showBackground ? "bg-[var(--c-neon-cyan)]" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${showBackground ? "translate-x-4" : "translate-x-0"}`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={showBackground}
                  onChange={(e) => setShowBackground(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {dict.showLineNumbers}
                </span>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showLineNumbers ? "bg-[var(--c-neon-cyan)]" : "bg-white/10"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${showLineNumbers ? "translate-x-4" : "translate-x-0"}`}
                  ></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCopy}
            disabled={isExporting}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${copiedIndicator ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"}`}
          >
            {copiedIndicator ? (
              <>
                <Check className="w-4 h-4" /> {dict.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> {dict.copyImage}
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all bg-[var(--c-neon-cyan)] hover:brightness-110 text-black shadow-[0_0_15px_rgba(var(--c-neon-cyan-rgb),0.3)] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "..." : dict.downloadPNG}
          </button>
        </div>
      </div>

      {/* Global styles for proper PrismJS highlighting since we are using tailwind reset */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .code-editor-container pre, .code-editor-container code {
          text-shadow: none !important;
          background: transparent !important;
        }
        .code-editor-container .token.comment,
        .code-editor-container .token.prolog,
        .code-editor-container .token.doctype,
        .code-editor-container .token.cdata {
          color: #6e7781;
        }
        .code-editor-container .token.punctuation {
          color: #abb2bf;
        }
        .code-editor-container .token.namespace {
          opacity: .7;
        }
        .code-editor-container .token.property,
        .code-editor-container .token.tag,
        .code-editor-container .token.boolean,
        .code-editor-container .token.number,
        .code-editor-container .token.constant,
        .code-editor-container .token.symbol,
        .code-editor-container .token.deleted {
          color: #fca311;
        }
        .code-editor-container .token.selector,
        .code-editor-container .token.attr-name,
        .code-editor-container .token.string,
        .code-editor-container .token.char,
        .code-editor-container .token.builtin,
        .code-editor-container .token.inserted {
          color: #2dd4bf;
        }
        .code-editor-container .token.operator,
        .code-editor-container .token.entity,
        .code-editor-container .token.url,
        .code-editor-container .language-css .token.string,
        .code-editor-container .style .token.string {
          color: #e2e8f0;
        }
        .code-editor-container .token.atrule,
        .code-editor-container .token.attr-value,
        .code-editor-container .token.keyword {
          color: #c084fc;
        }
        .code-editor-container .token.function,
        .code-editor-container .token.class-name {
          color: #60a5fa;
        }
        .code-editor-container .token.regex,
        .code-editor-container .token.important,
        .code-editor-container .token.variable {
          color: #f472b6;
        }
      `,
        }}
      />
    </div>
  );
}
