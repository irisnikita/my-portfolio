import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { site } from "../../data/site";

import { ui } from "../../i18n/ui";

const navKeys: Array<{ href: string; labelKey: keyof (typeof ui)["en"] }> = [
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/tools", labelKey: "nav.tools" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/#contact", labelKey: "nav.contact" },
];

export default function Header({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const { scrollY } = useScroll();

  const lang = currentPath.startsWith("/vi") ? "vi" : "en";
  const t = (key: keyof (typeof ui)["en"]) => ui[lang][key] || ui["en"][key];
  const translatePath = (path: string, l: string = lang) => {
    if (l === "en") return path;
    if (path.startsWith("/#")) return `/${l}${path.substring(1)}`;
    return `/${l}${path}`;
  };

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
    // Hide header if scrolling down and scrolled past 100px.
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

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="site-header"
      style={{
        position: "fixed", // Switched from sticky to fixed for smooth motion
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
