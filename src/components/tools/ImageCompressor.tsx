import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import {
  Upload,
  Download,
  AlertCircle,
  X,
  FileArchive,
  RefreshCcw,
  Eye,
  Settings,
  ChevronsLeftRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const defaultDict = {
  errorType: "Please upload only image files (JPG, PNG, WebP).",
  errorCompress: "An error occurred while compressing. Please try again.",
  dragDrop: "Drag & drop your images here",
  supported: "Supports JPG, PNG, WebP. Compresses entirely on your device, ensuring total privacy.",
  selectFile: "Select Files",
  unlimited: "No maximum size limit",
  originalTitle: "Original",
  originalPrefix: "Original:",
  recompressHint: "Recompress with new settings",
  compressedTitle: "Compressed",
  compressing: "Compressing...",
  doneTitle: "Compression Complete!",
  savedInfo1: "Saved ",
  savedInfo2: " space",
  compressAnother: "Compress Another",
  downloadNow: "Download",
  forceWebp: "Force convert to WebP (Smallest file size)",
  downloadAll: "Download All (ZIP)",
  addMore: "Add More",
  clearAll: "Clear All",
  statusReady: "Ready",
  statusCompressing: "Compressing...",
  statusDone: "Done",
  pasteInstruction: "Or press (Cmd/Ctrl + V) to paste from clipboard",
};

export interface ImageCompressorProps {
  dict?: typeof defaultDict;
}

interface CompressTask {
  id: string;
  originalFile: File;
  originalUrl: string;
  compressedFile: File | null;
  compressedUrl: string | null;
  status: "ready" | "compressing" | "done" | "error";
  progress: number;
  error?: string;
  saving?: string;
  relativePath?: string;
}

export default function ImageCompressorClient({ dict = defaultDict }: ImageCompressorProps) {
  const [tasks, setTasks] = useState<CompressTask[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings: Load from localStorage or use aggressive defaults
  const [maxSizeMB, setMaxSizeMB] = useState("1");
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState("1920");
  const [outputFormat, setOutputFormat] = useState<"webp" | "original" | "jpeg">("webp");
  const [renamePattern, setRenamePattern] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [compareTask, setCompareTask] = useState<CompressTask | null>(null);

  // Load saved settings
  useEffect(() => {
    const savedSize = localStorage.getItem("ic-maxSizeMB");
    const savedDim = localStorage.getItem("ic-maxWidthOrHeight");
    const savedFormat = localStorage.getItem("ic-outputFormat") as "webp" | "original" | "jpeg";
    const savedPattern = localStorage.getItem("ic-renamePattern");
    if (savedSize) setMaxSizeMB(savedSize);
    if (savedDim) setMaxWidthOrHeight(savedDim);
    if (savedFormat) setOutputFormat(savedFormat);
    if (savedPattern) setRenamePattern(savedPattern);
  }, []);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem("ic-maxSizeMB", maxSizeMB);
    localStorage.setItem("ic-maxWidthOrHeight", maxWidthOrHeight);
    localStorage.setItem("ic-outputFormat", outputFormat);
    localStorage.setItem("ic-renamePattern", renamePattern);
  }, [maxSizeMB, maxWidthOrHeight, outputFormat, renamePattern]);

  const handleCompress = useCallback(
    async (task: CompressTask, currentOpts: Record<string, unknown>) => {
      try {
        const compressed = await imageCompression(task.originalFile, {
          ...currentOpts,
          onProgress: (progress: number) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, progress, status: "compressing" } : t)),
            );
          },
        });

        const saved = (
          ((task.originalFile.size - compressed.size) / task.originalFile.size) *
          100
        ).toFixed(1);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  compressedFile: compressed,
                  compressedUrl: URL.createObjectURL(compressed),
                  status: "done",
                  saving: saved,
                }
              : t,
          ),
        );
      } catch (err) {
        console.error(err);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: "error", error: dict.errorCompress } : t,
          ),
        );
      }
    },
    [dict.errorCompress],
  );

  const processFiles = useCallback(
    (filesList: FileList | File[] | { file: File; path?: string }[]) => {
      const newTasks: CompressTask[] = [];

      let itemsToProcess = [];
      if (
        filesList instanceof FileList ||
        (Array.isArray(filesList) && filesList[0] instanceof File)
      ) {
        itemsToProcess = Array.from(filesList as File[] | FileList).map((f) => ({
          file: f,
          path: "",
        }));
      } else {
        itemsToProcess = filesList as { file: File; path?: string }[];
      }

      itemsToProcess.forEach(({ file, path }) => {
        if (!file.type.startsWith("image/")) {
          alert(dict.errorType + ": " + file.name);
          return;
        }
        const id = Math.random().toString(36).substr(2, 9);
        newTasks.push({
          id,
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          compressedFile: null,
          compressedUrl: null,
          status: "ready",
          progress: 0,
          relativePath: path,
        });
      });

      if (newTasks.length > 0) {
        setTasks((prev) => [...prev, ...newTasks]);

        const options = {
          maxSizeMB: parseFloat(maxSizeMB) || 0.8,
          maxWidthOrHeight: parseInt(maxWidthOrHeight) || 2560,
          useWebWorker: true,
          initialQuality: 0.8, // Aggressive high-quality reduction
          alwaysKeepResolution: true, // Don't shrink dimensions unless absolutely forced by maxSizeMB
          ...(outputFormat === "webp"
            ? { fileType: "image/webp" }
            : outputFormat === "jpeg"
              ? { fileType: "image/jpeg" }
              : {}),
        };

        newTasks.forEach((task) => {
          handleCompress(task, options);
        });
      }
    },
    [outputFormat, maxSizeMB, maxWidthOrHeight, dict.errorType, handleCompress],
  );

  // Global Paste Listener
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept paste if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!e.clipboardData) return;

      const pastedFiles: File[] = [];
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            // Give pasted images a default name since clipboard files often lack them
            const newFile = new File(
              [file],
              `Pasted Image ${new Date().getTime()}.${file.type.split("/")[1]}`,
              { type: file.type },
            );
            pastedFiles.push(newFile);
          }
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [processFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items).filter((item) => item.kind === "file");
      const filesWithPaths: { file: File; path?: string }[] = [];

      const readEntry = async (entry: FileSystemEntry, path = ""): Promise<void> => {
        if (entry.isFile) {
          const fileEntry = entry as FileSystemFileEntry;
          return new Promise<void>((resolve) => {
            fileEntry.file((file) => {
              filesWithPaths.push({ file, path: path });
              resolve();
            });
          });
        } else if (entry.isDirectory) {
          const dirEntry = entry as FileSystemDirectoryEntry;
          const dirReader = dirEntry.createReader();

          return new Promise<void>((resolve) => {
            const readEntries = () => {
              dirReader.readEntries(async (entries) => {
                if (entries.length === 0) {
                  resolve();
                } else {
                  for (const childEntry of entries) {
                    await readEntry(childEntry, path + dirEntry.name + "/");
                  }
                  readEntries(); // Keep reading until empty (Chrome requirement)
                }
              });
            };
            readEntries();
          });
        }
      };

      const promises = items.map((item) => {
        const entry = item.webkitGetAsEntry();
        if (entry) return readEntry(entry);
        return Promise.resolve();
      });

      await Promise.all(promises);
      if (filesWithPaths.length > 0) processFiles(filesWithPaths);
    } else if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files).map((f) => ({ file: f, path: "" })));
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) {
        if (task.originalUrl) URL.revokeObjectURL(task.originalUrl);
        if (task.compressedUrl) URL.revokeObjectURL(task.compressedUrl);
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  const clearAll = () => {
    tasks.forEach((task) => {
      if (task.originalUrl) URL.revokeObjectURL(task.originalUrl);
      if (task.compressedUrl) URL.revokeObjectURL(task.compressedUrl);
    });
    setTasks([]);
  };

  const downloadFile = (task: CompressTask) => {
    if (!task.compressedFile || !task.compressedUrl) return;
    const link = document.createElement("a");
    link.href = task.compressedUrl;

    // Auto Rename Logic
    let baseName = task.originalFile.name.replace(/\.[^/.]+$/, "");
    if (renamePattern) {
      const taskIndex = tasks.findIndex((t) => t.id === task.id) + 1;
      baseName = renamePattern.replace("{index}", taskIndex.toString());
    } else {
      baseName = `${baseName}-compressed`;
    }

    const extension =
      task.compressedFile.type === "image/webp"
        ? "webp"
        : task.compressedFile.type === "image/jpeg"
          ? "jpg"
          : task.compressedFile.type === "image/png"
            ? "png"
            : task.originalFile.name.split(".").pop() || "jpg";
    link.download = `${baseName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllZip = async () => {
    const doneTasks = tasks.filter((t) => t.status === "done" && t.compressedFile);
    if (doneTasks.length === 0) return;

    const zip = new JSZip();
    doneTasks.forEach((task, index) => {
      let baseName = task.originalFile.name.replace(/\.[^/.]+$/, "");
      if (renamePattern) {
        baseName = renamePattern.replace("{index}", (index + 1).toString());
      } else {
        baseName = `${baseName}-compressed`;
      }

      const extension =
        task.compressedFile!.type === "image/webp"
          ? "webp"
          : task.compressedFile!.type === "image/jpeg"
            ? "jpg"
            : task.compressedFile!.type === "image/png"
              ? "png"
              : task.originalFile.name.split(".").pop() || "jpg";
      const zipPath = task.relativePath
        ? `${task.relativePath}${baseName}.${extension}`
        : `${baseName}.${extension}`;
      zip.file(zipPath, task.compressedFile!);
    });

    const content = await zip.generateAsync({ type: "blob" });

    // Native browser download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "images-compressed.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const recompressAll = () => {
    const options = {
      maxSizeMB: parseFloat(maxSizeMB) || 0.8,
      maxWidthOrHeight: parseInt(maxWidthOrHeight) || 2560,
      useWebWorker: true,
      initialQuality: 0.8,
      alwaysKeepResolution: true,
      ...(outputFormat === "webp"
        ? { fileType: "image/webp" }
        : outputFormat === "jpeg"
          ? { fileType: "image/jpeg" }
          : {}),
    };

    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: "ready",
        progress: 0,
        compressedFile: null,
        compressedUrl: null,
        saving: "0",
      })),
    );

    tasks.forEach((task) => {
      handleCompress(task, options);
    });
  };

  const doneTasks = tasks.filter((t) => t.status === "done" && t.compressedFile);
  const totalOriginalSize = doneTasks.reduce((acc, t) => acc + t.originalFile.size, 0);
  const totalCompressedSize = doneTasks.reduce((acc, t) => acc + t.compressedFile!.size, 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const totalSavingsPct =
    totalOriginalSize > 0 ? ((totalSavedBytes / totalOriginalSize) * 100).toFixed(1) : "0";
  const isAllDone =
    tasks.length > 0 && tasks.every((t) => t.status === "done" || t.status === "error");

  return (
    <div
      className="relative z-10 w-full flex flex-col gap-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: "none" }}
      />

      {/* Advanced Settings — Collapsible Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl">
        <button
          type="button"
          className="flex items-center justify-between w-full p-4 cursor-pointer text-white/70 hover:text-white transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            <span className="font-semibold text-sm">Settings &amp; Options</span>
          </div>
          <motion.div animate={{ rotate: showSettings ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mx-4 mb-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                {/* Max Size */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <label className="text-sm text-white/60 font-medium">Max file size (MB)</label>
                  <input
                    type="number"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(e.target.value)}
                    className="w-full sm:w-24 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-center sm:text-left focus:border-[var(--c-neon-cyan)] outline-none transition-colors"
                  />
                </div>

                {/* Max Width/Height */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <label className="text-sm text-white/60 font-medium">
                    Max width / height (px)
                  </label>
                  <input
                    type="number"
                    value={maxWidthOrHeight}
                    onChange={(e) => setMaxWidthOrHeight(e.target.value)}
                    className="w-full sm:w-24 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-center sm:text-left focus:border-[var(--c-neon-cyan)] outline-none transition-colors"
                  />
                </div>

                {/* Auto Rename Pattern */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-white/60 font-medium">Auto Rename Pattern</label>
                    <span className="text-[10px] text-white/40 mt-1 uppercase font-mono tracking-wider">
                      Use {"{index}"} for numbering
                    </span>
                  </div>
                  <input
                    type="text"
                    value={renamePattern}
                    onChange={(e) => setRenamePattern(e.target.value)}
                    placeholder="e.g. product-img-{index}"
                    className="w-full sm:w-48 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-[var(--c-neon-cyan)] outline-none transition-colors font-mono placeholder:text-white/20"
                  />
                </div>

                {/* Advanced Output Format */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm text-white/60 font-medium">Output Format</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setOutputFormat("webp")}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left ${outputFormat === "webp" ? "bg-[var(--c-neon-cyan)]/10 border-[var(--c-neon-cyan)] text-[var(--c-neon-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.15)]" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                    >
                      <div className="mb-1 text-[13px]">Auto / WebP</div>
                      <span className="font-normal opacity-70 text-[11px] leading-tight block">
                        Smallest size, best for web.
                      </span>
                    </button>
                    <button
                      onClick={() => setOutputFormat("original")}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left ${outputFormat === "original" ? "bg-[var(--c-neon-purple)]/10 border-[var(--c-neon-purple)] text-[var(--c-neon-purple)] shadow-[0_0_15px_rgba(255,43,214,0.15)]" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                    >
                      <div className="mb-1 text-[13px]">Keep Original</div>
                      <span className="font-normal opacity-70 text-[11px] leading-tight block">
                        Format preserved (PNG/JPG).
                      </span>
                    </button>
                    <button
                      onClick={() => setOutputFormat("jpeg")}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left ${outputFormat === "jpeg" ? "bg-[#FF9B00]/10 border-[#FF9B00] text-[#FF9B00] shadow-[0_0_15px_rgba(255,155,0,0.15)]" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                    >
                      <div className="mb-1 text-[13px]">Force JPEG</div>
                      <span className="font-normal opacity-70 text-[11px] leading-tight block">
                        Legacy format support.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Recompress Button */}
                {tasks.length > 0 && (
                  <button
                    onClick={recompressAll}
                    title={dict.recompressHint}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/5 mt-1"
                  >
                    <RefreshCcw size={14} />
                    <span>{dict.recompressHint}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Total Savings Dashboard */}
      <AnimatePresence>
        {isAllDone && doneTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-gradient-to-r from-[var(--c-neon-cyan)]/10 to-[var(--c-neon-purple)]/10 border border-[var(--c-neon-cyan)]/30 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--c-neon-cyan)]/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex-1 relative z-10 w-full text-center sm:text-left">
              <h4 className="text-[var(--c-neon-cyan)] text-xl font-bold mb-1">
                Session Complete 🎉
              </h4>
              <p className="text-white/80 text-sm">
                You processed {doneTasks.length} {doneTasks.length === 1 ? "image" : "images"} and
                saved <strong className="text-white">{totalSavingsPct}%</strong> of storage space.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Original
                  </span>
                  <span className="font-mono text-lg">{formatBytes(totalOriginalSize)}</span>
                </div>
                <div className="hidden sm:block w-[1px] h-8 bg-white/20" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Compressed
                  </span>
                  <span className="font-mono text-lg">{formatBytes(totalCompressedSize)}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center min-w-[150px] relative z-10 shadow-xl">
              <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">
                Total Saved
              </span>
              <span className="font-mono text-3xl font-extrabold text-[var(--c-neon-cyan)] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                {formatBytes(totalSavedBytes)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tasks.length === 0 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`cursor-pointer border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 lg:p-24 transition-colors duration-300 ${
              isDragActive
                ? "border-[var(--c-neon-cyan)] bg-[var(--c-neon-cyan)]/10"
                : "border-white/20 hover:border-white/40 hover:bg-white/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={`p-4 md:p-5 rounded-full mb-4 md:mb-6 transition-colors ${isDragActive ? "bg-[var(--c-neon-cyan)]/20 text-[var(--c-neon-cyan)]" : "bg-white/10 text-white/70"}`}
            >
              <Upload className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 md:mb-3 text-center">
              {dict.dragDrop}
            </h3>
            <p className="text-white/60 mb-6 md:mb-8 text-center max-w-md text-sm md:text-lg">
              {dict.supported}
            </p>

            <button className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black font-bold text-base md:text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              {dict.selectFile}
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-white/40 text-xs sm:text-sm mt-6 sm:mt-8 border border-white/10 w-fit mx-auto px-4 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-black/40 text-center">
              <svg
                className="hidden sm:block"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{dict.pasteInstruction}</span>
            </div>
            <p className="text-[10px] md:text-sm font-mono text-white/40 mt-4 md:mt-6 tracking-widest uppercase text-center">
              {dict.unlimited}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Header Actions for Many Files */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-black/40 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md gap-4 xl:gap-0">
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                <div className="text-sm font-medium">
                  <span className="text-white/60">Processing: </span>
                  <span className="font-mono ml-1">
                    {tasks.length} {tasks.length === 1 ? "file" : "files"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap xl:flex-nowrap items-center justify-center gap-2 sm:gap-3 w-full xl:w-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors border border-white/5"
                >
                  {dict.addMore}
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-white/50 text-sm font-medium transition-colors border border-transparent hover:border-red-500/20"
                >
                  {dict.clearAll}
                </button>
                <button
                  onClick={downloadAllZip}
                  disabled={!isAllDone || tasks.filter((t) => t.status === "done").length === 0}
                  className="col-span-2 sm:col-span-1 w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[color:var(--c-neon-cyan)] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors whitespace-nowrap"
                >
                  <FileArchive size={18} />
                  <span>{dict.downloadAll}</span>
                </button>
              </div>
            </div>

            {/* List of files */}
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group overflow-hidden"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 shrink-0 bg-black/40 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-transparent checkered-bg opacity-30"></div>
                        <img
                          src={task.compressedUrl || task.originalUrl}
                          className="w-full h-full object-cover relative z-10"
                          alt="preview"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p
                          className="font-semibold text-sm truncate"
                          title={task.originalFile.name}
                        >
                          {task.originalFile.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 mt-1 font-mono">
                          <span>{formatBytes(task.originalFile.size)}</span>
                          {task.compressedFile && (
                            <>
                              <span className="opacity-50">→</span>
                              <span className="text-[var(--c-neon-cyan)] font-bold">
                                {formatBytes(task.compressedFile.size)}
                              </span>
                              <span className="bg-[var(--c-neon-cyan)]/20 text-[var(--c-neon-cyan)] px-1.5 font-bold rounded">
                                -{task.saving}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-white/5">
                      {task.status === "compressing" && (
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--c-neon-cyan)] transition-all duration-300 ease-out"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono w-10 text-right">
                            {Math.round(task.progress)}%
                          </span>
                        </div>
                      )}

                      {task.status === "error" && (
                        <div className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>Error</span>
                        </div>
                      )}

                      {task.status === "done" && (
                        <>
                          <button
                            onClick={() => setCompareTask(task)}
                            title="Compare Before & After"
                            className="p-2 rounded-full bg-white/10 hover:bg-[var(--c-neon-purple)] hover:text-white transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => downloadFile(task)}
                            title={dict.downloadNow}
                            className="p-2 rounded-full bg-white/10 hover:bg-[var(--c-neon-cyan)] hover:text-black transition-colors"
                          >
                            <Download size={18} />
                          </button>
                        </>
                      )}

                      {/* Remove item */}
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-2 rounded-full text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Optional dropzone below list */}
            {tasks.length > 0 && (
              <div
                className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? "border-[var(--c-neon-cyan)] bg-[var(--c-neon-cyan)]/5"
                    : "border-white/10 text-white/40 hover:text-white/80 hover:border-white/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto mb-2 opacity-50" size={24} />
                <span className="text-sm font-medium">{dict.dragDrop} to add more</span>
                <span className="block text-xs text-white/40 mt-1">{dict.pasteInstruction}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {compareTask && (
          <ComparisonModal
            task={compareTask}
            onClose={() => setCompareTask(null)}
            onApply={(tuned) => {
              setTasks((prev) => prev.map((t) => (t.id === tuned.id ? tuned : t)));
              setCompareTask(null);
            }}
            outputFormat={outputFormat}
            maxWH={parseInt(maxWidthOrHeight) || 2560}
          />
        )}
      </AnimatePresence>

      <style>{`
        .checkered-bg {
          background-image: 
            linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
          background-size: 10px 10px;
          background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
        }
      `}</style>
    </div>
  );
}

// Comparison Modal Component
const ComparisonModal = ({
  task,
  onClose,
  onApply,
  outputFormat,
  maxWH,
}: {
  task: CompressTask;
  onClose: () => void;
  onApply: (t: CompressTask) => void;
  outputFormat: "webp" | "original" | "jpeg";
  maxWH: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [quality, setQuality] = useState(0.8);
  const [tunedTask, setTunedTask] = useState<CompressTask>(task);
  const [isTuning, setIsTuning] = useState(false);
  const mounted = useRef(false);

  // Live Tuning Effect
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    let isCancelled = false;
    const tune = async () => {
      setIsTuning(true);
      try {
        const options = {
          maxSizeMB: 50, // Let quality dictate size down
          maxWidthOrHeight: maxWH,
          useWebWorker: true,
          initialQuality: quality,
          alwaysKeepResolution: true,
          ...(outputFormat === "webp"
            ? { fileType: "image/webp" }
            : outputFormat === "jpeg"
              ? { fileType: "image/jpeg" }
              : {}),
        };
        const compressed = await imageCompression(task.originalFile, options);
        if (isCancelled) return;

        const newUrl = URL.createObjectURL(compressed);
        const saved = (
          ((task.originalFile.size - compressed.size) / task.originalFile.size) *
          100
        ).toFixed(1);

        setTunedTask((prev) => {
          if (prev.compressedUrl && prev.compressedUrl !== task.compressedUrl) {
            URL.revokeObjectURL(prev.compressedUrl); // Cleanup previous tuned preview
          }
          return {
            ...prev,
            compressedFile: compressed,
            compressedUrl: newUrl,
            saving: saved,
          };
        });
      } catch (err) {
        console.error("Tuning error", err);
      } finally {
        if (!isCancelled) setIsTuning(false);
      }
    };

    const timeout = setTimeout(tune, 300); // 300ms debounce
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [quality, task, outputFormat, maxWH]);

  const rafRef = useRef<number | null>(null);

  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !foregroundRef.current || !handleRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const position = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));

      // Update DOM directly
      foregroundRef.current!.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      handleRef.current!.style.left = `calc(${position}% - 1px)`;
    });
  }, []);

  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent default to stop scrolling while dragging on mobile
      if (e.cancelable) e.preventDefault();

      const stopDrag = () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("touchmove", handleDrag);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchend", stopDrag);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };

      window.addEventListener("mousemove", handleDrag, { passive: true });
      window.addEventListener("touchmove", handleDrag, { passive: false });
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchend", stopDrag);
    },
    [handleDrag],
  );

  // Handle escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!task.originalUrl || !task.compressedUrl || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-white/10 bg-white/5 shrink-0">
          <div>
            <h3 className="font-bold text-lg">Before &amp; After Comparison</h3>
            <p className="text-white/50 text-xs truncate max-w-[200px] sm:max-w-md">
              {task.originalFile.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="flex-1 relative w-full h-full select-none checkered-bg overflow-hidden touch-none"
          ref={containerRef}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* Compressed Image (Background / After) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-8">
            <img
              src={tunedTask.compressedUrl!}
              alt="Compressed"
              className={`max-w-full max-h-full object-contain pointer-events-none transition-opacity duration-300 ${isTuning ? "opacity-50" : "opacity-100"}`}
              draggable={false}
            />
            {isTuning && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <RefreshCcw
                  size={48}
                  className="animate-spin text-[var(--c-neon-cyan)] opacity-80 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                />
              </div>
            )}
          </div>

          {/* Original Image (Foreground / Before) */}
          <div
            ref={foregroundRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-8 select-none"
            style={{ clipPath: `inset(0 50% 0 0)`, willChange: "clip-path" }}
          >
            <img
              src={tunedTask.originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain pointer-events-none shadow-[4px_0_15px_rgba(0,0,0,0.5)] select-none"
              draggable={false}
            />
          </div>

          {/* Slider Handle */}
          <div
            ref={handleRef}
            className="absolute top-0 bottom-0 w-[2px] bg-[var(--c-neon-cyan)] cursor-ew-resize hover:w-[4px] hover:-ml-[1px] transition-none z-20"
            style={{ left: `calc(50% - 1px)`, willChange: "left" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--c-neon-cyan)] shadow-[0_0_20px_rgba(0,229,255,0.5)] flex items-center justify-center text-black border-2 border-white hover:scale-110 transition-transform">
              <ChevronsLeftRight size={20} className="text-black" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold pointer-events-none shadow-xl flex flex-col shadow-black/50">
            Original{" "}
            <span className="text-[10px] sm:text-[11px] text-white/60 font-mono font-normal tracking-wide mt-0.5">
              {formatBytes(tunedTask.originalFile.size)}
            </span>
          </div>
          <div
            className={`absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/60 backdrop-blur-md border border-[var(--c-neon-cyan)]/30 text-[var(--c-neon-cyan)] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold pointer-events-none shadow-xl flex flex-col items-end shadow-black/50 transition-opacity ${isTuning ? "opacity-50" : "opacity-100"}`}
          >
            Compressed{" "}
            <span className="text-[10px] sm:text-[11px] opacity-70 font-mono font-normal tracking-wide mt-0.5">
              {formatBytes(tunedTask.compressedFile!.size)}
            </span>
          </div>

          {/* Tip hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white/60 text-[10px] sm:text-xs px-4 py-2 rounded-full pointer-events-none border border-white/10">
            Drag to compare
          </div>
        </div>

        {/* Footer: Live Tuning */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:px-6 border-t border-white/10 bg-[#111] shrink-0 gap-4 sm:gap-5">
          <div className="flex-1 w-full sm:max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-white/70">Live Tuning Quality</label>
              <span className="text-xs font-mono text-[var(--c-neon-cyan)]">
                {Math.round(quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-[var(--c-neon-cyan)] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onApply(tunedTask)}
              disabled={isTuning}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-[var(--c-neon-cyan)] text-black font-bold text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};
