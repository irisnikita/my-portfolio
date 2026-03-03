import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import {
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  FileArchive,
  RefreshCcw,
  Settings,
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
}

export default function ImageCompressorClient({ dict = defaultDict }: ImageCompressorProps) {
  const [tasks, setTasks] = useState<CompressTask[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Settings: Default to aggressive WebP like TinyWebP
  const [maxSizeMB, setMaxSizeMB] = useState("0.8");
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState("2560");
  const [forceWebp, setForceWebp] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCompress = async (task: CompressTask, currentOpts: any) => {
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
  };

  const processFiles = (filesList: FileList | File[]) => {
    const newTasks: CompressTask[] = [];

    Array.from(filesList).forEach((file) => {
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
        ...(forceWebp ? { fileType: "image/webp" } : {}),
      };

      newTasks.forEach((task) => {
        handleCompress(task, options);
      });
    }
  };

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [maxSizeMB, maxWidthOrHeight, forceWebp],
  );

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
    const fileName = task.originalFile.name.replace(/\.[^/.]+$/, "");
    const extension = forceWebp ? "webp" : task.originalFile.name.split(".").pop() || "jpg";
    link.download = `${fileName}-compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllZip = async () => {
    const doneTasks = tasks.filter((t) => t.status === "done" && t.compressedFile);
    if (doneTasks.length === 0) return;

    const zip = new JSZip();
    doneTasks.forEach((task) => {
      const fileName = task.originalFile.name.replace(/\.[^/.]+$/, "");
      const extension = forceWebp ? "webp" : task.originalFile.name.split(".").pop() || "jpg";
      zip.file(`${fileName}-compressed.${extension}`, task.compressedFile!);
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
      ...(forceWebp ? { fileType: "image/webp" } : {}),
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

  const totalOriginalSize = tasks.reduce((acc, t) => acc + t.originalFile.size, 0);
  const totalCompressedSize = tasks.reduce((acc, t) => acc + (t.compressedFile?.size || 0), 0);
  const totalSavingsObj =
    tasks.filter((t) => t.status === "done").length === tasks.length && tasks.length > 0
      ? (((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(1)
      : "0";
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

      {/* Advanced Settings Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
        <div
          className="flex items-center gap-2 mb-4 md:mb-0 cursor-pointer text-white/70 hover:text-white"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
          <span className="font-semibold text-sm">Settings & Options</span>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center w-full overflow-hidden mt-4 md:mt-0"
            >
              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto sm:border-r border-white/10 sm:pr-4">
                <label className="text-xs text-white/50 uppercase tracking-wider font-semibold whitespace-nowrap">
                  Max Size (MB)
                </label>
                <input
                  type="number"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(e.target.value)}
                  className="w-20 bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-[var(--c-neon-cyan)] outline-none"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto sm:border-r border-white/10 sm:pr-4">
                <label className="text-xs text-white/50 uppercase tracking-wider font-semibold whitespace-nowrap">
                  Max W/H (px)
                </label>
                <input
                  type="number"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(e.target.value)}
                  className="w-24 bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-[var(--c-neon-cyan)] outline-none"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={forceWebp}
                      onChange={(e) => setForceWebp(e.target.checked)}
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${forceWebp ? "bg-[var(--c-neon-cyan)]/80" : "bg-white/20"}`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${forceWebp ? "transform translate-x-4" : ""}`}
                    ></div>
                  </div>
                  <span
                    className={`transition-colors text-left flex-1 ${forceWebp ? "text-white font-medium" : "text-white/60"}`}
                  >
                    {dict.forceWebp}
                  </span>
                </label>
              </div>

              {tasks.length > 0 && (
                <button
                  onClick={recompressAll}
                  title={dict.recompressHint}
                  className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  <RefreshCcw size={14} />
                  <span>{dict.recompressHint}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
            <p className="text-xs md:text-sm font-mono text-white/40 mt-4 md:mt-6 tracking-widest uppercase">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/40 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="text-sm font-medium">
                  <span className="text-white/60">Original: </span>
                  <span className="font-mono ml-1">{formatBytes(totalOriginalSize)}</span>
                </div>
                {isAllDone && (
                  <div className="text-sm font-bold text-[var(--c-neon-cyan)] border-l border-white/20 pl-3">
                    <span>Saved: {totalSavingsObj}%</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
                  className="w-full mt-2 sm:mt-0 sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[color:var(--c-neon-cyan)] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors whitespace-nowrap"
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
                        <button
                          onClick={() => downloadFile(task)}
                          title={dict.downloadNow}
                          className="p-2 rounded-full bg-white/10 hover:bg-[var(--c-neon-cyan)] hover:text-black transition-colors"
                        >
                          <Download size={18} />
                        </button>
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
              </div>
            )}
          </motion.div>
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
