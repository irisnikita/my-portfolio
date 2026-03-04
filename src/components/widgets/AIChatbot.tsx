import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

import { useTranslations } from "../../i18n/utils";
import type { Lang } from "../../i18n/messages";

export default function AIChatbot({ lang = "en" }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dragControls = useDragControls();

  const chatProps = useChat();
  const { messages, sendMessage, status, error } = chatProps;
  const isLoading = status === "submitted" || status === "streaming";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };
  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        drag
        dragMomentum={false}
        whileDrag={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-colors hover:bg-cyan-400 cursor-grab active:cursor-grabbing"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[80vh] w-[350px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f24]/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b border-white/10 p-4 bg-white/5 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                </span>
                <h3 className="text-sm font-semibold text-white">{t("chatbot.title")}</h3>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-white/50 mt-10">
                  <p>{t("chatbot.empty")}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setInputValue(t("chatbot.suggestion1"))
                      }
                      className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 hover:bg-white/10 text-left"
                    >
                      {t("chatbot.suggestion1")}
                    </button>
                    <button
                      onClick={() =>
                        setInputValue(t("chatbot.suggestion2"))
                      }
                      className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 hover:bg-white/10 text-left"
                    >
                      {t("chatbot.suggestion2")}
                    </button>
                  </div>
                </div>
              )}
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-cyan-500 text-white rounded-br-sm"
                        : "bg-white/10 text-white/90 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white/10 rounded-bl-sm">
                    <div className="flex gap-1">
                      <div
                        className="h-1.5 w-1.5 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-1.5 w-1.5 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-1.5 w-1.5 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-red-500/20 text-red-200 border border-red-500/30 rounded-bl-sm text-sm">
                    ⚠️{" "}
                    {error.message ||
                      t("chatbot.error")}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-3 bg-black/20">
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  value={inputValue || ""}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("chatbot.placeholder")}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !(inputValue || "").trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-white transition-opacity disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
