import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { site } from "../../data/site";

import { useTranslations, useTranslatedPath } from "../../i18n/utils";
import type { Lang, I18nKey } from "../../i18n/messages";

const navKeys: Array<{ href: string; labelKey: I18nKey; hasDropdown?: boolean }> = [
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/tools", labelKey: "nav.tools", hasDropdown: true },
  { href: "/about", labelKey: "nav.about" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/#contact", labelKey: "nav.contact" },
];

const toolsSubItems: Array<{
  href: string;
  labelKey: I18nKey;
  descKey: I18nKey;
  icon: React.ReactNode;
}> = [
  {
    href: "/tools/image-compressor",
    labelKey: "tools.imageCompressor.title",
    descKey: "tools.imageCompressor.desc",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: "/tools/css-mesh-gradient",
    labelKey: "tools.meshGradient.title",
    descKey: "tools.meshGradient.desc",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    href: "/tools/code-to-image",
    labelKey: "tools.card.codeToImage.title",
    descKey: "tools.card.codeToImage.desc",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
];

export default function Header({ currentPath, lang }: { currentPath: string; lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [toolsHover, setToolsHover] = useState(false);
  const toolsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  const t = useTranslations(lang);
  const translatePath = useTranslatedPath(lang);

  const toggleLangPath =
    lang === "en"
      ? `/vi${currentPath === "/" ? "" : currentPath}`
      : currentPath.replace(/^\/vi/, "") || "/";

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) {
      setIsHidden(true);
      setIsOpen(false);
    } else {
      setIsHidden(false);
    }
  });

  const getIsActive = (href: string) => {
    const translatedHref = translatePath(href);
    if (href === "/#contact") {
      return (currentPath === "/" || currentPath === "/vi/") && currentHash === "#contact";
    }
    if (href === "/") {
      return (currentPath === "/" || currentPath === "/vi/") && currentHash !== "#contact";
    }
    return currentPath === translatedHref || currentPath.startsWith(translatedHref + "/");
  };

  const handleToolsMouseEnter = () => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setToolsHover(true);
  };

  const handleToolsMouseLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => setToolsHover(false), 150);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="site-header"
      style={{
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 40,
        backdropFilter: "saturate(120%) blur(10px)",
        WebkitBackdropFilter: "saturate(120%) blur(10px)",
        background: "rgba(7, 6, 13, 0.65)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className="wrap"
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <a
          className="brand"
          href="/"
          aria-label="Home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          {/* Neon Night Dark Logo Icon */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M3 8L16 26L29 8"
                stroke="url(#neon-cyan)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 5px rgba(50,245,255,0.8))" }}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 1.2, ease: "easeInOut" },
                  },
                }}
              />
              <motion.path
                d="M16 26L29 16"
                stroke="url(#neon-magenta)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 5px rgba(255,53,213,0.8))" }}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
                  },
                }}
              />
              <motion.path
                d="M16 26L3 16"
                stroke="url(#neon-magenta)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.5, filter: "drop-shadow(0 0 4px rgba(255,53,213,0.4))" }}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 0.5,
                    transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
                  },
                }}
              />
              <motion.circle
                cx="16"
                cy="26"
                r="2"
                fill="#fff"
                style={{ filter: "drop-shadow(0 0 4px #fff)" }}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 10, delay: 0.9 },
                  },
                }}
              />
              <defs>
                <linearGradient
                  id="neon-cyan"
                  x1="3"
                  y1="8"
                  x2="29"
                  y2="26"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#32F5FF" />
                  <stop offset="1" stopColor="#0088FF" />
                </linearGradient>
                <linearGradient
                  id="neon-magenta"
                  x1="16"
                  y1="26"
                  x2="29"
                  y2="16"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF35D5" />
                  <stop offset="1" stopColor="#7000FF" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          {/* Abbreviated Name */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ffffff",
              textShadow: "0 0 8px rgba(50,245,255,0.4), 0 0 16px rgba(255,53,213,0.2)",
            }}
          >
            VINLT
          </motion.span>
        </a>

        {/* Desktop Nav */}
        <nav
          className="nav desktop-nav"
          aria-label="Primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {navKeys.map((item) => {
            const translatedHref = translatePath(item.href);

            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  style={{ position: "relative" }}
                  onMouseEnter={handleToolsMouseEnter}
                  onMouseLeave={handleToolsMouseLeave}
                >
                  <a
                    href={translatedHref}
                    className={`navLink ${getIsActive(item.href) ? "isActive" : ""}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    {t(item.labelKey)}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{
                        opacity: 0.5,
                        transition: "transform 0.2s",
                        transform: toolsHover ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>

                  <AnimatePresence>
                    {toolsHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          minWidth: "260px",
                          background: "rgba(10, 10, 20, 0.95)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          padding: "8px",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.05)",
                          zIndex: 100,
                        }}
                      >
                        {/* Caret arrow */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-6px",
                            left: "50%",
                            transform: "translateX(-50%) rotate(45deg)",
                            width: "12px",
                            height: "12px",
                            background: "rgba(10, 10, 20, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderBottom: "none",
                            borderRight: "none",
                            borderRadius: "2px",
                          }}
                        />

                        {/* "All Tools" link */}
                        <a
                          href={translatedHref}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "all 0.15s ease",
                            marginBottom: "4px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          {t("header.tools.allTools")}
                        </a>

                        <div
                          style={{
                            height: "1px",
                            background: "rgba(255,255,255,0.08)",
                            margin: "0 8px 4px",
                          }}
                        />

                        {toolsSubItems.map((sub) => (
                          <a
                            key={sub.href}
                            href={translatePath(sub.href)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              textDecoration: "none",
                              color: "#fff",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(0, 229, 255, 0.08)";
                              (
                                e.currentTarget.querySelector(".tool-icon") as HTMLElement
                              ).style.background = "rgba(0, 229, 255, 0.15)";
                              (
                                e.currentTarget.querySelector(".tool-icon") as HTMLElement
                              ).style.color = "var(--c-neon-cyan)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              (
                                e.currentTarget.querySelector(".tool-icon") as HTMLElement
                              ).style.background = "rgba(255,255,255,0.06)";
                              (
                                e.currentTarget.querySelector(".tool-icon") as HTMLElement
                              ).style.color = "rgba(255,255,255,0.7)";
                            }}
                          >
                            <div
                              className="tool-icon"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.7)",
                                flexShrink: 0,
                                transition: "all 0.15s ease",
                              }}
                            >
                              {sub.icon}
                            </div>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.3 }}>
                                {t(sub.labelKey)}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "rgba(255,255,255,0.4)",
                                  lineHeight: 1.4,
                                  marginTop: "2px",
                                }}
                              >
                                {t(sub.descKey)}
                              </div>
                            </div>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <a
                key={item.href}
                href={translatedHref}
                className={`navLink ${getIsActive(item.href) ? "isActive" : ""}`}
              >
                {t(item.labelKey)}
              </a>
            );
          })}

          <div
            style={{
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 8px",
            }}
          />

          <a
            href={toggleLangPath}
            className="lang-switcher"
            title={`Switch to ${lang === "en" ? "Vietnamese" : "English"}`}
            style={{
              padding: "4px 8px",
              fontSize: "13px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--c-neon-cyan)";
              e.currentTarget.style.textShadow = "0 0 8px rgba(0, 229, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              e.currentTarget.style.textShadow = "none";
            }}
          >
            {lang === "en" ? "VI" : "EN"}
          </a>

          {site.cvUrl && (
            <a
              href={site.cvUrl}
              className="navLink cvLink"
              target="_blank"
              rel="noreferrer"
              download
            >
              {t("nav.cv")}
            </a>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            color: "var(--c-text)",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
              background: "rgba(7, 6, 13, 0.98)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
            }}
            className="mobile-dropdown"
          >
            <nav
              style={{ display: "flex", flexDirection: "column", padding: "16px 24px", gap: "8px" }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <a
                  href={toggleLangPath}
                  className="lang-switcher"
                  style={{
                    padding: "6px 16px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "var(--c-neon-cyan)",
                    textDecoration: "none",
                  }}
                >
                  🌐 {lang === "en" ? "Tiếng Việt" : "English"}
                </a>
              </div>

              {navKeys.map((item) => {
                const translatedHref = translatePath(item.href);

                if (item.hasDropdown) {
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => setToolsExpanded(!toolsExpanded)}
                        className={`navLink ${getIsActive(item.href) ? "isActive" : ""}`}
                        style={{
                          fontSize: "1.2rem",
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          background: "none",
                          border: "none",
                          borderBottomWidth: "1px",
                          borderBottomStyle: "solid",
                          borderBottomColor: "rgba(255,255,255,0.05)",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "inherit",
                          fontFamily: "inherit",
                        }}
                      >
                        <span>{t(item.labelKey)}</span>
                        <motion.svg
                          animate={{ rotate: toolsExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{ opacity: 0.5 }}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </button>

                      <AnimatePresence>
                        {toolsExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                padding: "8px 0 8px 16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                              }}
                            >
                              {/* All Tools link */}
                              <a
                                href={translatedHref}
                                onClick={() => setIsOpen(false)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "10px 14px",
                                  borderRadius: "12px",
                                  textDecoration: "none",
                                  color: "rgba(255,255,255,0.5)",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  background: "rgba(255,255,255,0.03)",
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="3" y="3" width="7" height="7" />
                                  <rect x="14" y="3" width="7" height="7" />
                                  <rect x="14" y="14" width="7" height="7" />
                                  <rect x="3" y="14" width="7" height="7" />
                                </svg>
                                {t("header.tools.allTools")}
                              </a>

                              {toolsSubItems.map((sub) => (
                                <a
                                  key={sub.href}
                                  href={translatePath(sub.href)}
                                  onClick={() => setIsOpen(false)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 14px",
                                    borderRadius: "12px",
                                    textDecoration: "none",
                                    color: "#fff",
                                    background: "rgba(255,255,255,0.03)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "10px",
                                      background: "rgba(0, 229, 255, 0.1)",
                                      color: "var(--c-neon-cyan)",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {sub.icon}
                                  </div>
                                  <div>
                                    <div
                                      style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.3 }}
                                    >
                                      {t(sub.labelKey)}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.4)",
                                        lineHeight: 1.4,
                                        marginTop: "2px",
                                      }}
                                    >
                                      {t(sub.descKey)}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={translatedHref}
                    onClick={() => setIsOpen(false)}
                    className={`navLink ${getIsActive(item.href) ? "isActive" : ""}`}
                    style={{
                      fontSize: "1.2rem",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {t(item.labelKey)}
                  </a>
                );
              })}
              {site.cvUrl && (
                <a
                  href={site.cvUrl}
                  className="navLink cvLink"
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    fontSize: "1.2rem",
                    padding: "12px 16px",
                    textAlign: "center",
                    marginTop: "12px",
                  }}
                >
                  {t("nav.cv")}
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
