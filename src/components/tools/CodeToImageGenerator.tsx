import React, { useState, useRef, useCallback } from "react";
import EditorPkg from "react-simple-code-editor";
// SSR workaround for react-simple-code-editor ESM import
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
import "prismjs/themes/prism-tomorrow.css"; // base theme
import { toPng } from "html-to-image";
import { Settings, Download, Copy, Check, Info, X } from "lucide-react";
import type { codeToImageDict } from "../../i18n/dicts/codeToImage";

interface CodeToImageProps {
  dict: (typeof codeToImageDict)["en"] | (typeof codeToImageDict)["vi"];
}
type Language = "javascript" | "typescript" | "css" | "json" | "html" | "bash" | "python" | "java" | "c" | "cpp" | "csharp" | "ruby" | "rust" | "go" | "sql" | "yaml" | "markdown";
type BgGradient = "ocean" | "candy" | "aurora" | "nebula" | "sunset" | "emerald" | "velvet" | "noir" | "none";

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

  const [isExporting, setIsExporting] = useState(false);
  const [copiedIndicator, setCopiedIndicator] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  const paddingOptions = ["32px", "64px", "96px", "128px"];

  const bgGradients: Record<BgGradient, string> = {
    ocean: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    candy: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    aurora: "linear-gradient(135deg, #10b981, #3b82f6)",
    nebula: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    sunset: "linear-gradient(135deg, #f59e0b, #ef4444)",
    emerald: "linear-gradient(135deg, #059669, #10b981)",
    velvet: "linear-gradient(135deg, #4c1d95, #c026d3)",
    noir: "linear-gradient(135deg, #1e293b, #0f172a)",
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
            className={`relative w-full max-w-[800px] rounded-xl overflow-hidden shadow-2xl transition-colors duration-300 ${darkMode ? "bg-[#0E1117]/95 border border-white/10" : "bg-white/95 border border-black/10"}`}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
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
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="html">HTML</option>
                <option value="bash">Bash / Shell</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="ruby">Ruby</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="sql">SQL</option>
                <option value="yaml">YAML</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>

            {/* Background Gradient */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {dict.bgPattern}
              </label>
              <div className="grid grid-cols-5 gap-2">
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
