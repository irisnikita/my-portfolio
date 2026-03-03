import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  RefreshCcw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const defaultDict = {
  errorType: "Please upload only image files (JPG, PNG, WebP).",
  errorCompress: "An error occurred while compressing. Please try again with another image.",
  dragDrop: "Drag & drop your image here",
  supported: "Supports JPG, PNG, WebP. Compresses entirely on your device, ensuring total privacy.",
  selectFile: "Select File",
  unlimited: "No maximum size limit",
  originalTitle: "Original",
  originalPrefix: "Original:",
  recompressHint: "Recompress with new settings",
  compressedTitle: "Compressed",
  compressing: "Running local compression algorithm...",
  doneTitle: "Compression Complete!",
  savedInfo1: "Saved ",
  savedInfo2: " space",
  compressAnother: "Compress Another",
  downloadNow: "Download Now",
};

export interface ImageCompressorProps {
  dict?: typeof defaultDict;
}

export default function ImageCompressorClient({ dict = defaultDict }: ImageCompressorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState(false);

  // Settings
  const [maxSizeMB, setMaxSizeMB] = useState("1");
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState("1920");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCompress = async (file: File, options?: any) => {
    setIsCompressing(true);
    setCompressionProgress(0);
    setError("");

    const defaultOptions = {
      maxSizeMB: parseFloat(maxSizeMB) || 1,
      maxWidthOrHeight: parseInt(maxWidthOrHeight) || 1920,
      useWebWorker: true,
      onProgress: (progress: number) => {
        setCompressionProgress(progress);
      },
    };

    try {
      const compressed = await imageCompression(file, options || defaultOptions);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
    } catch (err) {
      console.error(err);
      setError(dict.errorCompress);
    } finally {
      setIsCompressing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(dict.errorType);
      return;
    }

    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setCompressedFile(null);
    setCompressedUrl("");
    handleCompress(file);
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

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError(dict.errorType);
        return;
      }

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl("");
      handleCompress(file);
    },
    [maxSizeMB, maxWidthOrHeight],
  );

  const resetAll = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setCompressedFile(null);
    setOriginalUrl("");
    setCompressedUrl("");
    setCompressionProgress(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadFile = () => {
    if (!compressedFile || !compressedUrl) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    // Tự động thêm hậu tố -compressed
    const fileName = originalFile?.name.replace(/\.[^/.]+$/, "") || "image";
    const extension = originalFile?.name.split(".").pop() || "jpg";
    link.download = `${fileName}-compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reCompress = () => {
    if (!originalFile) return;
    setCompressedFile(null);
    setCompressedUrl("");
    handleCompress(originalFile);
  };

  // Tính toán % dung lượng tiết kiệm
  const savedPercentage =
    originalFile && compressedFile
      ? (((originalFile.size - compressedFile.size) / originalFile.size) * 100).toFixed(1)
      : "0";

  return (
    <div
      className="relative z-10 w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: "none" }}
      />

      <AnimatePresence mode="wait">
        {/* TRẠNG THÁI 1: CHƯA UPLOAD ẢNH */}
        {!originalFile && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 lg:p-24 transition-colors duration-300 ${
              isDragActive
                ? "border-[var(--c-neon-cyan)] bg-[var(--c-neon-cyan)]/5"
                : "border-white/20 hover:border-white/40 hover:bg-white/5"
            }`}
          >
            <div
              className={`p-4 rounded-full mb-6 ${isDragActive ? "bg-[var(--c-neon-cyan)]/20 text-[var(--c-neon-cyan)]" : "bg-white/10 text-white/70"}`}
            >
              <Upload size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{dict.dragDrop}</h3>
            <p className="text-white/60 mb-8 text-center max-w-md">{dict.supported}</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              {dict.selectFile}
            </button>
            <p className="text-xs text-white/40 mt-4">{dict.unlimited}</p>
          </motion.div>
        )}

        {/* TRẠNG THÁI 2: ĐÃ UPLOAD & ĐANG HOẶC ĐÃ NÉN XONG */}
        {originalFile && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
          >
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold mb-1 truncate max-w-[300px] md:max-w-md">
                  {originalFile.name}
                </h3>
                <p className="text-white/50 text-sm">
                  {dict.originalPrefix} {formatBytes(originalFile.size)}
                </p>
              </div>

              {/* Advanced Settings */}
              <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5 items-center">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Max Size (MB)
                  </label>
                  <input
                    type="number"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(e.target.value)}
                    className="w-20 bg-transparent border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-[var(--c-neon-cyan)] outline-none"
                    disabled={isCompressing}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                    Max Width (px)
                  </label>
                  <input
                    type="number"
                    value={maxWidthOrHeight}
                    onChange={(e) => setMaxWidthOrHeight(e.target.value)}
                    className="w-24 bg-transparent border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-[var(--c-neon-cyan)] outline-none"
                    disabled={isCompressing}
                  />
                </div>
                <button
                  onClick={reCompress}
                  disabled={isCompressing}
                  title={dict.recompressHint}
                  className="mt-5 p-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  <RefreshCcw size={18} className={isCompressing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
                <AlertCircle />
                <p>{error}</p>
              </div>
            )}

            {/* Before / After Preview Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Original Column */}
              <div className="flex flex-col bg-black/30 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="font-semibold text-white/70">{dict.originalTitle}</span>
                  <span className="font-mono text-[var(--c-neon-magenta)]">
                    {formatBytes(originalFile.size)}
                  </span>
                </div>
                <div className="relative p-4 flex-1 flex items-center justify-center min-h-[250px] checkered-bg">
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-[400px] object-contain rounded drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Compressed Column */}
              <div className="flex flex-col bg-black/30 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <span className="font-semibold text-[color:var(--c-neon-cyan)]">
                    {dict.compressedTitle}
                  </span>
                  {compressedFile && !isCompressing && (
                    <span className="font-mono font-bold text-[color:var(--c-neon-cyan)]">
                      {formatBytes(compressedFile.size)}
                    </span>
                  )}
                </div>

                <div className="relative p-4 flex-1 flex items-center justify-center min-h-[250px] checkered-bg">
                  {isCompressing ? (
                    <div className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[var(--c-neon-cyan)] animate-spin mb-4"></div>
                      <p className="font-mono text-xl">{compressionProgress}%</p>
                      <p className="text-white/50 text-sm mt-2">{dict.compressing}</p>
                    </div>
                  ) : compressedFile && compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="max-h-[400px] object-contain rounded drop-shadow-2xl"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            {!isCompressing && compressedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-6 rounded-2xl bg-gradient-to-r from-[rgba(0,229,255,0.1)] to-[rgba(255,43,214,0.1)] border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[color:var(--c-neon-cyan)]" size={32} />
                  <div>
                    <h4 className="font-bold text-lg">{dict.doneTitle}</h4>
                    <p className="text-sm text-white/70">
                      {dict.savedInfo1}
                      <span className="font-bold text-[color:var(--c-neon-cyan)]">
                        {savedPercentage}%
                      </span>
                      {dict.savedInfo2} ({formatBytes(originalFile.size - compressedFile.size)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={resetAll}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 font-medium transition-colors"
                  >
                    {dict.compressAnother}
                  </button>
                  <button
                    onClick={downloadFile}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[color:var(--c-neon-cyan)] text-black font-bold shadow-[0_0_15px_rgba(50,245,255,0.4)] hover:shadow-[0_0_25px_rgba(50,245,255,0.6)] hover:scale-105 transition-all"
                  >
                    <Download size={20} />
                    <span>{dict.downloadNow}</span>
                  </button>
                </div>
              </motion.div>
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
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
