import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { site } from '../../data/site';

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const { scrollY } = useScroll();

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    if (href === "/#contact") {
      return currentPath === "/" && currentHash === "#contact";
    }
    if (href === "/") {
      return currentPath === "/" && currentHash !== "#contact";
    }
    return currentPath.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="site-header"
      style={{
        position: 'fixed', // Switched from sticky to fixed for smooth motion
        width: '100%',
        top: 0,
        zIndex: 40,
        backdropFilter: 'saturate(120%) blur(10px)',
        WebkitBackdropFilter: 'saturate(120%) blur(10px)',
        background: 'rgba(7, 6, 13, 0.65)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="wrap" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <a className="brand" href="/" aria-label="Home" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--c-text)', fontWeight: 650, letterSpacing: 'var(--tracking-tight)' }}>
          <span className="mark" aria-hidden="true" style={{ width: '12px', height: '12px', borderRadius: '999px', background: 'radial-gradient(circle at 30% 30%, #ffffff, rgba(50, 245, 255, 0.85) 35%, rgba(255, 53, 213, 0.6))', boxShadow: 'var(--shadow-glow-cyan)' }}></span>
          <span>Trường Vĩ</span>
        </a>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav" aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={`navLink ${getIsActive(item.href) ? 'isActive' : ''}`}>
              {item.label}
            </a>
          ))}
          {site.cvUrl && (
            <a href={site.cvUrl} className="navLink cvLink" target="_blank" rel="noreferrer" download>
              CV ↓
            </a>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--c-text)',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
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
              overflow: 'hidden', 
              background: 'rgba(7, 6, 13, 0.98)', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0
            }}
            className="mobile-dropdown"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', gap: '8px' }}>
              {nav.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`navLink ${getIsActive(item.href) ? 'isActive' : ''}`} style={{ fontSize: '1.2rem', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {item.label}
                </a>
              ))}
              {site.cvUrl && (
                <a href={site.cvUrl} className="navLink cvLink" target="_blank" rel="noreferrer" download style={{ fontSize: '1.2rem', padding: '12px 16px', textAlign: 'center', marginTop: '12px' }}>
                  Download CV ↓
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
